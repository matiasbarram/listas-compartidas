import { GroupInfoResponse, IUserGroupsData } from "../../../../types";
import { callApi, createToast } from "@/lib/common";
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


export const groupInfo = async ({ token, slug }: { token: string, slug: string }) => {
    const res = await callApi({
        url: `/private/groups/${slug}/info`,
        method: "GET",
        token,
    })
    return (res.data as { group: GroupInfoResponse }).group;

}


interface IEditGroupData {
    message: string,
    data: {
        id: string,
        name: string,
        description: string
    }
}

export const editGroupInfo = async ({ token, slug, data }: {
    token: string, slug: string, data: {
        name: string,
        description: string
    }
}) => {
    const res = await callApi({
        url: `/private/groups/${slug}/info/edit`,
        method: "PUT",
        token,
        body: data
    })
    return res.data as { group: IEditGroupData };
}

export const addMember = async ({ token, slug, email }: {
    token: string, slug: string, email: string
}) => {
    const res = await callApi({
        url: `/private/groups/${slug}/members/add`,
        method: "PUT",
        token,
        body: { email }
    })
    return res.data as { message: string };
}

export const removeMember = async ({ token, slug, userId }: {
    token: string, slug: string, userId: number
}) => {
    const res = await callApi({
        url: `/private/groups/${slug}/members/delete`,
        method: "DELETE",
        token,
        body: { userId }
    })
    return res.data as { message: string };
}