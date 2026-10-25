import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Acceso · The Mala Leche', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f8] px-5">
      <div className="w-full max-w-sm border border-[#e4e7eb] bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626A73]">The Mala Leche</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111418]">Dashboard</h1>
        {error === 'sin-acceso' && (
          <p className="mt-4 border-l-2 border-[#C73526] pl-3 text-sm text-[#C73526]">Tu cuenta no tiene permisos de administrador.</p>
        )}
        <LoginForm next={next} />
      </div>
    </main>
  );
}
