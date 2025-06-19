import React from 'react'
import Image from 'next/image';

interface Props {
    type: string;
    extension: string;
    url: string;
}

const Thumbnail = ({type,extension,url=''}:Props) => {
    const isImage = type==="image" && extension!=="svg"
  return (
    <figure>
      <Image src={isImage? url:'none'} alt='thumble' className=' w-12 h-12 object-cover rounded-full' width={100} height={100}/>
    </figure>
  )
}

export default Thumbnail
