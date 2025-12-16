import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if we are on the root path
    if (request.nextUrl.pathname === '/') {
        // Get country from Vercel geolocation headers
        // x-vercel-ip-country is the standard header for Vercel
        // req.geo is available in some edge runtimes but headers are more universal
        const country = request.headers.get('x-vercel-ip-country');

        // If country is Belgium (BE), redirect to the Belgian homepage
        if (country === 'BE') {
            return NextResponse.redirect(new URL('/be', request.url))
        }
    }

    // Continue to the requested page
    return NextResponse.next()
}

// Configure matcher to only run on the root path for performance
// This prevents the middleware from running on every single image/asset request
export const config = {
    matcher: '/',
}
