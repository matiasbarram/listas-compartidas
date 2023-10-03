import { INewItem, IApiConfig, IApiResponse, ICompleted, IMarkAsCompletedProps, ICreateProduct as ICreateItem, INewList, KeysWithSession, IListItemsResponse, INewListValues, IListKeysProps, INewItemValues, IListItem, ICreateItemResponse, IUserGroupsData } from "../../../types";
import { API_URL, defaultDataItem, defaultDataList } from "./constants";
import { createToast } from "./common";
import { Error409 } from "./erros";


interface ICreateGroupData {
    name: string,
    description: string,
    emails: string[]
}

export async function callApi<T>({ method, token, body, url }: IApiConfig): Promise<IApiResponse<T>> {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(API_URL + url, {
            method,
            headers,
            cache: "no-cache",
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const responseBody = await response.json()
            return { ok: false, error: responseBody, status: response.status };
        }
        const data: T = await response.json();
        return { ok: true, data };

    } catch (error: any) {
        return { ok: false, error: error.message, status: error.status };
    }
}

export async function getGroups(token: string | undefined) {
    const groups = await callApi({
        url: "/private/groups",
        method: "GET",
        token: token,
    })
    return groups.data as IUserGroupsData;
}



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

export const signUp = async ({ email, password, name }: { email: string, password: string, name: string }) => {
    const url = "/auth/register"
    const body = { email, password, name };
    const method = "POST";
    try {
        const res = await callApi({ method, url, body })
        if (res.ok) {
            createToast({
                toastType: "success",
                message: "Usuario creado correctamente",
                duration: 1000
            })
        }
        else {
            if (res.status === 409) throw new Error409("El email ya existe");
            else throw new Error("Error al crear usuario");

        }
    }
    catch (error) {
        if (error instanceof Error409) {
            createToast({
                toastType: "error",
                message: error.message,
                duration: 1000
            })
        }
        else {
            createToast({
                toastType: "error",
                message: "Error al crear usuario",
                duration: 1000
            })
        }
    }
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


export const createGroup = async ({ group, token, closeModal }: { group: ICreateGroupData, token: string, closeModal: () => void }) => {
    try {
        const res = await callApi({
            url: "/private/groups/create",
            method: "POST",
            token,
            body: { ...group }
        })

        if (!res.ok) throw new Error("Error al crear el grupo");

        createToast({
            message: "Grupo creado correctamente",
            toastType: "success",
        })

    } catch (error) {
        createToast({
            message: "Error al crear el grupo",
            toastType: "error",
        })
    }
    finally {
        closeModal();
    }
}


export const createList = async ({ data, token, groupId }: { data: INewListValues, token: string, groupId: string }) => {
    try {
        const res = await callApi({
            url: `/private/groups/${groupId}/lists/create`,
            method: "POST",
            token,
            body: { ...data }
        })

        if (!res.ok) throw new Error("Error al crear la lista");

        createToast({
            message: "Lista creada correctamente",
            toastType: "success",
        })

    } catch (error) {
        createToast({
            message: "Error al crear la lista",
            toastType: "error",
        })
    }
}

export const createProduct = async ({ data, params, token }: { data: INewItemValues, params: IListKeysProps, token: string }): Promise<IListItem | undefined> => {
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