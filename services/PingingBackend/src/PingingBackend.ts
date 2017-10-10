import * as tcpPing from 'tcp-ping';
import {Log, DbInterface} from 'uniserve.m8s.utils';
import {PingRecord, Device} from 'uniserve.m8s.types';
import PingStorage from './PingStorage';

var dbInt = new DbInterface;
var storage = new PingStorage;

var deviceList: Device[] = dbInt.getDeviceList();

// Interval once a minute 
setInterval(()=>{
    var date = new Date();
    console.log("starting pings");
    let pingPromises: Promise<any>[];
    for (let device of deviceList) {
        pingPromises.push(ping(device));
    }
    Promise.all(pingPromises).then((data: any[]) => {
        var records: PingRecord[];
        for (let pingResponse of data) {
            records.push(responseToRecord(pingResponse));
        }
        storage.addPingRecords(date, records);
    })
}, 60000);

function ping(device: Device): Promise<any> {
    let pingPromise = new Promise((fulfill, reject) => {
        tcpPing.ping({address: device.ip_address}, (err, data) => {
            if (err) {
                console.log("Ping error: " + err)
                fulfill(err);
            } else {
                console.log("Ping success: " + JSON.stringify(data) );
                data.device_id = device.device_id;
                fulfill(data);
            }  
        });
    });
    return pingPromise;
}

function responseToRecord(response: any): PingRecord {
    let record: PingRecord;
    record.ping_recid;
    record.device_id = response.device_id;
    record.ms_response = response.avg;
    record.responded = true;
    return record;
}
