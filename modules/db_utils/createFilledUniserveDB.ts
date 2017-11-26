import {PingRecord, Device} from "uniserve.m8s.types";
import {Log, DbTesting} from "uniserve.m8s.utils";
import {DbInterface} from "uniserve.m8s.web.db_interface";


if(!process.env.NOTPRODUCTION){
    Log.error("Are you sure this isn't production? Add Enviromental variable NOTPRODUCTION before running");
    process.exit(1);
}

if(process.argv.length != 4){
    Log.error("createFilledUniserveDB takes 2 arguments, minimum and maximum error rate");
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

let minErrorRate = Number(process.argv[2]);
let maxErrorRate = Number(process.argv[3]);

function createPingRecords(start, end, devices){
    const db = new DbInterface();
    
    while(start < end){
        let records = [];
        for(let device of devices){

            let pingrecord: PingRecord = {
                ping_recid: null,
                device_recid: device.device_recid,

            }
            records.push(pingrecord);
        }

        db.storePingRecords(start.getTime(), records);
    }
}

async function filldb(){
    const dbtest = new DbTesting();
    const db = new DbInterface();

    await dbtest.deleteAllRecords();
    await dbtest.createTables();
    await dbtest.generateCompanyRecords();
    await dbtest.generateSiteRecords();
    await dbtest.generateDeviceRecords();
    let devices: any = await db.getAllDevices();

    for(let device of devices){
        device.failurerate = getRandomArbitrary(minErrorRate, maxErrorRate);
    }

    //60-90 day table
    let start = new Date();
    let end = start;
    start.setDate(start.getDate() - 90);
    end.setDate(end.getDate() - 60);

    await db.migrate30DayData();
    await db.migrate60DayData();
    

}

filldb();
