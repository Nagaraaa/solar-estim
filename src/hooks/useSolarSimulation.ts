import { useState } from "react";
import type { SimulationInput, SimulationResult } from "@/types";

export function useSolarSimulation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SimulationResult | null>(null);

    const calculate = async (input: SimulationInput) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Geocoding
            const geoUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
                input.address
            )}&limit=1`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            if (!geoData.features || geoData.features.length === 0) {
                throw new Error("Adresse introuvable.");
            }

            const [lon, lat] = geoData.features[0].geometry.coordinates;

            // 2. PVGIS Production
            // Timeout strategy: 4 seconds limit
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            let annualProductionPerKwc = 1100; // Default fallback

            try {
                const pvgisUrl = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&angle=35&aspect=0&outputformat=json`;
                const pvgisRes = await fetch(pvgisUrl, { signal: controller.signal });

                if (pvgisRes.ok) {
                    const pvgisData = await pvgisRes.json();
                    // E_y: Average annual energy production
                    if (pvgisData.outputs && pvgisData.outputs.totals && pvgisData.outputs.totals.E_y) {
                        annualProductionPerKwc = pvgisData.outputs.totals.E_y;
                    }
                }
            } catch (e) {
                console.warn("PVGIS API timed out or failed, using default values.", e);
                // Continue with default 1100
            } finally {
                clearTimeout(timeoutId);
            }

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

        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return { calculate, loading, error, result };
}
