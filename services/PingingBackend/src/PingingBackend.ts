import {Log, DbInterface} from 'uniserve.m8s.utils';
import {PingRecord, Device} from 'uniserve.m8s.types';
import PingStorage from './PingStorage';
import * as sysPing from 'ping'

var dbInt = new DbInterface;
var storage = new PingStorage;

dbInt.getAllDevices()
.then((deviceList => {

    // console.log("Device List: " + JSON.stringify(deviceList));
    
    // Interval once a minute 
    setInterval(()=>{
        // console.log("starting pings");
        storage.sendRecords();
        var date = new Date();
        let pingPromises: Promise<any>[] = [];
        for (let device of deviceList) {
            // console.log("found a device with ip " + device.ip_address);
            pingPromises.push(ping(device));
        }
        Promise.all(pingPromises)
        .then((data: any[]) => {
            // console.log("Got some data");
            var records: PingRecord[] = [];
            for (let pingResponse of data) {
                records.push(responseToRecord(pingResponse));
            }
            storage.addPingRecords(date, records);
        })
        .catch(e => {
            console.log("Error: " + JSON.stringify(e));
        });
    }, 10000);

}))
.catch(e => {

    console.log("Could not get data");

});

function ping(device: Device): Promise<any> {
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
    });
}

function responseToRecord(response: any): PingRecord {
    let record: PingRecord = {
        ping_recid: null,
        device_recid: response.device.device_recid,
        ms_response: +response.avg,
        responded: response.alive,
        datetime: new Date(),
        ip_address: response.host
    };
    return record;
}
