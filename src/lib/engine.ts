import { SOLAR_CONSTANTS } from '@/lib/constants';

// --- TYPES & INTERFACES ---

/**
 * Details sub-object for the simulation result.
 * Contains geographical and technical specifics.
 */
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

/**
 * Main result interface returned by the simulator.
 */
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
    yearlyData: {
        year: number;
        cumulativeCashflow: number;
        savings: number;
    }[];
}

/**
 * Input parameters for the engine calculation.
 */
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

/**
 * Dictionary of settings coming from the database.
 * Keys are typically uppercase (e.g., 'FR_ELECTRICITY_PRICE').
 */
type SolarSettings = Record<string, number | string | undefined>;

// --- HELPER FUNCTIONS ---

/**
 * Safely retrieves a setting value or returns a fallback constant.
 * Ensures the value is a positive number.
 */
const getSetting = (settings: SolarSettings, key: string, fallback: number): number => {
    const val = settings[key];
    const num = Number(val);
    // If val is missing, null, OR converts to 0 (which is invalid for prices/constants), use fallback
    return (val !== undefined && val !== null && !isNaN(num) && num > 0) ? num : fallback;
};

// --- STRATEGIES ---

/**
 * Strategy: Calculate System for Belgium (BE).
 * Handles: Wallonie vs Bruxelles regions, Prosumer Tax, specific sizing logic.
 */
function calculateBelgiumSystem(input: EngineInput, settings: SolarSettings, systemSize: number, totalProduction: number, batteryCost: number): Partial<SimulationResult> {
    const { address, withBattery } = input;
    const { BE } = SOLAR_CONSTANTS;

    // 1. Detect Region
    const cpMatch = address.match(/\b\d{4}\b/);
    const cp = cpMatch ? parseInt(cpMatch[0]) : 0;
    const isBxl = cp >= 1000 && cp <= 1299;
    const region = isBxl ? "Bruxelles" : "Wallonie";

    // 2. Costs
    const costPerKwc = getSetting(settings, 'BE_COST_PER_KWC', BE.COST_PER_KWC_EUR);
    const estimatedCost = (systemSize * costPerKwc) + batteryCost;
    const netCost = estimatedCost; // No generic federal rebates in BE currently

    // 3. Savings
    // Fallback for production if API fails
    const safeProduction = totalProduction > 0 ? totalProduction : (systemSize * BE.SAFE_PRODUCTION_AVG);

    // Self-consumption rate affects how much we save on the bill vs how much we sell at injection price
    const selfConsumptionRate = withBattery ? 0.70 : BE.DEFAULT_SELF_CONSUMPTION_RATE;
    const selfConsumed = safeProduction * selfConsumptionRate;
    const exported = safeProduction * (1 - selfConsumptionRate);

    // Electricity Price
    const electricityPriceBe = getSetting(settings, 'BE_ELECTRICITY_PRICE', BE.ELECTRICITY_PRICE_EUR_KWH);
    const safePrice = electricityPriceBe > 0 ? electricityPriceBe : 0.38;

    // Injection Price
    const injectionPrice = BE.INJECTION_PRICE_EUR_KWH;

    const billSavings = selfConsumed * safePrice;
    const injectionIncome = exported * injectionPrice;
    const grossSavings = billSavings + injectionIncome;

    // 4. Prosumer Tax (Wallonie Only)
    let prosumerTax = 0;
    if (region === "Wallonie") {
        // Legacy requirement was explicitly ~80€/kWe. 
        // We defer to the constant if provided in DB, but fallback to 80 to match exact legacy behavior for now.
        const taxRate = getSetting(settings, 'BE_PROSUMER_TAX', 80);
        prosumerTax = systemSize * taxRate;
    }

    const annualSavings = grossSavings - prosumerTax;

    // 5. Recommendations
    let recommendation = "";
    if (region === "Wallonie") {
        recommendation += "\n\n💡 Conseil Prosumer : En Wallonie, maximiser l'autoconsommation est crucial pour compenser le tarif Prosumer.";
    }

    return {
        totalCost: estimatedCost,
        netCost: netCost,
        annualSavings: annualSavings,
        selfConsumptionRate: selfConsumptionRate,
        details: {
            // @ts-ignore - Partial details to be merged
            region: region,
            recommendation: recommendation
        }
    };
}

