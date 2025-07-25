'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Following from './card/Following'
import Followers from './card/Followers'
import { getfollowinguser } from '@/queries/Queries'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'

interface User {
    picture:string,
    posts:number|undefined,
    follower:number,
    following:number,
    followinglist:string[],
    followerlist:string[]
    id:string,
}

const ProfileData = ({picture,posts,follower,following,followerlist,followinglist,id}:User) => {
  const [showFlowing, setShowFlowing] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [usersfollowing,setUsersfollowing] = useState<User[]>([]);
      const [getuserList] = useLazyQuery(getfollowinguser)
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
  const router = useRouter();

  const fetchMorefollowing = async () => {
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
        setUsersfollowing((prev) => {
          const merged = [...prev, ...data.followinguser]; // Merge old and new posts
          const unique = Array.from(
            new Map(merged.map((p) => [p.id, p])).values() // Deduplicate by post.id
          );
          return unique; // Set state with only unique posts
        });
      }
      router.refresh();
    }
  
    const handleFollowingScroll = (e: React.UIEvent<HTMLElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
          setSkip(prev => prev + 1);
        }
      };
      
      useEffect(() => {
        fetchMorefollowing();
      }, [skip]);

  return (
    <>
      <div className='flex justify-between sm:justify-start items-center sm:gap-6 bg-[rgba(84,84,84,0.4)] backdrop-blur-5xl px-5 rounded-2xl w-full sm:w-90 lg:w-100 h-20'>
          <Image className='rounded-full size-18' src={picture} alt='profile' width={720} height={720}/>
          <div className='flex flex-col justify-center h-18'>
            <h3 className='font-semibold lg:text-xl'>{posts}</h3>
            <p className='lg:text-xl'>posts</p>
          </div>
          <div onClick={()=>setShowFlower(true)} className='flex flex-col justify-center h-18'>
            <h2 className='font-semibold lg:text-xl'>{follower}</h2>
            <p className='lg:text-xl'>followers</p>
          </div>
          <div onClick={()=>setShowFlowing(true)} className='flex flex-col justify-center h-18'>
            <h2 className='font-semibold lg:text-xl'>{following}</h2>
            <p className='lg:text-xl'>followings</p>
          </div>
      </div>
      {showFlowing && (
        <div className='top-0 left-0 z-6 absolute flex justify-center items-center gap-2 backdrop-blur-sm w-full h-full'>
          <div className='py-10 h-full'><p onClick={()=>setShowFlowing(false)} className='flex justify-center items-center bg-red-500 p-1 rounded-md size-7 text-xl'>X</p></div>
          
          <div className="py-10 w-110 lg:w-150 h-full">
                <div className="flex flex-col items-center gap-7 bg-zinc-700 p-3 rounded-2xl w-full h-full">
                  <h1 className="font-semibold text-2xl">Following</h1>
                  <div onScroll={handleFollowingScroll} className="flex flex-col gap-3 w-full h-full">
                      {usersfollowing.map((user: User)=>(
                          <Following user={user}/>
                      ))}
                  </div>
                </div>
              </div>
        </div>
      )}
      {showFlower && (
        <div className='top-0 left-0 z-6 absolute flex justify-center items-center gap-2 backdrop-blur-sm w-full h-full'>
          <div className='py-10 h-full'><p onClick={()=>setShowFlower(false)} className='flex justify-center items-center bg-red-500 p-1 rounded-md size-7 text-xl'>X</p></div>
          <Followers id={id} followinglist={followerlist}/>
        </div>
      )}
    </>
  )
}

export default ProfileData
