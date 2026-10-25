import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { statusLabel } from '@/lib/phases';
import { mxn } from '@/lib/pricing';
import { Badge, PageHeader, Panel, statusTone } from '@/components/admin/Panel';
import { btnPrimary } from '@/components/admin/ui';

export default async function Proyectos() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from('projects')
    .select('id, slug, name, status, level, price, due_date, updated_at, clients(name)')
    .order('updated_at', { ascending: false });
  const rows = (data ?? []) as unknown as {
    id: string; slug: string; name: string; status: string; level: string | null; price: number | null; due_date: string | null; updated_at: string; clients: { name: string } | null;
  }[];

  return (
    <>
      <PageHeader eyebrow="Proyectos" title="Todos los proyectos" action={<Link href="/admin/proyectos/nuevo" className={btnPrimary}>Nuevo proyecto</Link>} />
      <Panel>
        {rows.length === 0 ? (
          <p className="text-sm text-[#626A73]">Sin proyectos todavía.</p>
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[#eef0f2] text-xs uppercase tracking-wider text-[#626A73]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Proyecto</th>
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Nivel</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold">Precio</th>
                  <th className="px-5 py-3 font-semibold">Entrega</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-b border-[#f1f2f4] last:border-0 hover:bg-[#fafbfb]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/proyectos/${p.slug}`} className="font-semibold hover:underline">{p.name}</Link>
                      <p className="font-mono text-xs text-[#626A73]">{p.slug}</p>
                    </td>
                    <td className="px-5 py-3">{p.clients?.name}</td>
                    <td className="px-5 py-3 font-mono text-xs">{p.level ?? '—'}</td>
                    <td className="px-5 py-3"><Badge tone={statusTone(p.status)}>{statusLabel(p.status)}</Badge></td>
                    <td className="px-5 py-3 text-right tabular-nums">{p.price ? mxn(Number(p.price)) : '—'}</td>
                    <td className="px-5 py-3 text-xs">{p.due_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
