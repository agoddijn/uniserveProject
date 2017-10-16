import {Company} from "uniserve.m8s.types";
import {Device} from "uniserve.m8s.types";


export class DataFaker {
    links: Device[];

    getDevices(howMany: number): Device[] {
        // returns the first "number" of devices
        let that = this;

        let returnDevices = [];

        let limit = howMany; 
        let i = 0;

        while (limit > 0) {
            returnDevices.push(that.links[i]);
            limit--;
            i++;
        }
        
        return returnDevices;

    }

    getPingRecords(howManyDevices: number, howManyPings:number): PingRecord {
        // create a ping record for number amount of devices
        // make responded true

        
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


