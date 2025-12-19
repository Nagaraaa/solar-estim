import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if we are on the root path
    if (request.nextUrl.pathname === '/') {
        // Check for country cookie
        const countryCookie = request.cookies.get('solar_country')?.value;
        const geoCountry = request.headers.get('x-vercel-ip-country');

        // Priority: Cookie > GeoIP
        const country = countryCookie || geoCountry;

        // If country is Belgium (BE), redirect to the Belgian homepage
        // Only redirect if we detect BE preference/location and we are not already going there (which we aren't, since we are at '/')
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
