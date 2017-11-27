import {Company, Site, Device, PingRecord} from 'uniserve.m8s.types'
import {dbObj, pgProm} from '../../modules/db_connection/db_connection'
const path = require('path');
let db = dbObj;
let testMode = false;
export default class DbTesting {

    constructor(test:boolean = false){
        console.log("DbTesting::Init");
        if (test == true) {
            testMode = true;
        }
    }

    
    // INSERTION/DELETION SCRIPTS

    /*
     * Creates all of the database tables
     * Return true if succesful, false otherwise
     */
    createTables() : Promise<[any,boolean]> {
        return new Promise((fulfill, reject) => {
            if (testMode == true){
                var sqlFile = this.sql('../../database/schema_test.sql');    
            }
            else {
                var sqlFile = this.sql('../../database/schema.sql');
            }
            const sqlCreateTables = sqlFile;
            db.any(sqlCreateTables)
            .then(result => {
                fulfill([result, true]);
            })
            .catch(error => {
                reject([error, false]);
            })
        });
    }

    /*
     * Deletes all records in the database
     * Return true if succesful, false otherwise
     */
    deleteAllRecords() : Promise<[boolean]> {
        return new Promise((fulfill, reject) => {
            if (testMode == true){
                var sqlFile = this.sql('../../database/delete_all_records_test.sql');    
            }
            else {
                var sqlFile = this.sql('../../database/delete_all_records.sql');
            }
            const sqlDeleteRecords = sqlFile;
            db.any(sqlDeleteRecords)
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
        console.log("asdasfasdfdsa");
        return new Promise((fulfill, reject) => {
            if (testMode == true){
                var sqlFile = this.sql('../../database/insert_msp_company_test.sql');    
            }
            else {
                var sqlFile = this.sql('../../database/insert_msp_company.sql');
            }
            const sqlGenerateCompanyRecords = sqlFile;
            db.any(sqlGenerateCompanyRecords)
            .then(result => {
                fulfill([true]);
            })
            .catch(error => {
                reject([false]);
            })
        });
    }

    /*
     * Insert the default Site recordss
     * Return true if succesful, false otherwise
     */
    generateSiteRecords() : Promise<[boolean]> {
        return new Promise((fulfill, reject) => {
            if (testMode == true){
                var sqlFile = this.sql('../../database/insert_msp_site_test.sql');    
            }
            else {
                var sqlFile = this.sql('../../database/insert_msp_site.sql');
            }
            const sqlGenerateSiteRecords = sqlFile;
            db.any(sqlGenerateSiteRecords)
            .then(result => {
                fulfill([true]);
            })
            .catch(error => {
                reject([false]);
            })
        });
    }

    /*
     * Insert the default Device records
     * Return true if succesful, false otherwise
     */
    generateDeviceRecords() : Promise<[boolean]> {
        return new Promise((fulfill, reject) => {
            if (testMode == true){
                var sqlFile = this.sql('../../database/insert_msp_device_valid_test.sql');    
            }
            else {
                var sqlFile = this.sql('../../database/insert_msp_device_valid.sql');
            }
            const sqlGenerateDeviceRecords = sqlFile;
            db.any(sqlGenerateDeviceRecords)
            .then(result => {
                fulfill([true]);
            })
            .catch(error => {
                reject([false]);
            })
        });
    }

    /*
     * Retrieves the sql file at a given filepath
     */
    sql(file) {
        const fullPath = path.join(__dirname, file);
        return new pgProm.QueryFile(fullPath, {minify: true});
    }
}