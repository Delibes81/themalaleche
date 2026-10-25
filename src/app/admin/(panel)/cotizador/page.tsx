import { requireAdmin } from '@/lib/auth';
import Cotizador from './Cotizador';

export default async function CotizadorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin();
  const { id } = await searchParams;
  return <Cotizador initialId={id} />;
}
