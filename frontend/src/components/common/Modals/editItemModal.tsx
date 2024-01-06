'use client';
import { editItem } from '@/lib/actions/item/items';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  IListItem,
  IListKeysProps,
  INewItemValues,
  schemaItem,
} from '../../../../types';
import Spinner from '../Spinner/Spinner';
import CustomModal from './Modal';

export default function EditItemModal({
  item,
  setShowModal,
  showModal,
}: {
  item: IListItem;
  setShowModal: any;
  showModal: boolean;
}) {
  const params = useParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const editParams: IListKeysProps = {
    slug: params.slug.toString(),
    listId: params.listId.toString(),
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<INewItemValues>({
    resolver: zodResolver(schemaItem),
  });

  const { mutate: editItemFn, data: editedItem } = useMutation({
    mutationKey: ['editItem', params.slug],
    mutationFn: (data: INewItemValues) =>
      editItem({ itemId: item.id, data, params: editParams, session }),
    onSuccess() {
      setShowModal(false);
      queryClient.invalidateQueries(['items', params.slug, params.listId]);
    },
    onError() {
      setShowModal(false);
    },
  });

  const handleEditItem = async (data: INewItemValues) => {
    editItemFn(data);
  };

  return (
    <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
        <h2 className="text-2xl font-bold text-center mb-8">
          Editar {item.description}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(handleEditItem)}>
          <div className="flex flex-col">
            <label
              className="text-lg font-semibold text-gray-100"
              htmlFor="description"
            >
              Descripción
            </label>
            <input
              className="input-field"
              type="text"
              id="description"
              defaultValue={item.description}
              {...register('description')}
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-lg font-semibold text-gray-100"
              htmlFor="quantity"
            >
              Cantidad
            </label>
            <input
              className="input-field"
              type="number"
              inputMode="decimal"
              id="quantity"
              defaultValue={item.quantity}
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <span className="text-red-500 text-sm">
                {errors.quantity.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="text-lg font-semibold text-gray-100"
              htmlFor="is_completed"
            >
              Notas
            </label>
            <textarea
              className="input-field"
              id="notes"
              defaultValue={item.notes}
              {...register('comments')}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="rounded-md bg-green-500 text-gray-100 font-semibold px-4 py-2"
              type="submit"
            >
              {isSubmitting ? <Spinner /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
}
