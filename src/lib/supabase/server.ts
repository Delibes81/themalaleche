import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient as createPlainClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseEnv } from './env';

/** Cliente con la sesión del usuario (RLS aplica como el usuario conectado). */
export async function createClient() {
  const { url, anonKey } = supabaseEnv();
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el proxy se encarga de refrescar la sesión.
        }
      },
    },
  });
}

/** Cliente anónimo sin sesión: solo puede usar las funciones públicas (propuesta y cuestionario). */
export function createPublicClient() {
  const { url, anonKey } = supabaseEnv();
  return createPlainClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
