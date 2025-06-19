import { Request } from "express"
import { findUser, registerUser } from "../services/user.service"
import userModel  from '../Models/user.model'

interface User {
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
            return response.status(200).json({
                message: "password or email is incorrect",
                success: false,
        })}
        const isMatch = await user.comparePassword(password, user.password)
        if(!isMatch){
            return response.status(200).json({
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