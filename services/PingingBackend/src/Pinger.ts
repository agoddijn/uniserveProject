import {Log, DbInterface} from 'uniserve.m8s.utils';
import {PingRecord, Device} from 'uniserve.m8s.types';
import PingStorage from './PingStorage';
import * as tcpPing from 'tcp-ping';

export default class Pinger {

    dbInt: DbInterface;
    storage: PingStorage;
    devices: Device[];

    constructor() {
        var that = this;
        console.log("Pinger::init");
        this.dbInt = new DbInterface();
        this.storage = new PingStorage();
        this.updateDevices();
    }

    public updateDevices() {
        var that = this;
        this.dbInt.getAllDevices()
        .then(devices => {
            that.devices = devices;
        })
        .catch(e => {
            console.error(JSON.stringify(e));
            console.log("Could not get data");
        });
    }

    public doPing() {
        var that = this;
        this.storage.sendRecords();
        var date = new Date();
        let pingPromises: Promise<any>[] = [];
        for (let device of that.devices) {
           //  console.log("found a device with ip " + device.ip_address);
            pingPromises.push(that.ping(device));
        }
        Promise.all(pingPromises)
        .then((data: any[]) => {
           //  console.log("Got some data");
            var records: PingRecord[] = [];
            for (let pingResponse of data) {
                records.push(that.responseToRecord(pingResponse));
            }
            that.storage.addPingRecords(date, records);
        })
        .catch(e => {
            console.log("Error: " + JSON.stringify(e));
        });
    }
    
    public ping(device: Device): Promise<any> {
        return new Promise((fulfill, reject) => {
            let options = {
                attempts: 2,
                address: device.ip_address
            }
    
            tcpPing.ping(options, (err, data) => {
                if (!data) {
                    fulfill({avg: null, device: device});
                }
                data.device = device;
                fulfill(data);
            })
        })   
    }
    
    public responseToRecord(response: any): PingRecord {
        let record: PingRecord = {
            ping_recid: null,
            device_recid: response.device.device_recid,
            ms_response: (response.avg != null) ? +response.avg : null,
            responded: response.avg != null,
            datetime: new Date(),
            ip_address: response.device.ip_address
        };
        return record;
    }
    
    public fakePingingBackend(devices: Device[]): Promise<PingRecord[]> {
        var that = this;
        return new Promise((fulfill, reject) => {
            var date = new Date();
            let pingPromises: Promise<any>[] = [];
            for (let device of devices) {
                pingPromises.push(that.ping(device));
            }
            Promise.all(pingPromises)
            .then((data: any[]) => {
                var records: PingRecord[] = [];
                for (let pingResponse of data) {
                    let record: PingRecord = that.responseToRecord(pingResponse);
                    record.datetime = date;
                    records.push(record);
                }
                fulfill(records);
            })
            .catch(e => {
                console.log("Error: " + JSON.stringify(e));
                fulfill([]);
            });
        });
    }
}