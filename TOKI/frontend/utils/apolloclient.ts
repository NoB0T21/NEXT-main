import createApolloClient from "@/apollo-client";
import { getpost } from '@/queries/Queries';

export const getUser = async ({userId}:{userId:string}) =>{
    const client = await createApolloClient();
    const {data} = await client.query({
        query: getpost,
        variables: {
            id: userId,
            owner: userId
        },
    });
    return data
}