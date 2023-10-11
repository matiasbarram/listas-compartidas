import React from "react"
import { getServerSession } from "next-auth"
import CreateGroupModal from "@/app/components/home/group/createGroup/createGroupModal"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getGroups } from "@/lib/actions/group/groups"
import { GroupCard } from "@/app/components/home/groupCard"
import { getLastUpdatedLists } from "@/lib/actions/lists/lists"
import LastUpdatedLists from "./lastUpdated"


export default async function HomePage() {
    const session = await getServerSession(authOptions)
    const { groups } = await getGroups(session?.token)
    const lists = await getLastUpdatedLists({
        token: session?.token as string,
    })
    if (!lists) return <div>error</div>

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-xl my-6"> Mis grupos {groups.length > 0 && `(${groups.length})`}</h2>
                <CreateGroupModal />
            </div>
            <div className="overflow-x-auto">
                <div className="flex my-4" style={{ width: `calc(100% * ${groups.length} * 0.6)` }}>
                    {
                        groups.map((group, index) => (
                            <GroupCard props={group} index={index} key={index} />
                        ))
                    }
                </div>

            </div >
            <h2 className="text-xl my-6">Últimas listas modificadas</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="text-center text-gray-500">
                    <LastUpdatedLists lists={lists} token={session?.token as string} />
                </div>
                < div />
            </div>
        </>
    )
}