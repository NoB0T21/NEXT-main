import User  from '../Models/user.model'

interface EmailParam {
    name:string,
    email:string,
    picture:string,
    password:string
}

export const findUser =  async ({email}:{email:string}) => {
  const user = await User.findOne({email})
  if(!user)return null
  return user
}

export const registerUser = async ({ name, email,picture, password }: EmailParam) => {
  const data = await User.create({
    name,
    email,
    picture,
    password,
  });
    return data;
  };