import React from "react"
import { Header } from "../components/Header/Header"

export default function DashboardLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <main>
            <Header />
            <section className="mx-auto px-4 sm:px-6 lg:px-8 container">
                {children}
            </section>
        </main>
    )
}