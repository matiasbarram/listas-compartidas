import { IUserGroupsData } from "../../../../../types";
import { callApi, createToast } from "../../common";
import { API_URL } from "../../constants";

interface ICreateGroupData {
    name: string,
    description: string,
    emails: string[]
}

export async function getGroups(token: string | undefined) {
    const groups = await callApi({
        url: "/private/groups",
        method: "GET",
        token: token,
    })
    return groups.data as IUserGroupsData;
}

export const groupLists = async (token: string, slug: string) => {

    try {
        const res = await fetch(`${API_URL}/private/groups/${slug}/lists`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!res.ok) {
            throw new Error('Something went wrong')
        }
        const lists = await res.json()
        return lists
    }
    catch (err) {
        console.error(err)
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

interface GroupInfoResponse {
    group: {
        id: number,
        name: string,
        description: string,
        created_at: string,
        updated_at: string,
        user_group: {
            id: number,
            user_id: number,
            group_id: number,
            users: {
                id: number,
                name: string,
                email: string,
            }
        }[]
    }
}

export const groupInfo = async (token: string, slug: string) => {
    const res = await callApi({
        url: `/private/groups/${slug}/info`,
        method: "GET",
        token,
    })

    return res.data as GroupInfoResponse;
}