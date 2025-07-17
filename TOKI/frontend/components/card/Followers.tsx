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
  picture: string
  following:{
    count: string[]
  }
}
const Followers = ({followinglist,id}:Following) => {
    const token = Cookies.get('token');
  const userID = Cookies.get('user') || '';
    const router = useRouter();
    const [getuserList] = useLazyQuery(getfollowinguser)
    const [hasMore, setHasMore] = useState(true);
    const [users,setUsers] = useState<User[]>([]);
    const [skip, setSkip] = useState(0);
    const [following, setFollowing ] = useState<string[]>()
    if(followinglist.length===0){
        return(<div className="font-bold text-2xl">Go get life on one follows you</div>)
    }
    const fetchMore = async () => {
    if (!hasMore) return;
    const { data } = await getuserList({
      variables: {
        userIds: followinglist,
        offset: skip*10,
        limit: 10,
      },
    })
    const newPosts = data?.followinguser || [];
    if (newPosts.length < 10 ) {
      setHasMore(false); // No more posts to fetch
    }
    if (newPosts.length) {
      setUsers((prev) => {
        const merged = [...prev, ...data.followinguser]; // Merge old and new posts
        const unique = Array.from(
          new Map(merged.map((p) => [p.id, p])).values() // Deduplicate by post.id
        );
        return unique; // Set state with only unique posts
      });
    }
    router.refresh();
  }

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
        setSkip(prev => prev + 1);
      }
    };
    
    useEffect(() => {
      fetchMore();
    }, [skip]);

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
    <div className="py-10 w-110 lg:w-150 h-full">
      <div className="flex flex-col items-center gap-7 bg-zinc-700 p-3 rounded-2xl w-full h-full">
        <h1 className="font-semibold text-2xl">Follower</h1>
        <div onScroll={handleScroll} className="flex flex-col gap-3 w-full h-full">
            {users.map((user: User)=>(
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
                        <div className="px-2 border-1 rounded-md" onClick={()=>followuser({userId:user.id})}>{user.following.count?.includes(userID)?'Following':'Follow'}</div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Followers
