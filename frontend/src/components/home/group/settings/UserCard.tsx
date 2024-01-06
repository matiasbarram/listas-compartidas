"use client"

import { DeleteUserModal } from "@/components/common/Modals/deleteUserFromGroupModal"
import { TrashIcon } from "@heroicons/react/24/solid"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { IUserData } from "../../../../../types"

export function UserCard({ user }: { user: IUserData }) {
    const [deleteModal, setDeleteModal] = useState(false)
    const closeModal = () => setDeleteModal(false)

    const { data: session } = useSession()
    if (!session) return null

    return (
        <>
            <div className="flex items-center justify-between bg-zinc-800 w-full rounded-md px-2 py-4">
                <div className="flex items-center gap-2">
                    <img
                        alt="Man"
                        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-sm">{user.email}</p>
                        <p className="text-xs">{user.name}</p>
                    </div>
                </div>
                {session.user.email !== user.email && (
                    <button className="bg-red-900 hover:bg-red-800 text-white p-2 rounded-md">
                        <TrashIcon
                            className="h-4 w-4"
                            onClick={() => setDeleteModal(true)}
                        />
                    </button>
                )}
            </div>
            <DeleteUserModal
                isOpen={deleteModal}
                closeModal={closeModal}
                setDeleteModal={setDeleteModal}
                user={user}
            />
        </>
    )
}
