import { JwtPayload } from "../../api/interfaces/interfaces";
import jwt from "jsonwebtoken";
import { users } from "@prisma/client";

export function createPayload(user: users): JwtPayload {
    const payload: JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
    return payload;
}

export function createJwt(payload: JwtPayload): string {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    return token;
}
