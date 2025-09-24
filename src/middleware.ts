
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
    '/briefing',
    '/chatbot',
    '/people',
    '/breaks',
    '/birthdays',
    '/tournaments',
    '/leaderboard',
    '/tasks',
    '/shop',
    '/map',
    '/fridge',
    '/focus',
    '/check-in',
    '/grades',
    '/settings',
    '/dashboard',
    '/team/select'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasFirebaseToken = request.cookies.has('firebase-auth-token');
    const isPreview = request.cookies.get('is-preview')?.value === 'true';

    const isAuthenticated = hasFirebaseToken || isPreview;

    // If user is logged in (or in preview) and tries to access the landing page, redirect to dashboard
    if (isAuthenticated && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not logged in (and not in preview) and tries to access a protected route, redirect to landing page
    if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Allow the request to proceed
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sounds (audio files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sounds).*)',
  ],
}
