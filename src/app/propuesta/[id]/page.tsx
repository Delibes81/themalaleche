import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/server';
import type { ProposalData } from '@/types/proposal';
import ProposalView from './ProposalView';

export const metadata: Metadata = {
  title: 'Propuesta · The Mala Leche',
  robots: { index: false, follow: false },
};

type Row = {
  id: string;
  created_at: string;
  client_name: string;
  budget: number;
  time_estimate: string;
  stack: string;
  status: string;
  description: string;
  modules: ProposalData['modules'] | null;
  steps: ProposalData['steps'] | null;
  mockups: string[] | null;
  recurring_costs: ProposalData['recurringCosts'] | null;
  payment_plans: ProposalData['paymentPlans'] | null;
  discounts: ProposalData['discounts'] | null;
  include_iva: boolean | null;
  client_logo_type: ProposalData['clientLogoType'];
  client_logo_value: string;
  client_logo_font: string | null;
};

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc('get_proposal', { p_id: id });
  if (error || !data) notFound();

  const row = data as Row;
  const proposal: ProposalData = {
    id: row.id,
    clientName: row.client_name,
    date: new Date(row.created_at)
      .toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .replace(/\//g, '.'),
    budget: row.budget,
    timeEstimate: row.time_estimate,
    stack: row.stack,
    status: row.status,
    description: row.description,
    modules: row.modules ?? [],
    steps: row.steps ?? [],
    mockups: row.mockups ?? [],
    recurringCosts: row.recurring_costs ?? [],
    paymentPlans: row.payment_plans ?? [],
    discounts: row.discounts ?? [],
    includeIva: row.include_iva ?? false,
    clientLogoType: row.client_logo_type,
    clientLogoValue: row.client_logo_value,
    clientLogoFont: row.client_logo_font ?? 'Inter',
  };

  return <ProposalView proposal={proposal} />;
}
