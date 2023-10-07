import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BackBtn } from "@/app/components/common/BackBtn";
import { groupInfo } from "@/lib/actions/group/groups";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import { Fragment } from "react";
import { UserCard } from "@/app/components/home/group/settings/UserCard";
import { GroupInfoResponse } from "../../../../../../../types";

function FormGroup({ group }: { group: GroupInfoResponse }) {
    return (
        <>
            <div className="flex flex-col gap-4 mt-8">
                <h2 className="text-xl font-bold">Información</h2>
                <div className="grid grid-cols-4 gap-2">
                    <label htmlFor="name" className="text-sm text-gray-500 col-span-1 py-2">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        className="rounded-md text-gray-500 bg-zinc-800 col-span-3 indent-2"
                        placeholder="Nombre del grupo"
                        defaultValue={group.name}
                    />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <label htmlFor="description" className="text-sm text-gray-500 col-span-1 py-2">Descripción</label>
                    <input
                        type="text"
                        id="description"
                        className="rounded-md w-full text-gray-500 bg-zinc-800 col-span-3 indent-2"
                        placeholder="Descripción del grupo"
                        defaultValue={group.description}
                    />
                </div>
            </div>
        </>
    );
}

function GroupUsers({ group }: { group: GroupInfoResponse }) {
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

function DangerZone() {
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

export default async function GroupListsPage({ params, searchParams }: { params: { slug: string }; searchParams: { page: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return { redirect: { destination: '/auth/login', permanent: false } }

    const group = await groupInfo({
        token: session.token,
        slug: params.slug
    })

    return (
        <>
            <BackBtn />

            <div className="mb-8">
                <div className="">
                    <h1 className="text-2xl font-bold mt-4 flex items-center">Configuración de grupo</h1>
                    <p className="text-gray-500 text-sm">Aquí puedes cambiar la información del grupo</p>
                </div>
                <FormGroup group={group} />
                <GroupUsers group={group} />
                <DangerZone />
            </div >

        </>
    )
}