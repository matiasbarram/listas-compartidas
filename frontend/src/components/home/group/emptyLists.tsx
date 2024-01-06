import { QueueListIcon } from "@heroicons/react/24/outline"
import { PageProps } from "../../../../types"
import AddItemBtn from "../addItemBtn"

export const emptyListComponent = (params: PageProps) => {
    return (
        <div className="flex flex-col gap-4 text-center h-96 justify-center items-center">
            <QueueListIcon className="h-20 w-20 text-gray-500" />
            <p className="text-gray-500">No hay listas en este grupo</p>
            <AddItemBtn params={params} btnType="static" />
        </div>
    )
}
