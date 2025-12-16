import { useState } from "react";
import type { SimulationInput, SimulationResult } from "@/types";
import { getPvgisData } from "@/app/actions/getPvgisData";

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
            console.log("Input coordinates received in hook:", lat, lon);

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

            // DIRECT CALL TO SERVER ACTION - NO FALLBACK
            // This will throw if PVGIS is down/unreachable
            annualProductionPerKwc = await getPvgisData(lat, lon, 1);

            // 3. Financial Algorithm
            // Consommation estimée = Facture * 12 / 0.25 (prix moyen kWh)
            const annualConsumption = (input.monthlyBill * 12) / 0.25;

            // Tient compte de la consommation pour choisir la taille
            let systemSize: 3 | 6 | 9;
            if (annualConsumption < 4500) {
                systemSize = 3;
            } else if (annualConsumption < 8000) {
                systemSize = 6;
            } else {
                systemSize = 9;
            }

            const totalProduction = systemSize * annualProductionPerKwc;
            const annualSavings = totalProduction * 0.25;

            // Estimation coût installation (Source moyenne 2024 - env 2.2€/Wc pour 3k, dégressif)
            // 3kWc ~ 7000€, 6kWc ~ 12000€, 9kWc ~ 16000€
            let estimatedCost = 0;
            if (systemSize === 3) estimatedCost = 7000;
            if (systemSize === 6) estimatedCost = 12000;
            if (systemSize === 9) estimatedCost = 16000;

            const roiYears = estimatedCost / annualSavings;

            setResult({
                systemSize,
                annualProduction: Math.round(totalProduction),
                annualSavings: Math.round(annualSavings),
                roiYears: parseFloat(roiYears.toFixed(1)),
                totalCost: estimatedCost,
                details: {
                    lat,
                    lon,
                    pvgisProductionPerKwc: annualProductionPerKwc
                }
            });
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
