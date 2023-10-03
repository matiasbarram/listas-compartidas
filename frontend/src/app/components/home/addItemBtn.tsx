"use client"

import { PlusIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { IListKeysProps, PageProps } from "../../../../types";
import AddItemModal from "./lists/addItemModal";
import styles from './modals.module.css'

function isIListKeys(params: IListKeysProps | PageProps): { value: boolean, fields: "item" | "list" } {
    const val = 'listId' in params
    return { value: val, fields: val ? "item" : "list" }
}

export default function AddItemBtn({ data, type }: { data: IListKeysProps | PageProps, type?: "static" }) {
    const [showModal, setShowModal] = useState(false);
    const [showBtn, setShowBtn] = useState(true);

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
                isListKeys ? <AddItemModal fields={fields} showModal={showModal} closeModal={closeModal} />
                    : <AddItemModal fields={fields} showModal={showModal} closeModal={closeModal} />
            }

        </>
    )
}
