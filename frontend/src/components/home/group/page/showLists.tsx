import { QueueListIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { IList } from "../../../../../types"

export const showLists = (lists: IList[], slug: string) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
                <div
                    className="bg-zinc-800 shadow rounded-lg w-full"
                    key={list.id}
                >
                    <Link href={`/home/groups/${slug}/list/${list.id}`}>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <QueueListIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {list.name}
                                        </dt>
                                        <dd>
                                            <div className="text-md font-medium text-indigo-400 opacity-90 line-clamp-2">
                                                {list.description}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}
