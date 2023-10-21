"use client"

import React from "react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { IListItem, IListKeysProps, PageProps } from "../../../../types";
import AddItemModal from "../common/Modals/addItemModal";
import styles from './modals.module.css'

interface IAddItemBtnProps {
    params: IListKeysProps | PageProps,
    btnType?: "static" | "fixed",
    type?: "item" | "list",
}

function isIListKeys(params: IListKeysProps | PageProps): { value: boolean, formType: "item" | "list" } {
    const val = 'listId' in params
    return { value: val, formType: val ? "item" : "list" }
}

export default function AddItemBtn({ params, btnType, type }: IAddItemBtnProps) {
    const [showModal, setShowModal] = useState(false);
    const [showBtn, setShowBtn] = useState(true);

    const { value: isListKeys, formType } = isIListKeys(params);

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
            {btnType === "static" ?
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
                isListKeys ? <AddItemModal fields={formType} showModal={showModal} closeModal={closeModal} /> : <AddItemModal fields={formType} showModal={showModal} closeModal={closeModal} />

            }

        </>
    )
}
