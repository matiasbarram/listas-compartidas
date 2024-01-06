"use client"

import Spinner from "@/components/common/Spinner/Spinner"
import { createToast } from "@/lib/common"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { ISignUpFormValues, signUpSchema } from "../../../../../types"
import SocialLogin from "./socialLogin"

const ForgotPassword = () => {
    return (
        <div className="flex items-center justify-between">
            <Link
                href="#"
                className="text-sm font-medium hover:underline text-primary-500"
            >
                ¿Olvidaste tu contraseña?
            </Link>
        </div>
    )
}

const checkErrors = (searchParams: ReadonlyURLSearchParams): void => {
    const error = searchParams.getAll("error")
    if (error.length > 0) {
        createToast({
            toastType: "error",
            message: "Error al iniciar sesión, por favor intenta de nuevo.",
        })
    }
}

export default function LoginPage() {
    const searchParams = useSearchParams()
    checkErrors(searchParams)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ISignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    })

    const loginUser = async (data: ISignUpFormValues) => {
        try {
            const validatedData = signUpSchema.parse(data)
            await signIn("credentials", {
                email: validatedData.email,
                password: validatedData.password,
                redirect: true,
                callbackUrl: "/home",
            })
        } catch (error) {
            createToast({
                toastType: "error",
                message: "Error al iniciar sesión, por favor intenta de nuevo.",
            })
        }
    }

    return (
        <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-zinc-700 bg-zinc-800">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white text-center">
                        Ingresa con tu cuenta
                    </h1>
                    <SocialLogin />
                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSubmit(loginUser)}
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-white"
                            >
                                Correo
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                name="email"
                                id="email"
                                className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="name@company.com"
                            />
                            {errors.email ? (
                                <p className="text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-white"
                            >
                                Contraseña
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className={`border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.password ? (
                                <p className="text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            ) : null}
                        </div>
                        <ForgotPassword />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-slate-600 hover:bg-slate-700 focus:ring-slate-800 focus:border-slate-800`}
                        >
                            {!isSubmitting ? "Iniciar sesión" : <Spinner />}
                        </button>
                    </form>

                    <p className="text-sm font-light text-gray-400">
                        ¿Aún no tienes cuenta?{" "}
                        <Link
                            href="/auth/register"
                            className="font-medium hover:underline text-primary-500"
                        >
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
