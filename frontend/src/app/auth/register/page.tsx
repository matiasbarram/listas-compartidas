"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { signUp } from "@/app/lib/actions";
import { createToast } from "@/app/lib/common";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ILoginFormValues, registerSchema } from "../../../../types";
import Spinner from "@/app/components/common/Spinner";

export default function RegisterPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ILoginFormValues>({
        resolver: zodResolver(registerSchema),
    });


    const registerUser = async (data: ILoginFormValues) => {
        await signUp({
            name: data.username,
            email: data.email,
            password: data.password,
        });
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: true,
            callbackUrl: "/home",
        });
    }

    return (
        <section className="">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-zinc-700 bg-zinc-800">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Regístrate en tu cuenta
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(registerUser)}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
                                    Nombre
                                </label>
                                <input
                                    type="text"                                    {
                                    ...register("username")
                                    }
                                    id="name"
                                    className="bordersm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre completo"
                                />
                                {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                                    Correo
                                </label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    id="email"
                                    className="border  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="name@company.com"
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    {...register("password")}
                                    id="password"
                                    placeholder="••••••••"
                                    className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                                    Repetir contraseña
                                </label>
                                <input
                                    type="password"
                                    {...register("confirmPassword")}
                                    placeholder="••••••••"
                                    className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-slate-600 hover:bg-slate-700 focus:ring-slate-800"
                                disabled={isSubmitting}
                            >
                                {!isSubmitting ? "Registrarse" : <Spinner />}
                            </button>
                        </form>
                        <p className="text-sm font-light text-gray-400">
                            ¿Ya tienes una cuenta? <Link href="/auth/login" className="font-medium text-primary-600 hover:underline text-primary-500">Inicia sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section >
    );
}
