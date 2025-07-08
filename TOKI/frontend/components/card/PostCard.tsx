'use client'
import Image from "next/image"
import Readmore from "../Readmore"
import { Like, LikeFill } from "../Icons"
import { api } from "@/utils/api"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Post{
    id:string,
    pictureURL: string,
    creator:string
    message:string,
    like:{
        like:string[]
    }
}

const PostCard = ({file, profile, name, userID}:{file:Post,profile:string, name:string,userID:string}) => {
    const [like, setLike ] = useState<string[]|null>(file?.like?.like)
    const token = Cookies.get('token');
    const route = useRouter()
    const likePost = async () => {
        
    if(!token){
      return
    }
    const data = await api.get(`/post/like/${file.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    if(data.status === 200) {
      const currentLikes = Array.isArray(like) ? like : [];

      const index = currentLikes.indexOf(userID);
      let updatedLikes;

      if (index === -1) {
        updatedLikes = [...currentLikes, userID]; // Add like
      } else {
        updatedLikes = currentLikes.filter(id => id !== userID); // Remove like
      }
      setLike(updatedLikes);
    }
  }

  return (
    <div key={file.id} className="relative bg-black my-6 rounded-md w-full lg:w-2/3 h-[78vh] overflow-y-auto snap-center scrollbar">
        <div className="w-full h-full">
            <Image
                src={file.pictureURL}
                alt="Post"
                width={3840}
                height={2160}
                className="bg-black p-1 rounded-md w-full h-full object-contain"
            />
        </div>
        <div className="top-0 absolute flex justify-between p-5 w-full h-20">
            <div className="flex justify-start gap-2 w-2/3">
                <Image
                    src={profile}
                    alt="Post"
                    width={720}
                    height={720}
                    className="rounded-full w-10 h-10 object-cover"
                />
                <p className="truncate">{name}</p>
            </div>
            <div>
                {name===file.creator?<p>...</p>:<p>Follow</p>}
            </div>
        </div>
        <div className="bottom-0 absolute p-5 w-full h-20">
            <div onClick={() =>likePost()} className="flex gap-3">
                <div className="flex gap-1"><div className={`size-7 `}>{!like?<Like/>:(like?.includes(userID)?<LikeFill/>:<Like/>)}</div>{!like?0:like.length}</div>
                <div className="flex gap-1"><div className={`size-7`}><LikeFill/></div>{!like?0:like.length}</div>
            </div>
            <div className="">
                <Readmore text={file.message} maxLength={30} />
            </div>
        </div>
    </div>
  )
}

export default PostCard
