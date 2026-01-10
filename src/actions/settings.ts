'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Initialize Supabase client for server-side usage
// We use process.env directly here because we are on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface SettingMap {
    [key: string]: any;
}

export async function fetchSettings(): Promise<SettingMap> {
    const { data, error } = await supabase
        .from('settings')
        .select('key, value');

    if (error) {
        console.error('Error fetching settings:', error);
        return {};
    }

    // Convert array to map
    const settings: SettingMap = {};
    data.forEach((item: { key: string; value: any }) => {
        settings[item.key] = item.value;
    });

    return settings;
}

export async function updateSettings(formData: FormData) {
    const updates: { key: string; value: any }[] = [];

    // Helper to push updates if value exists
    const pushIf = (key: string) => {
        const val = formData.get(key);
        if (val !== null) {
            // Try to parse number if it looks like one, otherwise string
            // actually for our settings they are mostly numbers or strings stored as JSON
            // JSONB in supabase expects valid JSON.
            // If it's a simple number, we can store it as a number or string.
            // Let's store as primitives.
            let parsedVal: any = val;
            if (!isNaN(Number(val)) && val !== '') {
                parsedVal = Number(val);
            }
            updates.push({ key, value: parsedVal });
        }
    };

    // Extract keys we know about
    // FR
    pushIf('FR_ELECTRICITY_PRICE');
    pushIf('FR_COST_PER_KWC'); // We might not have this input in the UI yet, check UI
    // The UI has: price-kwh-fr, buyback-fr, etc.
    // I need to map UI names to DB keys.

    // Let's re-map manually based on the Admin UI inputs I created:
    // price-kwh-fr -> FR_ELECTRICITY_PRICE
    // buyback-fr -> FR_SURPLUS_RESALE
    // price-kwh-be -> BE_ELECTRICITY_PRICE
    // prosumer-be -> BE_PROSUMER_TAX
    // prime-fr-3kw -> FR_PRIME_AUTOCONSO_3KW
    // prime-fr-9kw -> FR_PRIME_AUTOCONSO_9KW
    // prime-fr-36kw -> FR_PRIME_AUTOCONSO_36KW
    // prime-be-bru -> BE_GREEN_CERTS_BRU
    // email-contact -> ADMIN_CONTACT_EMAIL

    const rawData = Object.fromEntries(formData.entries());

    const mapping: Record<string, string> = {
        'price-kwh-fr': 'FR_ELECTRICITY_PRICE',
        'buyback-fr': 'FR_SURPLUS_RESALE',
        'price-kwh-be': 'BE_ELECTRICITY_PRICE',
        'prosumer-be': 'BE_PROSUMER_TAX',
        'prime-fr-3kw': 'FR_PRIME_AUTOCONSO_3KW',
        'prime-fr-9kw': 'FR_PRIME_AUTOCONSO_9KW',
        'prime-fr-36kw': 'FR_PRIME_AUTOCONSO_36KW',
        'prime-be-bru': 'BE_GREEN_CERTS_BRU',
        'email-contact': 'ADMIN_CONTACT_EMAIL'
    };

    for (const [uiKey, dbKey] of Object.entries(mapping)) {
        if (rawData[uiKey] !== undefined) {
            let val: any = rawData[uiKey];
            // Convert to number if applicable
            if (!isNaN(Number(val)) && val !== '' && uiKey !== 'email-contact') {
                val = Number(val);
            }
            // Supabase upsert
            const { error } = await supabase
                .from('settings')
                .upsert({ key: dbKey, value: val, updated_at: new Date().toISOString() });

            if (error) console.error(`Failed to update ${dbKey}`, error);
        }
    }

    revalidatePath('/admin/settings');
    revalidatePath('/simulateur'); // Revalidate simulator too

    return { success: true };
}
