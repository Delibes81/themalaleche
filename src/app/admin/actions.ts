'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { calcular, hitosDePago, PRECIOS_DEFAULT, type Nivel, type Precios } from '@/lib/pricing';
import { slugify } from '@/lib/phases';

export type ActionState = { ok: boolean; message: string } | null;

type Db = Awaited<ReturnType<typeof requireAdmin>>['supabase'];

async function log(supabase: Db, projectId: string | null, action: string, detail?: string) {
  await supabase.from('activity').insert({ project_id: projectId, actor: 'fundador', action, detail: detail ?? null });
}

export async function getPrecios(): Promise<Precios> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('settings').select('value').eq('key', 'precios').maybeSingle();
  return (data?.value as Precios | undefined) ?? PRECIOS_DEFAULT;
}

// ─── Sesión ───────────────────────────────────────────────
export async function signIn(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(6), next: z.string().optional() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: 'Revisa tu correo y contraseña.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { ok: false, message: 'Correo o contraseña incorrectos.' };

  const next = parsed.data.next?.startsWith('/admin') ? parsed.data.next : '/admin';
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// ─── Proyectos ────────────────────────────────────────────
const newProjectSchema = z.object({
  client_id: z.string().optional(),
  client_name: z.string().trim().max(120).optional(),
  contact_name: z.string().trim().max(120).optional(),
  email: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  has_branding: z.enum(['si', 'no']).optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(48).optional(),
  level: z.enum(['N1', 'N2', 'N3', 'N4', 'N5', '']).optional(),
});

export async function createProject(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = newProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: 'Completa el nombre del proyecto y el cliente.' };
  const d = parsed.data;

  let clientId = d.client_id && d.client_id !== 'nuevo' ? d.client_id : null;
  if (!clientId) {
    if (!d.client_name) return { ok: false, message: 'Escribe el nombre del cliente nuevo.' };
    const { data: c, error } = await supabase
      .from('clients')
      .insert({
        name: d.client_name,
        contact_name: d.contact_name || null,
        email: d.email || null,
        phone: d.phone || null,
        has_branding: d.has_branding === 'si',
      })
      .select('id')
      .single();
    if (error || !c) return { ok: false, message: 'No se pudo crear el cliente.' };
    clientId = c.id;
  }

  const slug = slugify(d.slug || d.name);
  if (!slug) return { ok: false, message: 'El identificador del proyecto no es válido.' };
  const { error } = await supabase
    .from('projects')
    .insert({ client_id: clientId, name: d.name, slug, level: d.level || null });
  if (error) {
    return { ok: false, message: error.code === '23505' ? 'Ya existe un proyecto con ese identificador.' : 'No se pudo crear el proyecto.' };
  }
  const { data: p } = await supabase.from('projects').select('id').eq('slug', slug).single();
  await log(supabase, p?.id ?? null, 'proyecto_creado', d.name);
  redirect(`/admin/proyectos/${slug}`);
}

const projectUpdateSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  status: z.string().optional(),
  level: z.string().optional(),
  price: z.string().optional(),
  estimated_hours: z.string().optional(),
  preview_url: z.string().optional(),
  production_url: z.string().optional(),
  repo: z.string().optional(),
  due_date: z.string().optional(),
  notes: z.string().max(5000).optional(),
});

export async function updateProject(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = projectUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: 'Datos no válidos.' };
  const d = parsed.data;
  const num = (v?: string) => (v && v.trim() !== '' && !Number.isNaN(Number(v)) ? Number(v) : null);
  const { error } = await supabase
    .from('projects')
    .update({
      status: d.status,
      level: d.level || null,
      price: num(d.price),
      estimated_hours: num(d.estimated_hours),
      preview_url: d.preview_url || null,
      production_url: d.production_url || null,
      repo: d.repo || null,
      due_date: d.due_date || null,
      notes: d.notes || null,
    })
    .eq('id', d.id);
  if (error) return { ok: false, message: 'No se pudo guardar.' };
  await log(supabase, d.id, 'proyecto_actualizado', d.status);
  revalidatePath(`/admin/proyectos/${d.slug}`);
  return { ok: true, message: 'Guardado.' };
}

