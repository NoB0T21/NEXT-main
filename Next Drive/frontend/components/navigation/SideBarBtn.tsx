'use client'

import { usePathname } from "next/navigation"
import { Dashboard,DashboardFill, Documents, DocumentsFill, Images, ImagesFill, Media, MediaFill, Other, OtherFill } from "../icon/Icons"
import Link from "next/link"

const SideBarBtn = ({pathname,name}:{pathname: string, name: string}) => {
    const path = usePathname()
  return (
    <Link href={`/${name}`} className={`${path===pathname?'bg-purple-900':'hover:bg-zinc-800'}  flex justify-start sm:justify-center lg:justify-start h-full gap-2 rounded-3xl sm:rounded-xl lg:rounded-3xl items-center px-6 sm:px-0 lg:px-6 w-full transition-all duration-200 ease-in-out`}>
        <div className=" flex justify-center items-center w-5 lg:w-6 h-6 transition-(w) duration-200 ease-in-out">
            {name==='Dashboard' && (path===pathname?<DashboardFill/>:<Dashboard/>)}
            {name==='Documents' && (path===pathname?<DocumentsFill/>:<Documents/>)}
            {name==='Images' && (path===pathname?<ImagesFill/>:<Images/>)}
            {name==='Media' && (path===pathname?<MediaFill/>:<Media/>)}
            {name==='Other' && (path===pathname?<OtherFill/>:<Other/>)}
        </div>
        <div className="flex sm:hidden lg:flex">{name}</div>
    </Link>
  )
}

export default SideBarBtn
