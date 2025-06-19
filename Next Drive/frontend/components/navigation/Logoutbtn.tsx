'use client'
 import React from 'react'
import { Logout } from '../icon/Icons'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
 
 const Logoutbtn = () => {
  const router= useRouter()

    const logout = () => {
      localStorage.removeItem('token')
      Cookie.remove('token')
      router.push('/sign-up')
    }

   return (
    <button onClick={logout} className='bg-red-700 hover:bg-red-600 p-1 w-full sm:w-10 h-10 rounded-full mx-2 flex justify-center items-center gap-2'><Logout/><p className='flex sm:hidden'>Logout</p></button>
   )
 }
 
 export default Logoutbtn
 