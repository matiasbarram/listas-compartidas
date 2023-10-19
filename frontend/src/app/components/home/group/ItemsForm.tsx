"use client"
import Select from 'react-select'
import { XMarkIcon } from "@heroicons/react/24/solid"
import { GptItem, IList, IListItem } from "../../../../../types"
import Button from "../../common/Button/Button"
import { Fragment, useContext, useEffect, useState } from 'react'
import { API_URL } from '@/lib/constants'
import { useParams } from 'next/navigation'
import nextAuth from 'next-auth'
import { useSession } from 'next-auth/react'
import { ItemsContext } from '@/providers/ItemsProvider'


interface ISpeakItemsFormProps {
    items: GptItem[],
    lists: IList[],
    closeModal: () => void
}

interface IItemsFieldsProps {
    items: GptItem[],
    item: GptItem,
    lists: IList[],
    setItems: (items: GptItem[]) => void
}

function ItemsFields({ items, item, lists, setItems }: IItemsFieldsProps) {
    const selectedList = lists.find(list => list.name === item.list)
    const itemName = `nombre-${item.name}`
    const itemQuantity = `cantidad-${itemName}-${item.quantity}`
    const itemList = `lista-${itemName}-${item.list}`

    return (
        <div className="flex flex-col gap-2 bg-zinc-900 p-2 rounded-md pb-4">
            <div className="flex justify-end" onClick={() => setItems(items.filter((itm, i) => itm.name !== item.name))}>
                <XMarkIcon className="h-5 w-5 cursor-pointer" />
            </div>
            <div>
                <label htmlFor={itemName}>Nombre</label>
                <input
                    name={itemName}
                    id={itemName}
                    className="input-field"
                    placeholder="Nombre"
                    defaultValue={item.name}
                    onChange={(e) => setItems(items.map((itm, i) => {
                        if (itm.name === item.name) {
                            itm.name = e.target.value
                        }
                        return itm
                    }
                    ))}
                />
            </div>
            <div>
                <label htmlFor={itemQuantity}>Cantidad</label>
                <input
                    name={itemQuantity}
                    id={itemQuantity}
                    className="input-field"
                    type="number"
                    defaultValue={item.quantity}
                    onChange={(e) => setItems(items.map((itm, i) => {
                        if (itm.name === item.name) {
                            itm.quantity = Number(e.target.value)
                        }
                        return itm
                    }
                    ))}
                />
            </div>
            <div>
                <label>Lista</label>
                <Select
                    id={itemList}
                    options={lists}
                    getOptionLabel={(option: IList) => option.name}
                    defaultValue={selectedList}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    onChange={(e) => setItems(items.map((itm, i) => {
                        if (itm.name === item.name) {
                            itm.list = e?.name || ""
                        }
                        return itm
                    }
                    ))}
                />
            </div>
        </div>
    )
}

interface IGptResponseItem {
    name: string
    list: {
        name: string
        id: number
    }
    quantity: number

}

interface IGptResponseItems {
    items: IGptResponseItem[]
}

interface IItemsCreated {
    items: IListItem[]
}

export default function SpeakItemsForm({ items, lists, closeModal }: ISpeakItemsFormProps) {
    const params = useParams()
    const { data: session } = useSession()
    const [editedItems, setEditedItems] = useState(items)
    const { listItems, setListItems } = useContext(ItemsContext)


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const items: IGptResponseItem[] = editedItems.map((item: GptItem) => {
            return {
                name: item.name,
                list: {
                    name: item.list,
                    id: Number(lists.find(list => list.name === item.list)?.id) || 0
                },
                quantity: item.quantity
            }
        })
        const gptResponse: IGptResponseItems = { items: items }
        const response = await fetch(API_URL + `/private/groups/${params.slug}/createItems`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.token}`
            },
            body: JSON.stringify(gptResponse)
        })
        const data: IItemsCreated = await response.json()
        setListItems([...data.items])
        closeModal()

    }

    useEffect(() => {
        if (editedItems.length === 0) {
            closeModal()
        }
    }, [editedItems, closeModal])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                {editedItems.map((item: GptItem, index: number) => (
                    <Fragment key={index}>
                        <ItemsFields items={editedItems} setItems={setEditedItems} item={item} lists={lists} />
                    </Fragment>
                ))}
            </div>
            <Button type="submit">Agregar items</Button>
        </form >
    )
}