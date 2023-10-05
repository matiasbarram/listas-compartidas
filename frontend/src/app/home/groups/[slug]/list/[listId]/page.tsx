import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getListItems } from "@/app/lib/actions";
import { ItemsGrid } from "@/app/components/home/lists/itemsGrid";
import { NestedParams } from "../../../../../../../types";
import { BackBtn } from "@/app/components/common/BackBtn";
import ItemsProvider from "@/app/providers/ItemsProvider";

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