import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { IList, PageProps } from "../../../../../types";
import { showLists } from "@/app/components/home/group/page/showLists";
import { groupLists } from "./actions/getGroupLists";
import AddItemBtn from "@/app/components/home/addItemBtn";
import { emptyListComponent } from "@/app/components/home/group/emptyLists";

interface IGroupResponse {
    groupId: number;
    lists: IList[];
}

export const GroupPage = async ({ params }: { params: PageProps }) => {

    const session = await getServerSession(authOptions)
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    const { lists }: IGroupResponse = await groupLists(session.token, params.slug)
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold mb-4">Listas compartidas del grupo</h1>
                {lists.length === 0 ? emptyListComponent(params) : showLists(lists, params.slug)}
            </div >
            <AddItemBtn data={params} />
        </>
    )
}

export default GroupPage