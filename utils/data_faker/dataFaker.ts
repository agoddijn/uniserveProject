import {Company} from "../../../uniserve.m8s/common_types";
import {Device} from "../../../uniserve.m8s/common_types";


export class DataFaker {

}

// export interface Device {
//     device_recid: number;
//     site_recid: number;
//     device_id: string;
//     manufacturer: string;
//     description: string;
//     device_type: string;
//     mac_address: string;
//     ip_address: string;
//     //should always be ordered by timestamp
//     ping_records?: PingRecord[];
// }

function addDataSet(jsonObjects: any) {
    let that = this;

    let links = [];

    for (let object of jsonObjects) {
        let linkObject = {};
        let keys = Object.keys(object);

        for (let key of keys) {
            if(object[key] == typeof String) {
                links.push(Object[key]);
            }
        }
    }

    return links;
}

function generateDeviceList(links: Array<Device>) {
    let that = this;
    let device: Device; 

    let devices = [];
    let id: number = 0;

    for (let link of links) {
        const dns = require('dns');
        const options = {
            family: 4
        };
        dns.lookup(link, options, (err, address, family) =>
        device.ip_address = address,
        device.device_recid = id,
        device.site_recid = 0, 
        device.device_id = "", 
        device.manufacturer = "", 
        device.description = "", 
        device.device_type = "", 
        device.device_type = "",
        device.mac_address = "");

        devices.push(device);
        id++;
    }

    return devices;
}



