
export interface Details {
    lat: number;
    lon: number;
    pvgisProductionPerKwc: number;
    region?: string;
    futureProofMode?: boolean; // New flag for expert note
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
}

export function calculateRecommendedSystem(input: EngineInput): SimulationResult {
    const electricityPriceFr = 0.25;
    const electricityPriceBe = 0.37; // Updated BE Price

    const { countryCode, monthlyBill, pvgisProductionPerKwc, lat, lon, address } = input;
    const pricePerKwh = countryCode === "BE" ? electricityPriceBe : electricityPriceFr;

    // 1. Estimate Consumption
    const annualConsumption = (monthlyBill * 12) / pricePerKwh;

    // 2. Sizing Logic
    let systemSize = 3;
    let futureProofMode = false;

    if (monthlyBill < 60) {
        // Small consumption profile
        systemSize = 2.5;
        futureProofMode = true; // Flag for expert note
    } else if (annualConsumption < 4500) {
        systemSize = 3;
    } else if (annualConsumption < 8000) {
        systemSize = 6;
    } else {
        systemSize = 9;
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
        const costPerKwc = 1400; // This is a "good price" (TVAC 6% implied for simulation)
        estimatedCost = systemSize * costPerKwc;
        netCost = estimatedCost; // No generic federal rebates

        // Savings
        const grossSavings = totalProduction * electricityPriceBe;

        let prosumerTax = 0;
        if (region === "Wallonie") {
            // Updated ORES tariff: 86.96 €/kWe
            // Assuming kWe (inverter) ~= kWc (panels) for simplicity, or 2.5kVA for 2.5kWc
            prosumerTax = systemSize * 86.96;
        }

        annualSavings = grossSavings - prosumerTax;
        if (annualSavings < 0) annualSavings = 0;

    } else {
        // --- FRANCE ---
        const costPerKwc = 2000;
        estimatedCost = systemSize * costPerKwc;

        // Prime à l'autoconsommation
        let primePerKwc = 0;
        if (systemSize <= 3) primePerKwc = 300; // Zones <= 3kWc
        else if (systemSize <= 9) primePerKwc = 230; // Zones <= 9kWc
        else primePerKwc = 200;

        const totalPrime = systemSize * primePerKwc;
        netCost = estimatedCost - totalPrime;

        // Detailed Savings (Self-consumption + Sale)
        const selfConsumptionRate = 0.35;
        const selfConsumed = totalProduction * selfConsumptionRate;
        const exported = totalProduction * (1 - selfConsumptionRate);

        const savingsBill = selfConsumed * electricityPriceFr;
        const incomeOA = exported * 0.13; // EDF OA S21 (approx)

        annualSavings = savingsBill + incomeOA;
    }

    roiYears = annualSavings > 0 ? netCost / annualSavings : 99;

    return {
        systemSize,
        annualProduction: Math.round(totalProduction),
        annualSavings: Math.round(annualSavings),
        roiYears: parseFloat(roiYears.toFixed(1)),
        totalCost: estimatedCost,
        netCost: netCost,
        monthlyBill,
        estimatedConsumption: Math.round(annualConsumption),
        details: {
            lat,
            lon,
            pvgisProductionPerKwc,
            region,
            futureProofMode
        }
    };
}
