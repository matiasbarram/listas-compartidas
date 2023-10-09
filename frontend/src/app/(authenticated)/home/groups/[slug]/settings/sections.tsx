"use client"

import { PlusIcon } from "@heroicons/react/24/solid";
import { GroupInfoResponse } from "../../../../../../../types";
import { Fragment, useState } from "react";
import { UserCard } from "@/app/components/home/group/settings/UserCard";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callApi } from "@/lib/common";
import { editGroupInfo } from "@/lib/actions/group/groups";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export function FormGroup({ group }: { group: GroupInfoResponse }): JSX.Element {
    const [newData, setNewData] = useState({
        name: group.name,
        description: group.description
    })
    const params = useParams()
    const { data: session } = useSession()

    const queryClient = useQueryClient()

    const { mutate: submitChange, isLoading, isError } = useMutation({
        mutationFn: () => editGroupInfo({
            token: session?.token as string,
            slug: params.slug as string,
            data: newData
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['groupInfo'])
        },
        onError: () => {
            console.log("Error al editar el grupo")
        }
    })


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submitChange()
    }

    return (
        <>
            <div className="flex flex-col gap-4 mt-8">
                <h2 className="text-xl font-bold">Información</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 gap-2">
                        <label htmlFor="name" className="text-sm text-gray-500 col-span-1 py-2">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            className="rounded-md text-gray-500 bg-zinc-800 col-span-3 indent-2"
                            placeholder="Nombre del grupo"
                            defaultValue={newData.name}
                            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <label htmlFor="description" className="text-sm text-gray-500 col-span-1 py-2">Descripción</label>
                        <input
                            type="text"
                            id="description"
                            className="rounded-md w-full text-gray-500 bg-zinc-800 col-span-3 indent-2"
                            placeholder="Descripción del grupo"
                            defaultValue={newData.description}
                            onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <button className="bg-indigo-500 text-white font-bold px-2 py-1 rounded-md">
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form >
            </div >
        </>
    );
}

export function GroupUsers({ group }: { group: GroupInfoResponse }) {
    return (
        <>
            <div className="flex justify-between items-center mt-8 mb-8">
                <h2 className="text-xl font-bold">Miembros</h2>
                <button className="p-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-full">
                    <small>Agregar</small>
                    <PlusIcon className="h-4 w-4" />
                </button>
            </div>

            <div className="flex flex-col items-center space-y-4">
                {
                    group && group.users.map((user, index) => (
                        <Fragment key={index}>
                            <UserCard user={user} />
                        </Fragment>
                    ))
                }
            </div>
        </>
    )
}

export function DangerZone() {
    return (
        <>
            <div className="flex flex-col gap-4 mt-8">
                <h2 className="text-xl font-bold">Zona de peligro</h2>
                <div className="flex justify-between items-center text-white px-4 py-2 gap-2 border border-red-900 rounded-md">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold">Eliminar grupo</h3>
                        <p className="text-sm">Una vez eliminado el grupo no se podrá recuperar</p>
                    </div>
                    <button className="bg-zinc-800 text-red-800 font-bold px-2 py-1 rounded-md">
                        <small>Eliminar</small>
                    </button>


                </div>
            </div>
        </>
    )
}