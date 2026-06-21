import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { encryptText } from "../src/utils/encrypt"

config()

const prisma = new PrismaClient()

async function main() {
    await prisma.item_tag.deleteMany()
    await prisma.comments.deleteMany()
    await prisma.items.deleteMany()
    await prisma.lists.deleteMany()
    await prisma.user_group.deleteMany()
    await prisma.groups.deleteMany()
    await prisma.tags.deleteMany()
    await prisma.users.deleteMany()

    const password = await encryptText("test1234")

    const user = await prisma.users.create({
        data: {
            name: "Test User",
            email: "test@test.com",
            password,
        },
    })

    const group = await prisma.groups.create({
        data: {
            name: "Mi grupo",
            description: "Listas personales",
            type: "personal",
        },
    })

    await prisma.user_group.create({
        data: {
            user_id: user.id,
            group_id: group.id,
        },
    })

    const list = await prisma.lists.create({
        data: {
            name: "Supermercado",
            description: "Compras semanales",
            group_id: group.id,
        },
    })

    const items = [
        { description: "Pan", quantity: 2 },
        { description: "Leche", quantity: 1 },
        { description: "Huevos", quantity: 12 },
        { description: "Queso", quantity: 1 },
        { description: "Tomates", quantity: 6 },
        { description: "Arroz", quantity: 1 },
    ]

    for (const item of items) {
        await prisma.items.create({
            data: {
                description: item.description,
                quantity: item.quantity,
                list_id: list.id,
            },
        })
    }

    console.log("Seed completado exitosamente!")
    console.log(`  Usuario: test@test.com / test1234`)
    console.log(`  Grupo: ${group.name}`)
    console.log(`  Lista: ${list.name} (${items.length} items)`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
