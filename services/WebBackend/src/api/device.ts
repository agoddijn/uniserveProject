import { Request, Response, NextFunction } from "express";

export let device = (req: Request, res: Response) => {
    res.json({hello:"world"});
}
