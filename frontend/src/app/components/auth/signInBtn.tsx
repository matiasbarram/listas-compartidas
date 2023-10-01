import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react"

export default function SignIn() {
    return (
        <form method="post" action="/api/auth/callback/credentials">
            <div>

                <label>
                    Email
                    <input name="email" type="email" />
                </label>
            </div>
            <div>

                <label>
                    Password
                    <input name="password" type="password" />
                </label>
            </div>
            <button type="submit">Sign in</button>
        </form>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}