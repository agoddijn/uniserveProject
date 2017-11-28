import * as path from 'path'; 
require('dotenv').config({path: path.join( __dirname + '/../../.env')});

import {PingRecord, Device} from "uniserve.m8s.types";
import {Log, DbTesting} from "uniserve.m8s.utils";
import {DbInterface} from "uniserve.m8s.web.db_interface";

if(!process.env.NOTPRODUCTION || process.env.NODE_ENV === "production"){
    Log.error("Are you sure this isn't production? Add Enviromental variable NOTPRODUCTION before running");
    process.exit(1);
}

async function resetdb(){
    const dbtest = new DbTesting();

    try{
        await dbtest.deleteAllRecords();
        await dbtest.generateCompanyRecords();
        await dbtest.generateSiteRecords();
        await dbtest.generateDeviceRecords(); 
    } catch (e){
        Log.error(JSON.stringify(e));
    }
    
    Log.info("DB Reset");
    
}

resetdb();
