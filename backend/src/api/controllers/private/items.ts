import { Request, Response } from "express";
import { payloadData } from "../../../utils/jwt/payloadData";
import { PrismaClient } from "@prisma/client";

interface IItem {
    id: number;
    list_id: number;
    creation_date: Date;
    modified_date: Date;
    description: string | null;
    is_completed: boolean | null;
    quantity: string | null;
    notes: string | null;
    priority: string | null;
    due_date: Date | null;
    assigned_to: string | null;
    reminder: string | null;
    url: string | null;
    cost: string | null;
    location: string | null;
    recurring: string | null;
}

export const getItems = async (req: Request, res: Response) => {
    const payload = payloadData(req, res);
    if (typeof payload === 'string') {
        return res.status(401).json({
            error: payload,
        });
    }

    const groupId = Number(req.params.groupId);
    const listId = Number(req.params.listId);
    const prisma = new PrismaClient();
    let list_items = await prisma.lists.findUnique({
        where: {
            group_id: groupId,
            id: listId,
        },
        include: {
            items: {
                orderBy: {
                    modified_date: 'desc'
                }
            }
        }
    })
    if (!list_items) {
        return res.status(404).json({
            error: "List not found"
        })
    }
    if (list_items.items.length === 0) {
        return res.status(200).json({
            list_items,
        });
    }
    const completedItems = list_items?.items.filter(item => item.is_completed === true);
    const uncompletedItems = list_items?.items.filter(item => item.is_completed === false);
    const listData = {
        id: list_items.id,
        name: list_items.name,
        description: list_items.description,
        group_id: list_items.group_id,
    }


    return res.status(200).json({
        list: listData,
        items: {
            completedItems,
            uncompletedItems,
        }
    })
}

export const createItem = async (req: Request, res: Response) => {
    const listId = Number(req.params.listId);
    const groupId = Number(req.params.groupId);
    const prisma = new PrismaClient();

    const { description, quantity }: { description: string, quantity: number } = req.body;
    const validations = []
    if (!description) {
        validations.push({
            error: "Description is required"
        })
    }
    if (!quantity) {
        validations.push({
            error: "Quantity is required"
        })
    }
    if (validations.length > 0) {
        return res.status(400).json({
            validations
        })
    }

    const existDescription = await prisma.items.findFirst({
        where: {
            description,
            list_id: listId,
        }
    })
    if (existDescription) {
        return res.status(400).json({
            error: "Description already exists"
        })
    }

    const item = await prisma.items.create({
        data: {
            list_id: listId,
            description,
            quantity,
        }
    })
    return res.status(200).json({
        groupId,
        listId,
        item,
    });
}


export const changeStatus = async (req: Request, res: Response) => {
    const allStatus = ["completed", "uncompleted"]
    const status = req.body.status;
    if (!status) {
        return res.status(400).json({
            error: "Status is required"
        })
    }

    if (!allStatus.includes(status)) {
        return res.status(400).json({
            error: "Status is invalid"
        })
    }


    const listId = Number(req.params.listId);
    const groupId = Number(req.params.groupId);

    const itemId = Number(req.params.itemId);
    const prisma = new PrismaClient();

    const item = await prisma.items.update({
        where: {
            id: itemId,
        },
        data: {
            is_completed: status === "completed" ? true : false,
            modified_date: new Date(),
        }
    })
    return res.status(200).json({
        groupId,
        listId,
        item,
    });

}