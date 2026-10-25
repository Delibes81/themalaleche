-- The Mala Leche · V2 Dashboard
-- Ejecutar en Supabase → SQL Editor (o `supabase db push`). Es idempotente en lo posible.
-- Después de ejecutarla, regístrate como administrador (ver final del archivo).

-- ─────────────────────────────────────────────────────────────
-- 0. Administradores
-- ─────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 1. Clientes y proyectos
-- ─────────────────────────────────────────────────────────────
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  email text,
  phone text,
  has_branding boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  level text check (level in ('N1', 'N2', 'N3', 'N4', 'N5')),
  status text not null default 'prospecto' check (status in (
    'prospecto', 'cotizado', 'aprobado', 'en_produccion', 'en_revision',
    'lanzado', 'entregado', 'pausado', 'cancelado'
  )),
  price numeric(12, 2),
  estimated_hours numeric(8, 1),
  preview_url text,
  production_url text,
  repo text,
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_client_idx on public.projects (client_id);

create table if not exists public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  position smallint not null,
  key text not null,
  label text not null,
  name text not null,
  agent text not null,
  status text not null default 'pendiente' check (status in (
    'pendiente', 'en_curso', 'en_revision', 'completada', 'no_aplica'
  )),
  estimated_hours numeric(8, 1),
  actual_hours numeric(8, 1),
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  unique (project_id, key)
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind text not null check (kind in ('cotizacion', 'direccion_visual', 'preview', 'publicacion', 'entrega')),
  approved_by text not null,
  approved_at timestamptz not null default now(),
  evidence text,
  unique (project_id, kind)
);

create table if not exists public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  variant text not null check (variant in ('A', 'B')),
  token text not null unique default (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
  status text not null default 'enviado' check (status in ('enviado', 'en_progreso', 'respondido')),
  answers jsonb not null default '{}'::jsonb,
  interviewer_notes jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null default (now() + interval '30 days'),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists questionnaires_project_idx on public.questionnaires (project_id);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  phase_key text,
  kind text not null default 'otro',
  title text not null,
  content text not null default '',
  author text not null default 'fundador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists documents_project_idx on public.documents (project_id);

create table if not exists public.activity (
  id bigint generated always as identity primary key,
  project_id uuid references public.projects (id) on delete cascade,
  actor text not null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists activity_project_idx on public.activity (project_id, created_at desc);

-- Configuración (catálogo de precios: copia de tml-agencia/cotizacion/precios.json)
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- updated_at
do $$
declare t text;
begin
  foreach t in array array['clients', 'projects', 'questionnaires', 'documents', 'settings'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- Fases por defecto al crear un proyecto
create or replace function public.create_default_phases()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_phases (project_id, position, key, label, name, agent) values
    (new.id, 1,  'entrevista',       '1',  'Entrevista',        'fundador'),
    (new.id, 2,  'brief',            '2',  'Brief',             'analista'),
    (new.id, 3,  'cotizacion',       '3',  'Cotización',        'cotizador'),
    (new.id, 4,  'propuesta_visual', '4',  'Propuesta visual',  'director-creativo'),
    (new.id, 5,  'arquitectura',     '5',  'Arquitectura',      'arquitecto'),
    (new.id, 6,  'contenido',        '6',  'Contenido',         'redactor'),
    (new.id, 7,  'frontend',         '7a', 'Frontend',          'frontend'),
    (new.id, 8,  'backend',          '7b', 'Backend',           'backend'),
    (new.id, 9,  'qa',               '8',  'QA',                'qa'),
    (new.id, 10, 'lanzamiento',      '9',  'Lanzamiento',       'lanzamiento'),
    (new.id, 11, 'entrega',          '10', 'Entrega',           'soporte')
  on conflict (project_id, key) do nothing;
  return new;
end;
$$;

drop trigger if exists projects_default_phases on public.projects;
create trigger projects_default_phases
  after insert on public.projects
  for each row execute function public.create_default_phases();

-- ─────────────────────────────────────────────────────────────
-- 2. Propuestas existentes: se vinculan a proyectos y se cierran
-- ─────────────────────────────────────────────────────────────
alter table public.proposals add column if not exists project_id uuid references public.projects (id) on delete set null;
create index if not exists proposals_project_idx on public.proposals (project_id);

-- ─────────────────────────────────────────────────────────────
-- 3. Seguridad: RLS solo administradores en todas las tablas
-- ─────────────────────────────────────────────────────────────
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['admins', 'clients', 'projects', 'project_phases', 'approvals',
                           'questionnaires', 'documents', 'activity', 'settings', 'proposals'] loop
    execute format('alter table public.%I enable row level security', t);
    -- Elimina políticas anteriores (incluida cualquier lectura anónima de proposals)
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy if exists %I on public.%I', p.policyname, t);
    end loop;
  end loop;
end $$;

create policy admins_self_read on public.admins
  for select to authenticated using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['clients', 'projects', 'project_phases', 'approvals',
                           'questionnaires', 'documents', 'activity', 'settings', 'proposals'] loop
    execute format(
      'create policy admin_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────
-- 4. Accesos públicos controlados (sin exponer tablas completas)
-- ─────────────────────────────────────────────────────────────

-- Propuesta: solo quien tiene el enlace (id) puede leer esa propuesta.
create or replace function public.get_proposal(p_id text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(p) - 'project_id'
  from public.proposals p
  where p.id::text = p_id
  limit 1;
$$;

-- Cuestionario: lectura y envío con token, mientras no expire.
create or replace function public.get_questionnaire(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'variant', q.variant,
    'status', q.status,
    'answers', q.answers,
    'client_name', c.name,
    'project_name', pr.name
  )
  from public.questionnaires q
  join public.projects pr on pr.id = q.project_id
  join public.clients c on c.id = pr.client_id
  where q.token = p_token and q.expires_at > now()
  limit 1;
$$;

create or replace function public.submit_questionnaire(p_token text, p_answers jsonb, p_final boolean)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  q public.questionnaires;
begin
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' or octet_length(p_answers::text) > 60000 then
    return 'invalido';
  end if;

  select * into q from public.questionnaires
  where token = p_token and expires_at > now()
  for update;

  if not found then
    return 'no_encontrado';
  end if;
  if q.status = 'respondido' then
    return 'ya_respondido';
  end if;

  update public.questionnaires
  set answers = p_answers,
      status = case when p_final then 'respondido' else 'en_progreso' end,
      submitted_at = case when p_final then now() else null end
  where id = q.id;

  if p_final then
    insert into public.activity (project_id, actor, action, detail)
    values (q.project_id, 'cliente', 'cuestionario_respondido', 'Cuestionario ' || q.variant);
    update public.project_phases set status = 'completada', completed_at = now()
    where project_id = q.project_id and key = 'entrevista' and status <> 'completada';
  end if;

  return 'ok';
end;
$$;

revoke all on function public.get_proposal(text) from public;
revoke all on function public.get_questionnaire(text) from public;
revoke all on function public.submit_questionnaire(text, jsonb, boolean) from public;
grant execute on function public.get_proposal(text) to anon, authenticated;
grant execute on function public.get_questionnaire(text) to anon, authenticated;
grant execute on function public.submit_questionnaire(text, jsonb, boolean) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 5. Registrarte como administrador (ejecutar una vez, con tu correo)
-- ─────────────────────────────────────────────────────────────
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'TU_CORREO@ejemplo.com'
-- on conflict do nothing;
