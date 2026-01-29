'use server'

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { checkAdminSession } from '@/lib/auth-checks';

// Zod Schema for Validation (Updated to match User Schema)
const VehicleSchema = z.object({
    brand: z.string().min(1, "La marque est requise"),
    model: z.string().min(1, "Le modèle est requis"),
    consumption_wltp: z.coerce.number().min(5).max(50, "Consommation irréaliste"),
    battery_usable: z.coerce.number().int().positive("La capacité doit être positive"),
    real_world_factor: z.coerce.number().min(1.0).max(2.0).default(1.15),
    charging_efficiency: z.coerce.number().min(0.5).max(1.0).default(0.88),
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
        await checkAdminSession(); // SECURITE

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
        await checkAdminSession(); // SECURITE

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
            .update({ ...validated.data, updated_at: new Date().toISOString() })
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
        await checkAdminSession(); // SECURITE

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
