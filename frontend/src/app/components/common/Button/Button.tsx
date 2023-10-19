interface IButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

export default function Button({ children, type, onClick }: IButtonProps) {
    const styles = {
        button: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-2 rounded-md flex items-center justify-center",
        submit: "mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-full",
        reset: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-2 rounded-md flex items-center justify-center"
    }
    return (

        <button className={styles[type || "button"]} onClick={onClick}>
            {children}
        </button>
    )
}