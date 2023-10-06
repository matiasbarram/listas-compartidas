import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { IGroupParams, IList } from "../../../../../types";
import { showLists } from "@/app/components/home/group/page/showLists";
import AddItemBtn from "@/app/components/home/addItemBtn";
import { emptyListComponent } from "@/app/components/home/group/emptyLists";
import { BackBtn } from "@/app/components/common/BackBtn";
import { groupInfo, groupLists } from "@/app/lib/actions/group/groups";

interface IGroupResponse {
    groupId: number;
    lists: IList[];
}

export default async function GroupListsPage({ params }: IGroupParams) {
    const session = await getServerSession(authOptions)
    if (!session) return null;


    const { lists }: IGroupResponse = await groupLists(session.token, params.slug)
    const info = await groupInfo(session.token, params.slug)

    return (
        <>
            <BackBtn />

            <div>
                <h1 className="text-2xl font-bold mb-4">Listas del grupo {info.group.name}</h1>
                {lists.length === 0 ? emptyListComponent(params) : showLists(lists, params.slug)}
            </div >
            <AddItemBtn params={params} />
        </>
    )
}