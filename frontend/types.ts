import { Session } from "next-auth";
import { SessionContextValue } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ComponentType, Dispatch, SetStateAction } from "react";
import { z } from "zod";


export interface PageProps {
    slug: string;
}

export interface IListKeysProps {
    slug: string;
    listId: string;
}

export interface NestedParams {
    params: IListKeysProps;
}
export interface IGroupParams {
    params: PageProps;
}

export interface IList {
    id: string,
    name: string,
    description: string,
}

export interface IFormData {
    email: string;
    password: string;
}

export interface IUserData {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface ILoginApiResponse {
    token: string;
    user: IUserData;
}



export interface IGroup {
    id: number;
    name: string;
    description: string;
    users: IUserData[];
}

export interface IUserGroupsData {
    groups: IGroup[];
}

export interface ISearchEmail {
    email: string;
    name: string;
}

export interface ISearchEmailResponse {
    users: ISearchEmail[];
}

export interface IActionBtn {
    label: string,
    Icon: ComponentType,
    bgColor: string,
    bgColorHover: string,
}

export interface IListItem {
    id: number;
    description: string;
    is_completed: boolean;
    quantity: string;
    notes: string;
    priority: string;
    due_date: string;
    creation_date: string;
    modified_date: string;
    assigned_to: string;
    reminder: string;
    url: string;
    cost: string;
    location: string;
    recurring: string;
    list_id: number;
}

export interface ICreateItemResponse {
    groupId: number;
    listId: number;
    item: IListItem;
}


export interface IListItemsResponse {
    list: {
        id: number;
        name: string;
        description: string;
        group_id: number;
    }
    items: IListItem[]
}

export interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    session: Session;
    router: AppRouterInstance;
}


export interface INewItem {
    description: string;
    quantity: number;
    comments: string;
}

export interface INewList {
    name: string;
    description: string;
}


export interface ICompleted {
    status: "completed" | "uncompleted" | "deleted"
}

export interface IMarkAsCompletedProps {
    isCompleted: boolean;
    params: IListKeysProps;
    session: Session;
    item: IListItem;
}

export interface ICreateProduct {
    session: SessionContextValue;
    url: string;
    newItem: INewItem | INewList;
    router: any;
    closeModal: () => void;
    setNewItem: any
}

export interface IApiResponse<T> {
    ok: boolean;
    data?: T;
    error?: string;
    status?: number;
}

export interface IApiConfig {
    url: string;
    method: string;
    token?: string;
    body?: any;
}

export interface IModalField {
    type: string,
    name: string,
    label: string,
    placeholder: string,
    required?: boolean,
    onChange: (e: any) => void
}


export interface KeysWithSession extends IListKeysProps {
    session: Session;
}


export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Al menos 8 caracteres"),
});

export const registerSchema = z.object({
    username: z.string().min(3, "Al menos 3 caracteres"),
    email: z.string().email(),
    password: z.string().min(8, "Al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Al menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["password"],
});

export type ISignUpFormValues = z.infer<typeof signUpSchema>;
export type ILoginFormValues = z.infer<typeof registerSchema>;

export const schemaItem = z.object({
    description: z.string().nonempty("Nombre es obligatorio"),
    quantity: z.number().int("Cantidad debe ser un número entero").min(1, "Cantidad mínima es 1").max(100, "Cantidad máxima es 100"),
    comments: z.string().optional(),
});

export const schemaList = z.object({
    name: z.string().nonempty("Nombre es obligatorio"),
    description: z.string().nonempty("Descripción es obligatorio")
});

export type INewItemValues = z.infer<typeof schemaItem>;
export type INewListValues = z.infer<typeof schemaList>;