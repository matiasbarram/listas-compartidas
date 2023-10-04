import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { createJwt } from "../../../utils/jwt/createJwt";

interface GoogleUser {
    email: string,
    name: string,
    picture: string,
    googleId: string
    password: string
}

export const loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    const googleUser = req.body as GoogleUser
    console.log(googleUser)
    const prisma = new PrismaClient()
    const user = await prisma.users.findUnique({
        where: {
            email: googleUser.email
        }
    })
    // check if user exists
    if (user === null) {
        // create user and return jwt token
        const newUser = await prisma.users.create({
            data: {
                email: googleUser.email,
                name: googleUser.name,
                password: googleUser.password
            }
        })
        const payload = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            created_at: newUser.created_at,
            updated_at: newUser.updated_at,
        }
        const jwtToken = createJwt(payload)
        return res.status(200).json({
            token: jwtToken,
            user: payload
        });
    }
    else {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
        const jwtToken = createJwt(payload)
        return res.status(200).json({
            token: jwtToken,
            user: payload
        });
    }
}