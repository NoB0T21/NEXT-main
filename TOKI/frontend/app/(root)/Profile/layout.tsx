import createApolloClient from '@/apollo-client';
import { ProfileHeader } from '@/components/navigation/Header';
import ProfileNav from '@/components/navigation/ProfileNav';
import ProfileData from '@/components/ProfileData';
import ClientUserProvider from '@/context/cientUserProvider';
import { getuserData } from '@/queries/Queries'
import { cookies } from 'next/headers';

const layout = async ({children}:{children: React.ReactNode}) => {
  const userId:string = (await cookies()).get('user')?.value || ''
  const client = await createApolloClient();
  
  const {data} = await client.query({
    query: getuserData,
      variables: {
        id: userId,
      },
  });
  const profiledata = {
    owner:data.user.id,
    posts: data.user.posts,
  }
  return (
    <main className='w-full h-full'>
      <ProfileHeader name={data.user.name}/>
      <ProfileData 
        picture={data.user.picture} 
        posts={data.user.posts.length} 
        follower={!data.user.follower?0:data.user.follower.length} 
        following={!data.user.following?0:data.user.following.length}
      />
      <div className='top-12 sticky'>
        <ProfileNav/>
      </div>
      <ClientUserProvider value={profiledata}>
        <div className='mt-5 w-full h-full'>{children}</div>
      </ClientUserProvider>
    </main>
  )
}

export default layout
