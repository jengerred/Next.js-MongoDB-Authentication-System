import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Test license key configuration
const TEST_LICENSE_KEY = 'GUMROAD_TEST_KEY_1234'; // Your test key
const LICENSE_KEY_REGEX = /^GUMROAD_[A-Z0-9_]+$/i; // Validates key format

export function licenseMiddleware(request: NextRequest) {
  // Only check in production
  if (process.env.NODE_ENV === 'production') {
    // Validate license key format and value
    const isValidKey = process.env.LICENSE_KEY 
      && LICENSE_KEY_REGEX.test(process.env.LICENSE_KEY)
      && process.env.LICENSE_KEY === TEST_LICENSE_KEY;

    const isErrorPage = request.nextUrl.pathname.startsWith('/license-error');

    // Redirect to error page for invalid keys
    if (!isValidKey && !isErrorPage) {
      return NextResponse.redirect(new URL('/license-error', request.url));
    }

    // Block access to error page with valid key
    if (isValidKey && isErrorPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}
