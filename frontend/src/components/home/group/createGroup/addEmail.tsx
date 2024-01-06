'use client';

import Label from '@/components/common/Label';
import { API_URL } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ISearchEmail, ISearchEmailResponse } from '../../../../../types';
import { EmailDropdown } from './emailDropdown';
import { EmailItem } from './emailSearchItem';

interface EmailListProps {
  emails: string[];
  setGroup: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      emails: string[];
    }>
  >;
}

export default function EmailList({ emails, setGroup }: EmailListProps) {
  const [typedEmail, setTypedEmail] = useState<string>('');
  const [searchedEmails, setSearchedEmails] = useState<ISearchEmail[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const session = useSession();

  const searchEmails = async (emailTyped: string) => {
    if (emailTyped.trim() === '') {
      setShowDropdown(false);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/private/users/search?email=${emailTyped}`,
        {
          headers: {
            Authorization: `Bearer ${session?.data?.token}`,
          },
        }
      );
      const data: ISearchEmailResponse = await response.json();
      setSearchedEmails(data.users);
      setShowDropdown(data.users.length > 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userEmailTyped = e.target.value;
    setTypedEmail(userEmailTyped);
    searchEmails(userEmailTyped);
  };

  const handleEmailSelect = (email: string) => {
    setTypedEmail(email);
    setShowDropdown(false);
  };

  const handleAddEmail = (emailToAdd: string) => {
    if (emailToAdd.trim() === '') {
      return;
    }
    if (!emails.includes(emailToAdd)) {
      setGroup((prevState) => ({
        ...prevState,
        emails: [...prevState.emails, emailToAdd],
      }));
    }
    setTypedEmail('');
  };

  return (
    <>
      <div className="relative w-full">
        <div className="flex flex-col">
          <Label text={'Emails'} htmlFor={'email'} />
          <input
            name="email"
            id="email"
            placeholder="Email"
            className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md bg-zinc-700 py-2 placeholder-gray-400 placeholder:opacity-75 indent-4"
            value={typedEmail}
            onChange={handleInputChange}
          />
          {showDropdown && (
            <EmailDropdown
              emails={searchedEmails}
              handleAddEmail={(email) => {
                handleAddEmail(email);
              }}
              clean={handleEmailSelect}
            />
          )}
        </div>
      </div>
      <div>
        {emails.map((email, index) => (
          <EmailItem
            key={index}
            email={email}
            onDelete={() => {
              const newEmails = emails.filter((_, i) => i !== index);
              setGroup((prevState) => ({
                ...prevState,
                emails: newEmails,
              }));
            }}
          />
        ))}
      </div>
    </>
  );
}
