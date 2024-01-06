import { IListItem } from "../../../../../types"
import { ItemCard } from "../itemCard/itemCard"

interface RenderItemsProps {
    itemsData: IListItem[]
    isCompleted: boolean
    toggleItemCompletion: (itemId: IListItem) => void
}

export default function RenderItems({
    itemsData,
    toggleItemCompletion,
    isCompleted,
}: RenderItemsProps) {
    const items = itemsData.filter((item) => item.is_completed === isCompleted)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 z-10">
            {items.length === 0 && (
                <p className="text-gray-400 text-center">No hay items</p>
            )}

            {items.length > 0 &&
                items.map((item: IListItem) => (
                    <ItemCard
                        item={item}
                        onToggleCompletion={() => toggleItemCompletion(item)}
                        key={item.id}
                    />
                ))}
        </div>
    )
}
