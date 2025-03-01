import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function licenseMiddleware(request: NextRequest) {
  try {
    // Get license key dynamically from request headers
    const licenseKey = request.headers.get('x-license-key') ?? "";
    
    // Verify license with Gumroad API
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      body: new URLSearchParams({
        product_id: "6Nzu5UE8M156Hbug1_7iUA==", // Replace with your actual product_id
        license_key: licenseKey,
        increment_uses_count: "false" // Prevent usage count increment on verification
      })
    });

    if (!response.ok) throw new Error('API request failed');

    const { success, purchase } = await response.json();
    
    // Check for valid license and active status
    if (!success || purchase?.refunded || purchase?.disputed) {
      throw new Error('Invalid or revoked license');
    }

    return NextResponse.next();

  } catch (error) {
    console.error('License verification failed:', error);
    return NextResponse.redirect(new URL('/license-error', request.url));
  }
}
