import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";
import { IListItem, NestedParams } from "../../../../../../../types";
import { ItemCard } from "@/app/components/home/lists/itemCard";
import AddItemBtn from "@/app/components/home/addItemBtn";
import { BackBtn } from "@/app/components/BackBtn";
import { getListItems } from "@/app/lib/actions";



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
            <BackBtn />
            <ul className="mt-4 space-y-4 mb-16">
                <h2 className="text-2xl font-bold">Pendientes ({totalItems})</h2>
                {uncompletedItems?.length === 0 || uncompletedItems === undefined ? <p className="text-gray-500 text-center">No hay items</p> :
                    <>
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
                <h2 className="text-xl font-bold">Completados ✅</h2>
                {completedItems === undefined || completedItems.length === 0 ? <p className="text-gray-500 text-center">No hay items</p> :
                    <>
                        {completedItems.map((item: IListItem) => (
                            <form key={item.id}
                                name={`checkbox-${item.id}`}
                                id={`checkbox-${item.id}`}
                                className="flex flex-col"
                            >
                                <ItemCard item={item} params={params} className="filter grayscale brightness-75" />
                            </form>
                        ))}
                    </>
                }
            </ul>
            <AddItemBtn data={params} />
        </div >
    )

}