import jwt from 'jsonwebtoken'
import {OAuth2Client} from 'google-auth-library'
import { NextFunction, Request, Response } from 'express'

const client = new OAuth2Client(process.env.GOOGLE_ID)

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }

const middleware = async (request: Request, response: Response, next: NextFunction) => {
    let accessToken:string | undefined
    const authHeader= request.headers.authorization;
    console.log(authHeader)
    if(authHeader && authHeader.startsWith('Bearer')){
        accessToken = authHeader.split(' ')[1];
    }
    if(!accessToken){
         response.status(401).json({
            message: 'Access Token required'
        });
        return
    }

    try {
        let user
        user = await jwt.verify(accessToken, process.env.SECRET_KEY || 'default')
        if(!user){
            const response = await client.getTokenInfo(accessToken);
            const user = response
        }
        request.user = `${user}`;
        next()
    } catch (error) {
         response.status(403).json({
            message: 'Invalid or expired token',
        });
        return
    }
}
export default middleware;