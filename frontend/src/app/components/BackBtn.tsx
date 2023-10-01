"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

export const BackBtn = () => {
    const router = useRouter()
    return (
        <div
            className="w-fit flex flex-row justify-start items-center gap-2 mt-4 ml-4 mb-4 cursor-pointer"
            onClick={() => router.back()}
        >
            <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
            <p className="text-gray-500">
                Volver
            </p>
        </div>)
}