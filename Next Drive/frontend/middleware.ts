import { NextRequest, NextResponse } from "next/server";
import Cookies from "js-cookie";

export function middleware (request: NextRequest){
    const path = request.nextUrl.pathname;
    const isPublicRout = path === '/sign-up' || path === '/sign-in'

    const token = request.cookies.get('token')?.value;

    if(!token && !isPublicRout){
        const res = NextResponse.redirect(new URL('/sign-up',request.url))
        res.headers.set('x-middleware-cache', 'no-cache');
        return res
    }
    if(token && isPublicRout){
        const res = NextResponse.redirect(new URL('/',request.url))
        res.headers.set('x-middleware-cache', 'no-cache');
        return res
    }

    const res = NextResponse.next();
    res.headers.set('x-middleware-cache', 'no-cache');
    return res
}

export const config = {
    matcher: ['/sign-up']
}