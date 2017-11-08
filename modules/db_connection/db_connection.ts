import * as pgPromise from 'pg-promise';

const pgp = pgPromise();
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