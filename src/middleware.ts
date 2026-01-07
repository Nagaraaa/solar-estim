import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = url.hostname;

    // Force non-www
    if (hostname.startsWith('www.')) {
        url.hostname = hostname.replace('www.', '');
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
