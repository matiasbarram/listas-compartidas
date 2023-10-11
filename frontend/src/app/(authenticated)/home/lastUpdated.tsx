"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IGetLists, IList } from "../../../../types";
import { useSession } from "next-auth/react";
import { getLastUpdatedLists } from "@/lib/actions/lists/lists";
import { HomeCard } from "@/app/components/home/homeCard";
import { Fragment } from "react";

export default function LastUpdatedLists({ lists: initialList, token }: { lists: IGetLists, token: string }) {
    const { status, data: session } = useSession()

    const { data: lists, isLoading, isError } = useQuery({
        queryKey: ["lastUpdatedLists"],
        queryFn: () => getLastUpdatedLists({ token }),
        initialData: initialList
    })

    return (
        <>
            {
                lists.lists.map((list, index) => (
                    <Fragment key={index}>
                        <HomeCard listData={list} />
                    </Fragment>
                ))
            }
        </>
    )
}