'use client'
import { AnimatePresence, motion } from "motion/react"
import { files } from '@/Types'
import { actionDropdown } from "@/utils"
import Items from './Items'
import React, { useState } from "react"
import { Menu } from "../icon/Icons"
import { api } from "@/utils/api"
import Cookies from "js-cookie"

const fileDropdown = ({file}:{file: files}) => {
  const token = Cookies.get('token')
  const [showDiv,setShowDiv] = useState(false)
  const [showtypeDiv,setShowTypeDiv] = useState(true)
  const [typeDiv,setTypeDiv] = useState('')
  const [fileName,setFileName] = useState(file.originalname)

  const handleRname =  async(e: React.FormEvent) => {
    e.preventDefault()
    const extension = file.originalname.split('.')[1]
    const name = `${fileName}.${extension}`
    const response = await api.put(`/file/rename/${file._id}`,name,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    })
  }

  return (
    <>
    <div>
      <div onClick={()=>setShowDiv(true)} className=" ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 size-6"><Menu/></div>
      {showDiv&&<>
        <AnimatePresence initial={showDiv}>{file && <motion.div 
        initial={{ opacity: 0,y:-100}}
        animate={{opacity:1,y:0}}
        exit={{opacity:0,y:-100}}
        className='absolute backdrop-blur-xs w-full h-full left-0 top-0 flex justify-center items-center'>
          <div className="bg-zinc-800 w-90 p-4 rounded-xl">
              {showtypeDiv?<><div className="flex justify-between gap-2">
                <div className='text-[1.2rem] truncate mb-3 font-semibold'>{file.originalname}</div>
                <div onClick={()=>{setShowDiv(false)}}>x</div>
              </div>
            {actionDropdown.map((items)=>(
              <div className="flex flex-col gap-3" onClick={()=>{setShowTypeDiv(false);setTypeDiv(items.lable)}} ><Items key={items.value} lable={items.lable} url={file.imageURL} file={file}/></div>
            ))}</>:<>
              <div className="flex justify-between gap-2">
                <div className='text-[1.2rem] truncate mb-3 font-semibold'>{file.originalname}</div>
              </div>
              <div className="w-full h-full p-3 flex text-[1.2rem] flex-col gap-5 items-center">
                {typeDiv==='Rename' && <>
                    <input className="px-4 p-2 mx-2  bg-zinc-600 rounded-full w-full" type="text" name="name" onChange={(e)=>setFileName(e.target.value)} value={fileName} />
                    <div className="flex gap-3">
                      <div className="bg-zinc-600 px-5 py-1 flex justify-center items-center rounded-full" onClick={()=>{setShowTypeDiv(true)}}>cancle</div>
                      <button onSubmit={(e)=>handleRname(e)} className="bg-purple-600 px-5 py-1 flex justify-center items-center rounded-full">save</button>
                    </div>
                </>}
                {typeDiv==='Delete' && <>
                    <div className=" text-[1.2rem] px-4 font-light">Are you soure you want move <b className="font-bold">{file.originalname}</b> file to Trash?</div>
                    <div className="flex gap-3">
                      <div className="bg-zinc-600 px-5 py-1 flex justify-center items-center rounded-full" onClick={()=>{setShowTypeDiv(true)}}>cancle</div>
                      <div className="bg-red-500 w-25 flex justify-center items-center rounded-full">Move</div>
                    </div>
                </>}
              </div>
            </>}
          </div>
          </motion.div>}</AnimatePresence>
        </>}
      </div>
    </>
  )
}

export default fileDropdown
