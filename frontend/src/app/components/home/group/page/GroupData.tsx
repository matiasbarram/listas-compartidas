"use client"

import { YouAndMore } from "@/app/components/common/YouAndMore";
import { GroupInfoResponse, PageProps } from "../../../../../../types";
import { useContext, useEffect, useState } from "react";
import { GroupContext } from "@/providers/GroupProvider";
import Skeleton from "@/app/components/common/Skeleton/skeleton";
import { useQuery } from "@tanstack/react-query";
import { groupInfo } from "@/lib/actions/group/groups";
import { useSession } from "next-auth/react";

export default function GroupData({ groupData: group, params }: { groupData: GroupInfoResponse, params: PageProps }) {
    const { data: session } = useSession()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['groupInfo'],
        queryFn: () => groupInfo({
            token: session?.token as string,
            slug: params.slug as string
        }),
        initialData: group
    })
    return (
        <div className="col-span-3">
            <h1 className="text-2xl font-bold mt-4 flex items-center">
                <span className={`${isLoading ? 'w-full' : ''} truncate`}
                > Listas de</span>
                {
                    isLoading ? <Skeleton number={1} /> :
                        <span className="text-indigo-500 ml-2">{data.name}</span>
                }
            </h1>
            {
                isLoading ? <Skeleton number={1} /> :
                    <p className="text-gray-500 text-sm">{data.description}</p>
            }
            {
                isLoading ? <Skeleton number={1} /> :
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