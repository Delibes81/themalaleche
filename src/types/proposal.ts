export interface ProposalModule {
  id: string;
  title: string;
  features: string[];
  cost: number;
}

export interface ProposalStep {
  id: string;
  label: string;
}

export interface RecurringCost {
  id: string;
  name: string;
  cost: number;
  period: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  percentage: number;
  condition: string;
}

export interface ProposalData {
  id: string; // From Supabase
  clientName: string;
  date: string;
  budget: number;
  timeEstimate: string;
  stack: string;
  status: string;
  description: string;
  modules: ProposalModule[];
  steps: ProposalStep[];
  mockups?: string[];
  recurringCosts?: RecurringCost[];
  paymentPlans?: PaymentPlan[];
  clientLogoType: 'text' | 'image';
  clientLogoValue: string;
  clientLogoFont?: string;
  createdAt?: string;
}
