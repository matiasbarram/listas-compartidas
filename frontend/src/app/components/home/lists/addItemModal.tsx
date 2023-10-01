import { IModalField } from "../../../../../types"
import CustomModal from "../../common/Modal"

interface IAddItemModal {
    fields: "item" | "list",
    showModal: boolean,
    newItem: any,
    setNewItem: any,
    createProduct: any,
    closeModal: any
}


export default function AddItemModal({ fields, showModal, newItem, setNewItem, createProduct, closeModal }: IAddItemModal) {
    const Itemfields: IModalField[] = [
        {
            type: "text",
            name: "description",
            label: "Nombre",
            placeholder: "Nuevo producto",
            required: true,
            onChange: (e: any) => setNewItem({ ...newItem, description: e.target.value })
        },
        {
            type: "number",
            name: "quantity",
            label: "Cantidad",
            placeholder: "1",
            required: true,
            onChange: (e: any) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
        },
        {
            type: "text",
            name: "comments",
            label: "Comentarios",
            placeholder: "Comentarios",
            onChange: (e: any) => setNewItem({ ...newItem, comments: e.target.value })
        }
    ]

    const ListFields: IModalField[] = [
        {
            type: "text",
            name: "name",
            label: "Nombre",
            placeholder: "Nueva lista",
            required: true,
            onChange: (e: any) => setNewItem({ ...newItem, name: e.target.value })
        },
        {
            type: "text",
            name: "description",
            label: "Descripción",
            placeholder: "Descripción",
            onChange: (e: any) => setNewItem({ ...newItem, description: e.target.value })
        }
    ]
    const iterFields = fields === "item" ? Itemfields : ListFields;

    return (
        <CustomModal isOpen={showModal} onClose={closeModal} >
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-zinc-800 shadow-xl rounded-2xl relative">
                <h2 className="text-2xl font-bold text-center mb-8">Agregar producto</h2>
                <form
                    className="w-11/12 mx-auto flex flex-col justify-between items-start space-y-4"
                    onSubmit={createProduct}
                >
                    {iterFields.map((field, index) => (
                        <div key={index} className="mb-4 w-full">
                            <label htmlFor={field.name} className="text-sm font-semibold">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                className="input-field"
                                required={field.required}
                                onChange={field.onChange}
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
                    >
                        Agregar
                    </button>
                </form>
            </div>
        </CustomModal >
    )
}   