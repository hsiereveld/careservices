import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com;"
  );
  
  // CSRF protection for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // Check for same-origin requests
    if (origin && host) {
      const originUrl = new URL(origin);
      const expectedOrigin = `${request.nextUrl.protocol}//${host}`;
      
      if (origin !== expectedOrigin && !originUrl.hostname.includes('localhost')) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF validation failed' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }
  
  return response;
}