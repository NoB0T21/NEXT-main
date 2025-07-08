'use client'
import { getpostpageintion } from '@/queries/Queries';
import {useLazyQuery} from '@apollo/client'
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Posts {
  id: string
  pictureURL: string
  owner: string
}

const Userprofile = ({userId}:{userId:string}) => {
  const [posts,setPosts] = useState<Posts[]>([]);
  const [skip, setSkip] = useState(0);
  const [show, setShow] = useState(false);
  const [getuserPost] = useLazyQuery(getpostpageintion)
    
  const fetchMore = async () => {
    const { data } = await getuserPost({
      variables: {
        owner: userId,
        offset: skip*8,
        limit: 8,
      },
    })

    if (data?.posts?.length) {
      setPosts((prev) => {
        const merged = [...prev, ...data.posts]
        const unique = Array.from(new Map(merged.map((p) => [p.id, p])).values())
        return unique
      })
    }
  }

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
     if (scrollTop + clientHeight >= scrollHeight - 100) {
       setSkip(prev => prev + 1);
     }
   };

  useEffect(() => {
       fetchMore();
   }, [skip]);

  return (
    <>
      {!show && <div onScroll={handleScroll} className="gap-4 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-5 w-full h-2/3 overflow-scroll">
        {posts.map((f:any)=>(
          <div key={f.id} onClick={()=>setShow(true)} className="bg-[rgba(84,84,84,0.6)] md:bg-[rgba(84,84,84,0.4)] backdrop-blur-xl rounded-md w-full h-70 overflow-hidden">
        
                    <div className="w-full h-full">
                      <Image
                        src={f.pictureURL}
                        alt="Post"
                        width={100}
                        height={100}
                        className="bg-black rounded-md w-full h-full object-contain md:object-cover"
                        />
            </div>
          </div>
        ))} 
      </div>}
      {show && 
      <div onScroll={handleScroll} className="gap-4 grid mt-5 w-full h-2/3 overflow-scroll">
        {posts.map((f:any)=>(
          <div key={f.id} className="bg-[rgba(84,84,84,0.6)] md:bg-[rgba(84,84,84,0.4)] backdrop-blur-xl rounded-md w-full h-70 overflow-hidden">
        
                    <div className="w-full h-full">
                      <Image
                        src={f.pictureURL}
                        alt="Post"
                        width={100}
                        height={100}
                        className="bg-black rounded-md w-full h-full object-contain md:object-cover"
                        />
            </div>
          </div>
        ))} 
      </div>}
    </>
  )
}

export default Userprofile
