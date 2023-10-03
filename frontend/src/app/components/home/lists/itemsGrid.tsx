"use client";

import { useState } from "react";
import { IListItem, IListItemsResponse, IListKeysProps } from "../../../../../types";
import { ItemCard } from "./itemCard";
import { markAsCompleted } from "@/app/lib/actions";
import { useSession } from "next-auth/react";

export const ItemsGrid = ({ itemsData, params }: { itemsData: IListItemsResponse, params: IListKeysProps }) => {

    const [listItems, setListItems] = useState<IListItem[]>(itemsData.items);

    const { data: session } = useSession();
    if (session === null) { return null };

    const toggleItemCompletion = (itemId: number) => {
        const newItems = listItems.map((item: IListItem) => {
            if (item.id === itemId) {
                item.is_completed = !item.is_completed;
            }
            return item;
        })
        const item = listItems.find((item: IListItem) => item.id === itemId);
        if (!item) return

        markAsCompleted({ isCompleted: item.is_completed, item, params, session });
        setListItems(newItems);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <h2 className="text-2xl font-bold text-gray-100 pb-4">Pendientes</h2>
            {
                listItems.map((item: IListItem) => {
                    if (item.is_completed === false) {
                        return (
                            <ItemCard item={item} onToggleCompletion={toggleItemCompletion} key={item.id} />
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
                            <ItemCard item={item} onToggleCompletion={toggleItemCompletion} key={item.id} />
                        );
                    }
                    return null
                })
            }
        </div>
    );
};
