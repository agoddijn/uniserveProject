import * as tcpPing from 'tcp-ping';
import {Log, DbInterface} from 'uniserve.m8s.utils';
import {PingRecord, Device} from 'uniserve.m8s.types';
import PingStorage from './PingStorage';

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
            address: device.ip_address,
            attempts: 2
        }

        tcpPing.ping(options, (err, data) => {
            if (err) {
                // console.log("Ping error: " + err)
                fulfill(err);
            } else {
                // console.log("Ping success");
                data.device_id = device.device_id;
                data.ping_recid = device.device_recid;
                fulfill(data);
            }  
        });
    });
}

function responseToRecord(response: any): PingRecord {
    let record: PingRecord = {
        ping_recid: response.ping_recid,
        device_recid: response.device_recid,
        ms_response: response.avg,
        responded: response.avg ? true : false,
        datetime: new Date()
    };
    return record;
}
