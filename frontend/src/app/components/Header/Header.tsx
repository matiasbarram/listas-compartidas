"use client"

import { SearchBar } from "../SearchBar"
import { NavBarMenu } from "../NavBarMenu"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface MenuProps {
    onClickOutside: () => void;
}

function Menu({ onClickOutside }: MenuProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickOutside && onClickOutside();
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [onClickOutside]);

    return (
        <div ref={ref}
            className="absolute right-0 w-48 py-2 mt-2 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 bg-zinc-900">
            <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-500"
            >
                Your Profile
            </a>

            <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-500"
            >
                Settings
            </a>

            <Link
                href="api/auth/signout"
                className="block px-4 py-2 text-sm text-gray-500"
            >
                Salir
            </Link>
        </div>
    )
}

const getIcon = async (name: string) => {
    const res = await fetch(`https://ui-avatars.com/api/?name=${name}&background=random&length=1&size=128&rounded=true&format=svg`,
        {
            headers: {
                'Content-Type': 'image/svg+xml'
            }
        })
    if (!res.ok) {
        throw new Error('Error fetching icon')
    }
    return await res.text()
}


export function Header() {

    const session = useSession()
    const [showMenu, setShowMenu] = useState(false)

    return (
        <header className="mb-8">
            <div className="shadow-lg">
                <div className="mx-auto px-4 py-4 sm:py-8 sm:px-6 lg:px-8 container">
                    <div className="flex items-center sm:justify-between sm:gap-4">
                        <SearchBar />
                        <div
                            className="flex flex-1 items-center justify-between gap-8 sm:justify-end"
                        >
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className="block shrink-0 rounded-lg p-2.5 text-gray-600 shadow-sm hover:text-gray-700 sm:hidden"
                                >
                                    <span className="sr-only">Search</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                                <NavBarMenu />
                            </div>

                            <button
                                type="button"
                                className="group flex shrink-0 items-center rounded-lg transition"
                                onClick={() => {
                                    setShowMenu(!showMenu)
                                }}
                            >
                                <span className="sr-only">Menu</span>
                                <img
                                    alt="Man"
                                    src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                    className="h-10 w-10 rounded-full object-cover"
                                />

                                <p className="ms-2 text-left text-xs">
                                    <strong className="block font-medium">{session.data?.user.name}</strong>

                                    <span className="text-gray-500"> {session.data?.user.email} </span>
                                </p>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="ms-4 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 sm:block"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {showMenu && <Menu onClickOutside={() => setShowMenu(false)} />}
            </div>
        </header>
    )
}
