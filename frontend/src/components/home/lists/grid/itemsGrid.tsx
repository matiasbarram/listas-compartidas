"use client"

import {
    deleteCompletedItems,
    getListItems,
    markAsCompleted,
} from "@/lib/actions/item/items"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import {
    IListItem,
    IListItemsResponse,
    IListKeysProps,
} from "../../../../../types"
import SavingStatus from "../../../common/Toast/savingStatusToast"
import AddItemBtn from "../../addItemBtn"
import SpeakToText from "../../group/SpeakToText"
import RenderItems from "./renderItems"

export const ItemsGrid = ({
    initialItems,
    params,
}: {
    initialItems: IListItemsResponse
    params: IListKeysProps
}) => {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const { data: itemsData } = useQuery({
        queryFn: () =>
            getListItems({
                slug: params.slug,
                listId: params.listId,
                session,
            }),
        queryKey: ["items", params.slug, params.listId],
        initialData: initialItems,
    })

    const cleanCompletedItems = useMutation({
        mutationKey: ["complete", params.slug, params.listId],
        mutationFn: () => {
            deleteCompletedItems({
                session,
                params,
            })
        },
        onMutate: async () => {
            await queryClient.cancelQueries([
                "items",
                params.slug,
                params.listId,
            ])
            queryClient.setQueryData<IListItemsResponse>(
                ["items", params.slug, params.listId],
                (old) => {
                    if (!old) return old
                    const newItems = old.items.filter(
                        (item) => !item.is_completed,
                    )
                    newItems.sort((a, b) => {
                        return (
                            new Date(b.modified_date).getTime() -
                            new Date(a.modified_date).getTime()
                        )
                    })
                    return { ...old, items: newItems }
                },
            )
        },
    })

    const markAsCompletedMutation = useMutation({
        mutationKey: ["items", params.slug, params.listId],
        mutationFn: (item: IListItem) =>
            markAsCompleted({
                params,
                session,
                item,
            }),
        onMutate: async (newItem: IListItem) => {
            await queryClient.cancelQueries([
                "items",
                params.slug,
                params.listId,
            ])
            queryClient.setQueryData<IListItemsResponse>(
                ["items", params.slug, params.listId],
                (old) => {
                    if (!old) return old
                    const newItems = old.items.map((item) => {
                        if (item.id === newItem.id) {
                            return {
                                ...item,
                                is_completed: !item.is_completed,
                                modified_date: new Date().toISOString(),
                            }
                        }
                        return item
                    })
                    newItems.sort((a, b) => {
                        return (
                            new Date(b.modified_date).getTime() -
                            new Date(a.modified_date).getTime()
                        )
                    })
                    return { ...old, items: newItems }
                },
            )
        },
    })

    const toggleItemCompletion = (item: IListItem) => {
        markAsCompletedMutation.mutate(item)
    }

    return (
        <>
            {markAsCompletedMutation.isLoading && (
                <SavingStatus saving={true} />
            )}
            <SpeakToText lists={[initialItems.list]} />
            <h2 className="text-2xl font-bold text-gray-100 py-4">
                Pendientes
            </h2>
            <RenderItems
                itemsData={itemsData?.items}
                isCompleted={false}
                toggleItemCompletion={toggleItemCompletion}
            />
            <div className="my-2 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-100 py-4">
                    Completados ✅
                </h2>
                <button
                    onClick={() => cleanCompletedItems.mutate()}
                    className="text-gray-100 bg-gray-700 px-4 py-1 rounded-md text-sm hover:bg-gray-600 transition-colors duration-300 ease-in-out active:bg-gray-500"
                >
                    Limpiar
                </button>
            </div>
            <RenderItems
                itemsData={itemsData?.items}
                isCompleted={true}
                toggleItemCompletion={toggleItemCompletion}
            />
            <AddItemBtn params={params} />
        </>
    )
}
