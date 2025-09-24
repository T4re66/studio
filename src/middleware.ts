
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
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    const hasFirebaseToken = request.cookies.has('firebase-auth-token');
    const hasTeam = request.cookies.get('has-team')?.value === 'true';

    // User is on the landing page
    if (pathname === '/') {
        // If logged in, always redirect to dashboard
        if (hasFirebaseToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        // Otherwise, let them stay on the landing page
        return NextResponse.next();
    }
    
    // Allow access to the dashboard regardless of team status
    if (pathname.startsWith('/dashboard')) {
        if (!hasFirebaseToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }


    // User is trying to access a protected route
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        // If not logged in, redirect to landing page
        if (!hasFirebaseToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        // If logged in but has no team, redirect to team selection
        if (!hasTeam) {
            return NextResponse.redirect(new URL('/team/select', request.url));
        }
    }
    
    // User is on the team select page
    if (pathname === '/team/select') {
        // If not logged in, redirect to landing page
        if (!hasFirebaseToken) {
             return NextResponse.redirect(new URL('/', request.url));
        }
        // If they already have a team, redirect to dashboard
        if(hasTeam) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // For all other cases, allow the request
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

    