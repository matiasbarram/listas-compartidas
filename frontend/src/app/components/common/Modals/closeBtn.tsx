import { XMarkIcon } from "@heroicons/react/24/solid";

export function CloseBtn({ closeModal }: { closeModal: () => void }) {
    return (
        <button
            type="button"
            aria-label="Close panel"
            className="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-500"
            onClick={closeModal}
        >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />

        </button>
    )
}