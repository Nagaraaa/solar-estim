export interface SimulationResult {
    systemSize: 3 | 6 | 9; // kWc
    annualProduction: number; // kWh
    annualSavings: number; // €
    roiYears: number;
    totalCost: number; // € (estimation)
    details: {
        lat: number;
        lon: number;
        pvgisProductionPerKwc: number; // kWh/kWc
    };
}

export interface SimulationInput {
    address: string;
    monthlyBill: number; // €
}
