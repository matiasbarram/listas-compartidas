import NextAuth from "next-auth/next";

interface UserData {
    id: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string
}

declare module "next-auth" {
    interface Session {
        user: UserData,
        token: string
    }
    interface User {
        token: string,
        user: UserData
    }

}
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
declare module "next-auth/jwt" {
    interface JWT {
        user: UserData,
        token: string,
        iat: number,
        exp: number
    }
}