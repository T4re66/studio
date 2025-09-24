
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

    // If user is authenticated and on the landing page, redirect to the dashboard.
    if (isAuthenticated && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated and trying to access a protected route, redirect to landing page.
    if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // This block handles redirection for REAL (non-preview) users without a team.
    // It is explicitly skipped if the user is in preview mode.
    if (hasFirebaseToken && !isPreview) {
        const hasTeam = request.cookies.get('has-team')?.value === 'true';
        
        // If user has no team, redirect to team selection, unless they are already there.
        if (!hasTeam && pathname !== '/team/select') {
            return NextResponse.redirect(new URL('/team/select', request.url));
        }
        // If user has a team and tries to access team selection, redirect to dashboard.
        if (hasTeam && pathname === '/team/select') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    
    // Allow all other requests to proceed, including all requests for preview users.
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
