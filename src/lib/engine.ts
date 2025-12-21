export interface SimulationResult {
    systemSize: number; // kWc
    annualProduction: number; // kWh
    annualSavings: number; // €
    roiYears: number; // years
    totalCost: number; // €
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
    let cumulativeWith = result.totalCost; // Starts with installation cost

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
