import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function licenseMiddleware(request: NextRequest) {
  // Only check in production
  if (process.env.NODE_ENV === 'production') {
    const validLicense = process.env.LICENSE_KEY === 'VALID_GUMROAD_KEY'
    const isErrorPage = request.nextUrl.pathname.startsWith('/license-error')

    // Redirect to error page if invalid license and not already there
    if (!validLicense && !isErrorPage) {
      return NextResponse.redirect(new URL('/license-error', request.url))
    }

    // Block access to error page with valid license
    if (validLicense && isErrorPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}
