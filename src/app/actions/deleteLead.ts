'use server'

import { supabase, supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function deleteLead(leadId: number) {
    try {
        // 1. Verify Auth with Supabase (Check JWT Validity)
        const cookieStore = await cookies();
        const token = cookieStore.get('solar-admin-auth')?.value;

        if (!token) {
            return { success: false, error: "Non autorisé. Jeton manquant." };
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error("Auth verification failed:", authError);
            return { success: false, error: "Session expirée ou invalide." };
        }

        // 2. Perform Delete with Admin Privileges (Bypass RLS)
        const { error } = await supabaseAdmin
            .from('leads')
            .delete()
            .eq('id', leadId);

        if (error) {
            console.error("Delete Error:", error);
            return { success: false, error: "Erreur lors de la suppression." };
        }

        // 3. Revalidate Dashboard
        revalidatePath('/admin');
        return { success: true };

    } catch (e: any) {
        return { success: false, error: e.message || "Erreur serveur." };
    }
}
