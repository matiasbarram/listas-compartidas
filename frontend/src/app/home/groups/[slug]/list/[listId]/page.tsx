import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import AddItemBtn from "@/app/components/home/addItemBtn";
import { BackBtn } from "@/app/components/BackBtn";
import { getListItems } from "@/app/lib/actions";
import { ItemsGrid } from "@/app/components/home/lists/itemsGrid";
import { NestedParams } from "../../../../../../../types";

export default async function ListItemPage({ params }: NestedParams) {
    const session = await getServerSession(authOptions);
    if (!session) return

    const itemsData = await getListItems({ slug: params.slug, listId: params.listId, session: session });
    if (itemsData === undefined || itemsData === null) {
        return {
            redirect: {
                destination: '/home/groups',
                permanent: false,
            },
        }
    }

    return (
        <div>
            <BackBtn />
            <ItemsGrid itemsData={itemsData} params={params} />
            <AddItemBtn data={params} />
        </div >
    )

}