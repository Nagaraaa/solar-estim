import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function checkAdminSession() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('solar-admin-auth');

    if (!authCookie || !authCookie.value) {
        throw new Error('Non autorisé : Session manquante');
    }

    const token = authCookie.value;

    // Vérification du token via Supabase Admin (qui a la clé secrète pour valider le JWT)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
        console.error("Auth Check Failed:", error);
        throw new Error('Non autorisé : Session invalide ou expirée');
    }

    return user;
}
