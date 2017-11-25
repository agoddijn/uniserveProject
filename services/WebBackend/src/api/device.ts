import {Request, Response, NextFunction } from "express";
import {HTTPMainPageResponse, Site, Device} from "uniserve.m8s.types";
import {Log} from "uniserve.m8s.utils";
import {DbInterface} from "uniserve.m8s.web.db_interface";

export let device = async (req: Request, res: Response) => {
    const company_recid = parseInt(req.params.company_recid);
    const device_recid  = parseInt(req.params.device_recid);
    let enddate = new Date();
    let startdate = new Date();
    startdate.setHours(startdate.getHours() - 24);

    if(req.query.startdate && req.query.enddate){
        startdate = new Date(req.query.startdate);
        enddate = new Date (req.query.enddate); 
    }

    Log.info("API:device # company_recid: " + company_recid + "device_recid " + device_recid + " startdate " + startdate + " enddate " + enddate);

    try {
        const db = new DbInterface();
        const siteData = await db.getCompanyDevices(company_recid);
        const sites: Site[] = siteData[0].sites;
        
        //Authenticate device owned by user, somewhat ineffecient
        let devices = [];
        sites.forEach(site =>{
            devices = devices.concat(site.devices);
        })
        let device = devices.find( device => device.device_recid === device_recid);

        
        if(device){
            const pingRecords = await db.getPingRecordsByDate(device.device_recid, startdate, enddate);
            if(!pingRecords[0]) throw new Error("No Ping Records Found");
            device.ping_records = pingRecords[0];
            res.json(device);              
        } else {
            res.status(404);
            res.json("Error: Device id: " + device_recid + " not found");            
        }

    } catch(e) {
        res.status(400);
        res.json("Error: " + JSON.stringify(e));
    }

}
