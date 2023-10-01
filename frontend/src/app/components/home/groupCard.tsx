import Link from "next/link";
import { IGroup } from "../../../../types";

export const GroupCard = ({ props, index }: { props: IGroup, index: number }) => {
    return (
        <div className={`bg-zinc-800 shadow rounded-lg w-full ${index !== 0 ? 'ml-6' : ''}`}>
            <Link href={`/home/groups/${props.id}`}>
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
                                    {props.name}
                                </dt>
                                <dd>
                                    <div className="text-md font-medium text-indigo-400 opacity-90 line-clamp-2">
                                        {props.description}
                                    </div>

                                    <div className="flex-shrink-0 text-sm font-medium text-gray-500">
                                        {
                                            props.users.length === 1 ?
                                                "Solo tú" :
                                                props.users.length === 2 ?
                                                    `Tu y 1 más` :
                                                    `Tu y ${props.users.length - 1} más`
                                        }
                                    </div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </Link>
        </div >
    )

}