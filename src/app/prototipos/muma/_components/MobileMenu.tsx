'use client';

import { useEffect, useState } from 'react';

const links = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#metodo', label: 'Método' },
  { href: '#portafolio', label: 'Portafolio' },
  { href: '#contacto', label: 'Contacto' },
];

export default function MobileMenu({ className = 'menu-btn' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);
  return (
    <>
      <button type="button" className={className} aria-expanded={open} aria-controls="muma-menu" onClick={() => setOpen(true)}>
        Menú
      </button>
      {open && (
        <div id="muma-menu" className="drawer" role="dialog" aria-modal="true" aria-label="Menú">
          <button type="button" className="close" onClick={() => setOpen(false)} autoFocus>Cerrar</button>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </div>
      )}
    </>
  );
}
