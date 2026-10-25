import { getPrecios } from '../../actions';
import { mxn, calcular, type Nivel } from '@/lib/pricing';
import { PageHeader, Panel } from '@/components/admin/Panel';
import PreciosForm from './PreciosForm';

export default async function Precios() {
  const precios = await getPrecios();
  const niveles = Object.entries(precios.niveles) as [Nivel, (typeof precios.niveles)[Nivel]][];
  return (
    <>
      <PageHeader eyebrow="Precios" title="Tarifas y catálogo" />
      <div className="grid gap-6 xl:grid-cols-[1fr_28rem]">
        <div className="space-y-6">
          <Panel title={`Niveles · tarifa ${mxn(precios.tarifa_hora)}/h · contingencia ${precios.contingencia * 100}%`}>
            <div className="-m-5 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-[#eef0f2] text-xs uppercase tracking-wider text-[#626A73]">
                  <tr><th className="px-5 py-2">Nivel</th><th className="px-5 py-2 text-right">Horas</th><th className="px-5 py-2 text-right">Precio base</th><th className="px-5 py-2">Mercado</th></tr>
                </thead>
                <tbody>
                  {niveles.map(([k, n]) => (
                    <tr key={k} className="border-b border-[#f1f2f4] last:border-0">
                      <td className="px-5 py-2"><span className="font-mono text-xs">{k}</span> {n.nombre}</td>
                      <td className="px-5 py-2 text-right tabular-nums">{n.horas}</td>
                      <td className="px-5 py-2 text-right font-semibold tabular-nums">{mxn(calcular(precios, { nivel: k, modulos: {}, multiplicadores: [], descuento: 0 }).precio)}</td>
                      <td className="px-5 py-2 text-xs text-[#626A73]">{mxn(n.mercado[0])} – {mxn(n.mercado[1])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel title="Mantenimiento mensual">
            <ul className="space-y-2 text-sm">
              {Object.entries(precios.mantenimiento).map(([k, m]) => (
                <li key={k}><strong>{k}</strong> · {mxn(m.precio_mes)} — <span className="text-[#626A73]">{m.incluye}</span></li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel title="Editar (JSON)">
          <p className="mb-3 text-xs text-[#626A73]">
            Misma estructura que <code className="font-mono">tml-agencia/cotizacion/precios.json</code>. Los agentes la leen con <code className="font-mono">tml precios</code>.
          </p>
          <PreciosForm initial={JSON.stringify(precios, null, 2)} />
        </Panel>
      </div>
    </>
  );
}
