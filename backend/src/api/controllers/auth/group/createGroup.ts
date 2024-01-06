import { PrismaClient } from "@prisma/client"

interface ICreateGroup {
    user_id: number
    prisma: PrismaClient
}

export const createGroup = async ({ user_id, prisma }: ICreateGroup) => {
    const group = await prisma.groups
        .create({
            data: {
                name: `Mi grupo`,
                description: `Listas personales`,
                type: `personal`,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    const user_group = await prisma.user_group
        .create({
            data: {
                user_id: user_id,
                group_id: group.id,
            },
        })
        .finally(() => {
            prisma.$disconnect()
        })

    return { group, user_group }
}
