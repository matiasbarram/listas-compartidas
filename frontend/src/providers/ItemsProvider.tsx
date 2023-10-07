"use client"

import { Dispatch, SetStateAction, createContext, useState } from "react"
import { IListItem, ProviderProps } from "../../types"


interface ItemsContextProps {
    listItems: IListItem[]
    setListItems: Dispatch<SetStateAction<IListItem[]>>
}

export const ItemsContext = createContext<ItemsContextProps>({} as ItemsContextProps)

export default function ItemsProvider({ children }: ProviderProps) {
    const [listItems, setListItems] = useState<IListItem[]>([])
    return (
        <ItemsContext.Provider value={{ listItems, setListItems }}>
            {children}
        </ItemsContext.Provider>
    )
}
