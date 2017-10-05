import { Request, Response, NextFunction } from "express";
import {HTTPMainPageRequest, HTTPMainPageResponse} from "uniserve.m8s.types";


export let devices = (req: Request, res: Response) => {
    let request: HTTPMainPageRequest = req.body;
    let response: HTTPMainPageResponse = {sites: []};
    res.json(response);
}
