import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { PageHeader, Panel } from '@/components/admin/Panel';
import Markdown from '@/components/admin/Markdown';

export default async function Documento({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const { supabase } = await requireAdmin();
  const { data: doc } = await supabase.from('documents').select('*, projects(slug, name)').eq('id', id).maybeSingle();
  if (!doc || (doc.projects as { slug: string } | null)?.slug !== slug) notFound();
  return (
    <>
      <Link href={`/admin/proyectos/${slug}`} className="text-sm font-semibold hover:underline">← {(doc.projects as { name: string }).name}</Link>
      <div className="mt-4">
        <PageHeader eyebrow={`${doc.kind} · ${doc.author}`} title={doc.title} />
      </div>
      <Panel className="max-w-4xl">
        <Markdown>{doc.content}</Markdown>
      </Panel>
    </>
  );
}
