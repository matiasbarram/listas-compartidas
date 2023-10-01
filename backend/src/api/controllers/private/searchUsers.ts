import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"

interface SearchUsersRequest extends Request {
    query: {
        email: string
    }
}

export default async function searchUsers(req: SearchUsersRequest, res: Response) {
    const searchEmail = req.query.email;
    const prisma = new PrismaClient();
    const users = await prisma.users.findMany({
        where: {
            email: {
                contains: searchEmail
            }
        },
        select: {
            email: true,
            name: true,
        }
    })
    return res.status(200).json({
        users
    })

}