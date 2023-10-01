import { ISearchEmail } from "../../../../../../types";

interface EmailDropdownProps {
    emails: ISearchEmail[];
    handleAddEmail: (email: string) => void;
    clean: (value: string) => void;
}

export const EmailDropdown: React.FC<EmailDropdownProps> = ({ emails, handleAddEmail, clean }) => {
    return (
        <ul className="absolute z-10 top-full rounded shadow-lg w-full bg-zinc-600 bg-opacity-95">
            {emails.map((email, index) => (
                <li
                    key={index}
                    className="p-2 text-sm cursor-pointer hover:bg-indigo-100"
                    onClick={() => {
                        handleAddEmail(email.email);
                        clean("");
                    }
                    }
                >
                    {email.email}
                    <small className="text-gray-500"> {email.name}</small>
                </li>
            ))}
        </ul>
    );
}