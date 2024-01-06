export function Checkbox({ postId, selected }: { postId: number, selected: boolean }) {
    return (
        <>
            <label htmlFor={`checkbox-${postId}`} className="sr-only">Select</label>
            <input
                type="checkbox"
                name={`checkbox-${postId}`}
                id={`checkbox-${postId}`}
                readOnly
                checked={selected}
                className="!w-6 !h-6 text-blue-600  rounded ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
        </>
    )
}