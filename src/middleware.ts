import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { env } from './env.mjs'

// This function can be marked `async` if using `await` inside
const publicPaths = [
  "/",
  "/projects",
  "/api/auth/signin",
  "/api/auth/signout",
  "/api/auth/callback",
  "/api/auth/providers",
]
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Redirect to signin if user not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/signin?callbackUrl=' + request.url, request.url))
  }

  //User is authenticated
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|/|projects).*)"]
}