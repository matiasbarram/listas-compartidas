'use client';
import { createItems } from '@/lib/actions/item/items';
import { createToast } from '@/lib/common';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import Select from 'react-select';
import { GptItem, IList, IListItemsResponse } from '../../../../types';
import Button from '../../common/Button/Button';

interface ISpeakItemsFormProps {
  items: GptItem[];
  lists: IList[];
  closeModal: () => void;
}

interface IItemsFieldsProps {
  items: GptItem[];
  item: GptItem;
  lists: IList[];
  setItems: (items: GptItem[]) => void;
}

function ItemsFields({ items, item, lists, setItems }: IItemsFieldsProps) {
  const selectedList = lists.find((list) => list.name === item.list);
  const itemName = `nombre-${item.name}`;
  const itemQuantity = `cantidad-${itemName}-${item.quantity}`;
  const itemList = `lista-${itemName}-${item.list}`;

  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2 rounded-md pb-4">
      <div
        className="flex justify-end"
        onClick={() =>
          setItems(items.filter((itm, i) => itm.name !== item.name))
        }
      >
        <XMarkIcon className="h-5 w-5 cursor-pointer" />
      </div>
      <div>
        <label htmlFor={itemName}>Nombre</label>
        <input
          name={itemName}
          id={itemName}
          className="input-field"
          placeholder="Nombre"
          defaultValue={item.name}
          onChange={(e) =>
            setItems(
              items.map((itm, i) => {
                if (itm.name === item.name) {
                  itm.name = e.target.value;
                }
                return itm;
              })
            )
          }
        />
      </div>
      <div>
        <label htmlFor={itemQuantity}>Cantidad</label>
        <input
          name={itemQuantity}
          id={itemQuantity}
          className="input-field"
          type="number"
          defaultValue={item.quantity}
          onChange={(e) =>
            setItems(
              items.map((itm, i) => {
                if (itm.name === item.name) {
                  itm.quantity = Number(e.target.value);
                }
                return itm;
              })
            )
          }
        />
      </div>
      <div>
        <label>Lista</label>
        <Select
          id={itemList}
          options={lists}
          getOptionLabel={(option: IList) => option.name}
          defaultValue={selectedList}
          className="react-select-container"
          classNamePrefix="react-select"
          onChange={(e) =>
            setItems(
              items.map((itm, i) => {
                if (itm.name === item.name) {
                  itm.list = e?.name || '';
                }
                return itm;
              })
            )
          }
        />
      </div>
    </div>
  );
}

interface IGptResponseItem {
  name: string;
  list: {
    name: string;
    id: number;
  };
  quantity: number;
}

interface IGptResponseItems {
  items: IGptResponseItem[];
}

export default function SpeakItemsForm({
  items,
  lists,
  closeModal,
}: ISpeakItemsFormProps) {
  const queryClient = useQueryClient();

  items.map(
    (item) =>
      (item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1))
  );

  const params = useParams();
  const { data: session } = useSession();
  const [editedItems, setEditedItems] = useState(items);

  const {
    data: newItems,
    mutate: createItemsMutation,
    isLoading,
  } = useMutation({
    mutationKey: ['speak', params.slug],
    mutationFn: (items: IGptResponseItems) =>
      createItems({
        gptResponse: items,
        params: {
          slug: params.slug.toString(),
          listId: items.items[0].list.id.toString(),
        },
        session: session,
      }),
    async onSuccess(newItems) {
      await queryClient.cancelQueries(['items', params.slug, params.listId]);
      queryClient.setQueryData<IListItemsResponse>(
        ['items', params.slug, params.listId],
        (old) => {
          if (!old) return old;
          const allItems = [...old.items, ...newItems.items];
          return {
            ...old,
            items: allItems,
          };
        }
      );
      createToast({
        message: 'Items agregados correctamente',
        toastType: 'success',
      });
      closeModal();
    },
    onError(error) {
      createToast({
        message: 'Error al procesar el mensaje',
        toastType: 'error',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const items: IGptResponseItem[] = editedItems.map((item: GptItem) => {
      return {
        name: item.name,
        list: {
          name: item.list,
          id: Number(lists.find((list) => list.name === item.list)?.id) || 0,
        },
        quantity: item.quantity,
      };
    });
    const gptResponse: IGptResponseItems = { items };
    createItemsMutation(gptResponse);
  };

  useEffect(() => {
    if (editedItems.length === 0) {
      closeModal();
    }
  }, [editedItems, closeModal]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {editedItems.map((item: GptItem, index: number) => (
          <Fragment key={index}>
            <ItemsFields
              items={editedItems}
              setItems={setEditedItems}
              item={item}
              lists={lists}
            />
          </Fragment>
        ))}
      </div>
      <Button type="submit">
        {isLoading ? 'Procesando...' : 'Agregar items'}
      </Button>
    </form>
  );
}
