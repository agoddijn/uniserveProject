import {Device, PingRecord, Company, Site} from "uniserve.m8s.types";

let fs = require('fs');
let Chance = require('chance');
var fakerator = require("fakerator")("hu-HU");

class PingRecordClass implements PingRecord {
    ping_recid = 0;
    device_recid = 0;
    ip_address = "";
    ms_response = 0;
    responded = true;
    datetime = null;
}

class DeviceClass implements Device {
    device_recid = 0;
    site_recid = 0;
    device_id = "";
    manufacturer = "";
    description = "";
    device_type = "";
    mac_address = "";
    ip_address = "";
}

class CompanyClass implements Company {
    company_recid = 0;
    company_id = "";
    company_name = "";
}

class SiteClass implements Site {
    site_recid = 0;
    company_recid = 0;
    description = "";
    address1 = "";
    address2 = "";
    city = "";
    province = "";
    postal_code = "";
    latitude = "";
    longitude = "";
}

export class DataFaker {
    links: Device[];
    json: any; 
    chance = new Chance();
    

    constructor() {
        console.log("Init::DataFaker")
        let that = this;
        that.json = require('./data/top10000.json');
    }


    /**
     * returns the first "number" of devices
     * @param howMany 
     */
    getDevices(howMany: number): Device[] {
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


    /**
     * returns the first "number" of devices
     * @param howMany 
     */
    getTopDevices(howMany: number): Device[] {
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


    /**
     * create a ping record for howMany amount of devices
     * @param howMany 
     * @param timeStamp 
     */
    generatePingRecords(howMany: number, timeStamp: Date): PingRecord[] {
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
        
        return generatedPingRecords;
        
    }


    /**
     * helper for generatePingRecords
     * given device id and date returns a ping record
     * @param device_id 
     * @param date 
     */
    generatePingRecord(device_id: any, date: Date): PingRecord {
        let that = this;
        let pingRecord: PingRecord = new PingRecordClass();

        pingRecord.datetime = date;
        pingRecord.device_recid = device_id;
        pingRecord.responded = true;
        pingRecord.ms_response = 100;

        return pingRecord;
    }


    /**
     * given a json object file
     * returns list of website links
     * @param jsonObjects 
     */  
    addDataSet(jsonObjects: any) {
    let that = this;

    that.links = [];

    for (let object of jsonObjects) {
        //let linkObject = {};
        let keys = Object.keys(object);

        for (let key of keys) {
            if(key == "url") {
                that.links.push(object[key]);
            }
        }
    }

    return that.links;
    }


    /**
     * given an array of website links
     * returns a list of devices
     * @param links 
     */
    generateDeviceList(links: Array<Device>): Device[] {
        // TODO: promisify this function
    let that = this;
    let device: Device = new DeviceClass();

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
        device.device_id = "fake_id" + device.device_recid, 
        device.manufacturer = "fake_manufacturer" + device.device_recid, 
        device.description = "fake_description" +  device.device_recid, 
        device.device_type = "fake_type" +  device.device_recid, 
        device.mac_address = "fake_mac" +  device.device_recid);

        devices.push(device);
        id++;
    }
    
    return devices;
    
    }


    /**
     * given 
     * returns list of companies
     * @param howMany 
     */
    generateCompanies(howMany: number): Company[] {
        let that = this;
        let company: Company = new CompanyClass();
        let companies: Company[] = [];
        let numOfSitesForCompany: number; 
         

        let c_recid: number = 1;
        let c_id: string = "Fake Company ID";
        
        for (var i = 0; i < howMany; i++) {
            numOfSitesForCompany = Math.floor(Math.random() * 4) + 1;

            company.company_recid = c_recid;
            company.company_id = c_id;
            company.company_name = fakerator.company.name();
            company.sites = that.generateSites(c_recid, numOfSitesForCompany);
            companies.push(company);
            c_recid++;
        }
        
        return  companies;
    }


    /**
     * returns list of sites
     */
    generateSites(c_recid: number, numSites: number): Site[] {
        let that = this;
        let site: Site = new SiteClass();
        let sites: Site[] = [];
        let rec_id: number = 1;
        
        let entity: JSON = fakerator.entity.address();

        for (var i = 0; i < numSites; i++) {
            site.site_recid = rec_id;
            site.company_recid = c_recid;
            site.description = "Fake Company Description";
            site.address1 = 
            site.address2 = " ";
            site.city = that.chance.city();
            site.province = that.chance.province
        }

        return sites;
    }


    /**
     * helper to add companies to sites
     */
    addToSite() {

    }

    /**
     * returns a random number between min and mix for the number
     * of sites wanted for a company
     * @param max number of sites wanted for a company
     * @param min number of sites wanted for a company
     */
    generateRandomNumOfSites(max: number, min: number): Number {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}


