interface IButtonProps {
    children: React.ReactNode
    type?: "button" | "submit" | "reset" | "circle"
    onClick?: () => void
}

export default function Button({ children, type, onClick }: IButtonProps) {
    const styles = {
        button: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-2 rounded-md flex items-center justify-center",
        submit: "bg-indigo-600 hover:bg-indigo-500 mt-4 px-4 py-2 text-white rounded-md  focus:outline-none focus:bg-indigo-500 w-full",
        reset: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-2 rounded-md flex items-center justify-center",
        circle: "bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-2 rounded-full flex items-center justify-center h-16 w-16",
    }
    return (
        <button className={styles[type || "button"]} onClick={onClick}>
            {children}
        </button>
    )
}
