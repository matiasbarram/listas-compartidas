import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { API_URL } from "@/app/lib/constants";
import { Session, getServerSession } from "next-auth";
import { IListItem, IListItemsResponse, IListKeysProps, NestedParams } from "../../../../../../../types";
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
                const data: IListItemsResponse = await res.json();
                return data;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const itemsData = await getListItems({ slug: params.slug, listId: params.listId, session: session });
    if (itemsData === undefined || itemsData === null) {
        return {
            redirect: {
                destination: '/home/groups',
                permanent: false,
            },
        }
    }
    const { uncompletedItems, completedItems } = itemsData.items
    const totalItems = uncompletedItems?.length;
    return (
        <div>
            <ul className="mt-4 space-y-4 mb-16">
                {uncompletedItems === undefined || uncompletedItems === null ? <p>No hay items</p> :
                    <>
                        <h2 className="text-2xl font-bold">Pendientes ({totalItems})</h2>
                        {uncompletedItems.map((item: IListItem) => (
                            <form key={item.id}
                                name={`checkbox-${item.id}`}
                                id={`checkbox-${item.id}`}
                                className="flex flex-col"
                            >
                                <ItemCard item={item} params={params} />
                            </form>
                        ))}
                    </>
                }
            </ul>
            <ul className="mt-4 space-y-4 mb-16">
                {completedItems === undefined || completedItems === null ? <p>No hay items</p> :
                    <>
                        <h2 className="text-xl font-bold">Completados</h2>
                        {completedItems.map((item: IListItem) => (
                            <form key={item.id}
                                name={`checkbox-${item.id}`}
                                id={`checkbox-${item.id}`}
                                className="flex flex-col"
                            >
                                <ItemCard item={item} params={params} />
                            </form>
                        ))}
                    </>
                }
            </ul>
            <AddItemBtn data={params} />
        </div>
    )

}