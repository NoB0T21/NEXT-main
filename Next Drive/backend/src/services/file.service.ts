import { Types } from 'mongoose';
import fileModel from '../Models/file.model'

interface files{
    owner: string,
    path: string,
    originalname: string,
    imageURL: string,
    fileType: string
}

export const  createfile = async ({owner,path,originalname,imageURL,fileType}:files) => {
 if(!owner || !path || !originalname || !fileType) return
 const file = await fileModel.create({
    owner: new Types.ObjectId(owner),
    path,
    originalname,
    imageURL,
    fileType,
  });
 return file
}