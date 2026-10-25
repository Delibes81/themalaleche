'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { calcular, mxn, type Nivel, type Precios } from '@/lib/pricing';
import { createProposalFromQuote } from '../../../actions';
import { btnPrimary, inputCls, labelCls } from '@/components/admin/ui';

export default function QuickQuote({
  precios,
  projectId,
  slug,
  clientName,
  defaultLevel,
}: {
  precios: Precios;
  projectId: string;
  slug: string;
  clientName: string;
  defaultLevel: string | null;
}) {
  const niveles = Object.keys(precios.niveles) as Nivel[];
  const [nivel, setNivel] = useState<Nivel>((defaultLevel as Nivel) || 'N2');
  const [modulos, setModulos] = useState<Record<string, number>>({});
  const [mults, setMults] = useState<string[]>([]);
  const [descuento, setDescuento] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; id?: string } | null>(null);
  const [pending, start] = useTransition();

  const r = useMemo(() => calcular(precios, { nivel, modulos, multiplicadores: mults, descuento: descuento / 100 }), [precios, nivel, modulos, mults, descuento]);

  const setQty = (k: string, n: number) => setModulos((m) => ({ ...m, [k]: Math.max(0, Math.min(100, n)) }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
      <div className="space-y-5">
        <div>
          <span className={labelCls}>Nivel</span>
          <div className="grid gap-2 sm:grid-cols-5">
            {niveles.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNivel(n)}
                aria-pressed={nivel === n}
                className={`border px-2 py-2 text-left text-xs transition ${nivel === n ? 'border-[#111418] bg-[#111418] text-white' : 'border-[#d5d9de] hover:border-[#111418]'}`}
              >
                <span className="block font-mono font-bold">{n}</span>
                <span className="block leading-tight">{precios.niveles[n].nombre}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#626A73]">Incluye: {precios.niveles[nivel].incluye}</p>
        </div>

        <details className="border border-[#eef0f2]" open>
          <summary className="cursor-pointer px-3 py-2 text-sm font-semibold">Módulos adicionales</summary>
          <ul className="max-h-80 divide-y divide-[#f1f2f4] overflow-y-auto">
            {Object.entries(precios.modulos).map(([k, m]) => {
              const qty = modulos[k] ?? 0;
              return (
                <li key={k} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className={qty ? 'font-semibold' : ''}>
                    {m.nombre}
                    <span className="block text-xs font-normal text-[#626A73]">
                      {m.horas} h por {m.unidad ?? 'proyecto'}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <button type="button" aria-label={`Quitar ${m.nombre}`} onClick={() => setQty(k, qty - 1)} className="h-8 w-8 border border-[#d5d9de]">−</button>
                    <span className="w-6 text-center font-mono tabular-nums">{qty}</span>
                    <button type="button" aria-label={`Agregar ${m.nombre}`} onClick={() => setQty(k, qty + 1)} className="h-8 w-8 border border-[#d5d9de]">+</button>
                  </span>
                </li>
              );
            })}
          </ul>
        </details>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className={labelCls}>Ajustes</legend>
            {Object.entries(precios.multiplicadores).map(([k, m]) => (
              <label key={k} className="flex items-center gap-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={mults.includes(k)}
                  onChange={(e) => setMults((x) => (e.target.checked ? [...x, k] : x.filter((y) => y !== k)))}
                  className="accent-[#111418]"
                />
                {m.nombre} <span className="text-xs text-[#626A73]">×{m.factor}</span>
              </label>
            ))}
          </fieldset>
          <label className="block">
            <span className={labelCls}>Descuento (máx. {precios.descuento_maximo * 100}%)</span>
            <input
              type="number"
              min={0}
              max={precios.descuento_maximo * 100}
              value={descuento}
              onChange={(e) => setDescuento(Math.min(precios.descuento_maximo * 100, Math.max(0, Number(e.target.value))))}
              className={inputCls}
            />
          </label>
        </div>
      </div>

      <aside className="h-fit border border-[#111418] p-4 lg:sticky lg:top-6">
        <p className={labelCls}>Precio (sin IVA)</p>
        <p className="text-3xl font-bold tabular-nums">{mxn(r.precio)}</p>
        <p
          className={`mt-1 text-xs font-semibold ${r.alerta === 'dentro' ? 'text-emerald-700' : 'text-[#C73526]'}`}
        >
          {r.alerta === 'dentro' && 'Dentro del mercado'}
          {r.alerta === 'bajo' && 'Debajo del piso: súbelo al mínimo'}
          {r.alerta === 'alto' && 'Arriba del rango: justifica valor o divide en etapas'}
        </p>
        <p className="text-xs text-[#626A73]">
          Mercado {mxn(r.mercado[0])} – {mxn(r.mercado[1])}
        </p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><dt>Horas</dt><dd className="tabular-nums">{r.horasAjustadas.toFixed(1)}</dd></div>
          <div className="flex justify-between"><dt>Semanas</dt><dd className="tabular-nums">{r.semanas}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-[#626A73]">Pagos: {r.pagos}</p>
        <button
          type="button"
          disabled={pending}
          className={`${btnPrimary} mt-4 w-full`}
          onClick={() =>
            start(async () => {
              const res = await createProposalFromQuote({
                project_id: projectId,
                slug,
                client_name: clientName,
                nivel,
                modulos,
                multiplicadores: mults,
                descuento: descuento / 100,
              });
              setMsg(res ? { ok: res.ok, text: res.message, id: res.id } : null);
            })
          }
        >
          {pending ? 'Creando…' : 'Crear propuesta'}
        </button>
        {msg && (
          <p role="status" className={`mt-2 text-xs ${msg.ok ? 'text-emerald-700' : 'text-[#C73526]'}`}>
            {msg.text}{' '}
            {msg.id && (
              <>
                <Link href={`/admin/cotizador?id=${msg.id}`} className="font-semibold underline">Editar</Link> ·{' '}
                <a href={`/propuesta/${msg.id}`} target="_blank" rel="noreferrer" className="font-semibold underline">Ver ↗</a>
              </>
            )}
          </p>
        )}
      </aside>
    </div>
  );
}
