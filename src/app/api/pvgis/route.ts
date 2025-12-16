import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const peakpower = searchParams.get("peakpower") || "1";
    const loss = searchParams.get("loss") || "14";

    if (!lat || !lon) {
        return NextResponse.json({ error: "Parameters 'lat' and 'lon' are required" }, { status: 400 });
    }

    try {
        const pvgisUrl = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=${loss}&angle=35&aspect=0&outputformat=json`;

        // Fetch from PVGIS (Server-to-Server, no CORS issues)
        const response = await fetch(pvgisUrl);

        if (!response.ok) {
            throw new Error(`PVGIS API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("PVGIS proxy error:", error);
        return NextResponse.json({ error: "Failed to fetch PVGIS data" }, { status: 500 });
    }
}
