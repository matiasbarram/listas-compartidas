"use client"

import { useState } from "react";
import { Checkbox } from "./checkbox";
import { IListItem, IListKeysProps } from "../../../../../types";
import { useSession } from "next-auth/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import DropdownMenu from "./itemCard/dropdownMenu";
import { markAsCompleted } from "@/app/lib/actions";
import { useRouter } from 'next/navigation';

export function ItemCard({ item, params, className }: { item: IListItem, params: IListKeysProps, className?: string }) {
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
        e.preventDefault();
        await markAsCompleted({ isCompleted: !itemSelected, params, session, item, setItemSelected });
        router.refresh();
    }


    return (
        <div className={"bg-zinc-800 shadow rounded-lg cursor-pointer mx-auto py-4 w-full " + className}>
            <div className="flex items-center space-x-4 w-11/12 mx-auto relative">
                <li
                    key={item.id}
                    onClick={e => handleCheckbox}
                    className="w-11/12 mx-auto flex items-center space-x-4"
                >
                    <Checkbox postId={item.id} selected={itemSelected} />
                    <div>
                        <h3 className={`text-lg font-medium text-gray-100 ${itemSelected ? "line-through" : ""}`}
                        >{item.description}</h3>
                    </div>
                </li >
                <div className="flex gap-2">
                    <div className="rounded border border-gray-500 px-2 py-1 flex justify-between items-center space-x-1">
                        <span className="text-gray-400 leading-none">{item.quantity}</span>
                    </div>
                    <button
                        className="rounded-fullhover:bg-zinc-600 cursor-pointer block"
                        type="button"
                        onClick={e => toggleMenu(e)}
                    >
                        <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <DropdownMenu
                    isOpen={isMenuOpen}
                    onEdit={e => editItem(e)}
                    onDelete={e => deleteItem(e)}
                    onClose={e => closeMenu(e)}
                />
            </div >
        </div >

    )
} 