'use server'
import { api } from "@/utils/api";
import Cookies from "js-cookie";

interface form {
    owner: string;
    files: File
}

export const uploadFile = async ({file,ownerID}:{file:File, ownerID: string}) => {
    const formData: form = {
        owner: ownerID,
        files: file
    }
    if(!file){
        try {
            const token:string = Cookies.get('token') || ''
            const response = await api.post('/file/upload',formData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            })
            if(response.status!==200)return false

            return true
        } catch (error) {
            return false
        }
    }
    return true
}