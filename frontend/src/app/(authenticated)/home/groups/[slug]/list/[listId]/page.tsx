import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BackBtn } from "@/components/common/BackBtn"
import { ItemsGrid } from "@/components/home/lists/grid/itemsGrid"
import { getListItems } from "@/lib/actions/item/items"
import { getServerSession } from "next-auth"
import { NestedParams } from "../../../../../../../../types"

export default async function ListItemPage({ params }: NestedParams) {
    const session = await getServerSession(authOptions)
    if (!session) return

    const itemsData = await getListItems({
        slug: params.slug,
        listId: params.listId,
        session: session,
    })
    if (itemsData === undefined) {
        return null
    }
    return (
        <div>
            <BackBtn />
            <ItemsGrid initialItems={itemsData} params={params} />
        </div>
    )
}
