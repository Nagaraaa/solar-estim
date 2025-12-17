
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const country = searchParams.get('country') || 'FR';

    if (!query || query.length < 3) {
        return NextResponse.json({ error: 'Query too short' }, { status: 400 });
    }

    try {
        const countryCode = country.toLowerCase();
        // Nominatim API
        // addressdetails=1: to extract postcode/city cleanly
        // countrycodes: to restrict results
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=${countryCode}`;

        const res = await fetch(nominatimUrl, {
            headers: {
                'User-Agent': 'SolarEstim/1.0 (contact@solarestim.com)',
                'Accept-Language': 'fr'
            }
        });

        if (!res.ok) {
            throw new Error(`Nominatim API error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Address Proxy Error:", error);
        return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
    }
}
