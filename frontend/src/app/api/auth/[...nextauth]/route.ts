import { API_URL, clientId, clientSecret } from "@/app/lib/constants";
import { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { ILoginApiResponse } from "../../../../../types";
import type { GoogleProfile } from "next-auth/providers/google";

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
        }),
        GoogleProvider({
            name: "Google",
            clientId: clientId,
            clientSecret: clientSecret,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
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

        async signIn({ user, account, profile }) {
            if (account && account.provider === "google" && profile) {
                user as unknown as User
                const googleProfile = profile as unknown as GoogleProfile
                const googleUser = {
                    name: googleProfile.name,
                    email: googleProfile.email,
                    password: googleProfile.name + googleProfile.email
                }
                const res = await fetch(API_URL + "/auth/google", {
                    method: "POST",
                    body: JSON.stringify(googleUser),
                    headers: { "Content-Type": "application/json" }
                })
                const { token, user: responseUser }: ILoginApiResponse = await res.json()
                user.token = token
                user.user = responseUser
            }
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