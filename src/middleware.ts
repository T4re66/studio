
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

const TEAM_REQUIRED_ROUTES = PROTECTED_ROUTES.filter(r => r !== '/dashboard' && r !== '/settings');

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAuthToken = request.cookies.has('firebase-auth-token');
    const isPreview = request.cookies.get('is-preview')?.value === 'true';
    const isAuthenticated = hasAuthToken || isPreview;
    const hasTeam = request.cookies.get('has-team')?.value === 'true';

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    // 1. If not authenticated and trying to access a protected route, redirect to landing page.
    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If authenticated and on the landing page, redirect to the dashboard.
    if (isAuthenticated && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // 3. If an authenticated user without a team tries to access a page that requires a team,
    //    redirect them to the dashboard, where they'll see the "join/create team" options.
    //    This rule does not apply to preview mode.
    if (isAuthenticated && !isPreview && !hasTeam && TEAM_REQUIRED_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // 4. If an authenticated user (real or preview) with a team tries to access the team selection page,
    //    redirect them to the dashboard.
    if (isAuthenticated && hasTeam && pathname.startsWith('/team/select')) {
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
