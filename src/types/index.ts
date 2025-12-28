export interface SimulationResult {
    systemSize: number; // kWc (Flexible: 2.5, 3, 6, 9...)
    annualProduction: number; // kWh
    annualSavings: number; // €
    roiYears: number; // Années
    totalCost: number; // € (estimation brute)
    netCost: number; // € (Coût net après primes)
    monthlyBill: number; // € (Facture mensuelle originale)
    estimatedConsumption: number; // kWh/an (Estimated from bill)
    details: {
        lat: number;
        lon: number;
        pvgisProductionPerKwc: number; // kWh/kWc
        region?: string; // BE region
        futureProofMode?: boolean; // Advice flag
        slope?: number; // Used slope (tilt)
        azimuth?: number; // Used azimuth (aspect)
    };
}

export interface SimulationInput {
    address: string;
    monthlyBill: number; // €
    lat?: number;
    lon?: number;
    countryCode?: "FR" | "BE";
    slope?: number; // 0-90
    azimuth?: number; // -180 to 180
}
