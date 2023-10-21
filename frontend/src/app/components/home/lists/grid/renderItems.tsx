import { IListItem, IListItemsResponse, IListKeysProps } from "../../../../../../types";
import { ItemCard } from "../itemCard/itemCard";

interface RenderItemsProps {
    itemsData: IListItem[],
    isCompleted: boolean,
    toggleItemCompletion: (itemId: IListItem) => void
}

export default function RenderItems({ itemsData, toggleItemCompletion, isCompleted }: RenderItemsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 z-10">

            {
                itemsData.map((item: IListItem) => {
                    if (item.is_completed === isCompleted) {
                        return (
                            <ItemCard item={item} onToggleCompletion={() => toggleItemCompletion(item)} key={item.id} />
                        );
                    }
                    return null
                })
            }
        </div>
    )
}