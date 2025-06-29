import { files } from '@/Types'
import Image from 'next/image'
import React from 'react'
import { DocumentsFill, ImagesFill, MediaFill, OtherFill } from '../icon/Icons'
import { getFileSize, getFileType } from '@/utils/utils'

const TypeFile = async ({file}:{file:files[]}) => {
    let Documentsum:any =0;
    let videosum:any =0;
    let imagesum:any =0;
    let othersum:any =0;
    let dd = await file.forEach((f: files)=>{
        const {type} = getFileType(f.originalname)
        if(type==='document'){return Documentsum += f.fileSize}
      },0)
    dd = await file.forEach((f: files)=>{
        const {type} = getFileType(f.originalname)
        if(type==='video'){return videosum += f.fileSize}
      },0)
    dd = await file.forEach((f: files)=>{
        const {type} = getFileType(f.originalname)
        if(type==='image'){return imagesum += f.fileSize}
      },0)
    dd = await file.forEach((f: files)=>{
        const {type} = getFileType(f.originalname)
        if(type==='other'){return othersum += f.fileSize}
      },0)
    const Document = getFileSize(Documentsum)
    const video = getFileSize(videosum)
    const image = getFileSize(imagesum)
    const other = getFileSize(othersum)
  return (
    <div className='gap-4 grid lg:grid-cols-4 sm:grid-rows-4 h-full'>
        <div className='lg:col-span-2 row-span-2'>
            <div className='flex flex-col gap-2 bg-[#0000002c] px-3 py-2 rounded-xl w-full h-full cursor-pointer'>
                <div className='flex justify-between items-center w-full'>
                    <div className='bg-blue-600 shadow-amber-400 lg:p-5 rounded-full size-20 lg:size-25'>
                        <DocumentsFill/>
                    </div>
                    <p className='w-full font-medium text-xl'>{Document}</p>
                </div>
                <div className='flex justify-center w-full font-semibold text-2xl'>Documents</div>
            </div>
        </div>
        <div className='lg:col-span-2 row-span-2'>
            <div className='flex flex-col gap-2 bg-[#0000002c] px-3 py-2 rounded-xl w-full h-full cursor-pointer'>
                <div className='flex justify-between items-center w-full'>
                    <div className='bg-orange-500 shadow-amber-400 p-3 lg:p-5 rounded-full size-20 lg:size-25'>
                        <MediaFill/>
                    </div>
                    <p className='w-full font-medium text-xl'>{video}</p>
                </div>
                <div className='flex justify-center w-full font-semibold text-2xl'>Media</div>
            </div>
        </div>
        <div className='lg:col-span-2 row-span-2'>
            <div className='flex flex-col gap-2 bg-[#0000002c] px-3 py-2 rounded-xl w-full h-full cursor-pointer'>
                <div className='flex justify-between items-center w-full'>
                    <div className='bg-blue-600 shadow-amber-400 p-3 lg:p-5 rounded-full size-20 lg:size-25'>
                        <ImagesFill/>
                    </div>
                    <p className='w-full font-medium text-xl'>{image}</p>
                </div>
                <div className='flex justify-center w-full font-semibold text-2xl'>Images</div>
            </div>
        </div>
        <div className='lg:col-span-2 row-span-2'>
            <div className='flex flex-col gap-2 bg-[#0000002c] px-3 py-2 rounded-xl w-full h-full cursor-pointer'>
                <div className='flex justify-between items-center w-full'>
                    <div className='bg-blue-600 shadow-amber-400 p-3 lg:p-5 rounded-full size-20 lg:size-25'>
                        <OtherFill/>
                    </div>
                    <p className='w-full font-medium text-xl'>{other}</p>
                </div>
                <div className='flex justify-center w-full font-semibold text-2xl'>Others</div>
            </div>
        </div>
    </div>
  )
}

export default TypeFile