import CustomModal from "./Modal"
import AddListForm from "../../home/group/createGroup/addListForm"
import AddItemForm from "../../home/lists/addItemForm"

AddItemForm

interface IAddItemModal {
    fields: "item" | "list"
    showModal: boolean
    closeModal: () => void
}

export default function AddItemModal({
    fields,
    showModal,
    closeModal,
}: IAddItemModal) {
    return (
        <CustomModal isOpen={showModal} onClose={closeModal}>
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Agregar {fields === "item" ? "producto" : "lista"}
                </h2>
                {fields === "list" ? (
                    <AddListForm closeModal={closeModal} />
                ) : (
                    <AddItemForm closeModal={closeModal} />
                )}
            </div>
        </CustomModal>
    )
}
