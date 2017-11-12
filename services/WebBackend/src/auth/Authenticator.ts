import {Request, Response, NextFunction } from "express";
import {Log} from "uniserve.m8s.utils";

/**
 * Authenticates users
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export let authenticate = (req: Request, res: Response, next: NextFunction) => {
    Log.trace("Authenticator::authenticate");

    if(req.query.authtoken && req.query.authtoken === process.env.PHP_AUTH_TOKEN){
        return next();
    }
    
    Log.error("Authenticator::authenticate HARD ERROR PHP TOKEN AUTH FAILURE SHOULD NOT HAPPEN EVER URL:" + req.url);

    res.statusCode = 400;
    res.json("Error: Middleware Authentication failed.");
}