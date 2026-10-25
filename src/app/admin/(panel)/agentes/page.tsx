import { requireAdmin } from '@/lib/auth';
import { PageHeader, Panel } from '@/components/admin/Panel';

const AGENTS = [
  { fase: '1-2', nombre: 'analista', hace: 'Cuestionario + tus notas → brief y nivel' },
  { fase: '3', nombre: 'cotizador', hace: 'Brief → cotización con la calculadora' },
  { fase: '4', nombre: 'director-creativo', hace: '2 direcciones visuales + hero navegable' },
  { fase: '5', nombre: 'arquitecto', hace: 'Mapa del sitio, Supabase, Stripe, plan de tareas' },
  { fase: '6', nombre: 'redactor', hace: 'Textos y SEO por página' },
  { fase: '7a', nombre: 'frontend', hace: 'Interfaz en Next.js desde el starter' },
  { fase: '7b', nombre: 'backend', hace: 'Supabase, auth, panel, Stripe' },
  { fase: '8', nombre: 'qa', hace: 'Reporte de calidad con evidencia' },
  { fase: '9', nombre: 'lanzamiento', hace: 'Producción en Vercel, dominio, SEO' },
  { fase: '10', nombre: 'soporte', hace: 'Manual, accesos, garantía, mantenimiento' },
];

export default async function Agentes() {
  const { supabase } = await requireAdmin();
  const { data: activity } = await supabase
    .from('activity')
    .select('id, actor, action, detail, created_at, projects(name)')
    .not('actor', 'in', '(fundador,cliente)')
    .order('created_at', { ascending: false })
    .limit(15);

  return (
    <>
      <PageHeader eyebrow="Agentes" title="Tu equipo" />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Equipo por fase">
          <ul className="divide-y divide-[#f1f2f4] text-sm">
            {AGENTS.map((a) => (
              <li key={a.nombre} className="flex gap-3 py-2">
                <span className="w-8 font-mono text-xs text-[#626A73]">{a.fase}</span>
                <span className="w-36 font-mono text-xs font-semibold">{a.nombre}</span>
                <span className="text-[#3b4249]">{a.hace}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Cómo se conectan">
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>En <code className="font-mono text-xs">tml-agencia/.env.local</code> pon <code className="font-mono text-xs">SUPABASE_URL</code> y <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> (solo en tu Mac, nunca en Git).</li>
            <li>Los agentes usan <code className="font-mono text-xs">node herramientas/tml.mjs</code> para leer el proyecto, el cuestionario y los precios, publicar documentos y actualizar fases.</li>
            <li>Todo lo que hacen aparece aquí y en la ficha del proyecto.</li>
          </ol>
          <pre className="mt-4 overflow-x-auto bg-[#111418] p-3 font-mono text-xs leading-relaxed text-white">{`node herramientas/tml.mjs proyectos
node herramientas/tml.mjs proyecto clinica-aurora
node herramientas/tml.mjs cuestionario clinica-aurora
node herramientas/tml.mjs doc clinica-aurora brief "Brief" clientes/clinica-aurora/01-brief.md
node herramientas/tml.mjs fase clinica-aurora brief completada 1.5`}</pre>
        </Panel>
        <Panel title="Actividad de agentes" className="xl:col-span-2">
          {(activity ?? []).length === 0 ? (
            <p className="text-sm text-[#626A73]">Los agentes aún no han registrado trabajo.</p>
          ) : (
            <ol className="space-y-2 text-sm">
              {(activity ?? []).map((a) => (
                <li key={a.id}>
                  <span className="font-mono text-xs font-semibold">{a.actor}</span> · {a.action.replace(/_/g, ' ')}
                  {a.detail ? ` — ${a.detail}` : ''} · <span className="text-xs text-[#626A73]">{(a.projects as unknown as { name: string } | null)?.name} · {new Date(a.created_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </>
  );
}
