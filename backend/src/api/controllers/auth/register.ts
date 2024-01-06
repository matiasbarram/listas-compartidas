import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { encryptText } from "../../../utils/encrypt"
import { createJwt, createPayload } from "../../../utils/jwt/createJwt"
import { createGroup } from "./group/createGroup"

export const register = async (req: Request, res: Response) => {
    const prisma = new PrismaClient()
    const { name, email, password } = req.body

    const encryptedPassword = await encryptText(password)

    try {
        const user = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: encryptedPassword,
            },
        })

        const { user_group } = await createGroup({
            user_id: user.id,
            prisma,
        })

        const payload = createPayload(user)
        const jwtToken = createJwt(payload)

        return res.status(200).json({
            message: "User created successfully",
            token: jwtToken,
            user: user,
            user_group: user_group,
        })
    } catch (error) {
        return res.status(409).json({
            message: "User already exists",
        })
    }
}
