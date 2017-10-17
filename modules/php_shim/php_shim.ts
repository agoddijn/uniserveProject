import * as express from "express";
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as crypto from "crypto";
import * as rp from 'request-promise';
import {Log} from "uniserve.m8s.utils";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

let session = {};

//TODO: blow up if not in dev env

app.post('/login', (req,res) => {
    let company_recid   = +req.body.company_recid;
    let token           = crypto.randomBytes(4).toString('hex');
    Log.trace(`php_shim::/login | company_recid: ${company_recid} token: ${token}`);

    session[token] = company_recid;
    res.cookie("SHIM_SESSION", token);
    res.send();
});

app.post('/logout', (req, res) => {
    Log.trace("php_shim::/logout");
    res.clearCookie("SHIM_SESSION");
    session = {};
    res.send();
})

app.get('/ajax/monitoring_api.php', async (req, res) => {
    let company_recid   = session[req.cookies.SHIM_SESSION];
    let type            = req.query.type;
    let device          = null;

    if(!company_recid) res.status(401).send("Not logged in.");    
    if(type === 'device'){
        device = req.query.device;
    }
    Log.trace(`php_shim::/ajax/monitoring_api.php | company_recid: ${company_recid} type: ${type} ${device ? 'device: ' + device : ''}`);

    let options = {
        json: true,
        uri: null
    }
    
    switch(type){
        case 'devices': 
            options.uri = `http://127.0.0.1:${process.env.WEBBACKEND_PORT}/api/company/${company_recid}/devices?authtoken=${process.env.PHP_AUTH_TOKEN}`;
            break;
        case 'device': {
            options.uri = `http://127.0.0.1:${process.env.WEBBACKEND_PORT}/api/company/${company_recid}/device/${device}?authtoken=${process.env.PHP_AUTH_TOKEN}`;
            break;
        }
        default:
            res.status(404).send("Monitoring api type not found.");
    }

    let apiResponse = await rp(options);
    res.json(apiResponse);
 
})

app.listen(3035, ()=>{
    Log.info("php_shim is running on http://localhost:" + 3035);
})
