
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
];

const TEAM_ROUTES = [
    '/team/select',
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAuthToken = request.cookies.has('firebase-auth-token');
    const isPreview = request.cookies.get('is-preview')?.value === 'true';
    const isAuthenticated = hasAuthToken || isPreview;
    const hasTeam = request.cookies.get('has-team')?.value === 'true';

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isTeamRoute = TEAM_ROUTES.some(route => pathname.startsWith(route));

    // 1. If not authenticated and trying to access a protected route, redirect to landing page.
    if (!isAuthenticated && (isProtectedRoute || isTeamRoute)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If authenticated and on the landing page, redirect to the dashboard.
    if (isAuthenticated && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. If a real user (not preview) is authenticated but has no team,
    // and is trying to access a protected route, redirect them to team selection.
    if (hasAuthToken && !isPreview && !hasTeam && isProtectedRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 4. If a real user has a team, don't let them access the team selection page.
    if (hasAuthToken && !isPreview && hasTeam && isTeamRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 5. Allow all other requests to proceed.
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

    