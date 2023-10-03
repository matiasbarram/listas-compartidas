"use client"

import { useCallback, useEffect, useState, useRef } from "react";
import { IListItem, IListItemsResponse, IListKeysProps } from "../../../../../types";
import { ItemCard } from "./itemCard";
import { markAsCompleted } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import AddItemBtn from "../addItemBtn";
import { debounce } from "lodash";

export const ItemsGrid = ({ itemsData, params }: { itemsData: IListItemsResponse, params: IListKeysProps }) => {

    const [listItems, setListItems] = useState<IListItem[]>(itemsData.items);
    const listItemsRef = useRef(listItems);
    useEffect(() => {
        listItemsRef.current = listItems;
    }, [listItems]);

    const { data: session } = useSession();

    const updateItemCompletion = (itemId: number, isCompleted: boolean) => {
        const newItems = listItemsRef.current.map((item: IListItem) => {
            if (item.id === itemId) {
                item.is_completed = isCompleted;
            }
            return item;
        });
        setListItems(newItems);
    };

    // Utiliza un mapa para realizar el seguimiento de las llamadas debounced individuales
    const debouncedMarkAsCompletedMap = useRef(new Map<number, () => void>());

    const toggleItemCompletion = (itemId: number) => {
        const item = listItemsRef.current.find((item: IListItem) => item.id === itemId);
        if (!item) return;

        const newIsCompleted = !item.is_completed;
        updateItemCompletion(itemId, newIsCompleted);
        let debouncedFn = debouncedMarkAsCompletedMap.current.get(itemId);

        if (!debouncedFn) {
            debouncedFn = debounce(async () => {
                if (session === null) return null;

                await markAsCompleted({ isCompleted: newIsCompleted, item, params, session: session });
            }, 2000);
            debouncedMarkAsCompletedMap.current.set(itemId, debouncedFn);
        }

        // Ejecuta la función debounced
        debouncedFn();
    };

    const addItem = (item: IListItem) => {
        setListItems([...listItems, item]);
    }

    useEffect(() => {
        return () => {
            // Cancela todas las funciones debounced al desmontar el componente
            debouncedMarkAsCompletedMap.current.forEach((debouncedFn) => {
                // @ts-ignore
                debouncedFn.cancel();
            });
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <h2 className="text-2xl font-bold text-gray-100 pb-4">Pendientes</h2>
            {
                listItems.map((item: IListItem) => {
                    if (item.is_completed === false) {
                        return (
                            <ItemCard item={item} onToggleCompletion={() => toggleItemCompletion(item.id)} key={item.id} />
                        );
                    }
                    return null
                })
            }
            <h2 className="text-2xl font-bold text-gray-100 pb-4">Completados ✅ </h2>
            {
                listItems.map((item: IListItem) => {
                    if (item.is_completed === true) {
                        return (
                            <ItemCard item={item} onToggleCompletion={() => toggleItemCompletion(item.id)} key={item.id} />
                        );
                    }
                    return null
                })
            }
            <AddItemBtn params={params} addItem={addItem} />
        </div>
    );
};
