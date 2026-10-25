import { requireAdmin } from '@/lib/auth';
import { PageHeader, Panel } from '@/components/admin/Panel';
import NewProjectForm from './NewProjectForm';

export default async function NuevoProyecto({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { supabase } = await requireAdmin();
  const { cliente } = await searchParams;
  const { data: clients } = await supabase.from('clients').select('id, name').order('name');
  return (
    <>
      <PageHeader eyebrow="Proyectos" title="Nuevo proyecto" />
      <Panel className="max-w-2xl">
        <NewProjectForm clients={clients ?? []} defaultClient={cliente} />
      </Panel>
    </>
  );
}
