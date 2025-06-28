
import axios from "axios"
import { api } from "../api"
import { redirect } from "next/navigation"

export const getFiles = async ({ token }: { token: string }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/file/getfile`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        next: {
            tags: ['files'], 
            },
    })
    const files = await res.json()
    if(files.message==='Invalid or expired token'){
       redirect('/sign-in');
    }
    return files.file
}

export const getShareuser = async ({ token }: { token: string}) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/file/getfile`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        next: {
            tags: ['Share'], 
            },
    })
    const files = await res.json()
    if(files.message==='Invalid or expired token'){
       redirect('/sign-in');
    }
    return files.file
}

export const SearchFiles = async ({token,query}:{token:string,query:string}) => {
    const files = await api.get(`/file/getfile?q=${query}`,{
        headers:{
            Authorization:`Bearer ${token}`,
        },
        withCredentials:true
    })
    return files.data.file
}