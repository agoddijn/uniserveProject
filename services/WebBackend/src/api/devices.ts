import {Request, Response, NextFunction } from "express";
import {HTTPMainPageResponse, Site, Device} from "uniserve.m8s.types";
import {Log} from "uniserve.m8s.utils";
import {DbInterface} from "uniserve.m8s.web.db_interface";
import {Geocoder} from "../geocoding/Geocoder";

export let devices = async (req: Request, res: Response) => {
    const request_id = parseInt(req.params.company_recid);
    Log.info("API:devices # company_recid: " + request_id);

    try {
        const db = new DbInterface();
        const geocoder = new Geocoder();
        
        const siteData = await db.getCompanyDevices(request_id);
        const sites: Site[] = siteData[0].sites;
        
        let pingPromises = [];
        
        for(let site of sites){

            if(site.latitude == ""){
                const coordinates = await geocoder.geocode(site);
                site.latitude = coordinates.lat;
                site.longitude = coordinates.long;
                if(site.latitude){
                    db.updateSiteLocation(site.site_recid, coordinates.lat.slice(0, 12), coordinates.long.slice(0, 12))
                        .catch(e => Log.error(`Site: ${site.site_recid} db update location failed`));
                }
            }

            for(const device of site.devices){
                pingPromises.push(db.getRecentPings(device.device_recid, 5));
            }
            
        }

        const pingRecords = await Promise.all(pingPromises);

        let i = 0;
        for(let j = 0; j < sites.length; j++){
            for(let k = 0; k < sites[j].devices.length; k++){
                sites[j].devices[k].ping_records = pingRecords[i][0];
                i++;
            }
        }


        res.json(sites);  

    } catch(e) {
        res.status(400);
        res.json("Error: " + JSON.stringify(e));
    }

}
