import * as pgPromise from 'pg-promise';
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

}