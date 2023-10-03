import { HomeCard } from "../components/home/homeCard"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { GroupCard } from "../components/home/groupCard"
import CreateGroupModal from "../components/home/group/createGroup/createGroupModal"
import { getGroups } from "../lib/actions"


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
                <p className="text-center text-gray-500">
                    Próximamente...
                </p>
                < div />
            </div>
        </>
    )
}