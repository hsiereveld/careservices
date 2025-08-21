import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { securityMiddleware } from "./middleware/security";

export function middleware(request: NextRequest) {
  // Apply security middleware
  const securityResponse = securityMiddleware(request);
  if (securityResponse.status !== 200) {
    return securityResponse;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};