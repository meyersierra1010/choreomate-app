import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/')) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/',
}