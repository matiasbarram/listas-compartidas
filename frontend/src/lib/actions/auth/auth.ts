import { callApi, createToast } from "@/lib/common"
import { Error409 } from "../../erros"

export const signUp = async ({
    email,
    password,
    name,
}: {
    email: string
    password: string
    name: string
}) => {
    const url = "/auth/register"
    const body = { email, password, name }
    const method = "POST"
    try {
        const res = await callApi({ method, url, body })
        if (res.ok) {
            createToast({
                toastType: "success",
                message: "Usuario creado correctamente",
                duration: 1000,
            })
        } else {
            if (res.status === 409) throw new Error409("El email ya existe")
            else throw new Error("Error al crear usuario")
        }
    } catch (error) {
        if (error instanceof Error409) {
            createToast({
                toastType: "error",
                message: error.message,
                duration: 1000,
            })
        } else {
            createToast({
                toastType: "error",
                message: "Error al crear usuario",
                duration: 1000,
            })
        }
    }
}
