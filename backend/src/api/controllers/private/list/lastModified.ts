import { Request, Response } from "express"
import { payloadData } from "../../../../utils/jwt/payloadData"
import { Prisma, PrismaClient } from "@prisma/client"

export const getLastModifiedLists = async (req: Request, res: Response) => {
    // get the last modified lists of the current user
    const payload = payloadData(req, res)
    if (typeof payload === "string") {
        return res.status(401).json({
            error: payload,
        })
    }
    const userId = payload.id

    const prisma = new PrismaClient()
    const userGroups = await prisma.user_group
        .findMany({
            where: {
                user_id: userId,
            },
            select: {
                group_id: true,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    const userGroupsIds = userGroups.map((userGroup) => userGroup.group_id)
    const lists = await prisma.lists
        .findMany({
            where: {
                group_id: {
                    in: userGroupsIds,
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                group_id: true,
                groups: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                modified_date: "desc",
            },
            take: 5,
        })
        .finally(() => {
            prisma.$disconnect()
        })
    const listResponse = lists.map((list) => {
        return {
            id: list.id,
            name: list.name,
            description: list.description,
            groupId: list.group_id,
            groupName: list.groups.name,
        }
    })

    return res.status(200).json({
        lists: listResponse,
    })
}
