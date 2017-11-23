import * as pgPromise from 'pg-promise';

const pgp = pgPromise();
var types =require('pg').types;
var timestampID = 1114;
types.setTypeParser(1114, function(stringValue) {
    return stringValue;
})
const cn = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
}
const db = pgp(cn);

export var dbObj = db;
export var pgProm = pgp;