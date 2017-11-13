import * as express from "express";
import * as Authenticator from "./auth/Authenticator";
import * as path from "path";
import * as devicesAPI from "./api/devices";
import * as deviceAPI from "./api/device";
import {Log,DbTesting} from "uniserve.m8s.utils";
import {Company} from "uniserve.m8s.types";
import {DbInterface} from "uniserve.m8s.web.db_interface";

const app = express();

let dbInt = new DbInterface;

app.get("/api/company/:company_recid/devices", Authenticator.authenticate, devicesAPI.devices);
app.get("/api/company/:company_recid/device/:device_recid", Authenticator.authenticate, deviceAPI.device);

app.listen(process.env.WEBBACKEND_PORT, ()=>{
    Log.info("Web Backend is running on http://localhost:" + process.env.WEBBACKEND_PORT);
})

//needed for testing
module.exports = app;
