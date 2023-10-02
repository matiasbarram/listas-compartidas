import { INewItem, IApiConfig, IApiResponse, ICompleted, IMarkAsCompletedProps, ICreateProduct as ICreateItem, INewList, KeysWithSession, IListItemsResponse } from "../../../types";
import { API_URL, defaultDataItem, defaultDataList } from "./constants";
import { createToast } from "./common";
import { Error409 } from "./erros";

async function callApi<T>({ method, token, body, url }: IApiConfig): Promise<IApiResponse<T>> {
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

export const markAsCompleted = async ({ isCompleted, params, session, item, setItemSelected }: IMarkAsCompletedProps) => {
    const { status }: ICompleted = { status: isCompleted ? "completed" : "uncompleted" }

    try {
        const { data } = await callApi({
            url: `/private/groups/${params.slug}/lists/${params.listId}/items/${item.id}/change`,
            method: "PUT",
            token: session.token,
            body: { status }
        })
        setItemSelected(isCompleted);
        item.is_completed = isCompleted;
    }
    catch (error) {
        createToast({
            toastType: "error",
            message: `Error al actualizar ${item.description}`,
            duration: 1000
        })
    }

}

function checkIsItem(item: INewItem | INewList): boolean {
    return (item as INewItem).description !== undefined;
}

export const createProduct = async ({ session, url, newItem, router, closeModal, setNewItem }: ICreateItem) => {
    try {
        const token = session.data?.token;
        if (!token) throw new Error("No token found");
        const res = await callApi({
            url: url,
            method: "POST",
            token,
            body: newItem
        })
        if (res.ok) {
            const isValid = checkIsItem(newItem);
            closeModal();
            if (isValid) {
                setNewItem(defaultDataItem);
            }
            else {
                setNewItem(defaultDataList);
            }
            router.refresh();
        }
        else { throw new Error("Error creating product") }
    }
    catch (error) {
        console.log(error);
    }
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