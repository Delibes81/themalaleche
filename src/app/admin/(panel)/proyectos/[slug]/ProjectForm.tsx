'use client';

import { useActionState } from 'react';
import { updateProject, type ActionState } from '../../../actions';
import { LEVELS, PROJECT_STATUSES } from '@/lib/phases';
import { FormMessage, SubmitButton, inputCls, labelCls } from '@/components/admin/ui';

type Project = {
  id: string; slug: string; status: string; level: string | null; price: number | null; estimated_hours: number | null;
  preview_url: string | null; production_url: string | null; repo: string | null; due_date: string | null; notes: string | null;
};

export default function ProjectForm({ project }: { project: Project }) {
  const [state, action] = useActionState<ActionState, FormData>(updateProject, null);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="id" value={project.id} />
      <input type="hidden" name="slug" value={project.slug} />
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelCls}>Estado</span>
          <select name="status" defaultValue={project.status} className={inputCls}>
            {PROJECT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Nivel</span>
          <select name="level" defaultValue={project.level ?? ''} className={inputCls}>
            <option value="">—</option>
            {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.value}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Precio (MXN)</span>
          <input name="price" inputMode="decimal" defaultValue={project.price ?? ''} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Horas estimadas</span>
          <input name="estimated_hours" inputMode="decimal" defaultValue={project.estimated_hours ?? ''} className={inputCls} />
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Preview (Vercel)</span>
        <input name="preview_url" type="url" defaultValue={project.preview_url ?? ''} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Producción</span>
        <input name="production_url" type="url" defaultValue={project.production_url ?? ''} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Repositorio</span>
        <input name="repo" defaultValue={project.repo ?? ''} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Fecha de entrega</span>
        <input name="due_date" type="date" defaultValue={project.due_date ?? ''} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Notas</span>
        <textarea name="notes" defaultValue={project.notes ?? ''} className={`${inputCls} min-h-20`} />
      </label>
      <div className="flex items-center gap-3">
        <SubmitButton>Guardar</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
