
export interface Details {
    lat: number;
    lon: number;
    pvgisProductionPerKwc: number;
    region?: string;
    futureProofMode?: boolean; // New flag for expert note
    slope?: number;
    azimuth?: number;
    recommendation?: string;
}

export interface SimulationResult {
    systemSize: number; // kWc
    annualProduction: number; // kWh
    annualSavings: number; // €
    roiYears: number; // years
    totalCost: number; // € (Brut)
    netCost: number; // € (After incentives)
    monthlyBill: number;
    estimatedConsumption: number;
    selfConsumptionRate?: number; // percentage (0.35 = 35%)
    details: Details;
}

export interface FinancialProjectionInput {
    result: SimulationResult;
    monthlyBill: number;
    inflationRate: number;
    years?: number;
}

export interface FinancialProjectionOutput {
    cumulativeWithout: number;
    cumulativeWith: number;
    netBenefit: number;
}

/**
 * Calculates financial projection over X years considering inflation
 */
export function calculateFinancialProjection({
    result,
    monthlyBill,
    inflationRate,
    years = 25
}: FinancialProjectionInput): FinancialProjectionOutput {
    let cumulativeWithout = 0;
    let cumulativeWith = result.netCost || result.totalCost; // Use net cost if available

    const startBill = monthlyBill * 12;

    for (let i = 1; i <= years; i++) {
        // Factor for specific year: (1 + rate)^(i-1)
        // Year 1: No inflation yet (base). Year 2: +Inflation.
        const inflationFactor = Math.pow(1 + inflationRate / 100, i - 1);

        const billForYear = startBill * inflationFactor;
        const savingsForYear = result.annualSavings * inflationFactor;

        cumulativeWithout += billForYear;

        // "With Solar" cost = Install Cost + (Bill - Savings)
        // If Savings > Bill, this term is negative (profit/surplus income)
        cumulativeWith += (billForYear - savingsForYear);
    }

    return {
        cumulativeWithout: Math.round(cumulativeWithout),
        cumulativeWith: Math.round(cumulativeWith),
        netBenefit: Math.round(cumulativeWithout - cumulativeWith)
    };
}

// --- NEW SIZING & ENGINE LOGIC ---

interface EngineInput {
    monthlyBill: number;
    lat: number;
    lon: number;
    countryCode: string;
    address: string;
    pvgisProductionPerKwc: number;
    slope?: number;
    azimuth?: number;
}

import { SOLAR_CONSTANTS } from '@/lib/constants';

// ... (existing interfaces)

