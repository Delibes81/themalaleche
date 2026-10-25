import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { APPROVALS, statusLabel } from '@/lib/phases';
import { mxn } from '@/lib/pricing';
import { Badge, PageHeader, Panel, statusTone } from '@/components/admin/Panel';
import { btnPrimary } from '@/components/admin/ui';

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  status: string;
  level: string | null;
  price: number | null;
  due_date: string | null;
  clients: { name: string } | null;
};
type PhaseRow = { project_id: string; position: number; key: string; label: string; name: string; agent: string; status: string };

const COLUMNS = [
  { title: 'Prospectos', statuses: ['prospecto'] },
  { title: 'Cotizados', statuses: ['cotizado'] },
  { title: 'En producción', statuses: ['aprobado', 'en_produccion', 'en_revision'] },
  { title: 'Lanzados', statuses: ['lanzado', 'entregado'] },
];

export default async function Resumen() {
  const { supabase } = await requireAdmin();
  const [{ data: projects }, { data: phases }, { data: approvals }, { data: activity }] = await Promise.all([
    supabase.from('projects').select('id, slug, name, status, level, price, due_date, clients(name)').order('updated_at', { ascending: false }),
    supabase.from('project_phases').select('project_id, position, key, label, name, agent, status').order('position'),
    supabase.from('approvals').select('project_id, kind'),
    supabase.from('activity').select('id, actor, action, detail, created_at, projects(slug, name)').order('created_at', { ascending: false }).limit(12),
  ]);

  const list = (projects ?? []) as unknown as ProjectRow[];
  const phaseList = (phases ?? []) as PhaseRow[];
  const approved = new Set((approvals ?? []).map((a) => `${a.project_id}:${a.kind}`));

  const current = new Map<string, PhaseRow>();
  for (const ph of phaseList) {
    if (!current.has(ph.project_id) && !['completada', 'no_aplica'].includes(ph.status)) current.set(ph.project_id, ph);
  }
  const blockers = list
    .filter((p) => !['entregado', 'cancelado', 'pausado'].includes(p.status))
    .map((p) => {
      const ph = current.get(p.id);
      const need = ph ? APPROVALS.find((a) => a.before === ph.key && !approved.has(`${p.id}:${a.kind}`)) : undefined;
      return { p, ph, need };
    });

  const active = list.filter((p) => ['aprobado', 'en_produccion', 'en_revision'].includes(p.status));
  const sum = (arr: ProjectRow[]) => arr.reduce((s, p) => s + (Number(p.price) || 0), 0);
  const kpis = [
    { label: 'En producción', value: String(active.length), sub: mxn(sum(active)) },
    { label: 'Cotizaciones abiertas', value: String(list.filter((p) => p.status === 'cotizado').length), sub: mxn(sum(list.filter((p) => p.status === 'cotizado'))) },
    { label: 'Esperan aprobación', value: String(blockers.filter((b) => b.need).length), sub: 'del cliente' },
    { label: 'Prospectos', value: String(list.filter((p) => p.status === 'prospecto').length), sub: 'por calificar' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Resumen"
        title="Centro de operación"
        action={
          <Link href="/admin/proyectos/nuevo" className={btnPrimary}>
            Nuevo proyecto
          </Link>
        }
      />

      <div className="grid gap-px border border-[#e4e7eb] bg-[#e4e7eb] sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#626A73]">{k.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{k.value}</p>
            <p className="text-sm text-[#626A73] tabular-nums">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Panel title="Tablero de proyectos">
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {COLUMNS.map((col) => {
                const items = blockers.filter((b) => col.statuses.includes(b.p.status));
                return (
                  <div key={col.title}>
                    <p className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#626A73]">
                      {col.title} <span className="tabular-nums">{items.length}</span>
                    </p>
                    <ul className="space-y-2">
                      {items.map(({ p, ph, need }) => (
                        <li key={p.id}>
                          <Link href={`/admin/proyectos/${p.slug}`} className="block border border-[#e4e7eb] p-3 transition hover:border-[#111418]">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold leading-tight">{p.name}</p>
                              {p.level && <span className="font-mono text-xs text-[#626A73]">{p.level}</span>}
                            </div>
                            <p className="mt-0.5 text-xs text-[#626A73]">{p.clients?.name}</p>
                            <p className="mt-2 text-xs">
                              {ph ? (
                                <>
                                  Fase {ph.label} · {ph.name} <span className="text-[#626A73]">({ph.agent})</span>
                                </>
                              ) : (
                                'Todas las fases completas'
                              )}
                            </p>
                            {need && (
                              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#C73526]">
                                <span className="inline-block h-1.5 w-1.5 bg-[#C73526]" aria-hidden />
                                Falta aprobación: {need.label}
                              </p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Actividad reciente">
          {(activity ?? []).length === 0 ? (
            <p className="text-sm text-[#626A73]">Sin actividad todavía.</p>
          ) : (
            <ol className="space-y-3">
              {(activity ?? []).map((a) => {
                const proj = a.projects as unknown as { slug: string; name: string } | null;
                return (
                  <li key={a.id} className="text-sm">
                    <p>
                      <span className="font-semibold">{a.actor}</span> · {a.action.replace(/_/g, ' ')}
                      {a.detail ? <span className="text-[#626A73]"> — {a.detail}</span> : null}
                    </p>
                    <p className="text-xs text-[#626A73]">
                      {proj ? (
                        <Link href={`/admin/proyectos/${proj.slug}`} className="underline-offset-2 hover:underline">
                          {proj.name}
                        </Link>
                      ) : (
                        'General'
                      )}{' '}
                      · {new Date(a.created_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>
      </div>

      {list.length > 0 && (
        <p className="mt-6 text-xs text-[#626A73]">
          Estados: {Array.from(new Set(list.map((p) => p.status))).map((s) => (
            <span key={s} className="mr-2">
              <Badge tone={statusTone(s)}>{statusLabel(s)}</Badge>
            </span>
          ))}
        </p>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="py-10 text-center">
      <p className="font-semibold">Aún no hay proyectos.</p>
      <p className="mt-1 text-sm text-[#626A73]">Crea el primero y envía el cuestionario al cliente.</p>
      <Link href="/admin/proyectos/nuevo" className={`${btnPrimary} mt-4`}>
        Nuevo proyecto
      </Link>
    </div>
  );
}
