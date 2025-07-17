'use client'

import { getfollowinguser } from "@/queries/Queries"
import { api } from "@/utils/api";
import { useLazyQuery } from "@apollo/client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"

interface Following{
    followinglist:string[],
    id:string
}
interface User {
  id: string,
  name: string,
  picture: string,
  follower:{
    count: string[]
  }
}
const Following = ({user}:any) => {
  const token = Cookies.get('token');
  const userID = Cookies.get('user') || '';
  const [following, setFollowing ] = useState<string[]>(user.follower.count)

    const followuser = async ({userId}:{userId:string}) => {    
        if(!token){
          return
        }
                 const data = await api.get(`/post/follow/${userId}`,
                   {
                     headers: {
                       Authorization: `Bearer ${token}`,
                     },
                     withCredentials: true,
                   }
                 );
                 if(data.status === 200) {
                   const currentLikes = Array.isArray(following) ? following : [];
                   const index = currentLikes.indexOf(userID);
                   let updatedFollow;
           
                   if (index === -1) {
                     updatedFollow = [...currentLikes, userID]; // Add like
                     //setLikeCount(prev => prev + 1);
                   } else {
                     updatedFollow = currentLikes.filter(id => id !== userID); // Remove like
                     //setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
                   }
           
                   setFollowing(updatedFollow);
                 }
             }

  return (
        <div key={user.id} className="bg-zinc-900 px-7 rounded-md w-full h-15 overflow-hidden">
                    <div className="flex justify-between items-center w-full h-full">
                        <div className="flex items-center gap-4 h-full">
                            <Image
                                src={user.picture}
                                alt="Post"
                                width={700}
                                height={700}
                                className="bg-black rounded-full size-12 object-contain md:object-cover"
                            />
                            {user.name}
                        </div>
                        <div className="px-2 border-1 rounded-md" onClick={()=>followuser({userId:user.id})}>{following.includes(userID)?'Following':'Follow'}</div>
                    </div>
                </div>
  )
}

export default Following
