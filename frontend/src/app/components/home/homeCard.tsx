"use client"

import Link from "next/link"
import { IList, IListWithGroup } from "../../../../types"

export function HomeCard({ listData }: { listData: IListWithGroup }) {
    const homeRoute = `home/groups/${listData.groupId}/list/${listData.id}`

    return (
        <Link href={homeRoute} className="bg-zinc-700 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3 hidden md:block">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                    <p className="ml-5 w-0 flex-1">{listData.name}</p>
                    <p className="ml-5 w-0 flex-1">{listData.groupName}</p>
                </div>
            </div>
        </Link>
    )
}