import { type NextRequest, NextResponse } from 'next/server'

import { getSession } from './lib/auth'

const PUBLIC_ROUTES = new Set(['/', '/auth/sign-in', '/auth/sign-up'])

export async function proxy(request: NextRequest) {
  const session = await getSession()

  // Redirect authenticated users if they are not onboarded
  if (session && !session.user.onboarded && !request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  if (session && session.user.onboarded && request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (session && (request.nextUrl.pathname.startsWith('/auth/') || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow public routes
  if (PUBLIC_ROUTES.has(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Protect all other routes
  // Redirect unauthenticated users to sign-in page
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    '/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|json)$).*)'
  ]
}
