'use client'
import React, { useEffect, useState } from 'react'
import {Searchbtn} from './icon/Icons'
import Cookies from 'js-cookie'
import { SearchFiles } from '@/utils/actions/fileActions'
import { usePathname, useRouter } from 'next/navigation'
import { files } from '@/Types'
import { getFileType } from '@/utils/utils'

const Search = () => {
  const token = Cookies.get('token') || ''
  const route = useRouter()
  const path = usePathname()
  const [search,setSearch] = useState('')
  const [result,setResult] =useState<files[]>([])
  const [type,setType] = useState('')

  useEffect(()=>{
    if (!search) {
    setResult([]);
    return;
  }
   const delayDebounce = setTimeout(() => {
    const fetch = async () => {
      const res = await SearchFiles({token:token, query:search})
      setResult(res)
    };

    fetch();
  }, 300);
  return () => clearTimeout(delayDebounce);
  },[search])

  const handleSubmit = async () => {
    setResult([])
    route.push(`${type}?q=${search}`)
  }
  const handleSubmit2 = async ({types,searchs}:{types:string,searchs:string}) => {
    setResult([])
    route.push(`/${types==='document'?'Documents'
            :`${types==='image'?'Images'
            :`${types==='video'?'Videos'
            :`${types==='other'?'Others'
            :``}`}`}`}?q=${searchs}`)
  }
  return (
    <div className='w-100 lg:w-2/3'>
      <div className='flex items-center gap-4 w-full'>
        <button onClick={()=>handleSubmit()} className='size-6'>
          <Searchbtn/>
        </button>
        <input placeholder='Search' value={search} onChange={(e)=>{setSearch(e.target.value);setType(path)}} type="text" className='bg-zinc-700 p-2 px-5 rounded-full outline-none w-full h-full' />
      </div>
      {result.length<=0?'':<>
        <div className='top-18 absolute bg-zinc-700 p-4 rounded-xl w-100 lg:w-2/3 h-auto min-h-25'>
        {result.map((file)=>{
          const {type} = getFileType(file.originalname)
          return(<>
          <div onClick={()=>{handleSubmit2({types:type,searchs:file.originalname})}} className='flex flex-col'>{file.originalname}</div>
        </>)})}
        </div>
      </>}
    </div>
  )
}

export default Search
