import Image from 'next/image'
import React from 'react'

interface User {
    picture:string,
    posts:number|undefined,
    follower:number,
    following:number
}

const ProfileData = ({picture,posts,follower,following}:User) => {
  return (
    <div className='flex justify-between sm:justify-start items-center sm:gap-6 bg-[rgba(84,84,84,0.4)] backdrop-blur-5xl px-5 rounded-2xl w-full sm:w-90 lg:w-100 h-20'>
        <Image className='rounded-full size-18' src={picture} alt='profile' width={720} height={720}/>
        <div className='flex flex-col justify-center h-18'>
          <h3 className='font-semibold lg:text-xl'>{posts}</h3>
          <p className='lg:text-xl'>posts</p>
        </div>
        <div className='flex flex-col justify-center h-18'>
          <h2 className='font-semibold lg:text-xl'>{follower}</h2>
          <p className='lg:text-xl'>followers</p>
        </div>
        <div className='flex flex-col justify-center h-18'>
          <h2 className='font-semibold lg:text-xl'>{following}</h2>
          <p className='lg:text-xl'>followings</p>
        </div>
    </div>
  )
}

export default ProfileData
