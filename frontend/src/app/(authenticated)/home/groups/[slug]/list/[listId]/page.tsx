import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { BackBtn } from "@/app/components/common/BackBtn";
import ItemsProvider from "@/providers/ItemsProvider";
import { ItemsGrid } from "@/app/components/home/lists/grid/itemsGrid";
import { getListItems } from "@/lib/actions/item/items";
import { NestedParams } from "../../../../../../../../types";


export default async function ListItemPage({ params }: NestedParams) {
    const session = await getServerSession(authOptions);
    if (!session) return

    const itemsData = await getListItems({ slug: params.slug, listId: params.listId, session: session });
    if (itemsData === undefined) { return null }

    return (
        <div>
            <ItemsProvider>
                <BackBtn />
                <ItemsGrid itemsData={itemsData} params={params} />
            </ItemsProvider>
        </div >
    )

}