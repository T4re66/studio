
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
    '/dashboard',
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
    '/team/select',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAuthToken = request.cookies.has('firebase-auth-token');
    const isPreview = request.cookies.get('is-preview')?.value === 'true';
    const isAuthenticated = hasAuthToken || isPreview;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    // If not authenticated and trying to access a protected route, redirect to landing page.
    if (!isAuthenticated && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }
    
    // Allow all other requests to proceed. The client-side AuthProvider will handle further redirection logic.
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
