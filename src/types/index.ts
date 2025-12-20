export interface SimulationResult {
    systemSize: 3 | 6 | 9; // kWc
    annualProduction: number; // kWh
    annualSavings: number; // €
    roiYears: number; // Années
    totalCost: number; // € (estimation)
    estimatedConsumption: number; // kWh/an (Estimated from bill)
    details: {
        lat: number;
        lon: number;
        pvgisProductionPerKwc: number; // kWh/kWc
        region?: string; // BE region
    };
}

export interface SimulationInput {
    address: string;
    monthlyBill: number; // €
    lat?: number;
    lon?: number;
    countryCode?: "FR" | "BE";
}
