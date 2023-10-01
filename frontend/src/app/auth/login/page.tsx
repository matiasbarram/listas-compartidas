"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
export default function LoginPage() {
    const router = useRouter()
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: true,
            callbackUrl: "/home"
        })
    }
    return (
        <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-zinc-700 bg-zinc-800">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                        Ingresa con tu cuenta
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={loginUser}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Correo</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                placeholder="name@company.com"
                                required={true}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-mediumtext-white">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className=" border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                required={true}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Link href="#" className="text-sm font-medium hover:underline text-primary-500">¿Olvidaste tu contraseña?</Link>
                        </div>
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-slate-600 hover:bg-slate-700 focus:ring-slate-800">Sign in</button>
                        <p className="text-sm font-light text-gray-400">
                            ¿Aún no tienes cuenta? <Link href="/auth/register" className="font-medium hover:underline text-primary-500">Regístrate</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}