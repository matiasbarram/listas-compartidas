import { HomeCard } from "../components/home/card"
import { IList, IUserGroupsData } from "../../../types"
import { Session, getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { API_URL } from "../lib/constants"
import { GroupCard } from "../components/home/groupCard"
import CreateGroupModal from "../components/home/group/createGroup/createGroupModal"

async function getGroups(token: string | undefined) {
    const groups = await fetch(`${API_URL}/private/groups`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: "no-cache"
    })
    const data: IUserGroupsData = await groups.json()
    return data
}

export default async function HomePage() {
    const session = await getServerSession(authOptions)
    const { groups } = await getGroups(session?.token)

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-xl my-6"> Mis grupos {groups.length > 0 && `(${groups.length})`}</h2>
                <CreateGroupModal />
            </div>
            <div className="overflow-x-auto">
                <div className="flex" style={{ width: `calc(100% * ${groups.length} * 0.6)` }}>
                    {
                        groups.map((group, index) => (
                            <GroupCard props={group} index={index} key={index} />
                        ))
                    }
                </div>

            </div >
            <h2 className="text-xl my-6">Últimas listas modificadas</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <p className="text-center text-gray-500">
                    Próximamente...
                </p>
                < div />
            </div>
        </>
    )
}