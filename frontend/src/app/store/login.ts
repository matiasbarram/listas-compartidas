import { create } from 'zustand'
import { IUserData } from '../../../types';
import { axiosClient } from '../utils/axios';


interface UserStore {
    token: string | null;
    userData: IUserData | null;
    setToken: (token: string) => void;
    setUserData: (userData: IUserData) => void;
    removeToken: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    token: null,
    userData: null,
    setToken: (token: string) => {
        document.cookie = `listas-token=${token}; path=/;`;
        set({ token })
    },
    removeToken: () => {
        document.cookie = `listas-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        set({ token: null })
    },
    setUserData: (userData: IUserData) => set({ userData }),
}))


export default useUserStore;
