import {Device, PingRecord, Company, Site} from "uniserve.m8s.types";

let fs = require('fs');
let Chance = require('chance');
var fakerator = require("fakerator")("en-CA");

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

export class Address {
    address: string;
    city: string;
    province: string;
    postal_code: string;
}

export class DataFaker {
    links: Device[];
    addresses: Address[];
    webLinksJSONFile: any = require('./data/top10000.json');
    addressesJSONFile: any = require('./data/1Kaddresses.json');
    chance = new Chance();
    

    constructor() {
        console.log("Init::DataFaker")
        let that = this;
        that.links = that.addDataSet(that.webLinksJSONFile);
        that.addresses = that.populateAddresses(that.addressesJSONFile);
    }

    /**
     * private function to populate addresses field
     */
    private populateAddresses(addressesFile: any): Address[] {
        let that = this;
        let addressesArray: Address[] = [];
        let address: Address = new Address();

        let objectValue = addressesFile["AddressesData"];
        
        for (let i = 0; i < 1000; i++) {
            let addressValue = objectValue[i];
            address.address = addressValue[0];
            address.city = addressValue[1];
            address.province = addressValue[2];
            address.postal_code = addressValue[3];
            addressesArray.push(address);
        }
        
        return addressesArray;
    }

    /**
     * private function to populate links array
     * given a json object file
     * returns list of website links
     * @param jsonObjects 
     */  
    private addDataSet(jsonObjects: any) {
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
     * Can be called after generating device list
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

        for (let i = 0; i < howMany && i < that.webLinksJSONFile.length; i++) {
            var cur = that.webLinksJSONFile[i];
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
        let locations = that.addresses;

        let c_recid: number = 1;
        let c_id: string = "Fake Company ID";
        
        for (var i = 0; i < howMany; i++) {
            numOfSitesForCompany = that.generateRandomNumOfSites(4, 1);

            company.company_recid = c_recid;
            company.company_id = c_id;
            company.company_name = fakerator.company.name();
            company.sites = that.generateSites(c_recid, numOfSitesForCompany, locations);
            companies.push(company);
            c_recid++;
        }
        
        return  companies;
    }


    /**
     * returns list of sites
     */
    generateSites(c_recid: number, numSites: number, locations: Address[]): Site[] {
        let that = this;
        let site: Site = new SiteClass();
        let sites: Site[] = [];
        let rec_id: number = 1;

        for (var i = 0; i < numSites; i++) {
            site.site_recid = rec_id;
            site.company_recid = c_recid;
            site.description = "Fake Company Description";
            that.setAddressOfSite(site, locations);
            // devices
        }
        return sites;
    }


    /**
     * Set the address of the given site
     * Once set, the set of locations deletes the address used
     */
    setAddressOfSite(site: Site, locations: Address[]): Site {
        site.address1 = locations[0].address;
        site.address2 = "";
        site.city = locations[0].city;
        site.province = locations[0].province;
        site.postal_code = locations[0].postal_code;
        locations.pop;
        return site;
    }

    /**
     * returns a random number between min and mix for the number
     * of sites wanted for a company
     * @param max number of sites wanted for a company
     * @param min number of sites wanted for a company
     */
    generateRandomNumOfSites(max: number, min: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}


