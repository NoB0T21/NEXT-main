'use client'
import { useState } from 'react'
import User from './User'
import SideBarBtn from "./SideBarBtn"
import FileUpload from '../FileUpload'
import Logoutbtn from './Logoutbtn'

const MobileNavSidebar = () => {
    const [show,setShow] = useState(false)
  return (
    <>
      <div onClick={()=>setShow(!show)} className='flex justify-center items-center w-5 m-1'>=</div>
      <div className={`${show?'flex ':'hidden'} absolute top-0 right-0 h-screen w-full  backdrop-blur-xs justify-end transition-all duration-300 ease-in-out`}>
        <div className='bg-zinc-900 rounded-l-xl w-3/4 p-3 gap-2 flex flex-col'>
            <div className='mb-3' onClick={()=>setShow(!show)}>X</div>
            <User/>
            <div className="flex w-full flex-col py-4 gap-2">
                <div className="w-full h-10 "><SideBarBtn pathname={'/'} name={'Dashboard'}/></div>
                <div className="w-full h-10 "><SideBarBtn pathname={'/Documents'} name={'Documents'}/></div>
                <div className="w-full h-10 "><SideBarBtn pathname={'/Images'} name={'Images'}/></div>
                <div className="w-full h-10 "><SideBarBtn pathname={'/Media'} name={'Media'}/></div>
                <div className="w-full h-10 "><SideBarBtn pathname={'/Other'} name={'Other'}/></div>
            </div>
            <FileUpload/>
            <Logoutbtn/>
        </div>
      </div>
    </>
  )
}

export default MobileNavSidebar
