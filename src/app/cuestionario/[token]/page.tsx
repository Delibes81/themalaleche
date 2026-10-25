import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/server';
import type { Answers } from '@/lib/questionnaire';
import QuestionnaireForm from './QuestionnaireForm';

export const metadata: Metadata = {
  title: 'Cuestionario para tu nueva web · The Mala Leche',
  robots: { index: false, follow: false },
};

type Data = { variant: 'A' | 'B'; status: string; answers: Answers; client_name: string; project_name: string };

export default async function QuestionnairePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();
  const { data } = await createPublicClient().rpc('get_questionnaire', { p_token: token });
  if (!data) notFound();
  const q = data as Data;

  return (
    <main className="min-h-screen bg-white text-[#111418]">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626A73]">The Mala Leche · Agencia de desarrollo web</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Cuestionario para tu nueva web</h1>
        <p className="mt-4 text-[#4a5159]">
          Hola, {q.client_name}. Estas preguntas nos ayudan a entender tu negocio y lo que necesitas. Responde con tus palabras;
          si algo no aplica, déjalo en blanco. Puedes guardar tu avance y volver con este mismo enlace. Tiempo estimado: 15 minutos.
        </p>
        {q.status === 'respondido' ? (
          <div className="mt-10 border border-[#111418] p-6">
            <p className="font-semibold">Ya recibimos tus respuestas. ¡Gracias!</p>
            <p className="mt-2 text-sm text-[#4a5159]">
              Con esta información preparamos tu cotización por escrito y, una vez aprobada, una propuesta visual para que veas tu web antes de construirla.
            </p>
          </div>
        ) : (
          <QuestionnaireForm token={token} variant={q.variant} initialAnswers={q.answers ?? {}} />
        )}
      </div>
    </main>
  );
}
