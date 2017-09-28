import { Request, Response, NextFunction } from "express";

export let devices = (req: Request, res: Response) => {
    res.json({hello:"world"});
}
