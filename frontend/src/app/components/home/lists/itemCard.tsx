"use client"

import { useState } from "react";
import { Checkbox } from "./checkbox";
import { IItemsData, IListItem, IListKeysProps } from "../../../../../types";
import { useSession } from "next-auth/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import DropdownMenu from "./itemCard/dropdownMenu";
import { markAsCompleted } from "@/app/lib/actions";
import { useRouter } from 'next/navigation';

export function ItemCard({ item, params, itemsData }: { item: IListItem, params: IListKeysProps, itemsData: IItemsData }) {
    const [itemSelected, setItemSelected] = useState(item.is_completed);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();
    if (!session) {
        return null;
    }

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    }

    const closeMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
    };

    const editItem = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Editando");
    }
    const deleteItem = async (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Eliminando");
    }
    const handleCheckbox = async (e: React.MouseEvent) => {
        await markAsCompleted({ isCompleted: !itemSelected, params, session, item, setItemSelected });
        router.refresh();
    }


    return (
        <div className="bg-zinc-800 space-x-4 shadow rounded-lg cursor-pointer mx-autopy-4 py-4 relative">
            <li
                key={item.id}
                onClick={e => handleCheckbox(e)}
                className="w-11/12 mx-auto flex  items-center space-x-4"
            >
                <Checkbox postId={item.id} selected={itemSelected} />
                <div>
                    <h3 className={`text-lg font-medium text-gray-100 ${itemSelected ? "line-through" : ""}`}
                    >{item.description}</h3>
                    <small className="text-gray-500 dark:text-gray-400">{item.notes}</small>
                </div>
                <button
                    className="absolute right-1 top-1 z-2 p-2 rounded-fullhover:bg-zinc-600 cursor-pointer"
                    type="button"
                    onClick={e => toggleMenu(e)}
                >
                    <EllipsisHorizontalIcon
                        className="h-5 w-5 text-gray-400" />
                </button>
            </li >
            <DropdownMenu
                isOpen={isMenuOpen}
                onEdit={e => editItem(e)}
                onDelete={e => deleteItem(e)}
                onClose={e => closeMenu(e)}
            />
        </div >

    )
} 