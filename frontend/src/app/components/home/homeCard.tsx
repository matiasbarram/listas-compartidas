import Link from "next/link"
import { IList } from "../../../../types"

export function HomeCard(listData: IList) {
    const homeRoute = `home/lists/${listData.id}`
    return (
        <Link href={homeRoute} className="bg-zinc-800 overflow-hidden shadow rounded-lg">
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
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {listData.name}
                            </dt>
                            <dd>
                                {/* <div className="bg-gray-800 rounded-md mt-1">
                                    <div
                                        className="h-1 bg-indigo-500 rounded-md"
                                        style={{ width: `${listData.completed}%` }}
                                    />
                                </div> */}

                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </Link>
    )
}