"use client"

import { useQuery } from "@tanstack/react-query"
import { GroupInfoResponse } from "../../../../../../../types"
import { FormGroup, DangerZone, GroupUsers } from "./sections"
import { groupInfo } from "@/lib/actions/group/groups"
import { useParams } from "next/navigation"

export default function Configs({ group, token }: { group: GroupInfoResponse, token: string }) {
    const params = useParams()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['groupInfo'],
        queryFn: () => groupInfo({
            token: token,
            slug: params.slug as string
        }),
        initialData: group
    })
    return (
        <>
            <FormGroup group={data} />
            <GroupUsers group={data} />
            <DangerZone />
        </>
    )
}