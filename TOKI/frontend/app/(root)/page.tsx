import { DashboardHeader } from '@/components/navigation/Header'
import { ApolloWrapper } from '@/context/ApolloClientProvider'
import Home from '@/components/card/Home'
import React from 'react'
import StoryBar from '@/components/StoryBar'
import { getuserfollowing } from '@/utils/serverActions'

const page = async () => {
  const usersFollowing = await getuserfollowing()

  return (
    <div>
      <DashboardHeader/>
      <StoryBar/>
      <ApolloWrapper>
          <Home ids={usersFollowing}/>
      </ApolloWrapper>
    </div>
  )
}

export default page
