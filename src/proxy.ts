import { type NextRequest, NextResponse } from 'next/server'

import { getSession } from './lib/auth'

const PUBLIC_ROUTES = new Set(['/auth/sign-in', '/auth/sign-up'])

export async function proxy(request: NextRequest) {
  if (PUBLIC_ROUTES.has(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
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
