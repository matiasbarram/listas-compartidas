"use client"

import { createContext, useState } from "react"
import { GroupInfoResponse, ProviderProps } from "../../types"

interface GroupContextProps {
    group: GroupInfoResponse;
    setGroup: React.Dispatch<React.SetStateAction<GroupInfoResponse>>;
}

export const GroupContext = createContext<GroupContextProps>({} as GroupContextProps)

export default function GroupProvider({ children }: ProviderProps) {
    const [group, setGroup] = useState<GroupInfoResponse>({} as GroupInfoResponse)
    return (
        <GroupContext.Provider value={{ group, setGroup }}>
            {children}
        </GroupContext.Provider>
    )
}