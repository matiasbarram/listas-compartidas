import { Dialog } from "@headlessui/react";
import CustomModal from "./Modal";
import { CloseBtn } from "./closeBtn";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/lib/actions/group/groups";
import { IUserData } from "../../../../../types";

export const DeleteUserModal = ({ isOpen, closeModal, setDeleteModal, user }: { isOpen: boolean, closeModal: () => void, setDeleteModal: (value: boolean) => void, user: IUserData }) => {
    const params = useParams()
    const { data: session } = useSession()
    const queryClient = useQueryClient()

    const { mutate: submitChange, isLoading, isError } = useMutation({
        mutationFn: () => removeMember({
            token: session?.token as string,
            slug: params.slug as string,
            userId: user.id
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['groupInfo'])
            closeModal()
        },
        onError: () => {
            console.log("Error al editar el grupo")
        }
    })
    return (
        <CustomModal isOpen={isOpen} onClose={() => setDeleteModal(false)}>
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                <CloseBtn closeModal={closeModal} />
                <Dialog.Title as="h3" className="text-lg font-medium text-indigo-500">
                    ¿Estás seguro?
                </Dialog.Title>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        ¿Estás seguro que deseas eliminar a {user.name} del grupo?
                    </p>
                </div>
                <div className="flex mt-4">
                    <button
                        type="button"
                        onClick={() => submitChange()}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Eliminar
                    </button>
                    <button
                        type="button"
                        className="ml-4 inline-flex justify-center py-2 px-4 bg-zinc-800 border boder-gray-500 rounded-md text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={closeModal}
                    >
                        Cancelar
                    </button>
                </div>
            </div>

        </CustomModal>
    )
}