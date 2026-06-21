import { authOptions } from "@/lib/auth"
import { BackBtn } from "@/components/common/BackBtn"
import { groupInfo } from "@/lib/actions/group/groups"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Configs from "./configs"

export default async function GroupListsPage(props: {
    params: Promise<{ slug: string }>
}) {
    const params = await props.params;
    const session = await getServerSession(authOptions)
    if (!session) redirect("/auth/login")

    const group = await groupInfo({
        token: session.token,
        slug: params.slug,
    })

    switch (group.type) {
        case "personal":
            return (
                <>
                    <BackBtn />
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mt-4 flex items-center">
                            !Lo sentimos!
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Los grupos personales no tienen configuración
                        </p>
                    </div>
                </>
            )
        default:
            return (
                <>
                    <BackBtn />
                    <div className="mb-8">
                        <div className="">
                            <h1 className="text-2xl font-bold mt-4 flex items-center">
                                Configuración de grupo
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Aquí puedes cambiar la información del grupo
                            </p>
                        </div>
                        <Configs group={group} token={session.token} />
                    </div>
                </>
            )
    }
}
