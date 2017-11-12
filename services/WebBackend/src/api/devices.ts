import {Request, Response, NextFunction } from "express";
import {HTTPMainPageResponse, Site, Device} from "uniserve.m8s.types";
import {Log} from "uniserve.m8s.utils";
import {DbInterface} from "uniserve.m8s.web.db_interface";

export let devices = async (req: Request, res: Response) => {
    //might be a string tbh
    const request_id = parseInt(req.params.company_recid);
    Log.info("API:devices # company_recid: " + request_id);

    try {
        const db = new DbInterface();
        const siteData = await db.getCompanyDevices(request_id);
        const sites: Site[] = siteData[0].sites;
        
        for(const site of sites){
            for(const device of site.devices){
                const dbpings = await db.getRecentPings(device.device_recid,5);
                device.ping_records = dbpings[0];
            }
        }

        res.json(sites);  

    } catch(e) {
        res.status(400);
        res.json("Error: " + JSON.stringify(e));
    }

}
