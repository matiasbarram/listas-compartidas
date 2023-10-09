"use client"

import { PlusIcon } from "@heroicons/react/24/solid";
import { GroupInfoResponse } from "../../../../../../../types";
import { Fragment, useState } from "react";
import { UserCard } from "@/app/components/home/group/settings/UserCard";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callApi, createToast } from "@/lib/common";
import { editGroupInfo, inviteMember } from "@/lib/actions/group/groups";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from 'framer-motion'
import CustomModal from "@/app/components/common/Modals/Modal";
import EmailList from "@/app/components/home/group/createGroup/addEmail";
import Spinner from "@/app/components/common/Spinner/Spinner";
import { set } from "lodash";

export function FormGroup({ group }: { group: GroupInfoResponse }): JSX.Element {
    const [newData, setNewData] = useState({
        name: group.name,
        description: group.description
    })
    const [showSaveBtn, setShowSaveBtn] = useState(false)
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setShowSaveBtn(true)
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
                            onChange={(e) => handleInputChange(e)}
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
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <AnimatePresence initial={false}>
                        <motion.div
                            className="absolute bottom-3 right-0 w-full flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={showSaveBtn ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.2 }}

                        >
                            <button className="bg-indigo-500 text-white font-bold px-2 py-2 rounded-md w-11/12"
                                disabled={isLoading}>
                                <small>Guardar cambios</small>
                            </button>

                        </motion.div>
                    </AnimatePresence>
                </form >
            </div >
        </>
    );
}

interface IGroupInfo {
    name: string;
    description: string;
    emails: string[];
}
export function GroupUsers({ group }: { group: GroupInfoResponse }) {
    const { data: session } = useSession()
    const params = useParams()
    const [showAddUser, setShowAddUser] = useState(false)
    const [newUsers, setNewUsers] = useState<IGroupInfo>({
        name: group.name,
        description: group.description,
        emails: []
    })
    const queryClient = useQueryClient()

    const { mutate: submitChange, isLoading, isError } = useMutation({
        mutationFn: () => inviteMember({
            token: session?.token as string,
            slug: params.slug as string,
            emails: newUsers.emails
        }),

        onSuccess: () => {
            queryClient.invalidateQueries(['groupInfo'])
            setShowAddUser(false)
            setNewUsers((prevState) => ({
                ...prevState,
                emails: []
            }))
            createToast({
                message: "Miembros agregados correctamente",
                toastType: "success"
            })
        },
        onError: () => {
            console.log("Error al editar el grupo")
            createToast({
                message: "Error al agregar miembros",
                toastType: "error"
            })
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submitChange()
    }
    return (
        <>
            <div className="flex justify-between items-center mt-8 mb-8">
                <h2 className="text-xl font-bold">Miembros</h2>
                <button
                    className="p-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-full"
                    onClick={() => setShowAddUser(true)}
                >
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
            <CustomModal isOpen={showAddUser} onClose={() => setShowAddUser(false)}>
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                    <h2 className="text-xl font-bold">Agregar miembro</h2>
                    <form onSubmit={handleSubmit}>
                        <EmailList emails={newUsers.emails} setGroup={setNewUsers} />
                        <div className="mt-4">
                            <button className="bg-indigo-500 text-white font-bold px-2 py-2 rounded-md w-full" disabled={isLoading}>
                                <small>{isLoading ? <span><Spinner /></span> : "Agregar miembros"}</small>
                            </button>
                        </div>
                    </form>
                </div>
            </CustomModal>
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