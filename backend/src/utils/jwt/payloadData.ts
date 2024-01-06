import { Request, Response } from "express";
import { validateJwt } from "./validateJwt";

export const payloadData = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    return validateJwt(token as string);
};
