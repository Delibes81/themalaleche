'use client';

import { useActionState } from 'react';
import { saveInterviewerNotes, type ActionState } from '../../../actions';
import { FormMessage, SubmitButton, inputCls, labelCls } from '@/components/admin/ui';

const PLANTILLA = `Lo que necesita realmente:
Problema de negocio detrás:
Nivel estimado (N1-N5):
Presupuesto real percibido:
Quién decide:
Urgencia:
¿Entregará contenido a tiempo?:
Señales buenas:
Alertas:
Para el Director Creativo:
Para el Cotizador:`;

export default function NotesForm({ questionnaireId, projectId, slug, initial }: { questionnaireId: string; projectId: string; slug: string; initial: string }) {
  const [state, action] = useActionState<ActionState, FormData>(saveInterviewerNotes, null);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={questionnaireId} />
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="slug" value={slug} />
      <label className="block">
        <span className={labelCls}>Tus notas del entrevistador (mandan sobre el cuestionario)</span>
        <textarea name="notes" defaultValue={initial || PLANTILLA} className={`${inputCls} min-h-56 font-mono text-xs leading-relaxed`} />
      </label>
      <div className="flex items-center gap-3">
        <SubmitButton>Guardar notas</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
