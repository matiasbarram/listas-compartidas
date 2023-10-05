import { FormEvent } from "react";
import { IListItem } from "../../../../../types";
import CustomModal from "./Modal";

export default function EditItemModal({ item, setShowModal, shoModal }: { item: IListItem, setShowModal: any, shoModal: boolean }) {

    const modifyItem = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(e.target)
    }

    return (
        <CustomModal isOpen={shoModal} onClose={() => setShowModal(false)}>
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Editar {item.description}
                </h2>
                <form className="space-y-4" onSubmit={modifyItem}>
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold text-gray-100" htmlFor="description">Descripción</label>
                        <input
                            className="input-field"
                            type="text"
                            name="description"
                            id="description"
                            defaultValue={item.description}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold text-gray-100" htmlFor="quantity">Cantidad</label>
                        <input
                            className="input-field"
                            type="number"
                            name="quantity"
                            id="quantity"
                            defaultValue={item.quantity}
                        />
                    </div>
                    <div>
                        <label className="text-lg font-semibold text-gray-100" htmlFor="is_completed">Notas</label>
                        <textarea
                            className="input-field"
                            name="notes"
                            id="notes"
                            defaultValue={item.notes}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="rounded-md bg-green-500 text-gray-100 font-semibold px-4 py-2"
                            type="submit"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </CustomModal>
    )
}