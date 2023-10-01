import { API_URL } from "@/app/lib/constants";
import { axiosClient } from "@/app/utils/axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null
                const { email, password } = credentials
                const res = await fetch(API_URL + "/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email, password }),
                    headers: { "Content-Type": "application/json" }
                })
                if (res.status === 401 || res.status === 400) return null

                const user = await res.json()
                return user
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user }
            return token
        },
        async session({ session, token }) {
            session.user = token.user
            session.token = token.token
            return session
        },
        async signIn({ user, account, profile, email, credentials }) {
            return true
        }
    },
    secret: process.env.SECRET,

}
const handler = NextAuth(authOptions)
export {
    handler as GET,
    handler as POST
}