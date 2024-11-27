import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Redirect non-admin users away from admin pages
    if (isAdminPage && (!isAuth || token?.role !== 'admin')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true to allow access to protected routes
        // This will be checked before the middleware function above
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ],
}
