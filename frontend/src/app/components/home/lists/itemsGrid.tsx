"use client"

import { useCallback, useEffect, useState, useRef } from "react";
import { IApiResponse, IListItem, IListItemsResponse, IListKeysProps } from "../../../../../types";
import { ItemCard } from "./itemCard/itemCard";
import { markAsCompleted } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import AddItemBtn from "../addItemBtn";
import { DebouncedFunc, debounce } from "lodash";
import SavingStatus from "../../common/Toast/savingStatusToast";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from 'next/navigation'


export const ItemsGrid = ({ itemsData, params }: { itemsData: IListItemsResponse, params: IListKeysProps }) => {

    const [listItems, setListItems] = useState<IListItem[]>(itemsData.items);
    const [saving, setSaving] = useState<boolean>(false);
    const listItemsRef = useRef(listItems);
    const { data: session } = useSession();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const updateItemCompletion = (itemId: number, isCompleted: boolean) => {
        setSaving(true);
        const newItems = listItemsRef.current.map((item: IListItem) => {
            if (item.id === itemId) {
                item.is_completed = isCompleted;
            }
            return item;
        });
        setListItems(newItems);
    };

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
                await markAsCompleted({ isCompleted: newIsCompleted, item, params, session: session })
                setSaving(false);
            }, 2000);
            debouncedMarkAsCompletedMap.current.set(itemId, debouncedFn);
        }
        debouncedFn();
    };

    const addItem = (item: IListItem) => {
        setListItems([...listItems, item]);
    }

    useEffect(() => {
        listItemsRef.current = listItems;
    }, [listItems]);

    useEffect(() => {
        const mapRef = debouncedMarkAsCompletedMap.current; // Capture the current value of the ref
        return () => {
            mapRef.forEach((debouncedFn) => {
                (debouncedFn as DebouncedFunc<() => void>).cancel();
            });
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {<SavingStatus saving={saving} />}
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
