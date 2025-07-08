'use client'

import FileCard from '@/components/card/FileCard'
import { useUser } from '@/context/context'


const page =  () => {
  const profiledata = useUser()

  return (
    <div className="gap-4 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full h-full">
      {profiledata.posts.map((f:any)=>(
        <FileCard key={f.id} post={f} owner={profiledata.owner}/>
      ))}
    </div>
  )
}

export default page
