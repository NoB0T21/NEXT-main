'use client'
import { useState } from 'react'
import User from './User'
import SideBarBtn from "./SideBarBtn"
import FileUpload from '../FileUpload'
import Logoutbtn from './Logoutbtn'
import { useAppContext } from '@/context'

const MobileNavSidebar = () => {  
    const {user} = useAppContext()
    const{_id} = user
    const [show,setShow] = useState(false)
  return (
    <>
      <div onClick={()=>setShow(!show)} className='flex justify-center items-center m-1 w-5'>=</div>
      <div className={`${show?'flex ':'hidden'} absolute top-0 right-0 h-screen w-full  backdrop-blur-xs justify-end transition-all duration-300 ease-in-out`}>
        <div className='flex flex-col gap-2 bg-zinc-900 p-3 rounded-l-xl w-3/4'>
            <div className='mb-3' onClick={()=>setShow(!show)}>X</div>
            <User/>
            <div className="flex flex-col gap-2 py-4 w-full">
                <div className="w-full h-10"><SideBarBtn pathname={'/'} name={'Dashboard'}/></div>
                <div className="w-full h-10"><SideBarBtn pathname={'/Documents'} name={'Documents'}/></div>
                <div className="w-full h-10"><SideBarBtn pathname={'/Images'} name={'Images'}/></div>
                <div className="w-full h-10"><SideBarBtn pathname={'/Media'} name={'Medias'}/></div>
                <div className="w-full h-10"><SideBarBtn pathname={'/Other'} name={'Others'}/></div>
            </div>
            <FileUpload ownerId={_id}/>
            <Logoutbtn/>
        </div>
      </div>
    </>
  )
}

export default MobileNavSidebar
