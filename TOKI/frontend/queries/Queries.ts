import { gql } from "@apollo/client";

export  const getuserData = gql`
      query getuserDetails($id: ID!){
        user(id:$id){
            id
            name
  		    email
            picture
            posts {
                id
                pictureURL

            }
            follower{
                count
            }
            following{
                count
            }
        }
    }
`

export  const getpostData = gql`
      query getuserDetails($id: ID!){
        user(id:$id){
            id
            name
            posts {
                id
                pictureURL
            }
        }
    }
`

export  const getpost = gql`
      query getuserPost($id: ID!,$owner: String!){  
        user(id:$id){
            id
            name
            picture
            postcount {
                postcount
            }
            follower{
                count
            }
            following{
                count
            }
        }
        posts(owner:$owner){
        id
        pictureURL
        owner
        }
    }
`
export  const getpostpageintion = gql`
      query getuserPost($owner: String!,$offset: Int, $limit: Int){  
        posts(owner:$owner,offset: $offset, limit: $limit){
            id
            pictureURL
            creator
            title
            message
            originalname
            like{
                like
                likeCount
            }
        }
    }
`

export  const getexplorepostpageintion = gql`
      query getuserPost($excludeOwner:ID, $offset: Int, $limit: Int){  
        exploreposts(excludeOwner: $excludeOwner, offset: $offset, limit: $limit){
            id
            pictureURL
            message
            title
            tags
            like{
                like
                likeCount
            }
            following{
                count
            }
            user{
                id
                name
                picture
            }
        }
    }
`