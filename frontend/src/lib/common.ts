import { toast } from "react-toastify"
import { IApiConfig, IApiResponse } from "../../types"
import { API_URL } from "./constants"

interface IToast {
    message: string
    duration?: number
    toastType: "success" | "error" | "info" | "warning"
}

export const createToast = ({ message, duration = 3000, toastType }: IToast) =>
    toast(message, {
        type: toastType,
        theme: "dark",
        autoClose: duration,
        position: "top-center",
        hideProgressBar: true,
    })

export async function callApi<T>({
    method,
    token,
    body,
    url,
}: IApiConfig): Promise<IApiResponse<T>> {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }

        const response = await fetch(API_URL + url, {
            method,
            headers,
            cache: "no-cache",
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const responseBody = await response.json()
            return { ok: false, error: responseBody, status: response.status }
        }
        const data: T = await response.json()
        return { ok: true, data }
    } catch (error: any) {
        return { ok: false, error: error.message, status: error.status }
    }
}

export const localDate = (date: string) => {
    const now = new Date()
    const newDate = new Date(date)
    if (now.getDate() === newDate.getDate())
        return newDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
    else {
        return newDate.toLocaleDateString()
    }
}
