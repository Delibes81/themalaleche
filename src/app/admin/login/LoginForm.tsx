'use client';

import { useActionState } from 'react';
import { signIn, type ActionState } from '../actions';
import { FormMessage, SubmitButton, inputCls, labelCls } from '@/components/admin/ui';

export default function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<ActionState, FormData>(signIn, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next ?? '/admin'} />
      <label className="block">
        <span className={labelCls}>Correo</span>
        <input name="email" type="email" required autoComplete="email" className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Contraseña</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </label>
      <SubmitButton className="w-full">Entrar</SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
