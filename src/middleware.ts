
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
    const hasAuth = request.cookies.has('firebase-auth-token');
    const isPreview = request.cookies.get('is-preview')?.value === 'true';
    const hasTeam = request.cookies.get('has-team')?.value === 'true';

    const isAuthenticated = hasAuth || isPreview;
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    // 1. If not authenticated and trying to access a protected route, redirect to landing page.
    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If authenticated and on the landing page, redirect to the dashboard.
    if (isAuthenticated && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. This block handles team-based redirection ONLY for real, authenticated users.
    // It is completely skipped for preview users.
    if (hasAuth && !isPreview) {
        // If a real user has no team, force them to the team selection page, unless they are already there.
        if (!hasTeam && pathname !== '/team/select') {
            return NextResponse.redirect(new URL('/team/select', request.url));
        }
        // If a real user has a team and somehow lands on the team selection page, push them to the dashboard.
        if (hasTeam && pathname === '/team/select') {
             return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    
    // 4. If none of the above conditions are met, allow the request to proceed.
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
