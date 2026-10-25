import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { PageHeader, Panel } from '@/components/admin/Panel';
import { btnGhost } from '@/components/admin/ui';

export default async function Clientes() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from('clients')
    .select('id, name, contact_name, email, phone, has_branding, projects(slug, name, status)')
    .order('name');
  const rows = (data ?? []) as unknown as {
    id: string; name: string; contact_name: string | null; email: string | null; phone: string | null; has_branding: boolean;
    projects: { slug: string; name: string; status: string }[];
  }[];

  return (
    <>
      <PageHeader eyebrow="Clientes" title="Clientes" action={<Link href="/admin/proyectos/nuevo" className={btnGhost}>Nuevo cliente con proyecto</Link>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.length === 0 && <p className="text-sm text-[#626A73]">Sin clientes todavía.</p>}
        {rows.map((c) => (
          <Panel key={c.id}>
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-[#626A73]">{[c.contact_name, c.email, c.phone].filter(Boolean).join(' · ') || 'Sin datos de contacto'}</p>
            <p className="mt-2 text-xs text-[#626A73]">Branding: {c.has_branding ? 'sí (cuestionario A)' : 'no (cuestionario B)'}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {c.projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/admin/proyectos/${p.slug}`} className="underline-offset-2 hover:underline">{p.name}</Link>
                </li>
              ))}
            </ul>
            <Link href={`/admin/proyectos/nuevo?cliente=${c.id}`} className="mt-3 inline-block text-xs font-semibold hover:underline">
              + Otro proyecto para este cliente
            </Link>
          </Panel>
        ))}
      </div>
    </>
  );
}
