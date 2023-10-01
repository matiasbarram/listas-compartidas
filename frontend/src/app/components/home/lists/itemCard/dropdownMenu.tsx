interface IDropdownMenu {
    isOpen: boolean;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    onClose: (e: React.MouseEvent) => void;
}

export default function DropdownMenu({ isOpen, onEdit, onDelete, onClose }: IDropdownMenu) {
    if (!isOpen) return null;
    return (
        <div className="absolute top-10 right-2 shadow-md rounded-md w-2/4 z-20 bg-white dark:bg-gray-700 p-2">
            <ul className="flex flex-col space-y-2">
                <li onClick={onEdit} className="p-1 rounded-md hover:bg-gray-600" >Editar</li>
                <li onClick={onDelete} className="p-1 rounded-md hover:bg-gray-600" >Eliminar</li>
            </ul>
        </div>
    )
}