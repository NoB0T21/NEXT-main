import fileModel from '../Models/file.model'

interface files{
    owner: object,
    path: string,
    originalname: string,
    imageURL: string,
    fileType: string
}

export const  createfile = async ({owner,path,originalname,imageURL,fileType}:files) => {
 if(!owner || !path || !originalname || !fileType) return
 const file = await fileModel.create({
    owner,
    path,
    originalname,
    imageURL,
    fileType
 })
 return file
}