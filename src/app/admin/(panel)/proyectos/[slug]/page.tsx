import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { siteUrl } from '@/lib/supabase/env';
import { APPROVALS, statusLabel } from '@/lib/phases';
import { answersToMarkdown, type Answers } from '@/lib/questionnaire';
import { mxn } from '@/lib/pricing';
import { Badge, PageHeader, Panel, statusTone } from '@/components/admin/Panel';
import Markdown from '@/components/admin/Markdown';
import { btnGhost, inputCls } from '@/components/admin/ui';
import { createQuestionnaire, getPrecios, recordApproval, removeApproval } from '../../../actions';
import ProjectForm from './ProjectForm';
import PhaseRow from './PhaseRow';
import QuickQuote from './QuickQuote';
import NotesForm from './NotesForm';
import CopyButton from './CopyButton';

export default async function ProyectoDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase } = await requireAdmin();

  const { data: project } = await supabase
    .from('projects')
    .select('*, clients(id, name, contact_name, email, phone, has_branding)')
    .eq('slug', slug)
    .maybeSingle();
  if (!project) notFound();
  const client = project.clients as { id: string; name: string; contact_name: string | null; email: string | null; phone: string | null; has_branding: boolean };

  const [{ data: phases }, { data: approvals }, { data: questionnaires }, { data: documents }, { data: proposals }, { data: activity }, precios] =
    await Promise.all([
      supabase.from('project_phases').select('*').eq('project_id', project.id).order('position'),
      supabase.from('approvals').select('*').eq('project_id', project.id),
      supabase.from('questionnaires').select('*').eq('project_id', project.id).order('created_at', { ascending: false }),
      supabase.from('documents').select('id, phase_key, kind, title, author, updated_at').eq('project_id', project.id).order('created_at'),
      supabase.from('proposals').select('id, budget, status, created_at').eq('project_id', project.id).order('created_at', { ascending: false }),
      supabase.from('activity').select('id, actor, action, detail, created_at').eq('project_id', project.id).order('created_at', { ascending: false }).limit(15),
      getPrecios(),
    ]);

  const q = questionnaires?.[0];
  const approvalByKind = new Map((approvals ?? []).map((a) => [a.kind as string, a]));
  const currentPhase = (phases ?? []).find((p) => !['completada', 'no_aplica'].includes(p.status));
  const blocking = currentPhase ? APPROVALS.find((a) => a.before === currentPhase.key && !approvalByKind.has(a.kind)) : undefined;

  return (
    <>
      <PageHeader
        eyebrow={`${client.name} · ${project.slug}`}
        title={project.name}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone(project.status)}>{statusLabel(project.status)}</Badge>
            {project.level && <Badge tone="ink">{project.level}</Badge>}
            {project.price && <span className="text-sm font-semibold tabular-nums">{mxn(Number(project.price))}</span>}
            {project.preview_url && (
              <a href={project.preview_url} target="_blank" rel="noreferrer" className={btnGhost}>
                Ver preview ↗
              </a>
            )}
          </div>
        }
      />

      {blocking && (
        <div className="mb-6 flex items-center gap-3 border border-[#C73526] bg-white px-4 py-3 text-sm">
          <span className="inline-block h-2 w-2 bg-[#C73526]" aria-hidden />
          <p>
            <strong>Siguiente paso bloqueado:</strong> registra la aprobación de «{blocking.label}» antes de pasar a {currentPhase?.name}.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="min-w-0 space-y-6">
          <Panel title="Fases y agentes">
            <div className="-m-5 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b border-[#eef0f2] text-xs uppercase tracking-wider text-[#626A73]">
                  <tr>
                    <th className="px-5 py-2 font-semibold">Fase</th>
                    <th className="px-5 py-2 font-semibold">Agente</th>
                    <th className="px-5 py-2 font-semibold">Estado</th>
                    <th className="px-5 py-2 font-semibold">Horas reales</th>
                  </tr>
                </thead>
                <tbody>
                  {(phases ?? []).map((ph) => (
                    <PhaseRow key={ph.id} phase={ph} slug={slug} current={ph.id === currentPhase?.id} />
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Cuestionario del cliente"
            action={q ? <Badge tone={q.status === 'respondido' ? 'green' : q.status === 'en_progreso' ? 'amber' : 'neutral'}>{q.status.replace('_', ' ')}</Badge> : null}
          >
            {!q ? (
              <div className="space-y-3">
                <p className="text-sm text-[#626A73]">
                  Genera el enlace y envíaselo al cliente. Recomendado: cuestionario <strong>{client.has_branding ? 'A (con branding)' : 'B (sin branding)'}</strong>.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['A', 'B'] as const).map((v) => (
                    <form key={v} action={createQuestionnaire}>
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="slug" value={slug} />
                      <input type="hidden" name="variant" value={v} />
                      <button className={btnGhost}>Crear cuestionario {v === 'A' ? 'A · con branding' : 'B · sin branding'}</button>
                    </form>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#626A73]">Enlace para el cliente (variante {q.variant})</p>
                  <div className="mt-1 flex gap-2">
                    <input readOnly value={`${siteUrl()}/cuestionario/${q.token}`} className={`${inputCls} min-w-0 flex-1 font-mono text-xs`} aria-label="Enlace del cuestionario" />
                    <CopyButton text={`${siteUrl()}/cuestionario/${q.token}`} />
                  </div>
                  <p className="mt-1 text-xs text-[#626A73]">Vence el {new Date(q.expires_at).toLocaleDateString('es-MX')}.</p>
                </div>
                {Object.keys(q.answers ?? {}).length > 0 && (
                  <details className="border border-[#eef0f2] p-4" open={q.status === 'respondido'}>
                    <summary className="cursor-pointer text-sm font-semibold">Respuestas del cliente</summary>
                    <Markdown>{answersToMarkdown(q.variant, q.answers as Answers)}</Markdown>
                  </details>
                )}
                <NotesForm questionnaireId={q.id} projectId={project.id} slug={slug} initial={(q.interviewer_notes as { texto?: string })?.texto ?? ''} />
              </div>
            )}
          </Panel>

          <Panel title="Cotización rápida">
            <QuickQuote precios={precios} projectId={project.id} slug={slug} clientName={client.name} defaultLevel={project.level} />
          </Panel>

          <Panel title="Documentos de los agentes">
            {(documents ?? []).length === 0 ? (
              <p className="text-sm text-[#626A73]">
                Aún no hay documentos. Los agentes los publican aquí con <code className="bg-[#f1f2f4] px-1 font-mono text-xs">tml doc {slug}</code>.
              </p>
            ) : (
              <ul className="divide-y divide-[#f1f2f4]">
                {(documents ?? []).map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <Link href={`/admin/proyectos/${slug}/documentos/${d.id}`} className="font-semibold hover:underline">{d.title}</Link>
                    <span className="text-xs text-[#626A73]">
                      {d.author} · {new Date(d.updated_at).toLocaleDateString('es-MX')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Aprobaciones del cliente">
            <ul className="space-y-4">
              {APPROVALS.map((a) => {
                const done = approvalByKind.get(a.kind);
                const isNext = !done && APPROVALS.find((x) => !approvalByKind.has(x.kind))?.kind === a.kind;
                return (
                  <li key={a.kind} className="text-sm">
                    <p className="flex items-center gap-2 font-semibold">
                      <span className={`inline-block h-2 w-2 ${done ? 'bg-emerald-600' : 'border border-[#9aa1a8]'}`} aria-hidden />
                      {a.label}
                    </p>
                    {done ? (
                      <div className="ml-4 mt-1 text-xs text-[#626A73]">
                        {done.approved_by} · {new Date(done.approved_at).toLocaleDateString('es-MX')}
                        {done.evidence ? ` · ${done.evidence}` : ''}
                        <form action={removeApproval} className="inline">
                          <input type="hidden" name="id" value={done.id} />
                          <input type="hidden" name="project_id" value={project.id} />
                          <input type="hidden" name="slug" value={slug} />
                          <button className="ml-2 underline">deshacer</button>
                        </form>
                      </div>
                    ) : !isNext ? (
                      <p className="ml-4 mt-1 text-xs text-[#9aa1a8]">Pendiente</p>
                    ) : (
                      <form action={recordApproval} className="ml-4 mt-2 grid gap-2">
                        <input type="hidden" name="project_id" value={project.id} />
                        <input type="hidden" name="slug" value={slug} />
                        <input type="hidden" name="kind" value={a.kind} />
                        <input name="approved_by" required defaultValue={client.contact_name ?? client.name} className={inputCls} aria-label="Aprobado por" />
                        <input name="evidence" placeholder="Evidencia (correo, WhatsApp, firma)" className={inputCls} aria-label="Evidencia" />
                        <button className={btnGhost}>Registrar aprobación</button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Datos del proyecto">
            <ProjectForm project={project} />
          </Panel>

          <Panel title="Propuestas">
            {(proposals ?? []).length === 0 ? (
              <p className="text-sm text-[#626A73]">Crea una desde «Cotización rápida».</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {(proposals ?? []).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span className="tabular-nums">{mxn(Number(p.budget))} · <span className="text-xs text-[#626A73]">{p.status}</span></span>
                    <span className="flex gap-3 text-xs font-semibold">
                      <Link href={`/admin/cotizador?id=${p.id}`} className="hover:underline">Editar</Link>
                      <a href={`/propuesta/${p.id}`} target="_blank" rel="noreferrer" className="hover:underline">Ver ↗</a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Para Claude Code">
            <p className="text-sm text-[#626A73]">En la carpeta <code className="font-mono text-xs">tml-agencia</code>:</p>
            <pre className="mt-2 overflow-x-auto bg-[#111418] p-3 font-mono text-xs leading-relaxed text-white">{`/siguiente-fase ${slug}\n/estado ${slug}`}</pre>
          </Panel>

          <Panel title="Actividad">
            <ol className="space-y-2 text-xs">
              {(activity ?? []).map((a) => (
                <li key={a.id}>
                  <span className="font-semibold">{a.actor}</span> · {a.action.replace(/_/g, ' ')}
                  {a.detail ? ` — ${a.detail}` : ''}
                  <span className="block text-[#626A73]">{new Date(a.created_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </>
  );
}
