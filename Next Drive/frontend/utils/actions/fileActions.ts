
import axios from "axios"
import { api } from "../api"

export const getFiles = async ({ token }: { token: string }) => {
    const files = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/file/getfile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    })
    return files.data.file
}