export async function updatePhase(formData: FormData) {
  const { supabase } = await requireAdmin();
  const d = z
    .object({
      id: z.string().uuid(),
      project_id: z.string().uuid(),
      slug: z.string(),
      status: z.enum(['pendiente', 'en_curso', 'en_revision', 'completada', 'no_aplica']),
      actual_hours: z.string().optional(),
    })
    .parse(Object.fromEntries(formData));
  const hours = d.actual_hours && !Number.isNaN(Number(d.actual_hours)) ? Number(d.actual_hours) : null;
  await supabase
    .from('project_phases')
    .update({
      status: d.status,
      actual_hours: hours,
      started_at: d.status === 'en_curso' ? new Date().toISOString() : undefined,
      completed_at: d.status === 'completada' ? new Date().toISOString() : null,
    })
    .eq('id', d.id);
  await log(supabase, d.project_id, 'fase_actualizada', d.status);
  revalidatePath(`/admin/proyectos/${d.slug}`);
}

export async function recordApproval(formData: FormData) {
  const { supabase } = await requireAdmin();
  const d = z
    .object({
      project_id: z.string().uuid(),
      slug: z.string(),
      kind: z.enum(['cotizacion', 'direccion_visual', 'preview', 'publicacion', 'entrega']),
      approved_by: z.string().trim().min(1).max(120),
      evidence: z.string().trim().max(500).optional(),
    })
    .parse(Object.fromEntries(formData));
  await supabase.from('approvals').upsert(
    { project_id: d.project_id, kind: d.kind, approved_by: d.approved_by, evidence: d.evidence || null, approved_at: new Date().toISOString() },
    { onConflict: 'project_id,kind' },
  );
  await log(supabase, d.project_id, 'aprobacion', d.kind);
  revalidatePath(`/admin/proyectos/${d.slug}`);
}

export async function removeApproval(formData: FormData) {
  const { supabase } = await requireAdmin();
  const d = z.object({ id: z.string().uuid(), project_id: z.string().uuid(), slug: z.string() }).parse(Object.fromEntries(formData));
  await supabase.from('approvals').delete().eq('id', d.id);
  await log(supabase, d.project_id, 'aprobacion_retirada');
  revalidatePath(`/admin/proyectos/${d.slug}`);
}

// ─── Cuestionarios ────────────────────────────────────────
export async function createQuestionnaire(formData: FormData) {
  const { supabase } = await requireAdmin();
  const d = z
    .object({ project_id: z.string().uuid(), slug: z.string(), variant: z.enum(['A', 'B']) })
    .parse(Object.fromEntries(formData));
  await supabase.from('questionnaires').insert({ project_id: d.project_id, variant: d.variant });
  await log(supabase, d.project_id, 'cuestionario_creado', d.variant);
  revalidatePath(`/admin/proyectos/${d.slug}`);
}

export async function saveInterviewerNotes(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const d = z
    .object({ id: z.string().uuid(), project_id: z.string().uuid(), slug: z.string(), notes: z.string().max(20000) })
    .safeParse(Object.fromEntries(formData));
  if (!d.success) return { ok: false, message: 'Notas demasiado largas.' };
  const { error } = await supabase
    .from('questionnaires')
    .update({ interviewer_notes: { texto: d.data.notes } })
    .eq('id', d.data.id);
  if (error) return { ok: false, message: 'No se pudo guardar.' };
  await log(supabase, d.data.project_id, 'notas_entrevistador');
  revalidatePath(`/admin/proyectos/${d.data.slug}`);
  return { ok: true, message: 'Notas guardadas.' };
}

