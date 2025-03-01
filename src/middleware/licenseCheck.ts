import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function licenseMiddleware(request: NextRequest) {
  // Only check in production
  if (process.env.NODE_ENV === 'production') {
    const licenseKey = process.env.LICENSE_KEY;

    // Check for valid key format (Gumroad-style)
    const isValidFormat = licenseKey?.startsWith('GUMROAD_') || false;
    
    if (!isValidFormat) {
      return NextResponse.redirect(new URL('/license-error', request.url));
    }
  }
  
  return NextResponse.next();
}
