
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client Public (Respecte les RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client Admin (Bypass RLS - Service Role)
// ⚠️ À utiliser UNIQUEMENT dans des contextes serveur sécurisés (Server Actions, API Routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
