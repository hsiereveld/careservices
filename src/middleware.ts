import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { securityMiddleware } from "./middleware/security";

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/api/auth',
  '/chat', // Public chat widget
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security middleware first
  const securityResponse = securityMiddleware(request);
  if (securityResponse.status !== 200) {
    return securityResponse;
  }

  // Skip auth for public routes and API auth endpoints
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/auth/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For now, just pass through all requests
  // Auth protection will be handled by individual route handlers
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};