/**
 * Strategy: Calculate System for France (FR).
 * Handles: Prime Autoconsommation, EDF OA (Resale), Tiered Pricing.
 */
function calculateFranceSystem(input: EngineInput, settings: SolarSettings, systemSize: number, totalProduction: number, batteryCost: number): Partial<SimulationResult> {
    const { withBattery } = input;
    const { FR } = SOLAR_CONSTANTS;

    // 1. Costs
    const baseCostPerKwc = getSetting(settings, 'FR_COST_PER_KWC', FR.COST_PER_KWC_EUR);
    let actualCostPerKwc = baseCostPerKwc;

    // Tiered Cost Logic (Economies of scale)
    if (systemSize >= 9) actualCostPerKwc = baseCostPerKwc * 0.9;
    else if (systemSize >= 6) actualCostPerKwc = baseCostPerKwc * 0.95;

    const estimatedCost = (systemSize * actualCostPerKwc) + batteryCost;

    // 2. Prime Deduction (Subsidies)
    const prime3 = getSetting(settings, 'FR_PRIME_AUTOCONSO_3KW', FR.PRIME_3KW);
    const prime9 = getSetting(settings, 'FR_PRIME_AUTOCONSO_9KW', FR.PRIME_9KW);
    const prime36 = getSetting(settings, 'FR_PRIME_AUTOCONSO_36KW', FR.PRIME_36KW);

    let applicablePrime = 0;
    if (systemSize <= 3) applicablePrime = prime3;
    else if (systemSize <= 9) applicablePrime = prime9;
    else applicablePrime = prime36;

    const totalPrime = systemSize * applicablePrime;
    const netCost = estimatedCost - totalPrime;

    // 3. Savings
    // Fallback for production if API fails
    const safeProduction = (!totalProduction || totalProduction < 100)
        ? (systemSize * 1100)
        : totalProduction;

    let selfConsumptionRate = FR.DEFAULT_SELF_CONSUMPTION_RATE;
    if (withBattery) selfConsumptionRate = 0.75;

    const selfConsumed = safeProduction * selfConsumptionRate;
    const exported = safeProduction * (1 - selfConsumptionRate);

    const electricityPriceFr = getSetting(settings, 'FR_ELECTRICITY_PRICE', FR.ELECTRICITY_PRICE_EUR_KWH);
    const savingsBill = selfConsumed * electricityPriceFr;

    // Resale Income (EDF OA)
    const resalePrice = FR.SURPLUS_RESALE_EUR_KWH;
    const incomeOA = exported * resalePrice;

    const annualSavings = savingsBill + incomeOA;

    return {
        totalCost: estimatedCost,
        netCost: netCost,
        annualSavings: annualSavings,
        selfConsumptionRate: selfConsumptionRate,
        details: {
            // @ts-ignore - Partial details to be merged
            region: "",
            recommendation: ""
        }
    };
}

// --- MAIN ENGINE ---

/**
 * Calculates the recommended solar installation based on user input and settings.
 * Dispatches to country-specific strategies.
 */
