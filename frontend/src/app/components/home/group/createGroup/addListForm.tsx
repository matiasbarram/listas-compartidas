"use client"

import { useForm } from 'react-hook-form';
import { INewListValues, schemaList } from '../../../../../../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { createList } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import Spinner from '@/app/components/common/Spinner/Spinner';

interface IAddListFormProps {
    closeModal: () => void;
}

export default function AddListForm({ closeModal }: IAddListFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<INewListValues>({
        resolver: zodResolver(schemaList),
    });
    const params = useParams()
    const { data: session } = useSession();
    const router = useRouter();
    if (!session) return null;

    const handleCreateProduct = async (data: INewListValues) => {
        try {
            schemaList.parse(data);
            await createList({
                data,
                groupId: params.slug.toString(),
                token: session?.token
            });
            closeModal();
            router.refresh();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleCreateProduct)}>
                <div className="flex flex-col mb-4">
                    <label className="mb-2 text-lg" htmlFor="name">Nombre</label>
                    <input
                        className={`input-field ${errors.name ? "input-error" : ""}`}
                        type="text"
                        placeholder="Nombre de la lista"
                        {...register("name")}
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm">{errors.name.message}</span>
                    )}
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2 text-lg" htmlFor="description">Descripción</label>
                    <textarea
                        className={`input-field ${errors.description ? "input-error" : ""}`}
                        id="description"
                        placeholder="Descripción de la lista"
                        {...register("description")}
                    />
                    {errors.description && (
                        <span className="text-red-500 text-sm">{errors.description.message}</span>
                    )}
                </div>

                <button
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-full"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <Spinner /> : "Crear lista"}
                </button>

            </form >
        </>
    )
}