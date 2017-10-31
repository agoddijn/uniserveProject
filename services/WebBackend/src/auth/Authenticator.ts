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

    //TODO
    //errors will get added on php side right if server responds with nothing
    //should probably actually be made more explicit
    res.send();
}