// app/providers.jsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { ProviderProps } from "../../types"

export default function ReactQueryProvider({ children }: ProviderProps) {
    const [queryClient] = React.useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
