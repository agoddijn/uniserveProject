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

export default class DbTesting {

    constructor(){
        console.log("DbTesting::Init");
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
    deleteAllRecords() : Promise<[boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlDeleteRecords = this.sql('../../database/delete_all_records.sql');
            db.one(sqlDeleteRecords)
            .then(result => {
               // console.log(result);
                fulfill([true]);
            })
            .catch(error => {
                //console.log(error);
                reject([true]);
            })
        });
    }

    /*
     * Insert the default Company records
     * Return true if succesful, false otherwise
     */
    generateCompanyRecords() : Promise<[boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlGenerateCompanyRecords = this.sql('../../database/insert_msp_company.sql');
            db.one(sqlGenerateCompanyRecords)
            .then(result => {
               // console.log(result);
                fulfill([true]);
            })
            .catch(error => {
               // console.log(error);
                reject([true]);
            })
        });
    }

    /*
     * Insert the default Site recordss
     * Return true if succesful, false otherwise
     */
    generateSiteRecords() : Promise<[boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlGenerateSiteRecords = this.sql('../../database/insert_msp_site.sql');
            db.one(sqlGenerateSiteRecords)
            .then(result => {
               // console.log(result);
                fulfill([true]);
            })
            .catch(error => {
               // console.log(error);
                reject([true]);
            })
        });
    }

    /*
     * Insert the default Device records
     * Return true if succesful, false otherwise
     */
    generateDeviceRecords() : Promise<[boolean]> {
        return new Promise((fulfill, reject) => {
            const sqlGenerateDeviceRecords = this.sql('../../database/insert_msp_device_valid.sql');
            db.one(sqlGenerateDeviceRecords)
            .then(result => {
                //console.log(result);
                fulfill([true]);
            })
            .catch(error => {
              //  console.log(error);
                reject([true]);
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
}