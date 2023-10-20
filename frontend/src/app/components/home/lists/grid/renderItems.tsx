import { IListItem, IListItemsResponse, IListKeysProps } from "../../../../../../types";
import { ItemCard } from "../itemCard/itemCard";

interface RenderItemsProps {
    itemsData: IListItem[],
    isCompleted: boolean,
    toggleItemCompletion: (itemId: IListItem) => void
}

export default function RenderItems({ itemsData, toggleItemCompletion, isCompleted }: RenderItemsProps) {
    return (
        <>
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
        </>
    )
}