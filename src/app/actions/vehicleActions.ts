'use server'

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Zod Schema for Validation
const VehicleSchema = z.object({
    brand: z.string().min(1, "La marque est requise"),
    model: z.string().min(1, "Le modèle est requis"),
    year: z.coerce.number().min(2010).max(2030).optional(),
    battery_capacity_kwh: z.coerce.number().positive("La capacité doit être positive"),
    range_wltp_km: z.coerce.number().positive("L'autonomie doit être positive"),
    consumption_kwh_100km: z.coerce.number().positive().optional(),
    max_charge_power_kw: z.coerce.number().positive().optional(),
    real_world_factor: z.coerce.number().min(0.5).max(1.0).default(0.85),
    charging_efficiency: z.coerce.number().min(0.5).max(1.0).default(0.90),
    is_bidirectional: z.boolean().default(false),
    image_url: z.string().url().optional().or(z.literal("")),
});

export type VehicleFormState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function createVehicle(prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
    try {
        const rawData = Object.fromEntries(formData.entries());

        // Handle checkbox
        const data = {
            ...rawData,
            is_bidirectional: rawData.is_bidirectional === 'on',
        };

        const validated = VehicleSchema.safeParse(data);

        if (!validated.success) {
            return {
                success: false,
                error: "Détails invalides",
                fieldErrors: validated.error.flatten().fieldErrors,
            };
        }

        const { error } = await supabaseAdmin
            .from('vehicles')
            .insert(validated.data);

        if (error) throw error;

        revalidatePath('/admin/vehicles');
        return { success: true };

    } catch (error: any) {
        console.error("Create Vehicle Error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateVehicle(id: string, prevState: VehicleFormState, formData: FormData): Promise<VehicleFormState> {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const data = {
            ...rawData,
            is_bidirectional: rawData.is_bidirectional === 'on',
        };

        const validated = VehicleSchema.safeParse(data);

        if (!validated.success) {
            return {
                success: false,
                error: "Détails invalides",
                fieldErrors: validated.error.flatten().fieldErrors,
            };
        }

        const { error } = await supabaseAdmin
            .from('vehicles')
            .update(validated.data)
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/vehicles');
        return { success: true };

    } catch (error: any) {
        console.error("Update Vehicle Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteVehicle(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseAdmin
            .from('vehicles')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/vehicles');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getVehicles() {
    const { data, error } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .order('brand', { ascending: true })
        .order('model', { ascending: true });

    if (error) {
        console.error("Fetch Vehicles Error:", error);
        return [];
    }
    return data;
}
