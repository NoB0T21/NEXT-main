import { Types } from 'mongoose';
import fileModel from '../Models/file.model'

interface files{
    owner: string,
    path: string,
    originalname: string,
    imageURL: string,
    fileType: string,
    fileSize: number
}

export const  createfile = async ({owner,path,originalname,imageURL,fileType,fileSize}:files) => {
 if(!owner || !path || !originalname || !fileType || !fileSize) return
 const file = await fileModel.create({
    owner: new Types.ObjectId(owner),
    path,
    originalname,
    imageURL,
    fileType,
    fileSize
  });
 return file
}

export const  getfiles = async ({id}:{id: string}) => {
 if(!id) return
 const file = await fileModel.find({owner: id});
 return file
}

export const  renamefiles = async ({id,originalname}:{id: string, originalname: string}) => {
 if(!id) return
 const file = await fileModel.findOneAndUpdate({_id: id},{originalname});
 return file
}