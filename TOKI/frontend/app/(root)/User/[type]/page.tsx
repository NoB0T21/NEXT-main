
import createApolloClient from '@/apollo-client'
import { ProfileHeader } from '@/components/navigation/Header'
import ProfileNav from '@/components/navigation/ProfileNav'
import ProfileData from '@/components/ProfileData'
import Userprofile from '@/components/Userprofile'
import { getpost} from '@/queries/Queries'
import { ApolloWrapper } from '@/context/ApolloClientProvider'


type Props = {
  params: {
    type: string
  }
}

const page = async  ({ params }: Props) => {
  const userId = params.type;
   const client = await createApolloClient();
  
   const {data} = await client.query({
     query: getpost,
     variables: {
       id: userId,
       owner: userId
     },
   });

  

  return (
    <main className='w-full h-full'>
      <ProfileHeader name={data.user.name}/>
      <ProfileData 
        picture={data.user.picture} 
        posts={data.user.posts.length} 
        follower={!data.user.follower?0:data.user.follower.length} 
        following={!data.user.following?0:data.user.following.length}
      />
      <div className='top-12 z-3 sticky'>
        <ProfileNav/>
      </div>
        <ApolloWrapper>
          <Userprofile userId={userId}/>
        </ApolloWrapper>
    </main>
    
  )
}

export default page
