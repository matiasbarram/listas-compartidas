"use client"

import { SessionProvider } from "next-auth/react"
import { ProviderProps } from "../../types"



const AuthProviders = ({ children }: ProviderProps) => {
    return <SessionProvider>{children}</SessionProvider>
}


export default AuthProviders