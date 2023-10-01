import { Request, Response } from "express";
import { payloadData } from "../../../utils/jwt/payloadData";
import { PrismaClient } from "@prisma/client";

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
    const list_items = await prisma.lists.findUnique({
        where: {
            group_id: groupId,
            id: listId,
        },
        include: {
            items: {
                orderBy: {
                    creation_date: 'asc'
                }
            }
        }
    })

    return res.status(200).json({
        list_items,
    });
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