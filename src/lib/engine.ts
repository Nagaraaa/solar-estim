
export interface Details {
    lat: number;
    lon: number;
    pvgisProductionPerKwc: number;
    region?: string;
    futureProofMode?: boolean; // New flag for expert note
    slope?: number;
    azimuth?: number;
    withBattery?: boolean;
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
}: FinancialProjectionInput): FinancialProjectionOutput & { yearlyData: any[] } {
    let cumulativeWithout = 0;
    let cumulativeWith = -(result.netCost); // Start with negative investment
    let currentBill = monthlyBill * 12;
    // let netBenefit = 0; // Derived

    // Initial State (Year 0)
    const yearlyData = [
        {
            year: 0,
            cumulativeCashflow: cumulativeWith, // -Cost
            savings: 0
        }
    ];

    for (let i = 1; i <= years; i++) {
        // Inflation applied to Bill and Energy Price (Savings)
        const inflationFactor = Math.pow(1 + inflationRate / 100, i - 1);

        const billForYear = currentBill * inflationFactor;
        const savingsForYear = result.annualSavings * inflationFactor;

        cumulativeWithout += billForYear;

        // Cashflow logic:
        cumulativeWith += savingsForYear;

        yearlyData.push({
            year: i,
            cumulativeCashflow: Math.round(cumulativeWith),
            savings: Math.round(savingsForYear)
        });
    }

    return {
        cumulativeWithout: Math.round(cumulativeWithout),
        cumulativeWith: Math.round(cumulativeWith), // Project Balance
        netBenefit: Math.round(cumulativeWith), // Project Balance at end
        yearlyData
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
    withBattery?: boolean;
}

import { SOLAR_CONSTANTS } from '@/lib/constants';

// ... (existing interfaces)

export function calculateRecommendedSystem(input: EngineInput, settings: Record<string, any> = {}): SimulationResult {
    // Helper to get setting or fallback to constant
    const getSetting = (key: string, fallback: number) => {
        const val = settings[key];
        const num = Number(val);
        // If val is missing, null, OR converts to 0 (which is invalid for prices/constants), use fallback
        return (val !== undefined && val !== null && !isNaN(num) && num > 0) ? num : fallback;
    };

    const electricityPriceFr = getSetting('FR_ELECTRICITY_PRICE', SOLAR_CONSTANTS.FR.ELECTRICITY_PRICE_EUR_KWH);
    const electricityPriceBe = getSetting('BE_ELECTRICITY_PRICE', SOLAR_CONSTANTS.BE.ELECTRICITY_PRICE_EUR_KWH);

    const { countryCode, monthlyBill, pvgisProductionPerKwc, lat, lon, address, slope, azimuth } = input;
    const pricePerKwh = countryCode === "BE" ? electricityPriceBe : electricityPriceFr;

    // 1. Estimate Consumption
    const annualConsumption = (monthlyBill * 12) / pricePerKwh;

    // 2. Sizing Logic
    let systemSize = SOLAR_CONSTANTS.SIZING.SYSTEM_SIZE_TIER_1;
    let futureProofMode = false;

    // Updated Logic for Granular Sizing
    if (monthlyBill < 60) {
        systemSize = SOLAR_CONSTANTS.SIZING.SYSTEM_SIZE_SMALL; // 2.5
        futureProofMode = true;
    } else if (annualConsumption < 3500) {
        systemSize = 3; // Tier 1
    } else if (annualConsumption < 7500) {
        systemSize = 6; // Tier 2 (covers ~120€/month bill well)
    } else {
        systemSize = 9; // Tier 3
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

    // BATTERY LOGIC
    const withBattery = input.withBattery || false;
    let batteryCost = 0;
    let batterySize = 0;

    if (withBattery) {
        // Auto-sizing logic
        if (systemSize <= 4) {
            batterySize = 5; // kWh
            batteryCost = 5000; // €
        } else if (systemSize <= 6) {
            batterySize = 5; // kWh
            batteryCost = 5000; // €
        } else {
            batterySize = 10; // kWh (for >= 6kWc)
            batteryCost = 9000; // €
        }
    } else {
        batterySize = 0;
        batteryCost = 0;
    }

    // --- BELGIUM LOGIC ---
    if (countryCode === "BE") {
        const cpMatch = address.match(/\b\d{4}\b/);
        const cp = cpMatch ? parseInt(cpMatch[0]) : 0;
        const isBxl = cp >= 1000 && cp <= 1299;
        region = isBxl ? "Bruxelles" : "Wallonie";

        const costPerKwc = getSetting('BE_COST_PER_KWC', SOLAR_CONSTANTS.BE.COST_PER_KWC_EUR);
        // Fallback for production if API fails (950 is a conservative average for BE)
        const safeProduction = totalProduction > 0 ? totalProduction : (systemSize * 950);

        estimatedCost = (systemSize * costPerKwc) + batteryCost;
        netCost = estimatedCost; // No generic federal rebates in BE currently

        // --- SAVINGS CALCULATION (BE) ---
        // 1. Gross Savings (Self-consumed + Injection)
        // Self-consumption rate affects how much we save on the bill vs how much we sell at injection price

        const selfConsumptionRate = withBattery ? 0.70 : SOLAR_CONSTANTS.BE.DEFAULT_SELF_CONSUMPTION_RATE; // 70% with battery is realistic for BE profile
        const selfConsumed = safeProduction * selfConsumptionRate;
        const exported = safeProduction * (1 - selfConsumptionRate);

        // Price to use for savings (Bill avoidance)
        const safePrice = electricityPriceBe > 0 ? electricityPriceBe : 0.38; // Force 0.38 if missing as per request

        // Injection Price (Fixed 0.05€/kWh as per 2026 market request)
        const injectionPrice = 0.05;

        const billSavings = selfConsumed * safePrice;
        const injectionIncome = exported * injectionPrice;

        const grossSavings = billSavings + injectionIncome;

        // 2. Prosumer Tax (Wallonie Only)
        let prosumerTax = 0;
        if (region === "Wallonie") {
            // Tax is approx 80€ per kWe (Inverter power).
            // We assume Inverter Power ~= System Size for simplicity, or slightly less (e.g. 0.85 ratio).
            // Requirement was: "Déduis systématiquement environ 80 € / kWe"
            const taxRate = getSetting('BE_PROSUMER_TAX', 80); // Default 80 EUR
            // Ideally kWe < kWc. Let's assume 1:1 for conservative worst-case or use 0.9 factor.
            // Request implies direct deduction based on size.
            prosumerTax = systemSize * taxRate;
        }

        annualSavings = grossSavings - prosumerTax;

        // Debug Log
        console.log(`[BE ENGINE] Size: ${systemSize}, Prod: ${safeProduction}, BillSave: ${billSavings}, InjIncome: ${injectionIncome}, Tax: ${prosumerTax}, NetSave: ${annualSavings}`);

    } else {
        // --- FRANCE LOGIC ---
        // Cost Scaling
        const baseCostPerKwc = getSetting('FR_COST_PER_KWC', SOLAR_CONSTANTS.FR.COST_PER_KWC_EUR);
        let actualCostPerKwc = baseCostPerKwc;

        // Tiered Cost Logic
        if (systemSize >= 9) actualCostPerKwc = baseCostPerKwc * 0.9;
        else if (systemSize >= 6) actualCostPerKwc = baseCostPerKwc * 0.95;

        // Fallback for production if API fails (1100 is avg for FR South/General)
        // Robust check for 0, null, or failure. 
        // Force minimum production related to system size to avoid "0" savings disasters.
        const safeProduction = (!totalProduction || totalProduction < 100)
            ? (systemSize * 1100)
            : totalProduction;

        estimatedCost = (systemSize * actualCostPerKwc) + batteryCost;

        // --- PRIME DEDUCTION (FR - Off Net Cost) ---
        // Prime values (approx 2026)
        const prime3 = getSetting('FR_PRIME_AUTOCONSO_3KW', 230); // Request says 230 for 9kWc, usually higher for small?
        // Actually current rates are ~300 for <3, ~230 for <9.
        const prime9 = getSetting('FR_PRIME_AUTOCONSO_9KW', 230);
        const prime36 = getSetting('FR_PRIME_AUTOCONSO_36KW', 200);

        let applicablePrime = 0;
        if (systemSize <= 3) applicablePrime = prime3;
        else if (systemSize <= 9) applicablePrime = prime9;
        else applicablePrime = prime36;

        const totalPrime = systemSize * applicablePrime;
        netCost = estimatedCost - totalPrime; // Direct deduction

        // --- SAVINGS CALCULATION (FR) ---
        let selfConsumptionRate = SOLAR_CONSTANTS.FR.DEFAULT_SELF_CONSUMPTION_RATE;
        if (withBattery) selfConsumptionRate = 0.75;

        const selfConsumed = safeProduction * selfConsumptionRate;
        const exported = safeProduction * (1 - selfConsumptionRate);

        const savingsBill = selfConsumed * electricityPriceFr; // 0.27

        // Injection Price (EDF OA) - Fixed 0.13€/kWh as per request
        const resalePrice = 0.13;
        const incomeOA = exported * resalePrice;

        annualSavings = savingsBill + incomeOA;

        // No Prosumer Tax in FR
    }

    // --- SANITY CHECKS ---

    // 1. Savings Cap: Cannot exceed Bill + 20% (approx generous buffer for surplus sales logic)
    // "Les économies annuelles ne peuvent jamais dépasser 100% de la facture annuelle + 20% de surplus."
    const maxAllowedSavings = (monthlyBill * 12) * 1.20;

    if (annualSavings > maxAllowedSavings) {
        console.warn(`[ENGINE] Savings capped! Calculated: ${annualSavings}, Max: ${maxAllowedSavings}`);
        annualSavings = maxAllowedSavings;
    }

    // 2. ROI Calculation & Cap
    // Annual Savings can fluctuate, but let's use the stable year 1 value for ROI base.
    // If Net Cost is used for FR (after prime), ROI improves.

    // Protection against negative savings (BE Tax heavy case)
    if (annualSavings <= 0) {
        annualSavings = 0;
        roiYears = 99;
    } else {
        roiYears = netCost / annualSavings;
    }

    // ROI Sanity Flag
    // "Si ROI > 30 ans -> Configuration non optimale"
    let recommendation = "";
    if (roiYears > 25) {
        recommendation = "⚠️ Configuration non optimale : La rentabilité estimée est trop faible (> 25 ans). Pensez à ajuster la puissance ou simplifier l'installation.";
    }

    // Regional notes
    if (countryCode === "BE" && region === "Wallonie") {
        recommendation += "\n\n💡 Conseil Prosumer : En Wallonie, maximiser l'autoconsommation est crucial pour compenser le tarif Prosumer.";
    }

    if (withBattery) {
        recommendation += `\n\n🔋 Batterie ${batterySize}kWh incluse : Optimise l'autoconsommation et sécurise votre prix du kWh.`;
    }

    const selfConsumptionRate = withBattery ? 0.75 : (countryCode === "BE"
        ? (withBattery ? 0.70 : SOLAR_CONSTANTS.BE.DEFAULT_SELF_CONSUMPTION_RATE)
        : SOLAR_CONSTANTS.FR.DEFAULT_SELF_CONSUMPTION_RATE);

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
            // @ts-ignore
            withBattery,
            // @ts-ignore
            recommendation
        }
    };
}
