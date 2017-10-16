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
                    }).catch(e => {
                        console.log("Error: " + e);
                    })
            }
            fulfill([date, true]);   
            // fulfill([date, false]) if it didnt work      
        });
    }

    getCompanyDevices(companyID: number){
        let that = this;
        let query = "SELECT * FROM msp_company c, msp_site s, msp_device d "
            +"WHERE c.company_recid = " + companyID + " "
            +"AND c.company_recid = s.company_recid "
            +"AND s.site_recid = d.device_recid;"
         //   +"AND d.device_recid = p.device_recid;";
        db.any(query).then(data => {
           // console.log("Data: " + JSON.stringify(data));
            that.compileResults(data, that);
        }).catch(e => {
            console.log("Error: " + e);
        })
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
                    devices : that.parseDevices(results[key],that)
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
    }

    parseDevices(site:any, that) {
        let deviceRecords: Device[] = [];
        let device : Device = {
            device_recid : site["device_recid"],
            site_recid : site["site_recid"],
            device_id : site["device_id"],
            manufacturer : site["manufacturer"],
            description : site["description"],
            device_type : site["device_type"],
            mac_address : site["mac_address"],
            ip_address : site["ip_address"],
            ping_records : that.parsePings(site)
        }
        deviceRecords.push(device)
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

    // Retrieves all companies
    getAllCompanies(){
        db.any("SELECT * FROM msp_company;").then(data => {
            console.log("Data: " + JSON.stringify(data));
        }).catch(e => {
            console.log("Error: " + e);
        })
    }

    // Retrieves the company ID based on the given username/email.
    getCompanyID(username){
        db.any("SELECT company_recid FROM msp_company WHERE username=\'" + username + "\';").then(data => {
            console.log("Data: " + JSON.stringify(data));
        }).catch(e => {
            console.log("Error: " + e);
        })
    }

    // Retrieves all sites
    getAllSites(){
        db.any("SELECT * FROM msp_site;").then(data => {
            console.log("Data: " + JSON.stringify(data));
        }).catch(e => {
            console.log("Error: " + e);
        })
    }

    // Retrieves the site IDs based on the given Company ID.
    getSites(companyID){
        db.any("SELECT site_recid FROM msp_site WHERE company_recid=\'" + companyID + "\';").then(data => {
            console.log("Data: " + JSON.stringify(data));
        }).catch(e => {
            console.log("Error: " + e);
        })
    }

    // Retrieves all devices
    getAllDevices(): Promise<Device[]> {
        return db.any("SELECT * FROM msp_device;");
    }

    // Retrieves the device IDs based on the given Site ID.
    getDevices(siteID){
        db.any("SELECT device_recid FROM msp_device WHERE site_recid=\'" + siteID + "\';").then(data => {
            console.log("Data: " + JSON.stringify(data));
        }).catch(e => {
            console.log("Error: " + e);
        })
    }

}