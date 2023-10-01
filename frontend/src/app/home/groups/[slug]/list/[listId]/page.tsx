import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { API_URL } from "@/app/lib/constants";
import { Session, getServerSession } from "next-auth";
import { IListItem, IListItems, IListKeysProps, NestedParams } from "../../../../../../../types";
import { ItemCard } from "@/app/components/home/lists/itemCard";
import AddItemBtn from "@/app/components/home/addItemBtn";

interface KeysWithSession extends IListKeysProps {
    session: Session;
}

export default async function ListItemPage({ params }: NestedParams) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        }
    }
    const getListItems = async ({ slug, listId, session }: KeysWithSession) => {
        try {
            const res = await fetch(API_URL + `/private/groups/${slug}/lists/${listId}/items`, {
                headers: {
                    "Authorization": `Bearer ${session.token}`
                },
                cache: "no-cache"
            })
            if (res.ok) {
                const data: IListItems = await res.json();
                return data;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const itemsData = await getListItems({ slug: params.slug, listId: params.listId, session: session });
    if (itemsData === undefined) {
        return {
            redirect: {
                destination: '/home/groups',
                permanent: false,
            },
        }
    }
    const { items } = itemsData.list_items
    const totalItems = items.length;
    return (
        <div>
            <h2 className="text-2xl font-bold">Total productos ({totalItems})</h2>
            <ul className="mt-4 space-y-4 mb-16">
                {items.map((item: IListItem) => (
                    <form key={item.id}
                        name={`checkbox-${item.id}`}
                        id={`checkbox-${item.id}`}
                        className="flex flex-col"
                    >
                        <ItemCard item={item} params={params} />
                    </form>
                ))}
            </ul>
            <AddItemBtn data={params} />
        </div>
    )

}