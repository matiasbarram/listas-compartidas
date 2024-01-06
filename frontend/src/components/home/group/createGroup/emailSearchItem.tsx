import { XMarkIcon } from "@heroicons/react/24/solid";

interface EmailItemProps {
    email: string;
    onDelete: () => void;
}

export const EmailItem: React.FC<EmailItemProps> = ({ email, onDelete }) => {
    return (
        <div className="flex flex-row justify-between mt-4 text-sm">
            <p>{email}</p>
            <button
                type="button"
                className="text-red-500"
                onClick={onDelete}
            >
                <XMarkIcon className="h-4 w-4 text-gray-500 " />
            </button>
        </div>
    );
};