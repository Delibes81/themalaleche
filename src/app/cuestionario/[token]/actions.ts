'use server';

import { createPublicClient } from '@/lib/supabase/server';
import type { Answers } from '@/lib/questionnaire';

export type SubmitResult = { ok: boolean; message: string };

export async function submitAnswers(token: string, answers: Answers, final: boolean): Promise<SubmitResult> {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    return { ok: false, message: 'Enlace no válido.' };
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc('submit_questionnaire', {
    p_token: token,
    p_answers: answers,
    p_final: final,
  });
  if (error) return { ok: false, message: 'No pudimos guardar tus respuestas. Intenta de nuevo en un momento.' };
  switch (data) {
    case 'ok':
      return { ok: true, message: final ? '¡Gracias! Recibimos tus respuestas.' : 'Avance guardado. Puedes volver con este mismo enlace.' };
    case 'ya_respondido':
      return { ok: false, message: 'Este cuestionario ya fue enviado. Si quieres cambiar algo, escríbenos.' };
    case 'invalido':
      return { ok: false, message: 'Tus respuestas son demasiado largas. Resume un poco e intenta de nuevo.' };
    default:
      return { ok: false, message: 'Este enlace ya no está disponible.' };
  }
}
