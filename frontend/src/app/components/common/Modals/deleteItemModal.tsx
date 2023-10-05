import { deleteItem } from "@/app/lib/actions";
import { IListItem, IListKeysProps } from "../../../../../types";
import CustomModal from "./Modal";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DeleteItemModal({ item, setShowModal, shoModal }: { item: IListItem, setShowModal: any, shoModal: boolean }) {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    if (!session) return null

    const handleDeleteItem = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("delete item")
        e.preventDefault()
        await deleteItem({
            params: params as unknown as IListKeysProps,
            session: session,
            item,
        })
        setShowModal(false)
    }


    return (
        <CustomModal isOpen={shoModal} onClose={() => setShowModal(false)}>
            <form
                className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative"
                onSubmit={handleDeleteItem}

            >
                <h2 className="text-2xl font-bold text-center mb-8">
                    Eliminar {item.description}
                </h2>
                <p className="text-lg text-gray-100 mb-8"> ¿Estás seguro de que quieres eliminar este elemento?</p>
                <div className="flex justify-center space-x-4">
                    <button
                        className="rounded-md bg-red-500 text-gray-100 font-semibold px-4 py-2"
                        type="submit"
                    >
                        Eliminar
                    </button>
                    <button
                        className="rounded-md text-gray-100 font-semibold px-4 py-2 border border-gray-100"
                        type="button"
                        onClick={() => setShowModal(false)}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </CustomModal>

    )
}