export const SOLAR_CONSTANTS = {
    // France
    FR: {
        ELECTRICITY_PRICE_EUR_KWH: 0.27, // Increased slighly to 2025 reality
        COST_PER_KWC_EUR: 1800, // Reduced to represent decent large install price
        PRIME_AUTOCONSO_EUR_KWC: 230, // Default to the 3-9kWc tier
        SURPLUS_RESALE_EUR_KWH: 0.13, // OA is roughly 12.69 -> 13cts
        DEFAULT_SELF_CONSUMPTION_RATE: 0.45, // 45% Optimistic
        PHONE_PREFIX: '+33',
        PHONE_REGEX: /^0[1-9]\d{8}$/,
        PHONE_PLACEHOLDER: "06 12 34 56 78",
        // New Constants for Refactor
        PRIME_3KW: 230, // < 3kWc (Technically often higher ~300 in reality, but keeping logic consistent)
        PRIME_9KW: 230, // < 9kWc
        PRIME_36KW: 200, // < 36kWc
    },
    // Belgique
    BE: {
        ELECTRICITY_PRICE_EUR_KWH: 0.37,
        COST_PER_KWC_EUR: 1400, // TVAC 6% implicit
        PROSUMER_TAX_EUR_KWE: 86.96, // Wallonie ORES average
        DEFAULT_SELF_CONSUMPTION_RATE: 0.40, // 40%
        PHONE_PREFIX: '+32',
        PHONE_REGEX: /^0\d{8,9}$/,
        PHONE_PLACEHOLDER: "0470 12 34 56",
        // New Constants for Refactor
        INJECTION_PRICE_EUR_KWH: 0.05,
        SAFE_PRODUCTION_AVG: 950,
    },
    // Sizing
    SIZING: {
        SMALL_CONSUMPTION_LIMIT_EUR: 60, // Monthly Bill < 60€
        TIER_1_LIMIT_KWH: 3500,
        TIER_2_LIMIT_KWH: 8000,
        SYSTEM_SIZE_SMALL: 2.5,
        SYSTEM_SIZE_TIER_1: 3,
        SYSTEM_SIZE_TIER_2: 6,
        SYSTEM_SIZE_LARGE: 9,
    },
    // Security / Validation
    VALIDATION: {
        NAME_MIN_LENGTH: 2,
        PHONE_MIN_LENGTH: 10,
        MAX_TEXT_LENGTH: 500, // Prevent abuse
    }
};
