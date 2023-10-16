"use client"

import { Header } from "@/app/components/Header/Header"
import Spinner from "@/app/components/common/Spinner/Spinner"
import { API_URL } from "@/lib/constants"
import { set } from "lodash"
import { signOut, useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"

export default function DashboardLayout({ children }: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        const checkJwt = async () => {
            fetch(API_URL + "/auth/verify", {
                headers: {
                    Authorization: `Bearer ${session?.token}`,
                },
            }).then(async (res) => {
                if (res.status === 401) {
                    await signOut()
                }
                setMounted(true)
            })
        }
        if (status === "authenticated") {
            checkJwt()
        }

    }, [session, status])

    return (
        <main>
            <Header />
            {!mounted && (
                <div className="flex justify-center items-center h-screen">
                    <Spinner />
                </div>
            )}
            {mounted && (
                <section className="mx-auto px-4 sm:px-6 lg:px-8 container">
                    {children}
                </section>
            )}
        </main>
    )
}