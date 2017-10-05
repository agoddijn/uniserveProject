import * as express from "express";
import * as Authenticator from "./auth/Authenticator";
import * as path from "path";
import * as devicesAPI from "./api/devices";
import * as deviceAPI from "./api/device";
import {Log, DbInterface} from "uniserve.m8s.utils";
import {Company} from "uniserve.m8s.types";

const app = express();

//TODO remove this once frontend has dev server and apache is figured out
app.use(express.static(path.normalize(__dirname + "/../../Frontend/public")));
app.get('/', function(req,res) {
    res.sendFile(path.normalize(__dirname + "/../../Frontend/public/index.html"));
});

let test : Company = {company_name: "test", company_recid: 1, company_id: "1"};

let dbInt = new DbInterface;
dbInt.helloWorld();
dbInt.getData();

app.get("/api/company/:company_id/devices", Authenticator.authenticateUser, devicesAPI.devices);
app.get("/api/company/:company_id/device/:device_id", Authenticator.authenticateUser, deviceAPI.device);

app.listen(process.env.PORT, ()=>{
    Log.info("App is running on http://localhost:" + process.env.PORT);
})
