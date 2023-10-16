import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IListItem } from "../../../../../../types";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

interface IDropdownMenu {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
    setShowEditModal: Dispatch<SetStateAction<boolean>>
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>
    item: IListItem;
}

export default function DropdownMenu({ open, setOpen, setShowEditModal, setShowDeleteModal, item }: IDropdownMenu) {
    return (
        <>
            <AnimatePresence initial={false}>
                <motion.div
                    className="absolute top-10 right-2 shadow-md rounded-md w-2/4 z-10 bg-gray-700 p-2 dropdown-menu"
                    variants={menu}
                    animate={open ? "open" : "closed"}
                    initial="closed"
                    exit="closed"
                >
                    <ul className="flex flex-col space-y-2">
                        <li
                            className="p-1 rounded-md hover:bg-gray-600"
                            onClick={() => {
                                setOpen(false)
                                setShowEditModal(true)
                            }}
                        >Editar
                        </li>
                        <li
                            className="p-1 rounded-md hover:bg-gray-600"
                            onClick={() => {
                                setOpen(false)
                                setShowDeleteModal(true)
                            }}
                        >
                            Eliminar
                        </li>
                    </ul>
                </motion.div>
            </AnimatePresence >
        </>
    )
}