import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface Session {
        user: {
            id: number,
            name: string,
            email: string,
            created_at: string,
            updated_at: string
        },
        token: string
    }

}
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: number,
            name: string,
            email: string,
            created_at: string,
            updated_at: string
        },
        token: string
    }
}