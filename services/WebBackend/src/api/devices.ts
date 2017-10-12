import {Request, Response, NextFunction } from "express";
import {HTTPMainPageRequest, HTTPMainPageResponse, Site, Device} from "uniserve.m8s.types";
import {Log, DbInterface} from "uniserve.m8s.utils";


export let devices = (req: Request, res: Response) => {
    //might be a string tbh
    let request_id = <number> req.params.company_recid;
    Log.trace("API:devices");
    Log.info("API:devices # company_recid: " + request_id);

    let fakesite: Site = {
        site_recid: 1,
        company_recid: request_id,
        description: "fake site",
        address1: "fake address1",
        address2: "fake address2",
        city: "fake city",
        province: "fake province",
        postal_code: "fake postalcode",
        latitude: "0",
        longitude: "0" 
    };

    let fakedevice: Device = {
        device_recid: 1,
        site_recid: 1,
        device_id: "fake device_id",
        manufacturer: "fake manufacturer",
        description: "fake description",
        device_type: "fake device type",
        mac_address: "fake mac address",
        ip_address: "fake ip",
        ping_records: [{ping_recid: 1, device_id: 1, ms_response: 100, responded: true, datetime: new Date()}]
    }

    fakesite.devices = [fakedevice];
    let response: HTTPMainPageResponse = {sites: [fakesite]};

    res.json(response);
}
