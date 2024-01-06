import { PrismaClient } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { encryptText } from "../../../utils/encrypt"
import { createJwt, createPayload } from "../../../utils/jwt/createJwt"
import { JwtPayload } from "../../interfaces/interfaces"

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const prisma = new PrismaClient()
    const { email, password }: { email: string; password: string } = req.body

    const encodedPassword = await encryptText(password)
    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email,
                password: encodedPassword,
            },
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }

        const payload: JwtPayload = createPayload(user)
        const jwtToken = createJwt(payload)
        res.status(200).json({
            token: jwtToken,
            user: payload,
        })
        return next()
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
