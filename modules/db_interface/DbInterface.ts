import {Company, Site, Device, PingRecord} from 'uniserve.m8s.types'
import {dbObj} from '../db_connection/db_connection'
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
            let query = 
            "BEGIN TRANSACTION; " +
            "INSERT INTO msp_ping_30 (device_recid, ip_address, ms_response, response_count, datetime) " +
            "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, round((count(nullif(responded, false))::decimal/5),1), date_trunc('hour', datetime) + date_part('minute', datetime)::int / 5 * interval '5 min' as timestamp " +
            "FROM( SELECT * FROM msp_ping p WHERE  datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_recid, p.responded ORDER BY p.device_recid, p.datetime ) AS SUBQUERY " +
            "GROUP BY timestamp, device_recid " + 
            "ORDER BY device_recid, timestamp; " +
            "DELETE FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval); " +
            "END TRANSACTION; ";

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
            let query = 
                "BEGIN TRANSACTION; " +
                "INSERT INTO msp_ping_60 (device_recid, ip_address, ms_response, response_count, datetime) " + 
                "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, (round(sum(response_count),1)::decimal) as ping_success_rate, date_trunc('hour', datetime) + date_part('minute', datetime)::int / 5 * interval '25 min' as timestamp " +
                "FROM(SELECT * FROM msp_ping_30 p WHERE  datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_recid, p.response_count ORDER BY p.device_recid, p.datetime) AS SUBQUERY " +
                "GROUP BY timestamp, device_recid ORDER BY device_recid, timestamp; " +
                "DELETE FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval); " +
                "END TRANSACTION; ";
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
            let query = "DELETE FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval);";
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
            let query = "DELETE FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval);";
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
                let psqlDate = new Date(record.datetime).toISOString().slice(0, 19).replace('T', ' ');
                
                let query = "INSERT INTO msp_ping (device_recid, ip_address, ms_response, responded, datetime) VALUES (" + record.device_recid 
                + ", \'" + record.ip_address + "\', " + record.ms_response + ", " + record.responded + ", \'" +  psqlDate + "\');"
                
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
        return new Promise ((fulfill, reject) => {
            let query = "SELECT * FROM msp_device;";
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
            db.any("SELECT device_recid FROM msp_device WHERE site_recid=\'" + siteID + "\';").then(data => {
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
            let query = "SELECT * FROM msp_ping;";
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

     /*
     * Retrieve all pings that are older than 30 days.
     * Return true if succesful, false otherwise
     */
    get30DayOldRecords() : Promise<[any, boolean]>{
        return new Promise((fulfill,reject) => {
            let query = "SELECT * FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY device_recid, ping_recid ORDER BY device_recid, datetime";
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
            let query = "SELECT * FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY device_recid, ping_recid ORDER BY device_recid, datetime";
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