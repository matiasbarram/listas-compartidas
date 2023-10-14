"use client"

import { Header } from "@/app/components/Header/Header"
import { API_URL } from "@/lib/constants"
import { signOut, useSession } from "next-auth/react"
import React, { useEffect } from "react"

export default function DashboardLayout({ children }: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    useEffect(() => {
        const checkJwt = async () => {
            fetch(API_URL + "/auth/verify", {
                headers: {
                    Authorization: `Bearer ${session?.token}`,
                },
            }).then((res) => {
                if (res.status === 401) {
                    signOut()
                }
            })
        }
        if (status === "authenticated") {
            checkJwt()
        }

    }, [session, status])

    return (
        <main>
            <Header />
            <section className="mx-auto px-4 sm:px-6 lg:px-8 container">
                {children}
            </section>
        </main>
    )
}