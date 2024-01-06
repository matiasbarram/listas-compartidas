import { Request, Response, NextFunction } from "express";
import { validateJwt } from "../../../utils/jwt/validateJwt";
import Logger from "../../../utils/logger";
import { JwtPayload, JwtToken } from "../../interfaces/interfaces";
import { createJwt } from "../../../utils/jwt/createJwt";

export function checkJwt(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            message: "Not authenticated",
        });
    }

    const authHeaderData = authHeader.split(" ");
    if (authHeaderData.length !== 2 || authHeaderData[0] !== "Bearer") {
        return res.status(401).json({
            message: "Not authenticated",
        });
    }
    const token = authHeaderData[1];
    try {
        const payload = validateJwt(token);
        if (typeof payload === "string") {
            return res.status(401).json({
                message: "Not authenticated",
            });
        }
        payload as JwtToken;
        ["iat", "exp"].forEach(
            (keyToRemove) => delete payload[keyToRemove as keyof JwtToken],
        );
        try {
            // Refresh and send a new token on every request
            const newToken = createJwt(payload as JwtPayload);
            res.setHeader("token", `Bearer ${newToken}`);
            return next();
        } catch (err) {
            // const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
            return next(err);
        }
    } catch {
        return res.status(401).json({
            message: "Not auth",
        });
    }
}
