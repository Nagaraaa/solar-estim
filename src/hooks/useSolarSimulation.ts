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

            // 3. Financial Algorithm
            // Consommation estimée = Facture * 12 / 0.25 (prix moyen kWh)
            const annualConsumption = (input.monthlyBill * 12) / 0.25;

            // Choix de la taille du système
            let systemSize: 3 | 6 | 9;
            if (annualConsumption < 4500) {
                systemSize = 3;
            } else if (annualConsumption < 8000) {
                systemSize = 6;
            } else {
                systemSize = 9;
            }

            const totalProduction = systemSize * annualProductionPerKwc;

            let estimatedCost = 0;
            let netCost = 0;
            let annualSavings = 0;
            let roiYears = 0;
            let region = "";

            // --- LOGIQUE SPÉCIFIQUE PAYS ---

            if (country === "BE") {
                // --- BELGIQUE ---
                // Extraction CP pour Région
                const cpMatch = input.address.match(/\b\d{4}\b/);
                const cp = cpMatch ? parseInt(cpMatch[0]) : 0;

                // 1000-1299 = Bruxelles, sinon Wallonie (simplifié selon demande)
                const isBxl = cp >= 1000 && cp <= 1299;
                region = isBxl ? "Bruxelles" : "Wallonie";

                // Coût installation : 1400 € / kWc (TVAC 6% pour les maisons > 10 ans)
                const costPerKwc = 1400;
                estimatedCost = systemSize * costPerKwc;
                netCost = estimatedCost; // Pas de prime mentionnée pour BE dans l'instruction actuelle, donc Net = Brut

                // Calcul Économies
                const electricityPrice = 0.30; // Prix moyen
                const grossSavings = totalProduction * electricityPrice;

                let prosumerTax = 0;
                if (region === "Wallonie") {
                    // Moyenne ~70€ par kVA (on approxime kVA ~ kWc système)
                    prosumerTax = systemSize * 70;
                }

                annualSavings = grossSavings - prosumerTax;
                if (annualSavings < 0) annualSavings = 0;

                // ROI = Coût / Économies annuelles
                roiYears = netCost / (annualSavings || 1);

            } else {
                // --- FRANCE ---
                // Coût installation : 2100 € / kWc (TVA 10% ou 20%)
                const costPerKwc = 2100;
                estimatedCost = systemSize * costPerKwc;

                // Primes: "Prime à l'autoconsommation"
                // On utilise les valeurs standards (~300€/kWc pour <= 3kWc, ~230€/kWc pour <= 9kWc)
                // Source indicative, mais on applique la logique "Déduis la Prime"
                let primePerKwc = 0;
                if (systemSize <= 3) primePerKwc = 300;
                else if (systemSize <= 9) primePerKwc = 230;
                else primePerKwc = 230;

                const totalPrime = systemSize * primePerKwc;
                netCost = estimatedCost - totalPrime;

                // Calcul Économies (Autoconsommation avec vente surplus)
                // On prend un taux d'autoconsommation standard (ex: 35%) pour estimer la part consommée vs injectée
                // Revenus : Ajoute la vente du surplus (environ 0,13 € / kWh injecté) si l'autoconsommation n'est pas de 100%

                // Hypothèse autoconsommation
                const selfConsumptionRate = 0.40; // Augmenté légèrement pour reflet "Expert" optimal
                const selfConsumedEnergy = totalProduction * selfConsumptionRate;
                const exportedEnergy = totalProduction * (1 - selfConsumptionRate);

                const savingsBill = selfConsumedEnergy * 0.25; // Économie sur facture (0.25€/kWh)
                const incomeOA = exportedEnergy * 0.13; // Vente surplus (0.13€/kWh)

                annualSavings = savingsBill + incomeOA;

                // ROI = (Coût Net) / Économies Annuelles
                roiYears = netCost / (annualSavings || 1);
            }

            setResult({
                systemSize,
                annualProduction: Math.round(totalProduction),
                annualSavings: Math.round(annualSavings),
                roiYears: parseFloat(roiYears.toFixed(1)),
                totalCost: estimatedCost,
                netCost: netCost,
                monthlyBill: input.monthlyBill,
                estimatedConsumption: Math.round(annualConsumption),
                details: {
                    lat,
                    lon,
                    pvgisProductionPerKwc: annualProductionPerKwc,
                    region
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
