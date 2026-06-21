import CustomModal from "./Modal"
import AddListForm from "../../home/group/createGroup/addListForm"
import AddItemForm from "../../home/lists/addItemForm"

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
            <div className="inline-block w-full max-w-md p-6 pb-8 sm:my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl sm:rounded-2xl rounded-t-2xl relative sm:max-h-[85vh] max-h-[calc(100dvh-4rem)] overflow-y-auto">
                <h2 className="text-2xl font-bold text-center mb-6">
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
