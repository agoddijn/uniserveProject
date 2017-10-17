import * as pgPromise from 'pg-promise';
import {Company, Site, Device, PingRecord} from 'uniserve.m8s.types'

const pgp = pgPromise();
const cn = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
}
const db = pgp(cn);

export default class DbInterface {

    constructor(){
        console.log("DbInterface::Init");
    }

    helloWorld() {
        console.log("Hello from the db interface");
    }

    getData() {
        db.any("SELECT * FROM msp_company").then(data => {
            console.log("Data: " + JSON.stringify(data));
        }).catch(e => {
            console.log("Error: " + e);
        })
    }

    /*
     * Stores a bunch of ping records
     * Return true if succesful, false otherwise
     */
    storePingRecords(date: number, records: PingRecord[]): Promise<[number, boolean]> {
        return new Promise((fulfill, reject) => {
            console.log("Recieving records");
            for (let record of records) {
                console.log("\n" + JSON.stringify(record));
                if (isNaN(record.ms_response) || record.ms_response === null) {
                    record.ms_response = -1
                }
                let psqlDate = new Date(record.datetime).toISOString().slice(0, 19).replace('T', ' ');
                
                let query = "INSERT INTO msp_ping (device_recid, ip_address, ms_response, responded, datetime) VALUES (" + record.device_recid 
                + ", \'" + record.ip_address + "\', " + record.ms_response + ", " + record.responded + ", \'" +  psqlDate + "\');"
                
                db.any(query).then(data => {
                        console.log("Sent data");
                        fulfill([date, true]); 
                    }).catch(e => {
                        console.log("Error: " + e);
                        reject([date, false]); 
                    })
            }  
            // fulfill([date, false]) if it didnt work      
        });
    }

    getCompanyDevices(companyID: number)/*: Promise<[any, boolean]>*/ {
        return new Promise((fulfill, reject) => {
            let that = this;
            let query = "SELECT * FROM msp_company c, msp_site s, msp_device d "
                +"WHERE c.company_recid = " + companyID + " "
                +"AND c.company_recid = s.company_recid "
                +"AND s.site_recid = d.device_recid;"
            //   +"AND d.device_recid = p.device_recid;";
            db.any(query).then(data => {
                that.compileResults(data, that);
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null, false]);
            })
         });
    }

    compileResults(results:any, that:any) {
        let pingRecords: PingRecord[] = [];
        let siteRecords : Site[] = [];
        for (var key in results){
            if (results.hasOwnProperty(key)){
                let tempSite : Site = {
                    site_recid : results[key]["site_recid"],
                    company_recid : results[key]["company_recid"],
                    description : results[key]["description"],
                    address1 : results[key]["address1"],
                    address2 : results[key]["address2"],
                    city : results[key]["city"],
                    province : results[key]["province"],
                    postal_code : results[key]["postal_code"],
                    latitude : results[key]["latitude"],
                    longitude : results[key]["longitude"],
                    devices : that.parseDevices(results, results[key]["company_recid"], results[key]["site_recid"], that)
                }
                siteRecords.push(tempSite);
            }
        }
        let companyRecord : Company = {
            company_recid : results[0]["company_recid"],
            company_id : results[0]["company_id"],
            company_name : results[0]["company_name"],
            sites : siteRecords
        }
        return companyRecord
    }

    parseDevices(results:any, company_recid, site_recid, that) {
        let deviceRecords: Device[] = [];
        for (var key in results){
            if (results.hasOwnProperty(key) && results[key]["company_recid"] == company_recid && results[key]["site_recid"] == site_recid){
                let device : Device = {
                    device_recid : results[key]["device_recid"],
                    site_recid : results[key]["site_recid"],
                    device_id : results[key]["device_id"],
                    manufacturer : results[key]["manufacturer"],
                    description : results[key]["description"],
                    device_type : results[key]["device_type"],
                    mac_address : results[key]["mac_address"],
                    ip_address : results[key]["ip_address"],
                //    ping_records : that.parsePings(site)
                }
                deviceRecords.push(device)
            }
        }
        return deviceRecords;
    }

    parsePings(device:any) {
        let pingRecords : PingRecord[] = [];
        let ping : PingRecord = {
            ping_recid : device["ping_recid"],
            device_recid : device["device_recid"],
            ip_address : device["ip_address"],
            ms_response : device["ms_response"],
            responded : device["responded"],
            datetime : device["datetime"],
        }
        pingRecords.push(ping);
        return pingRecords;
    }

    // Retrieve pings from specific device
    getDevicePings(deviceRecID:any) : Promise<[any, boolean]>{
        return new Promise((fulfill, reject) => {
            let query = "SELECT * from msp_ping where msp_ping.device_recid=\'" + deviceRecID + "\' order by datetime";
            db.any(query).then(data => {
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });     
    }

    // Retrieve 5 most recent pings
    getRecentPings(deviceRecID:any) : Promise<[any, boolean]>{
        return new Promise((fulfill, reject) => {
            let query = "SELECT * FROM msp_ping where device_recid=\'" + deviceRecID + "\' order by datetime desc, ping_recid, device_recid limit 5;"
            db.any(query).then(data => {
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });
    }

    // Retrieves all companies
    getAllCompanies() : Promise<[any, boolean]>{
        return new Promise((fulfill, reject) => {
            let query = "SELECT * FROM msp_company;";
            db.any(query).then(data => {
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });
    }

    // Retrieves the company ID based on the given username/email.
    getCompanyID(username) : Promise<[any, boolean]>{
        return new Promise((fulfill, reject) => {
            let query = "SELECT company_recid FROM msp_company WHERE username=\'" + username + "\';";
            db.any(query).then(data => {
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });
    }

    // Retrieves all sites
    getAllSites() : Promise<[any, boolean]>{
        return new Promise ((fulfill, reject) => {
            let query = "SELECT * FROM msp_site;";
            db.any(query).then(data => {
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });
    }

    // Retrieves the site IDs based on the given Company ID.
    getSites(companyID){
        return new Promise ((fulfill, reject) => {    
            let query = "SELECT site_recid FROM msp_site WHERE company_recid=\'" + companyID + "\';";
            db.any(query).then(data => {
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });
    }

    // Retrieves all devices
    getAllDevices(): Promise<Device[]> {
        return db.any("SELECT * FROM msp_device;");
    }

    // Retrieves the device IDs based on the given Site ID.
    getDevices(siteID): Promise<[any, boolean]> {
        return new Promise((fulfill, reject) => {            
            db.any("SELECT device_recid FROM msp_device WHERE site_recid=\'" + siteID + "\';").then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,true]);
            })
    });
    }

}