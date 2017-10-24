import {Request, Response, NextFunction } from "express";
import {HTTPMainPageResponse, Site, Device} from "uniserve.m8s.types";
import {Log, DbInterface} from "uniserve.m8s.utils";


export let devices = async (req: Request, res: Response) => {
    //might be a string tbh
    const request_id = <number> parseInt(req.params.company_recid);
    Log.trace("API:devices");
    Log.info("API:devices # company_recid: " + request_id);

    try {
        const db = new DbInterface();
        const sites: Site[] =  <Site[]> await db.getCompanyDevices(request_id)[0];
        
        for(let site of sites){
            for(let device of site.devices){
                device.ping_records = await db.getRecentPings(device.device_recid); 
            }
        }

        res.json(sites);  

    } catch(e) {
        //TODO proper errors
        res.json("error");
    }

}
