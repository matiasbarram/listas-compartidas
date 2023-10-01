import { Request, Response } from "express";
import { payloadData } from "../../../../utils/jwt/payloadData";
import { PrismaClient } from "@prisma/client";
import validator from "validator";

interface INewGroup {
    name: string;
    description: string;
    emails: string[];
}

const validateEmails = (emails: string[], res: Response) => {
    const invalidEmails = emails.filter((email) => !validator.isEmail(email));
    return {
        valid: invalidEmails.length === 0,
        invalidEmails,
    }

}

export const createGroup = async (req: Request, res: Response) => {
    const payload = payloadData(req, res);
    if (typeof payload === 'string') {
        return res.status(401).json({
            error: payload,
        });
    }
    const prisma = new PrismaClient();
    const { name, description, emails }: INewGroup = req.body;
    if (!name) {
        return res.status(400).json({
            error: "Name is required"
        })
    }
    if (!description) {
        return res.status(400).json({
            error: "Description is required"
        })
    }

    const checkMails = validateEmails(emails, res);
    if (!checkMails.valid) {
        return res.status(400).json({
            error: "Invalid emails",
            emails: checkMails.invalidEmails,
        })
    }

    const group = await prisma.groups.create({
        data: {
            name,
            description,
        }
    })

    const users = await prisma.users.findMany({
        where: {
            email: {
                in: emails,
            }
        }
    })

    const usersIds = users.map((user) => user.id);
    usersIds.push(payload.id);

    await prisma.user_group.createMany({
        data: usersIds.map((userId) => ({
            group_id: group.id,
            user_id: userId,
        }))
    })

    return res.status(200).json({
        group,
    });

}
