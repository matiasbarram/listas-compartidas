import { IActionBtn, INewItem, INewList } from "../../../types";


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
