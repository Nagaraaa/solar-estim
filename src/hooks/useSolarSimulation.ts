import { useState } from "react";
import type { SimulationInput, SimulationResult } from "@/types";
import { getPvgisData } from "@/app/actions/getPvgisData";
import { calculateRecommendedSystem } from "@/lib/engine";

export function useSolarSimulation() {
    const [loading, setLoading] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [baseCalculationParams, setBaseCalculationParams] = useState<any | null>(null);

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
            const slope = input.slope ?? 35;
            const azimuth = input.azimuth ?? 0;
            annualProductionPerKwc = await getPvgisData(lat, lon, 1, slope, azimuth);

            // Store base parameters for recalculation
            setBaseCalculationParams({
                monthlyBill: input.monthlyBill,
                lat,
                lon,
                countryCode: country,
                address: input.address,
                pvgisProductionPerKwc: annualProductionPerKwc,
            });

            // 3. Fetch Settings (Server Action)
            const { fetchSettings } = await import("@/actions/settings");
            const settings = await fetchSettings();

            // 4. Financial Algorithm (Delegated to Engine)
            const inputEngine = {
                monthlyBill: input.monthlyBill,
                lat,
                lon,
                countryCode: country,
                address: input.address,
                pvgisProductionPerKwc: annualProductionPerKwc,
                // Pass through new params to be stored in result details
                slope,
                azimuth,
                withBattery: false // Default to false
            };

            const calculationResult = calculateRecommendedSystem(inputEngine, settings);

            setResult(calculationResult);
            return true;

        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const recalculate = async (params: { slope?: number; azimuth?: number; withBattery?: boolean }) => {
        if (!baseCalculationParams) {
            setError("Initial calculation not performed yet.");
            return;
        }

        setIsCalculating(true);
        try {
            // Destructure base params to ensure variables are defined in this scope
            const {
                lat,
                lon,
                pvgisProductionPerKwc,
                monthlyBill,
                countryCode,
                address
            } = baseCalculationParams;

            // Check if we need to fetch new PVGIS data
            let newProduction = pvgisProductionPerKwc;
            const newSlope = params.slope ?? 35;
            const newAzimuth = params.azimuth ?? 0;

            // If slope or azimuth changed, we MUST fetch new data
            if (params.slope !== undefined || params.azimuth !== undefined) {
                console.log("🔄 Recalculating PVGIS for new angle:", newSlope, newAzimuth);
                try {
                    // Fetch new production data
                    const { getPvgisData } = await import("@/app/actions/getPvgisData");
                    newProduction = await getPvgisData(lat, lon, 1, newSlope, newAzimuth);
                } catch (fetchErr) {
                    console.error("Failed to refresh PVGIS data:", fetchErr);
                }
            }

            // Fetch Settings (Server Action) - needed for calculation as it's not stored
            const { fetchSettings } = await import("@/actions/settings");
            const settings = await fetchSettings();

            const inputEngine = {
                monthlyBill,
                lat,
                lon,
                countryCode,
                address,
                pvgisProductionPerKwc: newProduction,
                slope: newSlope,
                azimuth: newAzimuth,
                withBattery: params.withBattery ?? false,
            };

            const result = calculateRecommendedSystem(inputEngine, settings);
            setResult(result);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du recalcul.");
        } finally {
            setIsCalculating(false);
        }
    };

    return { calculate, loading, isCalculating, error, result, recalculate };
}
