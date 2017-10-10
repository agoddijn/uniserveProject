import * as pgPromise from 'pg-promise';
const pgp = pgPromise();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'ubc03',
    user: 'postgres',
    password: ''
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

    // Retrieves the company ID based on the given username/email.
    getCompanyID(username){
        db.any("SELECT company_recid FROM msp_company WHERE username=\'" + username + "\';").then(data => {
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

    // Retrieves the device IDs based on the given Site ID.
    getDevices(siteID){
        db.any("SELECT device_recid FROM msp_device WHERE site_recid=\'" + siteID + "\';").then(data => {
            console.log("Data: " + JSON.stringify(data));
        }).catch(e => {
            console.log("Error: " + e);
        })
    }

}