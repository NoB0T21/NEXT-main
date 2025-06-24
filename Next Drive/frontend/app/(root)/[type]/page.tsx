import { getFiles } from '@/utils/actions/fileActions';
import ShortFile from '@/components/ShortFile';
import React from 'react'
import { cookies} from 'next/headers';
import {SearchParamProps,files} from '@/Types/index'
import FileCard from '@/components/card/FileCard';
import { getFileSize, getFileType } from '@/utils/utils';
import TotalSize from '@/components/card/TotalSize';

const page = async ({params}:SearchParamProps) => {
  const types = ((await params)?.type as string) || '';
  
  const token = (await cookies()).get('token')?.value || '';
  const file = await getFiles({token: token})
  let sum:any =0; 
  const size =await file.forEach((f: files)=>{
    const {type} = getFileType(f.originalname)
    if(type===types.toLowerCase().slice(0,-1)){return sum += f.fileSize}
  },0)
  const total = getFileSize(sum)
  return (
    <div className='flex w-full max-w-7xl flex-col items-center gap-8'>
      <section className='w-full'>
        {types}
        <div className='flex my-3 h-[10%] justify-between text-sm font-medium'>
          <TotalSize size={total}/>
          <ShortFile />
        </div>
      </section>
        {file.length >0 ? 
        <div className='grid w-full h-50 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {file.map((f: files)=>{
            const {type,extension} = getFileType(f.originalname)
            return(
              type===types.toLowerCase().slice(0,-1) && <>
                <FileCard key={f.path}  file={f} types={type} extrnsion={extension}/>
              </>
            )
          })}
          </div>:<p>No files</p> }
    </div>
  )
}

export default page
