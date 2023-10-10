import { HomeIcon } from "@heroicons/react/24/solid"
import Link from "next/link"


interface IHeaderLink {
    label: string;
    route: string;
    Icon: React.ComponentType
}

const links: IHeaderLink[] = [
    {
        label: "Home",
        route: "/",
        Icon: HomeIcon,
    },
];

export function NavBarMenu() {
    return (
        <>
            {links.map(
                ({ label, route, Icon }: IHeaderLink) => (
                    <Link href={route} key={label}>
                        <button
                            type="button"
                            className="block shrink-0 rounded-lg  p-2.5 text-gray-600 shadow-sm hover:text-gray-700"
                        >
                            <div className="h-5 w-5">
                                <div className="h-full w-full">
                                    <Icon />
                                </div>
                            </div>
                        </button>
                    </Link>
                ))
            }
        </>
    )
}