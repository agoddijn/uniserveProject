import * as express from "express";
import * as Authenticator from "./auth/Authenticator";
import * as path from "path";
import * as devicesAPI from "./api/devices";
import * as deviceAPI from "./api/device";
import {Log} from "uniserve.m8s.utils";
import {Company} from "uniserve.m8s.types";
import {DbInterface} from "uniserve.m8s.web.db_interface";

const app = express();

//TODO remove this once frontend has dev server and apache is figured out
app.use(express.static(path.normalize(__dirname + "/../../Frontend/public")));
app.get('/', function(req,res) {
    res.sendFile(path.normalize(__dirname + "/../../Frontend/public/index.html"));
});

let test : Company = {company_name: "test", company_recid: 1, company_id: "1"};

let dbInt = new DbInterface;

app.get("/api/company/:company_recid/devices", Authenticator.authenticate, devicesAPI.devices);
app.get("/api/company/:company_recid/device/:device_recid", Authenticator.authenticate, deviceAPI.device);

app.listen(process.env.WEBBACKEND_PORT, ()=>{
    Log.info("Web Backend is running on http://localhost:" + process.env.WEBBACKEND_PORT);
})
