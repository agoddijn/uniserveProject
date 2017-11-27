import * as path from 'path'; 
require('dotenv').config({path: path.join( __dirname + '/../../.env')});

import {PingRecord, Device} from "uniserve.m8s.types";
import {Log, DbTesting} from "uniserve.m8s.utils";
import {DbInterface} from "uniserve.m8s.web.db_interface";


if(!process.env.NOTPRODUCTION || process.env.NODE_ENV === "production"){
    Log.error("Are you sure this isn't production? Add Enviromental variable NOTPRODUCTION before running");
    process.exit(1);
}

if(process.argv.length != 4){
    Log.error("createFilledUniserveDB takes 2 arguments, minimum and maximum error rate");
    process.exit(1);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

let minErrorRate = Number(process.argv[2]);
let maxErrorRate = Number(process.argv[3]);

async function createPingRecords(start, end, devices){
    const db = new DbInterface();
    let records = [];            
    while(start.getTime() < end.getTime()){
        for(let device of devices){
            let responded = getRandomArbitrary(0, 100) > device.failurerate;
            let ms = responded ?  Math.floor(device.averagems +getRandomArbitrary(20, 100)) : null;
            let pingrecord: PingRecord = {
                ping_recid: null,
                device_recid: device.device_recid,
                ms_response: ms,
                ip_address: device.ip_address,
                responded: responded,
                datetime: start
            }
            records.push(pingrecord);
        }
        if(records.length > 100000){
            await db.storePingRecordsBulk(start.getTime(), records);
            records = [];            
        }
        start = new Date(start.setTime(start.getTime() + 1000* 60));
    }
    await db.storePingRecordsBulk(start.getTime(), records);    
}

async function filldb(){
    const db = new DbInterface();  

    let devices: any = await db.getAllDevices();

    for(let device of devices){
        device.failurerate = getRandomArbitrary(minErrorRate, maxErrorRate);
        device.averagems = getRandomArbitrary(30, 250);
    }

    //60-90 day table
    let start = new Date();
    let end = new Date(start);
    start = new Date(start.setDate(start.getDate() - 90));
    end = new Date(end.setDate(end.getDate() - 60));
    await createPingRecords(start, end, devices);

    await db.migrate30DayData();
    await db.migrate60DayData();

    // //30-60 day table
    // start = new Date();
    // end = new Date(start);
    // start = new Date(start.setDate(start.getDate() - 60));
    // end = new Date(end.setDate(end.getDate() - 30));
    // await createPingRecords(start, end, devices);

    // await db.migrate30DayData();

    // //30 day table
    // //Run topup after
    // start = new Date();
    // end = new Date(start);
    // start = new Date(start.setDate(start.getDate() - 30));
    // end = new Date(end.setDate(end.getDate() - 10));
    // await createPingRecords(start, end, devices);
    
}

filldb();
