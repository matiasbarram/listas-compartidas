export function Checkbox({ postId, selected }: { postId: number, selected: boolean }) {
    return (
        <>
            <label htmlFor={`checkbox-${postId}`} className="sr-only">Select</label>
            <input
                name={`checkbox-${postId}`}
                type="checkbox"
                checked={selected}
                readOnly
                className="!w-6 !h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        </>
    )
}