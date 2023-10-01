import { ListBulletIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import CreateListModal from "../components/home/lists/Modals/createList";
import { IActionBtn, INewItem, INewList } from "../../../types";
import { Session } from "next-auth";
import { Router } from "next/router";


// isOpen, closeModal, session, router
interface ICreateGroupForm {
    isOpen: boolean,
    closeModal: () => void,
    session: Session
    router: Router
}

const apiURL = process.env.NEXT_PUBLIC_API_URL
if (!apiURL) {
    throw new Error(
        'Please define the API_URL environment variable inside .env.local'
    );
}
export const API_URL = apiURL;


export const defaultDataItem: INewItem = {
    description: "",
    quantity: 1,
    comments: "",
}
export const defaultDataList: INewList = {
    name: "",
    description: "",
}
