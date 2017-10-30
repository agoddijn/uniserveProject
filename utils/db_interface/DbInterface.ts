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
const path = require('path');

export default class DbInterface {

    constructor(){
        console.log("DbInterface::Init");
    }

    
    // INSERTION/DELETION SCRIPTS

    /*
     * Creates all of the database tables
     * Return true if succesful, false otherwise
     */
    createTables() : Promise<[any,boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlCreateTables = this.sql('../../database/schema.sql');
            db.one(sqlCreateTables)
            .then(result => {
                //console.log(result);
                fulfill([result, true]);
            })
            .catch(error => {
                //console.log(error);
                reject([error, true]);
            })
        });
    }

    /*
     * Deletes all records in the database
     * Return true if succesful, false otherwise
     */
    deleteAllRecords() : Promise<[any,boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlDeleteRecords = this.sql('../../database/delete_all_records.sql');
            db.one(sqlDeleteRecords)
            .then(result => {
               // console.log(result);
                fulfill([result, true]);
            })
            .catch(error => {
                //console.log(error);
                reject([error, true]);
            })
        });
    }

    /*
     * Insert the default Company records
     * Return true if succesful, false otherwise
     */
    generateCompanyRecords() : Promise<[any,boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlGenerateCompanyRecords = this.sql('../../database/insert_msp_company.sql');
            db.one(sqlGenerateCompanyRecords)
            .then(result => {
               // console.log(result);
                fulfill([result, true]);
            })
            .catch(error => {
               // console.log(error);
                reject([error, true]);
            })
        });
    }

    /*
     * Insert the default Site recordss
     * Return true if succesful, false otherwise
     */
    generateSiteRecords() : Promise<[any,boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlGenerateSiteRecords = this.sql('../../database/insert_msp_site.sql');
            db.one(sqlGenerateSiteRecords)
            .then(result => {
               // console.log(result);
                fulfill([result, true]);
            })
            .catch(error => {
               // console.log(error);
                reject([error, true]);
            })
        });
    }

    /*
     * Insert the default Device records
     * Return true if succesful, false otherwise
     */
    generateDeviceRecords() : Promise<[any,boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlGenerateDeviceRecords = this.sql('../../database/insert_msp_device_valid.sql');
            db.one(sqlGenerateDeviceRecords)
            .then(result => {
                //console.log(result);
                fulfill([result, true]);
            })
            .catch(error => {
              //  console.log(error);
                reject([error, true]);
            })
        });
    }

    
    /*
     * Retrieves the sql file at a given filepath
     */
    sql(file) {
        const fullPath = path.join(__dirname, file);
        return new pgp.QueryFile(fullPath, {minify: true});
    }

    // INSERTION COMMANDS

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

    // RETRIEVAL COMMANDS


    /*
     * Retrieve a specific company's devices
     * Return true if succesful, false otherwise
     */
    getCompanyDevices(companyID: number)/*: Promise<[any, boolean]>*/ {
        return new Promise((fulfill, reject) => {
            let that = this;
            let query = "SELECT * FROM msp_company c, msp_site s, msp_device d "
                +"WHERE c.company_recid = " + companyID + " "
                +"AND c.company_recid = s.company_recid "
                +"AND s.site_recid = d.device_recid;"
            //   +"AND d.device_recid = p.device_recid;";
            db.any(query).then(data => {
                let compiledResult = that.compileResults(data, that);
                console.log(JSON.stringify(compiledResult));
                fulfill([compiledResult, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null, false]);
            })
         });
    }

    /*
     * Get a device's recent pings
     * Return true if succesful, false otherwise
     */
    getRecentPings(deviceRecID:any, limit:number) : Promise<[any, boolean]>{
        return new Promise((fulfill, reject) => {
            let query = "SELECT * FROM msp_ping where device_recid=\'" + deviceRecID + "\' order by datetime desc, ping_recid, device_recid limit " + limit + ";";
            db.any(query).then(data => {
                fulfill([data, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });
    }

    /*
     * Retrieve all companies.
     * Return true if succesful, false otherwise
     */
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

    /*
     * Retrieve a specific record, based on username.
     * Return true if succesful, false otherwise
     */
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

    /*
     * Retrieve all devices
     * Return true if succesful, false otherwise
     */
    getAllDevices(): Promise<Device[]> {
        return db.any("SELECT * FROM msp_device;");
    }

    /*
     * Retrieve all devices belonging to a specific site.
     * Return true if succesful, false otherwise
     */
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

    /*
     * Retrieve all pings for a given device.
     * Return true if succesful, false otherwise
     */
    getDevicePings(deviceRecID:any) : Promise<[any, boolean]>{
        let that = this;
        return new Promise((fulfill, reject) => {
            let query = "SELECT * from msp_ping where msp_ping.device_recid=\'" + deviceRecID + "\' order by datetime";
            db.any(query).then(data => {
                let pingRecords = that.parsePings(data)
                fulfill([pingRecords, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });     
    }

    // HELPERS

    
    /*
     * Compile results and construct Company/Site objcts.
     * Return true if succesful, false otherwise
     */
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

    /*
     * Retrieve a specific company's devices
     * Return true if succesful, false otherwise
     */
    parseDevices(results:any, company_recid, site_recid, that) {
        let deviceRecords: Device[] = [];
       // console.log(JSON.stringify(results));
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


    /*
     * Parse pings in order to create Ping objects
     * Return true if succesful, false otherwise
     */
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
}