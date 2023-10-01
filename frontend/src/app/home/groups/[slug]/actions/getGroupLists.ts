import { API_URL } from "@/app/lib/constants"
export const groupLists = async (token: string, slug: string) => {

    try {
        const res = await fetch(`${API_URL}/private/groups/${slug}/lists`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!res.ok) {
            throw new Error('Something went wrong')
        }
        const lists = await res.json()
        return lists
    }
    catch (err) {
        console.error(err)
    }
}
