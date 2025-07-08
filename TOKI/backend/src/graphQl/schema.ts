import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import posts from '../models/posts.models'
import user from "../models/user.model"
import following from "../models/user.following.model"
import follower from "../models/user.followers.model"



const UserFollowingType = new GraphQLObjectType({
    name:'UserFollowing',
    fields:()=>({
        count:{type: new GraphQLList(GraphQLString)},
    })
})

const UserFollowersType = new GraphQLObjectType({
    name:'UserFollower',
    fields:()=>({
        count:{type: new GraphQLList(GraphQLString)},
    })
})

const UserType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        email:{type: GraphQLString},
        picture:{type: GraphQLString},
        posts:{
            type: new GraphQLList(PostType),
            resolve(parent,args){
                return posts.find({owner:parent.id})
            }
        },
        following:{
            type:UserFollowingType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args){
                return following.findOne({userID:args.id})
            }
        },
        follower:{
            type:UserFollowersType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args){
                return follower.findOne({userID:args.id})
            }
        }
    })
})

const PostType:any = new GraphQLObjectType({
    name:'Post',
    fields:()=>({
        id:{type: GraphQLID},
        creator:{type: GraphQLString},
        title:{type: GraphQLString},
        message:{type: GraphQLString},
        tags:{type: new GraphQLList(GraphQLString)},
        pictureURL:{type: GraphQLString},
        originalname:{type: GraphQLString},
        createdAt:{type: GraphQLString},
        owner:{type: GraphQLString},
        posts:{
            type: UserType,
            resolve(parent,args){
                return posts.findById({_id:parent.owner})
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQuertType',
    fields:{
        post:{
            type:PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args){
                return posts.findById(args.id)
            }
        },
        user:{
            type:UserType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return user.findById(args.id)
            }
        },
        posts:{
            type:new GraphQLList(PostType),
            args: {
                owner:{type: GraphQLString},
                offset: { type: GraphQLInt },
                limit: { type: GraphQLInt }, 
            },

            resolve(parent,args){
                return posts.find({owner: args.owner})
                .skip(args.offset || 0)
                .limit(args.limit || 5)
            }
        },
    }
})

const graphQLschema = new GraphQLSchema({
    query: RootQuery,
});

export default graphQLschema