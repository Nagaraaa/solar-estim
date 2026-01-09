'use server'

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function deleteLead(leadId: number) {
    try {
        // 1. Verify Auth (Admin Only)
        // We use the same cookie as the middleware: 'solar-admin-auth'
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('solar-admin-auth');

        if (!authCookie || !authCookie.value) {
            return { success: false, error: "Non autorisé. Session expirée." };
        }

        // 2. Perform Delete (Service Role bypasses RLS)
        const { error } = await supabase
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