export function calculateRecommendedSystem(input: EngineInput): SimulationResult {
    const electricityPriceFr = SOLAR_CONSTANTS.FR.ELECTRICITY_PRICE_EUR_KWH;
    const electricityPriceBe = SOLAR_CONSTANTS.BE.ELECTRICITY_PRICE_EUR_KWH;

    const { countryCode, monthlyBill, pvgisProductionPerKwc, lat, lon, address, slope, azimuth } = input;
    const pricePerKwh = countryCode === "BE" ? electricityPriceBe : electricityPriceFr;

    // 1. Estimate Consumption
    const annualConsumption = (monthlyBill * 12) / pricePerKwh;

    // 2. Sizing Logic
    let systemSize = SOLAR_CONSTANTS.SIZING.SYSTEM_SIZE_TIER_1;
    let futureProofMode = false;

    if (monthlyBill < SOLAR_CONSTANTS.SIZING.SMALL_CONSUMPTION_LIMIT_EUR) {
        // Small consumption profile
        systemSize = SOLAR_CONSTANTS.SIZING.SYSTEM_SIZE_SMALL;
        futureProofMode = true; // Flag for expert note
    } else if (annualConsumption < SOLAR_CONSTANTS.SIZING.TIER_1_LIMIT_KWH) {
        systemSize = SOLAR_CONSTANTS.SIZING.SYSTEM_SIZE_TIER_1;
    } else if (annualConsumption < SOLAR_CONSTANTS.SIZING.TIER_2_LIMIT_KWH) {
        systemSize = SOLAR_CONSTANTS.SIZING.SYSTEM_SIZE_TIER_2;
    } else {
        systemSize = SOLAR_CONSTANTS.SIZING.SYSTEM_SIZE_LARGE;
    }

    // 3. Production
    // If 2.5kWc, we just scale linearly from 1kWc production
    const totalProduction = systemSize * pvgisProductionPerKwc;

    // 4. Financials
    let estimatedCost = 0;
    let netCost = 0;
    let annualSavings = 0;
    let roiYears = 0;
    let region = "";

    if (countryCode === "BE") {
        // --- BELGIUM ---
        const cpMatch = address.match(/\b\d{4}\b/);
        const cp = cpMatch ? parseInt(cpMatch[0]) : 0;
        const isBxl = cp >= 1000 && cp <= 1299;
        region = isBxl ? "Bruxelles" : "Wallonie";

        // Cost: 1400€/kWc (approx market rate for small systems might be higher per kWc, but keeping consistent)
        // Taking into account 6% TVA is handled by the generic price usually, but let's be explicit
        // User asked: "Assure-toi que le 'Coût net estimé' prend bien en compte la TVA à 6%"
        // Let's set a base cost that reflects the 6% TVA reality.
        const costPerKwc = SOLAR_CONSTANTS.BE.COST_PER_KWC_EUR;
        estimatedCost = systemSize * costPerKwc;
        netCost = estimatedCost; // No generic federal rebates

        // Savings
        const grossSavings = totalProduction * electricityPriceBe;

        let prosumerTax = 0;
        if (region === "Wallonie") {
            // Updated ORES tariff: 86.96 €/kWe
            // Assuming kWe (inverter) ~= kWc (panels) for simplicity, or 2.5kVA for 2.5kWc
            prosumerTax = systemSize * SOLAR_CONSTANTS.BE.PROSUMER_TAX_EUR_KWE;
        }

        annualSavings = grossSavings - prosumerTax;
        if (annualSavings < 0) annualSavings = 0;

    } else {
        // --- FRANCE (Q1 2026) ---
        // Mise à jour : Coût installation stable (ex: 2000€/kWc pour simulation basique)
        const costPerKwc = SOLAR_CONSTANTS.FR.COST_PER_KWC_EUR;
        estimatedCost = systemSize * costPerKwc;

        // Prime à l'autoconsommation 2026 : Maintenue à 80 €/kWc (Nouvelle directive)
        const primePerKwc = SOLAR_CONSTANTS.FR.PRIME_AUTOCONSO_EUR_KWC;
        const totalPrime = systemSize * primePerKwc;

        netCost = estimatedCost - totalPrime;

        // Detailed Savings (Self-consumption + Sale)
        // Autoconsommation : on économise sur le prix du réseau (~0.25€)
        const selfConsumptionRate = SOLAR_CONSTANTS.FR.DEFAULT_SELF_CONSUMPTION_RATE;
        const selfConsumed = totalProduction * selfConsumptionRate;
        const exported = totalProduction * (1 - selfConsumptionRate);

        const savingsBill = selfConsumed * electricityPriceFr;

        // Vente du surplus : Nouveau tarif de rachat à 0,04 €/kWh
        const incomeOA = exported * SOLAR_CONSTANTS.FR.SURPLUS_RESALE_EUR_KWH;

        annualSavings = savingsBill + incomeOA;
    }

    roiYears = annualSavings > 0 ? netCost / annualSavings : 99;

    let recommendation = "";
    if (countryCode === "BE" && region === "Wallonie") {
        recommendation = "💡 Conseil Tarif Impact 2026 : Pour maximiser votre rentabilité, déplacez vos consommations (machines, recharge VE) entre 11h et 17h lorsque l'énergie solaire est abondante.";
    }

    // Default self-consumption rate for logic (consistent with FR logic)
    const selfConsumptionRate = countryCode === "BE"
        ? SOLAR_CONSTANTS.BE.DEFAULT_SELF_CONSUMPTION_RATE
        : SOLAR_CONSTANTS.FR.DEFAULT_SELF_CONSUMPTION_RATE;

    return {
        systemSize,
        annualProduction: Math.round(totalProduction),
        annualSavings: Math.round(annualSavings),
        roiYears: parseFloat(roiYears.toFixed(1)),
        totalCost: estimatedCost,
        netCost: netCost,
        monthlyBill,
        estimatedConsumption: Math.round(annualConsumption),
        selfConsumptionRate,
        details: {
            lat,
            lon,
            pvgisProductionPerKwc,
            region,
            futureProofMode,
            slope,
            azimuth,
            // @ts-ignore adding dynamic recommendation prop
            recommendation
        }
    };
}
