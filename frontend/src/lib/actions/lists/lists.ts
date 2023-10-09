import { INewListValues } from "../../../../types";
import { callApi, createToast } from "@/lib/common";

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