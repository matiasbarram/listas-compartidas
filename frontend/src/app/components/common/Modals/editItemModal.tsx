import { FormEvent, useContext, useState } from "react";
import { IListItem, IListKeysProps, INewItemValues, schemaItem } from "../../../../../types";
import CustomModal from "./Modal";
import { ItemsContext } from "@/providers/ItemsProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../Spinner/Spinner";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { createItem, editItem } from "@/lib/actions/item/items";

export default function EditItemModal({ item, setShowModal, showModal }: { item: IListItem, setShowModal: any, showModal: boolean }) {
    const params = useParams()
    const { listItems, setListItems } = useContext(ItemsContext)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<INewItemValues>({
        resolver: zodResolver(schemaItem),
    });

    const { data: session } = useSession()
    if (!session) return null


    const handleEditItem = async (data: INewItemValues) => {
        const editedItem = await editItem({
            itemId: item.id,
            data,
            params: params as unknown as IListKeysProps,
            token: session.token
        })
        if (editedItem) {
            const newListItems = listItems.map((listItem) => {
                if (listItem.id === item.id) {
                    return editedItem
                } else {
                    return listItem
                }
            })
            setListItems(newListItems)
            setShowModal(false)
        }
    }

    return (
        <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Editar {item.description}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(handleEditItem)}>
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold text-gray-100" htmlFor="description">Descripción</label>
                        <input
                            className="input-field"
                            type="text"
                            id="description"
                            defaultValue={item.description}
                            {...register("description")}

                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold text-gray-100" htmlFor="quantity">Cantidad</label>
                        <input
                            className="input-field"
                            type="number"
                            inputMode="decimal"
                            id="quantity"
                            defaultValue={item.quantity}
                            {...register("quantity", { valueAsNumber: true })}
                        />
                        {errors.quantity && (
                            <span className="text-red-500 text-sm">{errors.quantity.message}</span>
                        )}
                    </div>
                    <div>
                        <label className="text-lg font-semibold text-gray-100" htmlFor="is_completed">Notas</label>
                        <textarea
                            className="input-field"
                            id="notes"
                            defaultValue={item.notes}
                            {...register("comments")}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="rounded-md bg-green-500 text-gray-100 font-semibold px-4 py-2"
                            type="submit"
                        >
                            {isSubmitting ? <Spinner /> : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </CustomModal>
    )
}