import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { createJwt, createPayload } from "../../../utils/jwt/createJwt";
import { createGroup } from "./group/createGroup";
import { createUser } from "./user/createUser";
import { encryptText } from "../../../utils/encrypt";

interface GoogleUser {
    email: string,
    name: string,
    picture: string,
    googleId: string
    password: string
}

export const loginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body as GoogleUser
    const prisma = new PrismaClient()
    const encryptedPassword = await encryptText(password);


    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    }).finally(() => {
        prisma.$disconnect()
    })

    if (user === null) {
        const newUser = await createUser({
            user: {
                email: email,
                name: name,
                password: encryptedPassword
            }, prisma
        })
        await createGroup({ user_id: newUser.id, prisma })
        const payload = createPayload(newUser);
        const jwtToken = createJwt(payload)

        return res.status(200).json({
            token: jwtToken,
            user: payload
        });
    }

    else {
        const payload = createPayload(user);
        const jwtToken = createJwt(payload)
        return res.status(200).json({
            token: jwtToken,
            user: payload
        });
    }
}