"use client"

import { PlusIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import { IListKeysProps, INewItem, INewList, PageProps } from "../../../../types";
import { useRouter } from "next/navigation";
import AddItemModal from "./lists/addItemModal";
import styles from './modals.module.css'
import { createProduct } from "@/app/lib/actions";
import { defaultDataItem, defaultDataList } from "@/app/lib/constants";


function isIListKeys(params: IListKeysProps | PageProps): { value: boolean, fields: "item" | "list" } {
    const val = 'listId' in params
    return {
        value: val,
        fields: val ? "item" : "list"
    }
}

export default function AddItemBtn({ data, type }: { data: IListKeysProps | PageProps, type?: "static" }) {
    const session = useSession();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [showBtn, setShowBtn] = useState(true);
    const [newItem, setNewItem] = useState<INewItem>(defaultDataItem);
    const [newList, setNewList] = useState<INewList>(defaultDataList);

    const { value: isListKeys, fields } = isIListKeys(data);

    useEffect(() => {
        const handleScroll = () => {
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY;
            const gap = 10;
            const hidePosition = documentHeight - windowHeight - gap;
            setShowBtn(scrollPosition < hidePosition);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const closeModal = () => setShowModal(false);
    const addProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isListKeys) {
            const params = data as IListKeysProps;
            const url = `/private/groups/${params.slug}/lists/${params.listId}/items`
            await createProduct({ session, url, newItem, router, closeModal, setNewItem })
        }
        else {
            const params = data as PageProps;
            const url = `/private/groups/${params.slug}/lists/create`
            await createProduct({ session, url, newItem: newList, router, closeModal, setNewItem: setNewList })
        }
    }

    return (
        <>
            {type === "static" ?
                <button
                    onClick={() => setShowModal(true)}
                    className={`bg-indigo-800 rounded-md px-4 py-2 hover:bg-green-800 cursor-pointer`}
                >
                    Agregar
                    {isListKeys ? " item" : " lista"}
                </button>
                :
                <button
                    id="add-item-btn"
                    onClick={() => setShowModal(true)}
                    className={`fixed bottom-10 right-4 bg-indigo-800 rounded-md p-4 hover:bg-indigo-700 cursor-pointer ${showBtn ? styles.show : styles.hide}`}>
                    <PlusIcon className="w-5 h-5" />
                </button >
            }
            {
                isListKeys ? <AddItemModal fields={fields} showModal={showModal} newItem={newItem} setNewItem={setNewItem} createProduct={addProduct} closeModal={closeModal} />
                    : <AddItemModal fields={fields} showModal={showModal} newItem={newList} setNewItem={setNewList} createProduct={addProduct} closeModal={closeModal} />
            }

        </>
    )
}
