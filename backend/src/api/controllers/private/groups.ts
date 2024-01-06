import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { payloadData } from "../../../utils/jwt/payloadData"

export const getGroups = async (req: Request, res: Response) => {
    const payload = payloadData(req, res)
    if (typeof payload === "string") {
        return res.status(401).json({
            error: payload,
        })
    }

    const prisma = new PrismaClient()
    const user_groups = await prisma.groups
        .findMany({
            where: {
                user_group: {
                    some: {
                        user_id: payload.id,
                    },
                },
            },
            include: {
                user_group: {
                    include: {
                        users: true,
                    },
                },
            },
            orderBy: {
                created_at: "asc",
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    const groups = user_groups.map((user_group) => {
        const users = user_group.user_group.map((user) => {
            const { ...rest } = user.users
            return rest
        })
        const { ...rest } = user_group
        return {
            ...rest,
            users,
        }
    })

    return res.status(200).json({
        groups,
    })
}

export const inviteUsersToGroup = async (req: Request, res: Response) => {
    const payload = payloadData(req, res)
    if (typeof payload === "string") {
        return res.status(401).json({
            error: payload,
        })
    }
    const prisma = new PrismaClient()
    const groupId = Number(req.params.groupId)
    const { emails } = req.body
    if (!emails) {
        return res.status(400).json({
            error: "Emails is required",
        })
    }
    const users = await prisma.users
        .findMany({
            where: {
                email: {
                    in: emails,
                },
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })
    if (!users.length) {
        return res.status(400).json({
            error: "Users not found",
        })
    }
    const user_group = users.map((user) => {
        return {
            user_id: user.id,
            group_id: groupId,
        }
    })
    await prisma.user_group
        .createMany({
            data: user_group,
        })
        .finally(() => {
            prisma.$disconnect()
        })
    return res.status(200).json({
        message: "Users invited to group",
    })
}

export const deleteMemberFromGroup = async (req: Request, res: Response) => {
    const payload = payloadData(req, res)
    if (typeof payload === "string") {
        return res.status(401).json({
            error: payload,
        })
    }
    const prisma = new PrismaClient()
    const groupId = Number(req.params.groupId)
    // get userId from the body
    const userId = Number(req.body.userId)
    const userGroup = await prisma.user_group
        .findFirst({
            where: {
                user_id: userId,
                group_id: groupId,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })
    if (!userGroup) {
        return res.status(400).json({
            error: "User not in group",
        })
    }
    // delete userId from groupId
    await prisma.user_group
        .deleteMany({
            where: {
                user_id: userId,
                group_id: groupId,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    const users = await prisma.user_group
        .findMany({
            where: {
                group_id: groupId,
            },
            include: {
                users: true,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    return res.status(200).json({
        message: "User deleted from group",
        users: users.map((user) => {
            const { ...rest } = user.users
            return rest
        }),
    })
}

export const usersGroup = async (req: Request, res: Response) => {
    const payload = payloadData(req, res)
    if (typeof payload === "string") {
        return res.status(401).json({
            error: payload,
        })
    }
    const groupId = Number(req.params.id)
    const prisma = new PrismaClient()
    const users = await prisma.user_group
        .findMany({
            where: {
                group_id: groupId,
            },
            include: {
                users: true,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    return res.status(200).json({
        users,
    })
}

export const groupsInfo = async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId)
    const prisma = new PrismaClient()
    const group = await prisma.groups
        .findUnique({
            where: {
                id: groupId,
            },
        })
        .then(async (group) => {
            const users = await prisma.users.findMany({
                where: {
                    user_group: {
                        some: {
                            group_id: groupId,
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            })
            return {
                ...group,
                users,
            }
        })
        .finally(() => {
            prisma.$disconnect()
        })
    return res.status(200).json({
        group,
    })
}

export const editGroupInfo = async (req: Request, res: Response) => {
    // change name and description of group the info is inside the body
    const groupId = Number(req.params.groupId)
    const prisma = new PrismaClient()
    const { name, description } = req.body
    if (!name || !description) {
        return res.status(400).json({
            error: "Name and description are required",
        })
    }
    await prisma.groups
        .update({
            where: {
                id: groupId,
            },
            data: {
                name,
                description,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })
    return res.status(200).json({
        message: "Group info updated",
        data: {
            id: groupId,
            name,
            description,
        },
    })
}
