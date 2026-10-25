import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import { signOut } from '../actions';
import AdminNav from './AdminNav';

export const metadata: Metadata = { title: 'Dashboard · The Mala Leche', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#111418] lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-[#e4e7eb] bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="inline-block h-2 w-2 bg-[#C73526]" aria-hidden />
            THE MALA LECHE
          </Link>
          <p className="hidden text-xs text-[#626A73] lg:mt-1 lg:block">Centro de operación</p>
          <form action={signOut} className="lg:hidden">
            <button className="text-xs font-semibold text-[#111418] hover:underline">Salir</button>
          </form>
        </div>
        <AdminNav />
        <div className="hidden border-t border-[#eef0f2] px-5 py-4 text-xs text-[#626A73] lg:absolute lg:bottom-0 lg:block lg:w-full">
          <p className="truncate">{user.email}</p>
          <form action={signOut}>
            <button className="mt-2 font-semibold text-[#111418] hover:underline">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
