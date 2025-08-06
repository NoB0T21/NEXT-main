
import { Story } from '@/Types/types'
import React from 'react';
import Link from 'next/link';

const StoryBar = ({stories}:{stories:Story[]}) => {
  
  return (
    <div className='w-full text-sm mb-0.5 h-25'>
      Stories
      <div className='flex mt-1 gap-3 h-full'>
        <Link href={'/story/ownview'} className='space-y-1.5 flex flex-col items-center'>
          <div className='block content-center border rounded-full size-10 text-[#2EF6FF] text-2xl text-center align-middle'>+</div>
          <p className='text-[#b0bec5] text-sm'>Your story</p>
        </Link>
        <div className='flex gap-3 w-[90%] h-full overflow-x-auto'>
          {stories.map((story:Story)=>(
            <Link key={story.id} href={'/story/view'} className='space-y-1 w-15'>
              <img src={story.picture} className='block content-center border-2 rounded-full size-11 text-[#2EF6FF]'/>
              <p className='text-[#b0bec5] text-sm'>{story.name.split(' ')[0]}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoryBar
