import React from 'react';

interface NumberButtonProps {
    onClick: () => void;
    text: string;
    type: "l" | "r";
}

function NumberButton({ onClick, text, type }: NumberButtonProps) {
    const roundedType = type === "l" ? "rounded-l-md" : "rounded-r-md";
    return (
        <button
            data-action={type}
            type="button"
            onClick={onClick}
            className={`bg-indigo-600 text-white hover:bg-indigo-500 w-20 rounded-md cursor-pointer`}
        >
            <span className="m-auto text-2xl font-thin">{text}</span>
        </button>
    );
}

export default NumberButton;
