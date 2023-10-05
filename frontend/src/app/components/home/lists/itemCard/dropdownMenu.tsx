import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IListItem } from "../../../../../../types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useOutsideClick } from "@/app/hooks/clickOutside";
import CustomModal from "@/app/components/common/Modals/Modal";
import EditItemModal from "@/app/components/common/Modals/editItemModal";
import DeleteItemModal from "@/app/components/common/Modals/deleteItemModal";

interface IDropdownMenu {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
    item: IListItem;
}

const menu = {
    closed: {
        scale: 0,
    },
    open: {
        scale: 1,
        transition: {
            type: "spring",
            duration: 0.4,
            delayChildren: 0.2,
            staggerChildren: 0.05,
        },
    },
} satisfies Variants;

export default function DropdownMenu({ open, setOpen, item }: IDropdownMenu) {
    const [shoEditModal, setShowEditModal] = useState(false)
    const [shoDeleteModal, setShowDeleteModal] = useState(false)

    const handleEditItemModal = () => {
        setOpen(!open)
        setShowEditModal(true)
    }
    const handleDeleteItemModal = () => {
        setOpen(!open)
        setShowDeleteModal(true)
    }


    return (
        <>
            <AnimatePresence initial={false}>
                <motion.div
                    className="absolute top-10 right-2 shadow-md rounded-md w-2/4 z-2 bg-gray-700 p-2 dropdown-menu"
                    variants={menu}
                    animate={open ? "open" : "closed"}
                    initial="closed"
                    exit="closed"
                >
                    <ul className="flex flex-col space-y-2">
                        <li
                            className="p-1 rounded-md hover:bg-gray-600"
                            onClick={handleEditItemModal}
                        >Editar
                        </li>
                        <li
                            className="p-1 rounded-md hover:bg-gray-600"
                            onClick={handleDeleteItemModal}
                        >
                            Eliminar
                        </li>
                    </ul>
                </motion.div>
            </AnimatePresence >
            <EditItemModal item={item} setShowModal={setShowEditModal} shoModal={shoEditModal} />
            <DeleteItemModal item={item} setShowModal={setShowDeleteModal} shoModal={shoDeleteModal} />

        </>
    )
}