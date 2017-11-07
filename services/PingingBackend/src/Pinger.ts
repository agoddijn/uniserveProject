import {Log, DbInterface} from 'uniserve.m8s.utils';
import {PingRecord, Device} from 'uniserve.m8s.types';
import PingStorage from './PingStorage';
import * as sysPing from 'ping'

export default class Pinger {

    dbInt: DbInterface;
    storage: PingStorage;
    devices: Device[];

    constructor() {
        var that = this;
        console.log("Pinger::init");
        this.dbInt = new DbInterface();
        this.storage = new PingStorage();
        this.devices = [];
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

    public doPing(): Promise<boolean> {
        var that = this;
        this.storage.sendRecords();
        return new Promise((fulfill, reject) => {
            var date = new Date();
            let pingPromises: Promise<any>[] = [];
            for (let device of that.devices) {
                pingPromises.push(that.ping(device));
            }
            Promise.all(pingPromises)
            .then((data: any[]) => {
                var records: PingRecord[] = [];
                for (let pingResponse of data) {
                    records.push(that.responseToRecord(pingResponse));
                }
                that.storage.addPingRecords(date, records);
                fulfill(true);
            })
            .catch(e => {
                console.log("Error: " + e);
                fulfill(false);
            });
        })   
    }
    
    public ping(device: Device): Promise<any> {
        return new Promise((fulfill, reject) => {
            let options = {
                timeout: 2,
                min_reply: 1
            }

            sysPing.promise.probe(device.ip_address, options)
            .then(res => {
                res.device = device;
                fulfill(res);
            })
            .catch(err => {
                err.device = device;                
                fulfill(err);
            })
        })   
    }
    
    public responseToRecord(response: any): PingRecord {
        let record: PingRecord = {
            ping_recid: null,
            device_recid: response.device.device_recid,
            ms_response: response.alive ? +response.avg : null,
            responded: response.alive,
            datetime: new Date(),
            ip_address: response.host
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