// ─── Cotización rápida → propuesta ───────────────────────
const quoteSchema = z.object({
  project_id: z.string().uuid(),
  slug: z.string(),
  client_name: z.string(),
  nivel: z.enum(['N1', 'N2', 'N3', 'N4', 'N5']),
  modulos: z.record(z.string(), z.number().min(0).max(100)),
  multiplicadores: z.array(z.string()),
  descuento: z.number().min(0).max(1),
});

export async function createProposalFromQuote(input: z.infer<typeof quoteSchema>): Promise<ActionState & { id?: string }> {
  const { supabase } = await requireAdmin();
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Cotización no válida.' };
  const q = parsed.data;
  const precios = await getPrecios();
  const r = calcular(precios, { nivel: q.nivel as Nivel, modulos: q.modulos, multiplicadores: q.multiplicadores, descuento: q.descuento });

  // Reparte el precio entre los conceptos según sus horas (múltiplos de 100) y ajusta la diferencia en la base.
  const totalHoras = r.horas || 1;
  const modules = r.filas.map((f, i) => ({
    id: String(i + 1),
    title: f.nombre,
    features: f.cantidad > 1 ? [`${f.cantidad} × ${precios.modulos[f.clave]?.unidad ?? 'unidad'}`] : [],
    cost: Math.round(((r.precio * f.horas) / totalHoras) / 100) * 100,
  }));
  const diff = r.precio - modules.reduce((s, m) => s + m.cost, 0);
  modules[0].cost += diff;
  modules[0].features = [precios.niveles[q.nivel].incluye];

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      project_id: q.project_id,
      client_name: q.client_name,
      description: `Propuesta ${precios.niveles[q.nivel].nombre.toLowerCase()} para ${q.client_name}.`,
      budget: r.precio,
      time_estimate: `${r.semanas} SEMANAS`,
      stack: 'NEXT.JS / VERCEL' + (['N3', 'N4', 'N5'].includes(q.nivel) ? ' / SUPABASE' : '') + (q.nivel === 'N4' ? ' / STRIPE' : ''),
      status: 'PENDIENTE',
      modules,
      steps: [
        { id: '1', label: 'Propuesta visual' },
        { id: '2', label: 'Construcción' },
        { id: '3', label: 'QA' },
        { id: '4', label: 'Lanzamiento' },
      ],
      recurring_costs: [],
      payment_plans: hitosDePago(r.pagos),
      discounts: [],
      include_iva: true,
      mockups: [],
      client_logo_type: 'text',
      client_logo_value: q.client_name,
      client_logo_font: 'Inter',
    })
    .select('id')
    .single();
  if (error || !data) return { ok: false, message: 'No se pudo crear la propuesta: ' + (error?.message ?? '') };

  await supabase
    .from('projects')
    .update({ level: q.nivel, price: r.precio, estimated_hours: Math.round(r.horasAjustadas * 10) / 10, status: 'cotizado' })
    .eq('id', q.project_id);
  await log(supabase, q.project_id, 'propuesta_creada', `${q.nivel} · $${r.precio}`);
  revalidatePath(`/admin/proyectos/${q.slug}`);
  return { ok: true, message: 'Propuesta creada.', id: data.id };
}

// ─── Precios ──────────────────────────────────────────────
export async function savePrecios(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const raw = String(formData.get('json') ?? '');
  let value: Precios;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, message: 'El JSON no es válido.' };
  }
  if (!value?.niveles || !value?.modulos || typeof value.tarifa_hora !== 'number') {
    return { ok: false, message: 'Faltan niveles, módulos o tarifa_hora.' };
  }
  const { error } = await supabase.from('settings').upsert({ key: 'precios', value });
  if (error) return { ok: false, message: 'No se pudo guardar.' };
  await log(supabase, null, 'precios_actualizados', `tarifa ${value.tarifa_hora}`);
  revalidatePath('/admin/precios');
  return { ok: true, message: 'Precios guardados.' };
}
