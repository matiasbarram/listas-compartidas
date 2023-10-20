"use client"

import { IListItem, IListItemsResponse, IListKeysProps } from "../../../../../../types";
import { useSession } from "next-auth/react";
import AddItemBtn from "../../addItemBtn";
import SavingStatus from "../../../common/Toast/savingStatusToast";
import RenderItems from "./renderItems";
import { getListItems, markAsCompleted } from "@/lib/actions/item/items";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const ItemsGrid = ({ initialItems, params }: { initialItems: IListItemsResponse, params: IListKeysProps }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { data: itemsData } = useQuery({
        queryFn: () => getListItems({
            slug: params.slug,
            listId: params.listId,
            session,
        }),
        queryKey: ["items", params.slug, params.listId],
        initialData: initialItems,
    })

    const markAsCompletedMutation = useMutation({
        mutationKey: ["items", params.slug, params.listId],
        mutationFn: (item: IListItem) => markAsCompleted({
            params,
            session,
            item
        }),
        onMutate: async (newItem: IListItem) => {
            await queryClient.cancelQueries(["items", params.slug, params.listId]);

            queryClient.setQueryData<IListItemsResponse>(["items", params.slug, params.listId], (old) => {
                if (!old) return old;
                const newItems = old.items.map((item) => {
                    if (item.id === newItem.id) {
                        return { ...item, is_completed: !item.is_completed };
                    }
                    return item;
                });
                return { ...old, items: newItems };
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(["items", params.slug, params.listId]);
        }
    });

    const addItemMutation = useMutation({
    })

    const toggleItemCompletion = (item: IListItem) => {
        markAsCompletedMutation.mutate(item);
    };

    const addItem = () => {
        console.log("add item")
    }

    return (
        <>
            {markAsCompletedMutation.isLoading && <SavingStatus saving={true} />}

            < h2 className="text-2xl font-bold text-gray-100 py-4">Pendientes</h2 >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <RenderItems itemsData={itemsData?.items} isCompleted={false} toggleItemCompletion={toggleItemCompletion} />
            </div>
            <h2 className="text-2xl font-bold text-gray-100 py-4">Completados ✅</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <RenderItems itemsData={itemsData?.items} isCompleted={true} toggleItemCompletion={toggleItemCompletion} />
            </div>
            <AddItemBtn params={params} addItem={addItem} />
        </>
    );
}