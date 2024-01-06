import { Request } from "express"
import { validateJwt } from "./validateJwt"

export const payloadData = (req: Request) => {
    const token = req.headers.authorization?.split(" ")[1]
    return validateJwt(token as string)
}
