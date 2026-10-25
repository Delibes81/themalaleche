'use client';

import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

export function SubmitButton({ children, variant = 'primary', className = '' }: { children: ReactNode; variant?: 'primary' | 'ghost'; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${variant === 'primary' ? btnPrimary : btnGhost} ${className}`}>
      {pending ? 'Guardando…' : children}
    </button>
  );
}

export function FormMessage({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state) return null;
  return (
    <p role="status" className={`text-sm ${state.ok ? 'text-emerald-700' : 'text-[#C73526]'}`}>
      {state.message}
    </p>
  );
}

export const btnPrimary =
  'inline-flex min-h-10 items-center justify-center gap-2 bg-[#111418] px-4 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50';
export const btnGhost =
  'inline-flex min-h-10 items-center justify-center gap-2 border border-[#d5d9de] bg-white px-4 text-sm font-semibold text-[#111418] transition hover:border-[#111418] disabled:opacity-50';
export const inputCls =
  'w-full border border-[#d5d9de] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#111418] focus:ring-2 focus:ring-[#111418]/10';
export const labelCls = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-[#626A73]';
