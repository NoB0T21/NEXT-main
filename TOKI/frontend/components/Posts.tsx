'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Post{
    id:string,
    creator: string,
    title: string,
    message: string,
    tags:string[],
    pictureURL:string,
    createdAt:string,
}

const Posts = ({posts,owner}:{posts : any,owner:string}) => {
    const path = usePathname()
    const postId = path.split('/')[4]
    const [currentIndex, setCurrentIndex] = useState(() =>
        posts.findIndex((post: Post) => post.id === postId)
    );
    const containerRef = useRef<HTMLDivElement>(null)
    const post = posts[currentIndex]
    useEffect(() => {
        if (containerRef.current) {
        const postElement = containerRef.current.children[currentIndex] as HTMLElement
        postElement?.scrollIntoView({ behavior: 'instant', inline: 'start', block: 'nearest' })
        }
    }, [currentIndex])
  return (
    <>
        <div ref={containerRef} className='w-100 h-80 overflow-auto'>
        {posts.map((post:Post)=>(
            <Image key={post.id} className='my-20 size-80' height={100} width={100} alt='pitc' src={post.pictureURL}/>
            ))}
        </div>
    </>
  )
}

export default Posts
