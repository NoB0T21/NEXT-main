import React from 'react'
import Image from 'next/image'

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className=' flex min-h-screen'>
        <section className='bg-indigo-500 w-1/3 hidden lg:flex flex-col p-10 gap-8 rounded-r-xl'>
            <div className='flex justify-start items-center gap-2'>
                <Image src='/Images/Logo.png' alt='Logo' width={100} height={100} className='h-auto'/>
                <h2 className='font-semibold text-3xl mb-3'>ByteBox</h2>
            </div>
            <div className='flex flex-col gap-5'>
                <h1 className=' text-4xl font-black'>Manage your files the best way</h1>
                <h5>Awesome, we've created the perfect place for you to store all your documents</h5>
            </div>
            <div className='flex justify-center hover:-rotate-5 hover:scale-120 transition-all duration-300 ease-in-out'>
                <Image src='/files.png' alt='Logo' width={200} height={200} className='h-auto'/>
            </div>
        </section>
      <div className='flex flex-1 flex-col lg:justify-center p-4 py-10 lg:p-10 lg:py-0 items-center'>
        <div className='flex lg:hidden justify-center items-center gap-2'>
            <Image src='/Images/Logo.png' alt='Logo' width={100} height={100} className='h-auto'/>
            <h2 className='font-bold text-4xl mb-3'>ByteBox</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout
