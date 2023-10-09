import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BackBtn } from "@/app/components/common/BackBtn";
import { groupInfo } from "@/lib/actions/group/groups";
import { getServerSession } from "next-auth";
import { DangerZone, FormGroup, GroupUsers } from "./sections";
import Configs from "./configs";



export default async function GroupListsPage({ params, searchParams }: { params: { slug: string }; searchParams: { page: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return { redirect: { destination: '/auth/login', permanent: false } }

    const group = await groupInfo({
        token: session.token,
        slug: params.slug
    })

    return (
        <>
            <BackBtn />
            <div className="mb-8">
                <div className="">
                    <h1 className="text-2xl font-bold mt-4 flex items-center">Configuración de grupo</h1>
                    <p className="text-gray-500 text-sm">Aquí puedes cambiar la información del grupo</p>
                </div>
                <Configs group={group} token={session.token} />

            </div >

        </>
    )
}