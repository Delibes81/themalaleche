import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';

/** Exige sesión de administrador. La autorización real la impone RLS en Supabase. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/admin/login?error=sin-acceso');

  return { supabase, user };
}
