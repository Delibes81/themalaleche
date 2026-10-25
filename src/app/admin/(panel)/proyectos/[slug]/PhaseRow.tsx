'use client';

import { useRef } from 'react';
import { updatePhase } from '../../../actions';
import { PHASE_STATUSES } from '@/lib/phases';

type Phase = { id: string; project_id: string; label: string; name: string; agent: string; status: string; actual_hours: number | null };

const dot: Record<string, string> = {
  pendiente: 'border border-[#9aa1a8]',
  en_curso: 'bg-sky-600',
  en_revision: 'bg-[#C73526]',
  completada: 'bg-emerald-600',
  no_aplica: 'bg-[#d5d9de]',
};

export default function PhaseRow({ phase, slug, current }: { phase: Phase; slug: string; current: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const formId = `phase-${phase.id}`;
  return (
    <tr className={`border-b border-[#f1f2f4] last:border-0 ${current ? 'bg-[#fafbfb]' : ''} ${phase.status === 'no_aplica' ? 'text-[#9aa1a8]' : ''}`}>
      <td className="px-5 py-2.5">
        <span className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 shrink-0 ${dot[phase.status] ?? ''}`} aria-hidden />
          <span className="w-6 font-mono text-xs text-[#626A73]">{phase.label}</span>
          <span className={current ? 'font-semibold' : ''}>{phase.name}</span>
          {current && <span className="text-[10px] font-bold uppercase tracking-wider text-[#C73526]">actual</span>}
        </span>
      </td>
      <td className="px-5 py-2.5 font-mono text-xs">{phase.agent}</td>
      <td className="px-5 py-2.5">
        <form id={formId} ref={formRef} action={updatePhase}>
          <input type="hidden" name="id" value={phase.id} />
          <input type="hidden" name="project_id" value={phase.project_id} />
          <input type="hidden" name="slug" value={slug} />
          <select
            name="status"
            defaultValue={phase.status}
            onChange={() => formRef.current?.requestSubmit()}
            aria-label={`Estado de ${phase.name}`}
            className="border border-[#d5d9de] bg-white px-2 py-1 text-xs"
          >
            {PHASE_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </form>
      </td>
      <td className="px-5 py-2.5">
        <input
          form={formId}
          name="actual_hours"
          inputMode="decimal"
          defaultValue={phase.actual_hours ?? ''}
          onBlur={() => formRef.current?.requestSubmit()}
          aria-label={`Horas reales de ${phase.name}`}
          className="w-20 border border-[#d5d9de] px-2 py-1 text-xs tabular-nums"
          placeholder="0"
        />
      </td>
    </tr>
  );
}
