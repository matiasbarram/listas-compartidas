import { Request, Response } from "express";
import { payloadData } from "../../../utils/jwt/payloadData";
import { PrismaClient } from "@prisma/client";
import Logger from "../../../utils/logger";

interface IItem {
    id: number;
    list_id: number;
    creation_date: Date;
    modified_date: Date;
    description: string | null;
    is_completed: boolean | null;
    quantity: number | null;
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
    }).finally(() => {
        prisma.$disconnect()
    })

    if (!list_items) {
        return res.status(404).json({
            error: "List not found"
        })
    }

    const listData = {
        id: list_items.id,
        name: list_items.name,
        description: list_items.description,
        group_id: list_items.group_id,
    }


    return res.status(200).json({
        list: listData,
        items: [...list_items.items],
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
    }).finally(() => {
        prisma.$disconnect()
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
    }).finally(() => {
        prisma.$disconnect()
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
    }).finally(() => {
        prisma.$disconnect()
    })

    return res.status(200).json({
        groupId,
        listId,
        item,
    });

}


export const deleteItem = async (req: Request, res: Response) => {
    const listId = Number(req.params.listId);
    const groupId = Number(req.params.groupId);
    const itemId = Number(req.params.itemId);

    const prisma = new PrismaClient();
    try {

        const item = await prisma.items.delete({
            where: {
                id: itemId,
            }
        }).finally(() => {
            prisma.$disconnect()
        })
        return res.status(200).json({
            groupId,
            listId,
            item,
        });

    }
    catch (error) {
        return res.status(400).json({
            error: "Item not found"
        })
    }
}


export const editItem = async (req: Request, res: Response) => {
    const listId = Number(req.params.listId);
    const groupId = Number(req.params.groupId);
    const itemId = Number(req.params.itemId);

    const prisma = new PrismaClient();
    try {
        const item = await prisma.items.update({
            where: {
                id: itemId,
            },
            data: {
                ...req.body,
                modified_date: new Date(),
            }
        }).finally(() => {
            prisma.$disconnect()
        })
        return res.status(200).json({
            groupId,
            listId,
            item,
        });

    }
    catch (error) {
        Logger.error(error)
        return res.status(400).json({
            error: "Item not found"
        })
    }
}


interface ICreateItem {
    name: string;
    quantity: number;
    list: {
        name: string;
        id: number;
    }
}

type ICreateItems = ICreateItem[]

export const createItems = async (req: Request, res: Response) => {
    const groupId = Number(req.params.groupId)
    const items: ICreateItems = req.body.items;
    const prisma = new PrismaClient();

    const validations = []
    if (!items) {
        validations.push({
            error: "Items are required"
        })
    }
    if (validations.length > 0) {
        return res.status(400).json({
            validations
        })
    }

    /*
    items = [
    {
        "name": "palta",
        "list": {
            "name": "Supermercado",
            "id": 1
        },
        "quantity": 1
    },
    {
        "name": "tomate",
        "list": {
            "name": "Supermercado",
            "id": 1
        },
        "quantity": 1
    },
    {
        "name": "lechuga",
        "list": {
            "name": "Supermercado",
            "id": 1
        },
        "quantity": 1
    }
]

    */
    const [totalCreated, itemsCreated] = await prisma.$transaction([
        prisma.items.createMany({
            data: items.map(item => {
                return {
                    description: item.name,
                    quantity: item.quantity,
                    list_id: item.list.id,
                }
            })
        }),
        prisma.items.findMany({
            where: {
                description: {
                    in: items.map(item => item.name)
                },
                list_id: {
                    in: items.map(item => Number(item.list.id))
                }
            }
        })
    ]).finally(() => {
        prisma.$disconnect()
    })
    return res.status(200).json({
        items: itemsCreated,
    });



}