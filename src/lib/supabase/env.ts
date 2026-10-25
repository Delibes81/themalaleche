export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return { url, anonKey };
}

export function siteUrl() {
  const fallback = process.env.NODE_ENV === 'production' ? 'https://themalaleche.com' : 'http://localhost:3000';
  return (process.env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/$/, '');
}
