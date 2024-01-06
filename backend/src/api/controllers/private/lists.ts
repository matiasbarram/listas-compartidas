import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

export const lists = async (req: Request, res: Response) => {
    const groupId = Number(req.params.id)
    const prisma = new PrismaClient()
    const lists = await prisma.lists
        .findMany({
            where: {
                group_id: groupId,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    return res.status(200).json({
        groupId,
        lists,
    })
}

export const createList = async (req: Request, res: Response) => {
    const id = Number(req.params.groupId)
    const prisma = new PrismaClient()
    const { name, description } = req.body
    if (!name) {
        return res.status(400).json({
            error: "Name is required",
        })
    }
    if (!description) {
        return res.status(400).json({
            error: "Description is required",
        })
    }
    const list = await prisma.lists
        .create({
            data: {
                group_id: id,
                name,
                description: description,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    return res.status(200).json({
        groupId: id,
        list,
    })
}
