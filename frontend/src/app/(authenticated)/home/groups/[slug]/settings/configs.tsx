"use client"

import { groupInfo } from "@/lib/actions/group/groups"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { GroupInfoResponse } from "../../../../../../../types"
import { DangerZone, FormGroup, GroupUsers } from "./sections"

export default function Configs({
    group,
    token,
}: {
    group: GroupInfoResponse
    token: string
}) {
    const params = useParams()

    const { data, isLoading, isError } = useQuery({
        queryKey: ["groupInfo", params.slug],
        queryFn: () =>
            groupInfo({
                token: token,
                slug: params.slug as string,
            }),
        initialData: group,
    })
    return (
        <>
            <FormGroup group={data} />
            <GroupUsers group={data} />
            <DangerZone />
        </>
    )
}
