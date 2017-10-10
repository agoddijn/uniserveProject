import * as pgPromise from 'pg-promise';
import {Device, PingRecord} from 'uniserve.m8s.types'

const pgp = pgPromise();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'ubc03',
    user: 'postgres',
    password: 'jackjack'
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
     * Returns the list of all devices
     * Needed by PinginBackend
     */
    getDeviceList(): Device[] {
        var result: Device[];
        return result;
    }

    /*
     * Stores a bunch of ping records
     * Return true if succesful, false otherwise
     */
    storePingRecords(records: PingRecord[]): Promise<boolean> {
        return new Promise((fulfill, reject) => {
            fulfill(true);
        })
    }

}