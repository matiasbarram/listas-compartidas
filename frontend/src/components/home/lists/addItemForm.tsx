"use client"

import { createItem } from "@/lib/actions/item/items"
import { createToast } from "@/lib/common"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import {
    IListItemsResponse,
    IListKeysProps,
    INewItemValues,
    schemaItem,
} from "../../../../types"
import Spinner from "../../common/Spinner/Spinner"

interface IAddItemForm {
    closeModal: () => void
}

export default function AddItemForm({ closeModal }: IAddItemForm) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<INewItemValues>({
        resolver: zodResolver(schemaItem),
    })

    const params = useParams()
    const productParams: IListKeysProps = {
        slug: params.slug.toString(),
        listId: params.listId.toString(),
    }
    const { data: session } = useSession()
    const queryClient = useQueryClient()

    const { mutate: mutateItem, data: itemMutated } = useMutation({
        mutationKey: ["items", params.slug, params.listId],
        mutationFn: (newItem: INewItemValues) =>
            createItem({
                data: newItem,
                params: productParams,
                token: session ? session.token : "",
            }),

        onSuccess: (itemMutated) => {
            queryClient.setQueryData<IListItemsResponse>(
                ["items", params.slug, params.listId],
                (old) => {
                    if (!old) return old
                    const newItems = [...old.items, itemMutated]
                    return { ...old, items: newItems }
                },
            )
            createToast({
                message: "Producto agregado",
                toastType: "success",
            })
        },
        onError: (error) => {
            createToast({
                message: "Error al agregar producto",
                toastType: "error",
            })
        },
    })

    const handleCreateProduct = async (data: INewItemValues) => {
        try {
            schemaItem.parse(data)
            mutateItem(data)
            closeModal()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleCreateProduct)}>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 text-lg" htmlFor="description">
                        Producto
                    </label>
                    <input
                        className={`input-field ${
                            errors.description ? "input-error" : ""
                        }`}
                        type="text"
                        placeholder="Nombre del producto"
                        {...register("description")}
                    />
                    {errors.description && (
                        <span className="text-red-500 text-sm">
                            {errors.description.message}
                        </span>
                    )}

                    <label className="mb-2 text-lg" htmlFor="quantity">
                        Cantidad
                    </label>
                    <input
                        className={`input-field ${
                            errors.quantity ? "input-error" : ""
                        }`}
                        type="number"
                        inputMode="decimal"
                        placeholder="Cantidad"
                        {...register("quantity", {
                            setValueAs: (value: any) => {
                                if (value === "") return 1
                                return Number(value)
                            },
                        })}
                    />
                    {errors.quantity && (
                        <span className="text-red-500 text-sm">
                            {errors.quantity.message}
                        </span>
                    )}
                    <label className="mb-2 text-lg" htmlFor="comments">
                        Comentarios
                    </label>
                    <textarea
                        className={`input-field ${
                            errors.comments ? "input-error" : ""
                        }`}
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
                    {isSubmitting ? <Spinner /> : "Agregar"}
                </button>
            </form>
        </>
    )
}
