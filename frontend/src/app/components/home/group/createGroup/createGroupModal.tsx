"use client"

import { Dialog, Transition } from "@headlessui/react";
import { PlusSmallIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import Input from "../../../common/Input";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import EmailList from "./addEmail";
import CustomModal from "@/app/components/common/Modals/Modal";
import { CloseBtn } from "@/app/components/common/Modals/closeBtn";
import Spinner from "@/app/components/common/Spinner/Spinner";
import { createGroup } from "@/app/lib/actions/group/groups";


interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    session: Session;
    router: AppRouterInstance;
}


function CreateGroupForm({ authSession, router, closeModal }: {
    authSession: Session, router: AppRouterInstance,
    closeModal: () => void
}) {
    const [group, setGroup] = useState({
        name: "",
        description: "",
        emails: [] as string[],
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGroup((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGroup((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setIsLoading(true);
        if (!authSession) return

        const { name, description, emails } = group;
        const token = authSession?.token;
        await createGroup({ group, token, closeModal });
        router.refresh();
        setIsLoading(false);

    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mt-4">
                <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Nombre del grupo"
                    inputChangeFn={handleInputChange}
                    labelText="Nombre"
                />
            </div>
            <div className="mt-4">
                <Input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Este grupo es para..."
                    tag="textarea"
                    textareaChangeFn={handleTextareaChange}
                    labelText="Descripción"
                />
            </div>
            <div className="mt-4">
                <EmailList emails={group.emails} setGroup={setGroup} />
            </div>
            <button type="submit" className="mt-8 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {isLoading ? <Spinner /> : "Crear grupo"}
            </button>
        </form>
    )
}

function Modal({ isOpen, closeModal, session, router }: ModalProps) {
    return (
        <CustomModal isOpen={isOpen} onClose={closeModal} >
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
                <CreateGroupForm authSession={session} router={router} closeModal={closeModal} />
            </div>
        </CustomModal >

    );
}

export default function CreateGroupModal() {
    const [showModal, setShowModal] = useState(false);
    const { data: session, status } = useSession()
    const router = useRouter()
    if (!session) return
    return (
        <div>
            <PlusSmallIcon
                className="h-6 w-6 active:text-gray-700 hover:text-gray-700 cursor-pointer"
                aria-hidden="true"
                onClick={() => setShowModal(true)}
            />
            <Modal
                isOpen={showModal}
                closeModal={() => setShowModal(false)}
                session={session}
                router={router}
            />
        </div>
    );
}
