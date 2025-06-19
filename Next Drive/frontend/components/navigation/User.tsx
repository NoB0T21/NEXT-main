'use client'
import { useAppContext } from "@/context"

const User = () => {
    const {user} = useAppContext()
    const {name,email, picture} = user
  return (
    <div className=" flex h-12 gap-2 px-2 sm:p-0 sm:justify-center lg:justify-start items-center rounded-xl sm:rounded-full mt-1 mb-5 bg-purple-900 w-full lg:px-2">
        <div className="w-10 h-10">
            <img src={picture} className=" rounded-full object-cover w-full h-full"/>
        </div>
        <div className="flex sm:hidden lg:flex flex-col text-md font-light justify-center">
          <p>{name}</p>
          <p className="text-sm">{email}</p>
        </div>
    </div>
  )
}

export default User
