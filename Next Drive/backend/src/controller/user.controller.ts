import { Request } from "express"
import { findUser, findUsersByid, getUsersByid, registerUser } from "../services/user.service"
import userModel  from '../Models/user.model'

interface User {
    _id:string,
    name:string,
    email:string,
    password:string
}

export const register = async (request: Request, response: any) => {
    const {name, email,picture, password} = request.body
    if(!name||!email||!password){
        return response.status(400).json({
            message: 'Require all fields',
            success: false
        })
    }
    try {
        const existingUsers = await findUser({email})
        if(existingUsers){
            return response.status(202).json({
                message: "User already exists",
                user: existingUsers,
                success: false,
            })}
            const hashPassword = await userModel.hashpassword(password)
            const user = await registerUser({name,email,picture,password:hashPassword})
        if(!user){
            return response.status(500).json({
                message: "Some Error occure",
                success: false,
        })}
        const token = await user.generateToken()
        return response.status(201).json({
            message: "User created successfully",
            user,
            token,
            success: true,
        });
    } catch (error) {
        console.error("Register Error:", error);
        return response.status(500).json({
            message: "Internal server error",
            success: false,
          });
    }
}

export const login = async (request: Request, response:any) => {
    const {email, password} = request.body
    if(!email||!password){
        return response.status(400).json({
            message: 'Require all fields',
            success: false
        })
    }

    try {
        const user = await findUser({email})
        if(!user){
            return response.status(202).json({
                message: "password or email is incorrect",
                success: false,
        })}
        const isMatch = await user.comparePassword(password, user.password)
        if(!isMatch){
            return response.status(202).json({
                message: "password or email is incorrect",
                success: false,
        })}
        const token = await user.generateToken()
        return response.status(201).json({
            message: "User login successfully",
            user,
            token,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            success: false,
          });
    }
}

export const getUser = async (request: Request, response:any) => {
    const email = request.user.email
    if(!email){
        return response.status(400).json({
        message: 'Require all fields',
        success: false
    })}
    const user = await findUser({email})
    const userid = user?._id||''
    try {
        const user = await findUsersByid({shareuser:userid})
        if(!user){
            return response.status(200).json({
                message: "password or email is incorrect",
                success: false,
        })}
        return response.status(200).json({
            message: "IDs",
            file: user,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            success: false,
          });
    }
}

export const getuserbyid = async (request: Request, response:any) => {
    const userid = request.params.id
    
    if(!userid){
        return response.status(400).json({
            message: 'Require all fields',
            success: false
        })
    }

    try {
        const user = await findUsersByid({shareuser:userid})
        if(!user){
            return response.status(200).json({
                message: "password or email is incorrect",
                success: false,
        })}
        return response.status(200).json({
            message: "IDs",
            data: user,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            success: false,
          });
    }
}

export const getuser = async (request: Request, response:any) => {
    const userid = request.body
    if(!userid){
        return response.status(400).json({
            message: 'Require all fields',
            success: false
        })
    }

    try {
        const user = await getUsersByid({shareuser:userid})
        if(!user){
            return response.status(200).json({
                message: "password or email is incorrect",
                data: user,
                success: false,
        })}
        return response.status(200).json({
            message: "IDs",
            data: user,
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            success: false,
          });
    }
}