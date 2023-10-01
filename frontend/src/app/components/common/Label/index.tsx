interface ILabelProps {
    htmlFor: string;
    text: string;
}

export default function Label({ htmlFor, text }: ILabelProps) {
    return (
        <label className="block text-sm font-medium text-white" htmlFor={htmlFor}>
            {text}
        </label>
    )

}