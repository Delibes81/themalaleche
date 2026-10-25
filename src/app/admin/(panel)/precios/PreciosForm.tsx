'use client';

import { useActionState } from 'react';
import { savePrecios, type ActionState } from '../../actions';
import { FormMessage, SubmitButton, inputCls } from '@/components/admin/ui';

export default function PreciosForm({ initial }: { initial: string }) {
  const [state, action] = useActionState<ActionState, FormData>(savePrecios, null);
  return (
    <form action={action} className="space-y-3">
      <textarea name="json" defaultValue={initial} spellCheck={false} aria-label="Precios en JSON" className={`${inputCls} h-[32rem] font-mono text-xs`} />
      <div className="flex items-center gap-3">
        <SubmitButton>Guardar precios</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
