import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=be`;

        const response = await fetch(nominatimUrl, {
            headers: {
                // Nominatim requires a valid User-Agent
                "User-Agent": "SolarEstim-Be-Simulator/1.0 (contact@solarestim.com)",
                "Accept-Language": "fr-FR"
            },
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map data server-side to simplify client
        const mappedData = data.map((item: any) => ({
            properties: {
                label: item.display_name,
                id: item.place_id
            },
            geometry: {
                coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
            }
        }));

        return NextResponse.json(mappedData);

    } catch (error) {
        console.error("Address proxy error:", error);
        return NextResponse.json({ error: "Failed to fetch address suggestions" }, { status: 500 });
    }
}
