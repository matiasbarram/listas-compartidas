import CustomModal from "../../common/Modal"
import AddItemForm from "./addItemForm"
import AddListForm from "../group/createGroup/addListForm"
import { IListItem } from "../../../../../types";

interface IAddItemModal {
    fields: string;
    showModal: boolean;
    closeModal: () => void;
    addItem: (item: IListItem) => void
}

export default function AddItemModal({ fields, showModal, closeModal, addItem }: IAddItemModal) {
    return (
        <CustomModal isOpen={showModal} onClose={closeModal}>
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Agregar {fields === "item" ? "producto" : "lista"}
                </h2>
                {
                    fields === "item" ?
                        <AddItemForm closeModal={closeModal} addItem={addItem} />
                        :
                        <AddListForm closeModal={closeModal} />
                }

            </div>
        </CustomModal>
    );
}   