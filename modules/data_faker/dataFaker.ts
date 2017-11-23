import {Company} from "uniserve.m8s.types";
import {Device} from "uniserve.m8s.types";
import {PingRecord} from "uniserve.m8s.types";

let fs = require('fs');


export class DataFaker {
    links: Device[];
    json: any; 

    constructor() {
        console.log("Init::DataFaker")
        let that = this;
        that.json = require('./data/top10000.JSON'); 
    }

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

    getTopDevices(howMany: number): Device[] {
        // returns the first "number" of devices
        let that = this;

        let returnDevices = [];

        for (let i = 0; i < howMany && i < that.json.length; i++) {
            var cur = that.json[i];
            var dev: Device = {
                device_recid: null,
                site_recid: null,
                device_id: null,
                manufacturer: null,
                description: "top10000url",
                device_type: null,
                mac_address: null,
                ip_address: cur.url
            }
            returnDevices.push(dev);
        }
        
        return returnDevices;
    }

    generatePingRecords(howMany: number, timeStamp: Date): PingRecord[] {
        // create a ping record for howMany amount of devices

        let that = this;
        
        let pingRec: PingRecord; 
        let generatedPingRecords: PingRecord[] = [];

        let limit = howMany;
        let device_id = 1;

        while (limit > 0) {
            pingRec = that.generatePingRecord(device_id, timeStamp);
            pingRec.ms_response = device_id; 

            generatedPingRecords.push(pingRec);

            limit--;
            device_id++;
        }
        console.log(generatedPingRecords);
        return generatedPingRecords;
        
    }

    generatePingRecord(device_id: any, date: Date): PingRecord {
        let pingRecord: PingRecord = {
            ping_recid : 0,
            datetime : date,
            device_recid : device_id,
            responded :  true,
            ms_response : 100,
        }
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


