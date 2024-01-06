import { ChangeEventHandler, FormEventHandler } from "react";
import Label from "../Label";

interface InputProps {
    type: string;
    name: string;
    id: string;
    placeholder: string;
    tag?: "input" | "textarea";
    labelText: string;
    inputChangeFn?: ChangeEventHandler<HTMLInputElement>;
    textareaChangeFn?: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function Input({
    type,
    name,
    id,
    placeholder,
    tag,
    inputChangeFn,
    textareaChangeFn,
    labelText
}: InputProps) {
    const posibleTags = ["input", "textarea"];
    const Tag = tag || "input";
    if (!posibleTags.includes(Tag)) {
        throw new Error(`Tag ${Tag} is not supported`);
    }

    return (
        <div className="mt-2">
            <Label htmlFor={name} text={labelText} />
            {Tag === "input" ? (
                <input
                    type={type}
                    name={name}
                    id={id}
                    className="input-field"
                    placeholder={placeholder}
                    onChange={inputChangeFn}
                    required
                />
            ) : (
                <textarea
                    name={name}
                    id={id}
                    className="input-field"
                    placeholder={placeholder}
                    onChange={textareaChangeFn}
                    required
                />
            )}
        </div>
    );

}