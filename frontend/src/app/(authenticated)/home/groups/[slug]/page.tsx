import React, { useContext } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { showLists } from "@/app/components/home/group/page/showLists";
import AddItemBtn from "@/app/components/home/addItemBtn";
import { emptyListComponent } from "@/app/components/home/group/emptyLists";
import { BackBtn } from "@/app/components/common/BackBtn";
import { groupInfo, groupLists } from "@/lib/actions/group/groups";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { YouAndMore } from "@/app/components/common/YouAndMore";
import GroupProvider, { GroupContext } from "@/providers/GroupProvider";
import GroupData from "@/app/components/home/group/page/GroupData";
import { IGroupParams, IList } from "../../../../../../types";

interface IGroupResponse {
    groupId: number;
    lists: IList[];
}

export default async function GroupListsPage({ params }: IGroupParams) {
    const session = await getServerSession(authOptions)
    if (!session) return null;


    const { lists }: IGroupResponse = await groupLists(session.token, params.slug)
    const group = await groupInfo({
        token: session.token,
        slug: params.slug
    })

    return (
        <>
            <BackBtn />
            <GroupProvider>
                <div className="grid grid-cols-4 gap-2 items-center mb-8">
                    <GroupData groupData={group} params={params} />
                    <div className="col-span-1 flex justify-end">
                        <Link
                            href={`/home/groups/${params.slug}/settings`}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-2 rounded-md w-10 h-10 flex items-center justify-center"
                        >
                            <Cog8ToothIcon className="h-6 w-6" />
                        </Link>
                    </div>
                </div >
                {lists.length === 0 ? emptyListComponent(params) : showLists(lists, params.slug)}
            </GroupProvider>

            < AddItemBtn params={params} />
        </>
    )
}