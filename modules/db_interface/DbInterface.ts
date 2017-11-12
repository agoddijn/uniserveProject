import {Company, Site, Device, PingRecord} from 'uniserve.m8s.types'
import {dbObj} from '../db_connection/db_connection'
import {Query} from './query'
const path = require('path');
let db = dbObj;
export class DbInterface {
    constructor(){
        console.log("DbInterface::Init");
    }

    // AGGREGATION COMMANDS

    /*
     * Migrate and aggregate all records older than 30 days
     * Return true if succesful, false otherwise
     */
    migrate30DayData() : Promise<[any, boolean]>{
        return new Promise((fulfill,reject) => {
            let query = Query.MIGRATE_30;

            db.any(query).then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false]);
            })
        })
    }

    /*
     * Migrate and aggregate all records older than 60 days
     * Return true if succesful, false otherwise
     */
    migrate60DayData() : Promise<[any, boolean]>{
        return new Promise((fulfill,reject) => {
            let query = Query.MIGRATE_60;
            db.any(query).then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false]);
            })
        })
    }

    // DELETION COMMANDS

    /*
     * Delete all pings older than 30 days.
     * Return true if succesful, false otherwise
     */
    delete30DayOldRecords() : Promise<[any, boolean]>{
        return new Promise((fulfill,reject) => {
            let query = Query.DELETE_30_DAYS;
            db.any(query).then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false]);
            })
        });
    }

    /*
     * Delete all pings older than 60 days
     * Return true if succesful, false otherwise
     */
    delete60DayOldRecords() : Promise<[any, boolean]>{
        return new Promise((fulfill,reject) => {
            let query = Query.DELETE_60_DAYS;
            db.any(query).then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false]);
            })
        });
    }

    // INSERTION COMMANDS

    /*
     * Stores a bunch of ping records
     * Return true if succesful, false otherwise
     */
    storePingRecords(date: number, records: PingRecord[]): Promise<[number, boolean]> {
        return new Promise((fulfill, reject) => {
            // console.log("Recieving records");
            for (let record of records) {
                // console.log("\n" + JSON.stringify(record));
                if (isNaN(record.ms_response) || record.ms_response === null) {
                    record.ms_response = -1
                }
                //https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
                let psqlDate = new Date(record.datetime).toISOString().slice(0, 19).replace('T', ' ');

                let query = Query.INSERT_RECORDS
                    .replace("deviceRecID",`${record.device_recid}`)
                    .replace("IPAddress",`${record.ip_address}`)
                    .replace("msResponse",`${record.ms_response}`)
                    .replace("respondedResult",`${record.responded}`)
                    .replace("psqlDate",`${psqlDate}`)
                db.any(query)
                .then(data => {
                    console.log("Sent data");
                    fulfill([date, true]); 
                }).catch(e => {
                    console.log("Error: " + e);
                    fulfill([date, false]); 
                })
            }      
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
            let query = Query.GET_COMPANY_DEVICES.replace("companyID",`${companyID}`);
            console.log(query);
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
    getRecentPings(deviceRecID:any, limitNum:number = 5) : Promise<[any, boolean]>{
        return new Promise((fulfill, reject) => {
            let query = Query.GET_RECENT_PINGS.replace("deviceRecID",`${deviceRecID}`).replace("limitNum", `${limitNum}`);
            console.log(query);
            db.any(query).then(data => {
                console.log(data);
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
            let query = Query.GET_ALL_COMPANIES;
            db.any(query).then(data => {
                console.log(JSON.stringify(data));
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
            let query = Query.GET_COMPANY.replace("username",`${username}`);
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
            let query = Query.GET_ALL_SITES;
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
            let query = Query.GET_SITES_BY_COMPANY.replace("companyID",`${companyID}`);
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
        return new Promise ((fulfill, reject) => {
            let query = Query.GET_ALL_DEVICES;
            db.any(query).then(data => {
                let devices = this.parseAllDevices(data);
                fulfill(devices);
            }).catch(e => {
                console.log("Error: " + e);
                reject([]);
            })
        })
    }


    /*
     * Retrieve all devices belonging to a specific site.
     * Return true if succesful, false otherwise
     */
    getDevices(siteID): Promise<[any, boolean]> {
        return new Promise((fulfill, reject) => {
            let query = Query.GET_SITE_DEVICES.replace("siteID",`${siteID}`);
            db.any(query).then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,true]);
            })
        });
    }

    /*
     * Retrieve all pings
     * Return true if succesful, false otherwise
     */
    getAllPings(): Promise<PingRecord[]> {
        return new Promise ((fulfill, reject) => {
            let query = Query.GET_ALL_PINGS;
            db.any(query).then(data => {
                let pingRecords = this.parsePings(data);
                fulfill(pingRecords);
            }).catch(e => {
                console.log("Error: " + e);
                reject([]);
            })
        })
    }

    /*
     * Retrieve all pings for a given device.
     * Return true if succesful, false otherwise
     */
    getDevicePings(deviceRecID:any) : Promise<[any, boolean]>{
        let that = this;
        return new Promise((fulfill, reject) => {
            let query = Query.GET_DEVICE_PINGS.replace("deviceRecID",`${deviceRecID}`);
            db.any(query).then(data => {
                let pingRecords = that.parsePings(data)
                fulfill([pingRecords, true]); 
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false])
            })  
        });     
    }

     /*
     * Retrieve all pings that are older than 30 days.
     * Return true if succesful, false otherwise
     */
    get30DayOldRecords() : Promise<[any, boolean]>{
        return new Promise((fulfill,reject) => {
            let query = Query.GET_30_DAYS_OLD_PINGS;
            db.any(query).then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false]);
            })
        });
    }

    /*
     * Retrieve all pings that are older than 60 days.
     * Return true if succesful, false otherwise
     */
    get60DayOldRecords() : Promise<[any, boolean]>{
        return new Promise((fulfill,reject) => {
            let query = Query.GET_60_DAYS_OLD_PINGS;
            db.any(query).then(data => {
                fulfill([data,true]);
            }).catch(e => {
                console.log("Error: " + e);
                reject([null,false]);
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
    *
    * Retrieve a specific company's devices
    * Return true if succesful, false otherwise
    */
   parseAllDevices(results:any) :  Device[] {
       let deviceRecords: Device[] = [];
        for (var key in results){
           let device : Device = {
               device_recid : results[key]["device_recid"],
               site_recid : results[key]["site_recid"],
               device_id : results[key]["device_id"],
               manufacturer : results[key]["manufacturer"],
               description : results[key]["description"],
               device_type : results[key]["device_type"],
               mac_address : results[key]["mac_address"],
               ip_address : results[key]["ip_address"],
           }
           deviceRecords.push(device)
        }
        return deviceRecords;
    }
       

    /*
     * Retrieve a specific company's devices
     * Return true if succesful, false otherwise
     */
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
    parsePings(device:any) : PingRecord[] {
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