import { Request, Response, NextFunction } from "express";

/**
 * Authenticates users
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export let authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    //true if user is authenticad
    console.log("authenticating");
    if(true){
        return next();
    } else {
        res.redirect('/')
    }
}