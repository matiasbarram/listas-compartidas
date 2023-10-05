import { IActionBtn, INewItem, INewList } from "../../../types";
import { throwEnvError } from "./erros";


const apiURL = process.env.NEXT_PUBLIC_API_URL
if (!apiURL) {
    throw new Error(
        'Please define the API_URL environment variable inside .env.local'
    );
}
export const API_URL = apiURL;
export const homePath = "/home";


export const defaultDataItem: INewItem = {
    description: "",
    quantity: 1,
    comments: "",
}
export const defaultDataList: INewList = {
    name: "",
    description: "",
}


export const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || throwEnvError("NEXT_PUBLIC_GOOGLE_CLIENT_ID")
export const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || throwEnvError("NEXT_PUBLIC_GOOGLE_CLIENT_SECRET")
export const DEBOUNCE_DELAY = 1000
