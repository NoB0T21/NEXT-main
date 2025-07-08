import { Types } from "mongoose";
import postModel from '../models/posts.models'
import likeModel from '../models/like.model'

interface files{
    creator:string,
    title:string,
    message:string,
    tags: string[],
    owner: string,
    path: string,
    originalname: string,
    pictureURL: string,
}

export const  createfile = async ({creator,title,message,tags,owner,path,originalname,pictureURL}:files) => {
 if(!creator || !path || !originalname || !pictureURL || !owner) return
 const file = await postModel.create({
    creator,
    title,
    message,
    tags,
    owner: new Types.ObjectId(owner),
    path,
    originalname,
    pictureURL,
  });
 return file
}

export const  LikePost = async ({userID}:{userID:any}) => {
  if(!userID) return
  const file = await likeModel.create({
    userID
  });
 return file
}

export const  getLikePost = async ({PostId}:{PostId:any}) => {
  if(!PostId) return
  const file = await likeModel.findOne({
    userID: PostId
  });
 return file
}