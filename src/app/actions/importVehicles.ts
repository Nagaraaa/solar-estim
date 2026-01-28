'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type ImportResult = {
    success: boolean;
    count?: number;
    error?: string;
    details?: string[];
};

export async function importVehicles(formData: FormData): Promise<ImportResult> {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: "Aucun fichier fourni." };
        }

        const text = await file.text();
        const lines = text.split(/\r?\n/);

        // Expected Header: Marque,Modèle,Conso WLTP (kWh/100),Facteur Réel,Batterie (kWh),Efficience,V2H/G
        // We will skip header if present, or detect it.
        // Simple strategy: Filter empty lines, map values.

        // Detect Separator
        const sampleLine = lines.find(l => l.trim().length > 0);
        const separator = sampleLine && sampleLine.includes(';') ? ';' : ',';

        const vehicles = [];
        const errors = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Skip Header
            if (line.toLowerCase().startsWith('marque') || line.toLowerCase().startsWith('brand')) continue;

            const parts = line.split(separator).map(p => p.trim());

            if (parts.length < 5) { // Relaxed check (allow missing V2G)
                errors.push(`Ligne ${i + 1} ignorée : ${parts.length} colonnes trouvées (séparateur: '${separator}')`);
                continue;
            }

            // Map Columns
            // Marque | Modèle | Conso | Facteur | Batterie | Efficience | V2H/G
            const brand = parts[0];
            const model = parts[1];

            // Helper for numbers (handle "15,2" and "15.2")
            const parseNum = (val: string) => {
                if (!val) return NaN;
                return parseFloat(val.replace(',', '.'));
            };

            const consumption_wltp = parseNum(parts[2]);
            const real_world_factor = parseNum(parts[3]) || 1.15;
            const battery_usable = Math.round(parseNum(parts[4])); // Round to Integer for DB compatibility
            const charging_efficiency = parseNum(parts[5]) || 0.88;
            const v2gRaw = parts[6] || "";
            const is_bidirectional = v2gRaw.includes('✅') || v2gRaw.toLowerCase() === 'true' || v2gRaw === '1';

            if (!brand || !model || isNaN(consumption_wltp) || isNaN(battery_usable)) {
                // Detailed parsing error
                errors.push(`Ligne ${i + 1} invalide : ${brand} ${model} (Conso: ${parts[2]}, Batt: ${parts[4]})`);
                continue;
            }

            vehicles.push({
                brand,
                model,
                consumption_wltp,
                real_world_factor,
                battery_usable,
                charging_efficiency,
                is_bidirectional,
                image_url: ""
            });
        }

        if (vehicles.length === 0) {
            return { success: false, error: "Aucun véhicule valide trouvé.", details: errors };
        }

        // 2. Manual Upsert Strategy (since unique constraint might be missing)

        // Fetch existing
        const { data: existingVehicles, error: fetchError } = await supabaseAdmin
            .from('vehicles')
            .select('id, brand, model');

        if (fetchError) {
            return { success: false, error: "Erreur lecture base de données: " + fetchError.message };
        }

        const updates = [];
        const inserts = [];

        for (const v of vehicles) {
            // Find match (Case insensitive match on Brand AND Model for safety)
            const match = existingVehicles?.find(ev =>
                ev.brand?.toLowerCase() === v.brand.toLowerCase() &&
                ev.model?.toLowerCase() === v.model.toLowerCase()
            );

            if (match) {
                // Prepare Update
                updates.push(
                    supabaseAdmin
                        .from('vehicles')
                        .update(v)
                        .eq('id', match.id)
                );
            } else {
                // Prepare Insert
                inserts.push(v);
            }
        }

        // Execute Updates (Parallel)
        if (updates.length > 0) {
            await Promise.all(updates);
        }

        // Execute Inserts (Batch)
        if (inserts.length > 0) {
            const { error: insertError } = await supabaseAdmin
                .from('vehicles')
                .insert(inserts);

            if (insertError) {
                return { success: false, error: "Erreur insertion: " + insertError.message };
            }
        }

        revalidatePath('/admin/vehicles');
        return {
            success: true,
            count: vehicles.length,
            details: [`${inserts.length} ajoutés`, `${updates.length} mis à jour`]
        };

    } catch (err: any) {
        console.error("Import Exception:", err);
        return { success: false, error: err.message };
    }
}
