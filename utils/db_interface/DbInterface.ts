import * as pgPromise from 'pg-promise';
import {Device, PingRecord} from 'uniserve.m8s.types'

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

    // Using a Company ID, get associated Sites records, Device records And lates ping
    // Join??? Multiple commands? 
    // GetCompanyDevices(company_recid)

    //
    //
    //

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