import { ICompleted, ICreateItemResponse, IDeleteItemProps, IListItem, IListItemsResponse, IListKeysProps, IMarkAsCompletedProps, INewItemValues, KeysWithSession } from "../../../../../types"
import { callApi, createToast } from "../../common"

export const markAsCompleted = async ({ isCompleted, params, session, item }: IMarkAsCompletedProps) => {
    const { status }: ICompleted = { status: isCompleted ? "completed" : "uncompleted" }
    callApi({
        url: `/private/groups/${params.slug}/lists/${params.listId}/items/${item.id}/change`,
        method: "PUT",
        token: session.token,
        body: { status: status }
    })
    console.log({ isCompleted, params, session, item })
}


export const deleteItem = async ({ params, session, item }: IDeleteItemProps) => {
    callApi({
        url: `/private/groups/${params.slug}/lists/${params.listId}/items/${item.id}/delete`,
        method: "DELETE",
        token: session.token,
    })
    console.log({ params, session, item })
}

export const getListItems = async ({ slug, listId, session }: KeysWithSession) => {
    try {
        const res = await callApi({
            url: `/private/groups/${slug}/lists/${listId}/items`,
            method: "GET",
            token: session.token,
        })
        if (res.ok) {
            return res.data as IListItemsResponse;
        }
    }
    catch (error) {
        console.log(error);
    }
}


export const createItem = async ({ data, params, token }: { data: INewItemValues, params: IListKeysProps, token: string }): Promise<IListItem | undefined> => {
    try {
        const res = await callApi({
            url: `/private/groups/${params.slug}/lists/${params.listId}/items/create`,
            method: "POST",
            token,
            body: { ...data }
        })

        if (!res.ok) throw new Error("Error al crear el producto");

        createToast({
            message: "Producto creado correctamente",
            toastType: "success",
        })
        const newItem = res.data as ICreateItemResponse;
        return newItem.item;

    } catch (error) {
        createToast({
            message: "Error al crear el producto",
            toastType: "error",
        })
    }
}


export const editItem = async ({ itemId, data, params, token }: { itemId: number, data: INewItemValues, params: IListKeysProps, token: string }) => {
    const { comments, ...rest } = data;
    const body = { ...rest, notes: comments }
    try {
        const res = await callApi({
            url: `/private/groups/${params.slug}/lists/${params.listId}/items/${itemId}/edit`,
            method: "PUT",
            token,
            body: { ...body }
        })

        if (!res.ok) throw new Error("Error al editar el producto");

        createToast({
            message: "Producto editado correctamente",
            toastType: "success",
        })
        const newItem = res.data as ICreateItemResponse;
        return newItem.item

    } catch (error) {
        createToast({
            message: "Error al editar el producto",
            toastType: "error",
        })
    }
}