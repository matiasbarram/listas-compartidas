import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { encryptText } from "../../../utils/encrypt";
import { createJwt, createPayload } from "../../../utils/jwt/createJwt";

const createGroup = async (user_id: number, name: string, prisma: PrismaClient) => {
    const group = await prisma.groups.create({
        data: {
            name: `Personal ${name}-${user_id}`,
            description: `Personal group for ${name}`,
        }

    }).finally(() => {
        prisma.$disconnect()
    })


    return group;
}


export const register = async (req: Request, res: Response, next: NextFunction) => {
    const prisma = new PrismaClient()
    const { name, email, password } = req.body;

    const encryptedPassword = await encryptText(password);

    try {
        const user = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: encryptedPassword
            }
        }).finally(() => {
            prisma.$disconnect()
        })


        const group = await createGroup(user.id, user.name, prisma);
        const user_group = await prisma.user_group.create({
            data: {
                user_id: user.id,
                group_id: group.id,
            }
        }).finally(() => {
            prisma.$disconnect()
        })


        const payload = createPayload(user);
        const jwtToken = createJwt(payload);


        return res.status(200).json({
            message: 'User created successfully',
            token: jwtToken,
            user: user,
            user_group: user_group,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }



}

