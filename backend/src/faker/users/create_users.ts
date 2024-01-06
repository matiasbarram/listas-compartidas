import { PrismaClient } from "@prisma/client"
import { encryptText } from "../../utils/encrypt"
import users from "./users.json"

export async function createUsers(prisma: PrismaClient) {
    for (const user of users) {
        user.password = await encryptText(user.password)

        try {
            await prisma.users
                .create({
                    data: user,
                })
                .finally(() => {
                    prisma.$disconnect()
                })
        } catch (e) {
            console.error(e)
        }
    }
}
