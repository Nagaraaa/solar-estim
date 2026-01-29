import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
    const nonce = crypto.randomUUID();
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

    const strictCspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://challenges.cloudflare.com;
  `;

    const requestHeaders = new Headers(request.headers);

    // Geolocation Logic (Non-blocking)
    const country = (request as any).geo?.country || request.headers.get('x-vercel-ip-country') || 'FR';

    // Inject detected country into headers for Layout to consume
    requestHeaders.set('x-detected-country', country);

    // Security Logic (CSP + Nonce)
    requestHeaders.set('x-nonce', nonce);

    // Use the strict header
    requestHeaders.set(
        'Content-Security-Policy',
        strictCspHeader.replace(/\s{2,}/g, ' ').trim()
    );

    // --- ROUTE PROTECTION (ADMIN) ---
    // Check for our manual cookie 'solar-admin-auth' set by the login page.
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const hasAuthCookie = request.cookies.has('solar-admin-auth');

        if (!hasAuthCookie) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set(
        'Content-Security-Policy',
        strictCspHeader.replace(/\s{2,}/g, ' ').trim()
    );

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
