export interface JwtPayload {
    id: number
    name: string
    email: string
    created_at: Date
    updated_at: Date
    icon?: string
}

export interface JwtToken extends JwtPayload {
    iat: number
    exp: number
}

export type DeleteStatus = "completed" | "all" | "incomplete"
