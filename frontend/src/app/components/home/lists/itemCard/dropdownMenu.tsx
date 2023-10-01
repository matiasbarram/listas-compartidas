import React, { useEffect, useRef, useState } from "react";

interface IDropdownMenu {
    isOpen: boolean;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    onClose: (e: React.MouseEvent) => void;
}

export default function DropdownMenu({ isOpen, onEdit, onDelete, onClose }: IDropdownMenu) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsActive(true);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isActive) {
                const dropdown = document.querySelector('.dropdown-menu');
                if (dropdown && !dropdown.contains(e.target as Node)) {
                    onClose(e as unknown as React.MouseEvent);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActive, onClose]);

    if (!isOpen) return null;


    return (
        <div className="absolute top-10 right-2 shadow-md rounded-md w-2/4 z-20 bg-gray-700 p-2 dropdown-menu">
            <ul className="flex flex-col space-y-2">
                <li onClick={onEdit} className="p-1 rounded-md hover:bg-gray-600" >Editar</li>
                <li onClick={onDelete} className="p-1 rounded-md hover:bg-gray-600" >Eliminar</li>
            </ul>
        </div>
    )
}