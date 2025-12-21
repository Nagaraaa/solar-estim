import { useState } from "react";
import type { SimulationInput, SimulationResult } from "@/types";
import { getPvgisData } from "@/app/actions/getPvgisData";
import { calculateRecommendedSystem } from "@/lib/engine";

export function useSolarSimulation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SimulationResult | null>(null);

    const calculate = async (input: SimulationInput): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            // 1. Geocoding
            let lat = input.lat;
            let lon = input.lon;
            const country = input.countryCode || "FR";

            console.log("Input coordinates received in hook:", lat, lon, "Country:", country);

            if (!lat || !lon) {
                const geoUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
                    input.address
                )}&limit=1`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (!geoData.features || geoData.features.length === 0) {
                    throw new Error("Adresse introuvable.");
                }

                [lon, lat] = geoData.features[0].geometry.coordinates;
            }

            if (typeof lat !== 'number' || typeof lon !== 'number') {
                throw new Error("Coordonnées invalides.");
            }

            // 2. PVGIS Production (STRICT SERVER ACTION)
            let annualProductionPerKwc = 0;
            annualProductionPerKwc = await getPvgisData(lat, lon, 1);

            // 3. Financial Algorithm (Delegated to Engine)
            const inputEngine = {
                monthlyBill: input.monthlyBill,
                lat,
                lon,
                countryCode: country,
                address: input.address,
                pvgisProductionPerKwc: annualProductionPerKwc
            };

            const calculationResult = calculateRecommendedSystem(inputEngine);

            setResult(calculationResult);
            return true;

        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { calculate, loading, error, result };
}
