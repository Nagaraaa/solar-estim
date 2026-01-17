import { describe, it, expect } from 'vitest';
import { calculateRecommendedSystem } from './engine';

// Mock Constants for stability in tests
const MOCK_FR_INPUT = {
    monthlyBill: 150,
    lat: 48.8566,
    lon: 2.3522,
    countryCode: 'FR',
    address: '75001 Paris',
    pvgisProductionPerKwc: 1100, // Standardize production
    slope: 30,
    azimuth: 0,
    withBattery: false
};

const MOCK_BE_INPUT = {
    monthlyBill: 150,
    lat: 50.8503,
    lon: 4.3517,
    countryCode: 'BE',
    address: '1000 Bruxelles',
    pvgisProductionPerKwc: 950,
    slope: 30,
    azimuth: 0,
    withBattery: false
};

describe('calculateRecommendedSystem', () => {
    describe('Sizing Logic (Shared)', () => {
        it('should recommend Tier 1 (3kWc) for small bills', () => {
            const result = calculateRecommendedSystem({ ...MOCK_FR_INPUT, monthlyBill: 70 }); // ~840/year -> <3500kWh
            expect(result.systemSize).toBe(3);
        });

        it('should recommend Tier 2 (6kWc) for medium bills', () => {
            const result = calculateRecommendedSystem({ ...MOCK_FR_INPUT, monthlyBill: 150 }); // ~1800/year -> ~6600kWh
            expect(result.systemSize).toBe(6);
        });

        it('should recommend Tier 3 (9kWc) for large bills', () => {
            const result = calculateRecommendedSystem({ ...MOCK_FR_INPUT, monthlyBill: 250 }); // ~3000/year -> >7500kWh
            expect(result.systemSize).toBe(9);
        });
    });

    describe('France Specifics', () => {
        it('should apply Prime Autoconso correctly for <3kWc', () => {
            const result = calculateRecommendedSystem({ ...MOCK_FR_INPUT, monthlyBill: 50 }); // Force small system
            expect(result.systemSize).toBe(2.5); // "Small" system logic

            // Expected Cost: 2.5 * 1800 = 4500
            // Prime: 2.5 * 230 = 575
            // Net: 3925
            expect(result.totalCost).toBe(4500);
            expect(result.netCost).toBe(3925);
        });

        it('should apply resale income (OA) for surplus', () => {
            const result = calculateRecommendedSystem(MOCK_FR_INPUT); // 6kWc
            // Production: 6 * 1100 = 6600 kWh
            // Self-consumed (45%): 2970 kWh
            // Exported (55%): 3630 kWh
            // Bill Savings: 2970 * 0.27 = 801.9
            // OA Income: 3630 * 0.13 = 471.9
            // Total Savings: 1273.8
            expect(result.annualSavings).toBeCloseTo(1274, 0);
        });
    });

    describe('Belgium Specifics', () => {
        it('should detect Wallonie region from postcode', () => {
            const result = calculateRecommendedSystem({ ...MOCK_BE_INPUT, address: '4000 Liège' });
            expect(result.details.region).toBe('Wallonie');
        });

        it('should detect Bruxelles region from postcode', () => {
            const result = calculateRecommendedSystem({ ...MOCK_BE_INPUT, address: '1000 Bruxelles' });
            expect(result.details.region).toBe('Bruxelles');
        });

        it('should deduct Prosumer Tax in Wallonie', () => {
            const result = calculateRecommendedSystem({ ...MOCK_BE_INPUT, address: '4000 Liège' }); // 6kWc
            // Production: 6 * 950 = 5700
            // Self-consumed (40%): 2280 | Exported: 3420
            // Bill Savings: 2280 * 0.37 = 843.6
            // Injection (0.05): 3420 * 0.05 = 171
            // Gross: 1014.6
            // Tax: 6 * 80 = 480
            // Net Savings: 534.6
            expect(result.annualSavings).toBeCloseTo(535, 0); // Approx
        });

        it('should NOT deduct Prosumer Tax in Bruxelles', () => {
            const result = calculateRecommendedSystem({ ...MOCK_BE_INPUT, address: '1000 Bruxelles' }); // 6kWc
            // Prosumer tax should be 0
            // Value significantly higher than Wallonie case
            expect(result.annualSavings).toBeGreaterThan(800);
        });
    });
});
