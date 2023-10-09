"use client"

import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { IListItem, IListItemsResponse, IListKeysProps } from "../../../../../../types";
import { useSession } from "next-auth/react";
import AddItemBtn from "../../addItemBtn";
import { DebouncedFunc, debounce } from "lodash";
import SavingStatus from "../../../common/Toast/savingStatusToast";
import { ItemsContext } from "@/providers/ItemsProvider";
import RenderItems from "./renderItems";
import { DEBOUNCE_DELAY } from "@/lib/constants";
import { markAsCompleted } from "@/lib/actions/item/items";



export const ItemsGrid = ({ itemsData, params }: { itemsData: IListItemsResponse, params: IListKeysProps }) => {

    const { listItems, setListItems } = useContext(ItemsContext)

    const updateListItems = useCallback((newItems: IListItem[]) => setListItems(newItems), [setListItems]);

    useEffect(() => {
        // Move 'updateListItems' inside the useEffect callback
        updateListItems(itemsData.items);
    }, [itemsData.items, updateListItems]);

    useEffect(() => {
        updateListItems(itemsData.items);
    }, [itemsData.items, updateListItems]);


    const [saving, setSaving] = useState<boolean>(false);
    const listItemsRef = useRef(listItems);
    const { data: session } = useSession();

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
            }, DEBOUNCE_DELAY)
            debouncedMarkAsCompletedMap.current.set(itemId, debouncedFn);
        }
        debouncedFn();
    };

    const addItem = (item: IListItem) => setListItems([...listItems, item]);


    useEffect(() => {
        listItemsRef.current = listItems;
    }, [listItems]);

    useEffect(() => {
        const mapRef = debouncedMarkAsCompletedMap.current;
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
            <RenderItems itemsData={listItems} isCompleted={false} toggleItemCompletion={toggleItemCompletion} />
            <h2 className="text-2xl font-bold text-gray-100 pb-4">Completados ✅ </h2>
            <RenderItems itemsData={listItems} isCompleted={true} toggleItemCompletion={toggleItemCompletion} />
            <AddItemBtn params={params} addItem={addItem} />
        </div>
    );
};
