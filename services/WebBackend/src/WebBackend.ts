import * as express from "express";
import * as Authenticator from "./auth/Authenticator";
import * as path from "path";
import * as devicesAPI from "./api/devices";
import * as deviceAPI from "./api/device"

const app = express();

//TODO remove this once frontend has dev server and apache is figured out
app.use(express.static(path.normalize(__dirname + "/../../Frontend/public")));
app.get('/', function(req,res) {
    res.sendFile(path.normalize(__dirname + "/../../Frontend/public/index.html"));
});

app.get("/api/company/:company_id/devices", Authenticator.authenticateUser, devicesAPI.devices);
app.get("/api/company/:company_id/device/:device_id", Authenticator.authenticateUser, deviceAPI.device);

app.listen(process.env.PORT, ()=>{
    console.log("App is running on http://localhost:" + process.env.PORT);
})
