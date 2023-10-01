import { PrismaClient } from '@prisma/client'
import users from './users.json'
import { encryptText } from '../../utils/encrypt'

export async function createUsers(prisma: PrismaClient) {
    for (const user of users) {
        user.password = await encryptText(user.password)

        try {
            let userCreated = await prisma.users.create({
                data: user,
            })
            console.log(userCreated)
        }
        catch (e) {
            console.error(e)
        }
    }
}