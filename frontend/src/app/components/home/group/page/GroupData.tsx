"use client"

import { YouAndMore } from "@/app/components/common/YouAndMore";
import { GroupInfoResponse, PageProps } from "../../../../../../types";
import { useContext, useEffect, useState } from "react";
import { GroupContext } from "@/providers/GroupProvider";
import Skeleton from "@/app/components/common/Skeleton/skeleton";

export default function GroupData({ groupData, params }: { groupData: GroupInfoResponse, params: PageProps }) {
    const { group, setGroup } = useContext(GroupContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setGroup(groupData)
        setLoading(false)
    }, [groupData, setGroup])

    return (
        <div className="col-span-3">
            <h1 className="text-2xl font-bold mt-4 flex items-center">
                <span className={`${loading ? 'w-full' : ''} truncate`}
                > Listas de</span>
                {
                    loading ? <Skeleton number={1} /> :
                        <span className="text-indigo-500 ml-2">{group.name}</span>
                }
            </h1>
            {
                loading ? <Skeleton number={1} /> :
                    <p className="text-gray-500 text-sm">{group.description}</p>
            }
            {
                loading ? <Skeleton number={1} /> :
                    <>
                        <div className="flex items-center gap-1">
                            <YouAndMore
                                users={group.users}
                                className="text-sm text-gray-500"
                            />
                        </div>
                    </>

            }
        </div >
    )
}