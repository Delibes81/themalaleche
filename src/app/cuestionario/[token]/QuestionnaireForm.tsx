'use client';

import { useState, useTransition } from 'react';
import { sectionsFor, type Answers, type Field } from '@/lib/questionnaire';
import { submitAnswers, type SubmitResult } from './actions';

export default function QuestionnaireForm({
  token,
  variant,
  initialAnswers,
}: {
  token: string;
  variant: 'A' | 'B';
  initialAnswers: Answers;
}) {
  const sections = sectionsFor(variant);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (id: string, value: Answers[string]) => setAnswers((a) => ({ ...a, [id]: value }));

  const send = (final: boolean) =>
    startTransition(async () => {
      const r = await submitAnswers(token, answers, final);
      setResult(r);
      if (r.ok && final) setDone(true);
    });

  if (done) {
    return (
      <div className="mt-10 border border-[#111418] p-6" role="status">
        <p className="font-semibold">{result?.message}</p>
        <p className="mt-2 text-sm text-[#4a5159]">Te contactaremos con tu cotización por escrito.</p>
      </div>
    );
  }

  return (
    <form
      className="mt-10 space-y-12"
      onSubmit={(e) => {
        e.preventDefault();
        send(true);
      }}
    >
      {sections.map((s, i) => (
        <fieldset key={s.id} className="space-y-6">
          <legend className="w-full border-b border-[#EAEDF0] pb-3">
            <span className="mr-3 font-mono text-sm text-[#C73526]">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-xl font-bold">{s.title}</span>
          </legend>
          {s.intro && <p className="text-sm text-[#4a5159]">{s.intro}</p>}
          {s.fields.map((f) => (
            <FieldInput key={f.id} field={f} value={answers[f.id]} onChange={(v) => set(f.id, v)} />
          ))}
        </fieldset>
      ))}

      <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-[#EAEDF0] bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 bg-[#111418] px-6 font-semibold text-white transition hover:bg-black disabled:opacity-50"
        >
          {pending ? 'Enviando…' : 'Enviar respuestas'}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => send(false)}
          className="min-h-11 border border-[#111418] px-6 font-semibold transition hover:bg-[#EAEDF0] disabled:opacity-50"
        >
          Guardar avance
        </button>
        {result && (
          <p role="status" className={`text-sm ${result.ok ? 'text-[#2f6b3a]' : 'text-[#C73526]'}`}>
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
}

const inputCls =
  'w-full border border-[#cfd4da] bg-white px-3 py-2.5 text-base outline-none transition focus:border-[#111418] focus:ring-2 focus:ring-[#111418]/15';

function FieldInput({ field, value, onChange }: { field: Field; value: Answers[string] | undefined; onChange: (v: Answers[string]) => void }) {
  const labelId = `${field.id}-label`;
  const label = (
    <div className="mb-2">
      <span id={labelId} className="block font-medium">
        {field.label}
      </span>
      {field.hint && <span className="mt-0.5 block text-sm text-[#626A73]">{field.hint}</span>}
    </div>
  );

  if (field.type === 'text' || field.type === 'textarea') {
    const v = typeof value === 'string' ? value : '';
    return (
      <label className="block">
        {label}
        {field.type === 'text' ? (
          <input className={inputCls} value={v} maxLength={500} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <textarea className={`${inputCls} min-h-28`} value={v} maxLength={3000} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    );
  }

  if (field.type === 'radio') {
    const v = typeof value === 'string' ? value : '';
    return (
      <div role="radiogroup" aria-labelledby={labelId}>
        {label}
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options.map((o) => (
            <label key={o} className={`flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 transition ${v === o ? 'border-[#111418] bg-[#f4f5f7]' : 'border-[#e1e4e8]'}`}>
              <input type="radio" name={field.id} checked={v === o} onChange={() => onChange(o)} className="accent-[#111418]" />
              <span className="text-sm">{o}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'checkbox') {
    const arr = Array.isArray(value) ? value : [];
    const otherValue = arr.find((x) => x.startsWith('Otro: '))?.slice(6) ?? '';
    const standard = arr.filter((x) => !x.startsWith('Otro: '));
    const toggle = (o: string) => {
      const next = standard.includes(o) ? standard.filter((x) => x !== o) : [...standard, o];
      if (field.max && next.length > field.max) return;
      onChange(otherValue ? [...next, `Otro: ${otherValue}`] : next);
    };
    return (
      <div role="group" aria-labelledby={labelId}>
        {label}
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options.map((o) => (
            <label key={o} className={`flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 transition ${standard.includes(o) ? 'border-[#111418] bg-[#f4f5f7]' : 'border-[#e1e4e8]'}`}>
              <input type="checkbox" checked={standard.includes(o)} onChange={() => toggle(o)} className="accent-[#111418]" />
              <span className="text-sm">{o}</span>
            </label>
          ))}
        </div>
        {field.other && (
          <input
            className={`${inputCls} mt-2`}
            placeholder="Otro (escribe aquí)"
            aria-label={`${field.label}: otro`}
            maxLength={300}
            value={otherValue}
            onChange={(e) => onChange(e.target.value ? [...standard, `Otro: ${e.target.value}`] : standard)}
          />
        )}
      </div>
    );
  }

  if (field.type !== 'scale') return null;
  const scale = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return (
    <div role="group" aria-labelledby={labelId}>
      {label}
      <div className="space-y-3">
        {field.pairs.map(([a, b]) => {
          const key = `${a}-${b}`;
          return (
            <div key={key} className="grid grid-cols-[6.5rem_1fr_6.5rem] items-center gap-2 text-sm">
              <span className="text-right">{a}</span>
              <div className="flex justify-between gap-1" role="radiogroup" aria-label={`${a} a ${b}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="flex-1">
                    <input
                      type="radio"
                      name={key}
                      className="peer sr-only"
                      checked={scale[key] === n}
                      onChange={() => onChange({ ...scale, [key]: n })}
                    />
                    <span className="flex h-11 cursor-pointer items-center justify-center border border-[#e1e4e8] font-mono text-xs transition peer-checked:border-[#111418] peer-checked:bg-[#111418] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#111418]/30">
                      {n}
                    </span>
                  </label>
                ))}
              </div>
              <span>{b}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