export function calculateRecommendedSystem(input: EngineInput, settings: SolarSettings = {}): SimulationResult {
    const { countryCode, monthlyBill, pvgisProductionPerKwc, lat, lon, slope, azimuth, withBattery } = input;
    const { SIZING, FR, BE } = SOLAR_CONSTANTS;

    // 1. Determine Energy Price for Sizing
    // We use a base price to estimate kWh consumption from the bill
    const electricityPriceFr = getSetting(settings, 'FR_ELECTRICITY_PRICE', FR.ELECTRICITY_PRICE_EUR_KWH);
    const electricityPriceBe = getSetting(settings, 'BE_ELECTRICITY_PRICE', BE.ELECTRICITY_PRICE_EUR_KWH);
    const pricePerKwh = countryCode === "BE" ? electricityPriceBe : electricityPriceFr;

    // 2. Estimate Annual Consumption and System Size
    const annualConsumption = (monthlyBill * 12) / pricePerKwh;

    let systemSize = SIZING.SYSTEM_SIZE_TIER_1;
    let futureProofMode = false;

    if (monthlyBill < SIZING.SMALL_CONSUMPTION_LIMIT_EUR) {
        systemSize = SIZING.SYSTEM_SIZE_SMALL; // 2.5
        futureProofMode = true;
    } else if (annualConsumption < SIZING.TIER_1_LIMIT_KWH) {
        systemSize = SIZING.SYSTEM_SIZE_TIER_1; // 3
    } else if (annualConsumption < SIZING.TIER_2_LIMIT_KWH) {
        systemSize = SIZING.SYSTEM_SIZE_TIER_2; // 6
    } else {
        systemSize = SIZING.SYSTEM_SIZE_LARGE; // 9
    }

    // 3. Production Calculation
    // Linear scaling based on PVGIS 1kWc data
    const totalProduction = systemSize * pvgisProductionPerKwc;

    // 4. Battery Logic (Shared Sizing)
    let batteryCost = 0;
    let batterySize = 0;

    if (withBattery) {
        if (systemSize <= 4) {
            batterySize = 5;
            batteryCost = 5000;
        } else if (systemSize <= 6) {
            batterySize = 5;
            batteryCost = 5000;
        } else {
            batterySize = 10;
            batteryCost = 9000;
        }
    }

    // 5. Strategy Dispatch (Financials)
    let strategyResult: Partial<SimulationResult>;

    if (countryCode === "BE") {
        strategyResult = calculateBelgiumSystem(input, settings, systemSize, totalProduction, batteryCost);
    } else {
        strategyResult = calculateFranceSystem(input, settings, systemSize, totalProduction, batteryCost);
    }

    // 6. Merge and Finalize Results
    let annualSavings = strategyResult.annualSavings || 0;
    const netCost = strategyResult.netCost || 0;
    let recommendation = strategyResult.details?.recommendation || "";

    // --- SANITY CHECKS ---

    // Cap Savings: Cannot exceed Bill + 20%
    const maxAllowedSavings = (monthlyBill * 12) * 1.20;
    if (annualSavings > maxAllowedSavings) {
        console.warn(`[ENGINE] Savings capped! Calculated: ${annualSavings}, Max: ${maxAllowedSavings}`);
        annualSavings = maxAllowedSavings;
    }

    // ROI Calculation
    // Protection against negative savings
    let roiYears = 99;
    if (annualSavings > 0) {
        roiYears = netCost / annualSavings;
    } else {
        annualSavings = 0; // No negative savings allowed in final output
    }

    // ROI Warning
    if (roiYears > 25) {
        recommendation = ("⚠️ Configuration non optimale : La rentabilité estimée est trop faible (> 25 ans). Pensez à ajuster la puissance ou simplifier l'installation." + "\n" + recommendation).trim();
    }

    // Battery Note
    if (withBattery) {
        recommendation += `\n\n🔋 Batterie ${batterySize}kWh incluse : Optimise l'autoconsommation et sécurise votre prix du kWh.`;
    }

    return {
        systemSize,
        annualProduction: Math.round(totalProduction),
        annualSavings: Math.round(annualSavings),
        roiYears: parseFloat(roiYears.toFixed(1)),
        totalCost: strategyResult.totalCost || 0,
        netCost: netCost,
        monthlyBill,
        estimatedConsumption: Math.round(annualConsumption),
        selfConsumptionRate: strategyResult.selfConsumptionRate,
        details: {
            lat,
            lon,
            pvgisProductionPerKwc,
            futureProofMode,
            slope,
            azimuth,
            withBattery,
            region: strategyResult.details?.region,
            recommendation: recommendation
        }
    };
}

/**
 * Calculates financial projection over X years considering inflation and energy price evolution.
 */
export function calculateFinancialProjection({
    result,
    monthlyBill,
    inflationRate,
    years = 25
}: FinancialProjectionInput): FinancialProjectionOutput {
    let cumulativeWithout = 0;
    let cumulativeWith = -(result.netCost); // Start with negative investment
    let currentBill = monthlyBill * 12;

    const yearlyData = [
        {
            year: 0,
            cumulativeCashflow: cumulativeWith,
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
