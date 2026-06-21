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
import { useEffect } from "react"

interface IAddItemForm {
    closeModal: () => void
}

export default function AddItemForm({ closeModal }: IAddItemForm) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<INewItemValues>({
        resolver: zodResolver(schemaItem),
        defaultValues: {
            quantity: 1,
        },
    })

    const quantityValue = watch("quantity")

    const params = useParams()
    const productParams: IListKeysProps = {
        slug: params.slug!.toString(),
        listId: params.listId!.toString(),
    }
    const { data: session } = useSession()
    const queryClient = useQueryClient()

    const { mutateAsync } = useMutation({
        mutationFn: (newItem: INewItemValues) =>
            createItem({
                data: newItem,
                params: productParams,
                token: session ? session.token : "",
            }),
    })

    const handleCreateProduct = async (data: INewItemValues) => {
        try {
            schemaItem.parse(data)
            const itemMutated = await mutateAsync(data)
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
            closeModal()
        } catch (error) {
            createToast({
                message: "Error al agregar producto",
                toastType: "error",
            })
        }
    }

    useEffect(() => {
        const handleFocus = (e: Event) => {
            const target = e.currentTarget as HTMLElement
            setTimeout(() => {
                target.scrollIntoView({ block: "center", behavior: "smooth" })
            }, 300)
        }

        const form = document.querySelector("#add-item-form")
        const inputs = form?.querySelectorAll<HTMLElement>("input, textarea") ?? []
        inputs.forEach((input) => input.addEventListener("focus", handleFocus))

        return () => {
            inputs.forEach((input) => input.removeEventListener("focus", handleFocus))
        }
    }, [])

    return (
        <>
            <form id="add-item-form" onSubmit={handleSubmit(handleCreateProduct)}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-base sm:text-lg" htmlFor="description">
                            Producto
                        </label>
                        <input
                            className={`input-field py-3 ${
                                errors.description ? "input-error" : ""
                            }`}
                            type="text"
                            id="description"
                            placeholder="Nombre del producto"
                            enterKeyHint="next"
                            autoFocus
                            {...register("description")}
                        />
                        {errors.description && (
                            <span className="text-red-500 text-sm">
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-base sm:text-lg">
                            Cantidad
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setValue(
                                        "quantity",
                                        Math.max(1, (quantityValue ?? 1) - 1),
                                    )
                                }
                                className="w-10 h-10 rounded-full bg-zinc-700 text-white text-lg flex items-center justify-center hover:bg-zinc-600 active:scale-95 transition-all"
                            >
                                −
                            </button>
                            <span className="text-xl w-8 text-center tabular-nums">
                                {quantityValue ?? 1}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setValue(
                                        "quantity",
                                        Math.min(100, (quantityValue ?? 1) + 1),
                                    )
                                }
                                className="w-10 h-10 rounded-full bg-zinc-700 text-white text-lg flex items-center justify-center hover:bg-zinc-600 active:scale-95 transition-all"
                            >
                                +
                            </button>
                            <input type="hidden" {...register("quantity", { valueAsNumber: true })} />
                        </div>
                        {errors.quantity && (
                            <span className="text-red-500 text-sm">
                                {errors.quantity.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-base sm:text-lg" htmlFor="comments">
                            Comentarios
                        </label>
                        <textarea
                            className={`input-field py-3 ${
                                errors.comments ? "input-error" : ""
                            }`}
                            id="comments"
                            placeholder="Comentarios"
                            {...register("comments")}
                        />
                    </div>
                </div>
                <button
                    className="mt-4 px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-full text-base"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Spinner /> : "Agregar"}
                </button>
            </form>
        </>
    )
}
