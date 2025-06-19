import Header from '@/components/navigation/Header'
import MobileNav from '@/components/navigation/MobileNav'
import Sidebar from '@/components/navigation/Sidebar'
import React from 'react'

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='flex h-screen'>
        <div className='hidden sm:flex'><Sidebar/></div>
        <section className='flex flex-col h-full flex-1 pb-5'>
            <div className='flex sm:hidden'><MobileNav/> </div>
            <div className='hidden sm:flex w-full'><Header/></div>
            <div className='h-full'>{children}</div>
        </section>
    </main>
  )
}

export default Layout
