"use client"

import { CloseBtn } from "./closeBtn";
import { Dialog, Transition } from "@headlessui/react";
import { Session } from "next-auth";
import { Fragment } from "react";

interface ICreateGroupForm {
    isOpen: boolean;
    authSession: any;
    router: any;
    session: Session;
    closeModal: () => void;
}

export default function CreateListModal({ isOpen, closeModal, session, router }: ICreateGroupForm) {
    return (
        <>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                                <CloseBtn closeModal={closeModal} />
                                <Dialog.Title as="h3" className="text-lg font-medium text-indigo-500">
                                    Crear nuevo grupo
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        En un grupo podrás crear y compartir listas con tus amigos.
                                    </p>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}