'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/proyectos', label: 'Proyectos' },
  { href: '/admin/clientes', label: 'Clientes' },
  { href: '/admin/cotizador', label: 'Propuestas' },
  { href: '/admin/precios', label: 'Precios' },
  { href: '/admin/agentes', label: 'Agentes' },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
      {items.map((it) => {
        const active = it.href === '/admin' ? path === '/admin' : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-10 shrink-0 items-center gap-2 px-3 text-sm transition ${
              active ? 'bg-[#111418] font-semibold text-white' : 'text-[#3b4249] hover:bg-[#f1f2f4]'
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
