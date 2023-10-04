import { PrismaClient } from "@prisma/client";


interface ICreateUser {
    prisma: PrismaClient,
    user: {
        email: string,
        name: string,
        password: string
    }
}

export const createUser = async ({ user, prisma }: ICreateUser) => {

    const newUser = await prisma.users.create({
        data: {
            email: user.email,
            name: user.name,
            password: user.password
        }
    }).finally(() => {
        prisma.$disconnect()
    })
    return newUser;
}