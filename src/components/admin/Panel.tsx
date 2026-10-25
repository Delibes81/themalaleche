import type { ReactNode } from 'react';

export function Panel({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-[#e4e7eb] bg-white ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-[#eef0f2] px-5 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#626A73]">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

const tones: Record<string, string> = {
  neutral: 'bg-[#eef0f2] text-[#3b4249]',
  ink: 'bg-[#111418] text-white',
  red: 'bg-[#C73526] text-white',
  green: 'bg-emerald-50 text-emerald-800',
  amber: 'bg-amber-50 text-amber-800',
  blue: 'bg-sky-50 text-sky-800',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: keyof typeof tones }) {
  return <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

export function statusTone(status: string): keyof typeof tones {
  switch (status) {
    case 'prospecto':
      return 'neutral';
    case 'cotizado':
      return 'amber';
    case 'aprobado':
    case 'en_produccion':
      return 'blue';
    case 'en_revision':
      return 'red';
    case 'lanzado':
    case 'entregado':
      return 'green';
    default:
      return 'neutral';
  }
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626A73]">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111418] sm:text-3xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
