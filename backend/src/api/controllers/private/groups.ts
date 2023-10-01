import { Request, Response } from "express";
import { validateJwt } from "../../../utils/jwt/validateJwt";
import { PrismaClient } from "@prisma/client";
import { payloadData } from "../../../utils/jwt/payloadData";


export const getGroups = async (req: Request, res: Response) => {
    const payload = payloadData(req, res);
    if (typeof payload === 'string') {
        return res.status(401).json({
            error: payload,
        });
    }

    const prisma = new PrismaClient();
    const user_groups = await prisma.groups.findMany({
        where: {
            user_group: {
                some: {
                    user_id: payload.id,
                },
            }
        },
        include: {
            user_group: {
                include: {
                    users: true,
                }
            }
        },
        orderBy: {
            created_at: 'asc'
        }
    }).finally(() => {
        prisma.$disconnect()
    })

    const groups = user_groups.map((user_group) => {
        const users = user_group.user_group.map((user) => {
            const { password, ...rest } = user.users;
            return rest;
        })
        const { user_group: _, ...rest } = user_group;
        return {
            ...rest,
            users,
        }
    })

    return res.status(200).json({
        groups,
    });
}



export const inviteUserToGroup = async (req: Request, res: Response) => {
    const payload = payloadData(req, res);
    if (typeof payload === 'string') {
        return res.status(401).json({
            error: payload,
        });
    }
    const prisma = new PrismaClient();
    const groupId = Number(req.params.id);
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            error: "Email is required"
        })
    }
    const user = await prisma.users.findUnique({
        where: {
            email,
        }
    }).finally(() => {
        prisma.$disconnect()
    })

    if (!user) {
        return res.status(400).json({
            error: "User not found"
        })
    }
    const userGroup = await prisma.user_group.findFirst({
        where: {
            user_id: user.id,
            group_id: groupId,
        }
    }).finally(() => {
        prisma.$disconnect()
    })

    if (userGroup) {
        return res.status(400).json({
            error: "User already in group"
        })
    }
    await prisma.user_group.create({
        data: {
            user_id: user.id,
            group_id: groupId
        }
    }).finally(() => {
        prisma.$disconnect()
    })

    return res.status(200).json({
        message: "User added to group"
    });

}


export const usersGroup = async (req: Request, res: Response) => {
    const payload = payloadData(req, res);
    if (typeof payload === 'string') {
        return res.status(401).json({
            error: payload,
        });
    }
    const groupId = Number(req.params.id);
    const prisma = new PrismaClient();
    const users = await prisma.user_group.findMany({
        where: {
            group_id: groupId,
        },
        include: {
            users: true,
        }
    }).finally(() => {
        prisma.$disconnect()
    })

    return res.status(200).json({
        users,
    });

}