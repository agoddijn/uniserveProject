import {Company} from "uniserve.m8s.types";
import {Device} from "uniserve.m8s.types";
import {PingRecord} from "uniserve.m8s.types";


export class DataFaker {
    links: Device[];

    getDevices(howMany: number): Device[] {
        // returns the first "number" of devices
        let that = this;

        let returnDevices = [];

        let limit = howMany; 
        let i = 1;

        while (limit > 0) {
            returnDevices.push(that.links[i]);
            limit--;
            i++;
        }
        
        return returnDevices;

    }

    getPingRecords(howMany: number, timeStamp: Date): PingRecord[] {
        // create a ping record for number amount of devices
        // make responded true
        let that = this;
        
        let pingRec: PingRecord; 
        let generatedPingRecords: PingRecord[];

        let limit = howMany;
        let device_id = 1;

        while (limit > 0) {
            pingRec = that.generatePingRecord(device_id, timeStamp);
            pingRec.ms_response = device_id; 

            generatedPingRecords.push(pingRec);

            limit--;
            device_id++;
        }
        
        return generatedPingRecords;
        
    }

    generatePingRecord(device_id: any, date: Date): PingRecord {
        let pingRecord: PingRecord;

        pingRecord.datetime = date;
        pingRecord.device_recid = device_id;
        pingRecord.responded = true;
        pingRecord.ms_response = 1;

        return pingRecord;
    }

    addDataSet(jsonObjects: any) {
    let that = this;

    that.links = [];

    for (let object of jsonObjects) {
        //let linkObject = {};
        let keys = Object.keys(object);

        for (let key of keys) {
            if(object[key] == typeof String) {
                that.links.push(Object[key]);
            }
        }
    }

    return that.links;
}

    generateDeviceList(links: Array<Device>) {
    let that = this;
    let device: Device; 

    let devices = [];
    let id: number = 1;

    for (let link of links) {
        const dns = require('dns');
        const options = {
            family: 4
        };
        dns.lookup(link, options, (err, address, family) =>
        device.ip_address = address,
        device.device_recid = id,
        device.site_recid = 0, 
        device.device_id = "fake_id", 
        device.manufacturer = "fake_manufacturer", 
        device.description = "fake_description", 
        device.device_type = "fake_type", 
        device.mac_address = "fake_mac");

        devices.push(device);
        id++;
    }

    return devices;
    }

}


