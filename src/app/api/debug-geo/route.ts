import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Get all headers to inspect
    const countryHeader = request.headers.get('x-vercel-ip-country');
    const cityHeader = request.headers.get('x-vercel-ip-city');

    return NextResponse.json({
        message: "Debug Geolocation Headers",
        detectedCountry: countryHeader || "Not Set",
        detectedCity: cityHeader || "Not Set",
        allHeaders: Object.fromEntries(request.headers)
    }, { status: 200 });
}
