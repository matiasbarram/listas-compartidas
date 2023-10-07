"use client"

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { IListItem, IListKeysProps, INewItemValues, schemaItem } from "../../../../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createItem } from "@/lib/actions/item/items";
import Spinner from "../../common/Spinner/Spinner";

interface IAddItemForm {
    closeModal: () => void;
    addItem: (item: IListItem) => void;
}


export default function AddItemForm({ closeModal, addItem }: IAddItemForm) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<INewItemValues>({
        resolver: zodResolver(schemaItem),
    });

    const params = useParams()
    const { data: session } = useSession();
    const router = useRouter();
    if (!session) return null;



    const handleCreateProduct = async (data: INewItemValues) => {
        const paramsData: IListKeysProps = {
            slug: params.slug.toString(),
            listId: params.listId.toString()
        }
        try {
            schemaItem.parse(data);
            const newItem = await createItem({
                data,
                params: paramsData,
                token: session?.token
            });

            if (addItem) { newItem !== undefined ? addItem(newItem) : null; }

            closeModal();

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit(handleCreateProduct)}>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 text-lg" htmlFor="description">Nombre</label>
                    <input
                        className={`input-field ${errors.description ? "input-error" : ""}`}
                        type="text"
                        placeholder="Nombre del producto"
                        {...register("description")}
                    />
                    {errors.description && (
                        <span className="text-red-500 text-sm">{errors.description.message}</span>
                    )}
                    <label className="mb-2 text-lg" htmlFor="quantity">Cantidad</label>
                    <input
                        className={`input-field ${errors.quantity ? "input-error" : ""}`}
                        type="number"
                        inputMode="decimal"
                        placeholder="Cantidad"
                        {...register("quantity", { valueAsNumber: true })}
                    />
                    {errors.quantity && (
                        <span className="text-red-500 text-sm">{errors.quantity.message}</span>
                    )}
                    <label className="mb-2 text-lg" htmlFor="comments">Comentarios</label>
                    <textarea
                        className={`input-field ${errors.comments ? "input-error" : ""}`}
                        id="comments"
                        placeholder="Comentarios"
                        {...register("comments")}
                    />
                </div>
                <button
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-full"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Spinner /> : "Crear lista"}
                </button>

            </form>

        </>
    )
}