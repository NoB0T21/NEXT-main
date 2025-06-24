'use client'
import { files } from "@/Types"
import { api } from "@/utils/api"
import Cookies from "js-cookie"

const ConfermCard =  ({lable,file}:{lable:string,file:files}) => {
    const token = Cookies.get("token") || "";
    const handleDelete = async (fileID:string) => {
        if(fileID!==file._id)return

        const response = await api.delete(`/file/delete/${fileID}`,{
            headers: {
                Authorization: `Bearer ${token}`,
              },
          withCredentials: true
        })
    }
  return (
    <>
        <div className="w-full h-full p-3 flex text-[1.2rem] flex-col gap-5 items-center">
            {lable==='Rename' && <>
                <input className="px-4 p-2 mx-2  bg-zinc-600 rounded-full w-full" type="text" name="name" value={file.originalname} />
                <div className="bg-purple-600 px-5 py-1 flex justify-center items-center rounded-full">save</div>
            </>}
            {lable==='Delete' && <>
                <div className=" text-[1.2rem] px-4 font-light">Are you soure you want move <b className="font-bold">{file.originalname}</b> file to Trash?</div>
                <div onClick={()=>handleDelete(file._id)} className="bg-red-500 w-25 flex justify-center items-center rounded-full">Move</div>
            </>}
        </div>
    </>
  )
}

export default ConfermCard
