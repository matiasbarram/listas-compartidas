import { toast } from "react-toastify"

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
        hideProgressBar: true
    })

