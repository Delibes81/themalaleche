import defaults from './precios-default.json';

export type Nivel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

export type Precios = {
  moneda: string;
  tarifa_hora: number;
  contingencia: number;
  redondeo: number;
  horas_productivas_semana: number;
  niveles: Record<Nivel, { nombre: string; horas: number; incluye: string; mercado: [number, number] }>;
  modulos: Record<string, { nombre: string; horas: number; unidad?: string }>;
  multiplicadores: Record<string, { nombre: string; factor: number }>;
  descuento_maximo: number;
  pagos: Record<Nivel, string>;
  mantenimiento: Record<string, { precio_mes: number; incluye: string }>;
  costos_cliente: string[];
};

export const PRECIOS_DEFAULT = defaults as unknown as Precios;

export type OpcionCotizacion = {
  nivel: Nivel;
  modulos: Record<string, number>;
  multiplicadores: string[];
  descuento: number;
};

export type ResultadoCotizacion = {
  filas: { clave: string; nombre: string; cantidad: number; horas: number }[];
  horas: number;
  factor: number;
  horasAjustadas: number;
  precio: number;
  semanas: number;
  mercado: [number, number];
  alerta: 'bajo' | 'dentro' | 'alto';
  pagos: string;
};

/** Misma fórmula que tml-agencia/cotizacion/calcular.py. */
export function calcular(p: Precios, op: OpcionCotizacion): ResultadoCotizacion {
  const nivel = p.niveles[op.nivel];
  const filas: ResultadoCotizacion['filas'] = [
    { clave: op.nivel, nombre: `Base ${op.nivel} · ${nivel.nombre}`, cantidad: 1, horas: nivel.horas },
  ];
  for (const [clave, cantidad] of Object.entries(op.modulos)) {
    const m = p.modulos[clave];
    if (!m || cantidad <= 0) continue;
    filas.push({ clave, nombre: m.nombre, cantidad, horas: m.horas * cantidad });
  }
  const horas = filas.reduce((s, f) => s + f.horas, 0);
  let factor = 1;
  for (const k of op.multiplicadores) factor *= p.multiplicadores[k]?.factor ?? 1;
  const horasAjustadas = horas * factor * (1 + p.contingencia);
  const descuento = Math.min(Math.max(op.descuento, 0), p.descuento_maximo);
  const bruto = horasAjustadas * p.tarifa_hora * (1 - descuento);
  const precio = Math.ceil(bruto / p.redondeo) * p.redondeo;

  const urgente = op.multiplicadores.includes('urgente');
  const factorTrabajo = factor / (urgente ? (p.multiplicadores.urgente?.factor ?? 1) : 1);
  let semanas = Math.ceil((horas * factorTrabajo * (1 + p.contingencia)) / p.horas_productivas_semana);
  if (urgente) semanas = Math.max(1, Math.ceil(semanas / 2));

  const [lo, hi] = nivel.mercado;
  return {
    filas,
    horas,
    factor,
    horasAjustadas,
    precio,
    semanas,
    mercado: [lo, hi],
    alerta: precio < lo ? 'bajo' : precio > hi ? 'alto' : 'dentro',
    pagos: p.pagos[op.nivel],
  };
}

export function mxn(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

/** Convierte "50% anticipo, 30% al aprobar el preview, 20% al lanzar" en hitos de pago. */
export function hitosDePago(texto: string) {
  return texto
    .split(',')
    .map((t) => t.trim())
      .map((t, i, arr) => {
      const m = t.match(/^(\d+)%\s*(.*)$/);
      if (!m) return null;
      const condicion = m[2].trim();
      return {
        id: String(i + 1),
        name: i === 0 ? 'Anticipo' : i === arr.length - 1 ? 'Pago final' : `Pago ${i + 1}`,
        percentage: Number(m[1]),
        condition: condicion.charAt(0).toUpperCase() + condicion.slice(1),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}
