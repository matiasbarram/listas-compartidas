import { callApi, createToast } from "@/lib/common"
import { Session } from "next-auth"
import {
    ICompleted,
    ICreateItemResponse,
    IDeleteItemProps,
    IItemsCreated,
    IList,
    IListItemsResponse,
    IListKeysProps,
    IMarkAsCompletedProps,
    INewItemValues,
    KeysWithSession,
} from "../../../../types"

export const markAsCompleted = async ({
    params,
    session,
    item,
}: IMarkAsCompletedProps) => {
    const status: ICompleted = !item.is_completed ? "completed" : "uncompleted"
    await callApi({
        url: `/private/groups/${params.slug}/lists/${params.listId}/items/${item.id}/change`,
        method: "PUT",
        token: session ? session.token : "",
        body: { status: status },
    })
}

export const deleteItem = async ({ params, session }: IDeleteItemProps) => {
    callApi({
        url: `/private/groups/${params.slug}/lists/${params.listId}/items/delete/completed`,
        method: "DELETE",
        token: session ? session.token : "",
    })
    console.log({ params, session })
}

export const deleteCompletedItems = async ({
    params,
    session,
}: {
    params: IListKeysProps
    session: Session | null
}) => {
    await callApi({
        url: `/private/groups/${params.slug}/lists/${params.listId}/items/delete/completed`,
        method: "DELETE",
        token: session ? session.token : "",
    })
}

export const getListItems = async ({
    slug,
    listId,
    session,
}: KeysWithSession) => {
    const token = session ? session.token : ""
    const res = await callApi({
        url: `/private/groups/${slug}/lists/${listId}/items`,
        method: "GET",
        token,
    })
    return res.data as IListItemsResponse
}

export const createItem = async ({
    data,
    params,
    token,
}: {
    data: INewItemValues
    params: IListKeysProps
    token: string
}) => {
    const res = await callApi({
        url: `/private/groups/${params.slug}/lists/${params.listId}/items/create`,
        method: "POST",
        token,
        body: { ...data },
    })
    const newItem = res.data as ICreateItemResponse
    return newItem.item
}

export const editItem = async ({
    itemId,
    data,
    params,
    session,
}: {
    itemId: number
    data: INewItemValues
    params: IListKeysProps
    session: Session | null
}) => {
    const { comments, ...rest } = data
    const body = { ...rest, notes: comments }
    const token = session ? session.token : ""
    try {
        const res = await callApi({
            url: `/private/groups/${params.slug}/lists/${params.listId}/items/${itemId}/edit`,
            method: "PUT",
            token,
            body: { ...body },
        })

        if (!res.ok) throw new Error("Error al editar el producto")

        createToast({
            message: "Producto editado correctamente",
            toastType: "success",
        })
        const newItem = res.data as ICreateItemResponse
        return newItem.item
    } catch (error) {
        createToast({
            message: "Error al editar el producto",
            toastType: "error",
        })
    }
}

export const openAICreateItems = async ({
    finalTranscript,
    lists,
}: {
    finalTranscript: string
    lists: IList[]
}) => {
    const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: finalTranscript,
            lists: lists,
        }),
    })
    const data = await response.json()
    return data
}

export const createItems = async ({
    gptResponse,
    params,
    session,
}: {
    gptResponse: any
    params: IListKeysProps
    session: Session | null
}) => {
    const response = await callApi({
        method: "POST",
        url: `/private/groups/${params.slug}/createItems`,
        body: gptResponse,
        token: session?.token,
    })
    return response.data as IItemsCreated
}
