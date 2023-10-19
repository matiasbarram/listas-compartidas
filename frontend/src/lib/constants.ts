import { ThemeConfig } from "react-select";
import { INewItem, INewList } from "../../types";
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
export const JWT_EXPIRATION_TIME = Number(process.env.NEXT_PUBLIC_JWT_EXPIRATION_TIME) || throwEnvError("JWT_EXPIRATION_TIME")


export const responseSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3,
                "maxLength": 20
            },
            "list": {
                "type": "string",
                "minLength": 3,
                "maxLength": 20
            },
            "quantity": {
                "type": "number",
                "description": "Product quantity",
                "minimum": 0
            }
        },
        "required": ["name", "list", "quantity"]
    }
}

export const GPTContext = `You will be provided with a message in natural language, and your task is to parse the message using a json. The json schema is ${JSON.stringify(responseSchema)}.
The message will be record using a microphone, so may have a conversational words. Just considere the products names, quantity and list the list. 
If the quantity is not provided add by default 1.
If the message only contains one product, use the schema .
If the list is not provided return a 400 status.
If the user message dont fit the schema return a error json with  400 status.
Always add the products to items field of the json
`

