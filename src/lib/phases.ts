export const PROJECT_STATUSES = [
  { value: 'prospecto', label: 'Prospecto' },
  { value: 'cotizado', label: 'Cotizado' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'en_produccion', label: 'En producción' },
  { value: 'en_revision', label: 'En revisión' },
  { value: 'lanzado', label: 'Lanzado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'cancelado', label: 'Cancelado' },
] as const;

export const PHASE_STATUSES = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_curso', label: 'En curso' },
  { value: 'en_revision', label: 'En revisión' },
  { value: 'completada', label: 'Completada' },
  { value: 'no_aplica', label: 'No aplica' },
] as const;

export const APPROVALS = [
  { kind: 'cotizacion', label: 'Cotización y anticipo', before: 'propuesta_visual' },
  { kind: 'direccion_visual', label: 'Dirección visual', before: 'arquitectura' },
  { kind: 'preview', label: 'Sitio en preview', before: 'qa' },
  { kind: 'publicacion', label: 'Publicación', before: 'lanzamiento' },
  { kind: 'entrega', label: 'Entrega y cierre', before: null },
] as const;

export const LEVELS = [
  { value: 'N1', label: 'N1 · Landing' },
  { value: 'N2', label: 'N2 · Informativo' },
  { value: 'N3', label: 'N3 · Corporativo' },
  { value: 'N4', label: 'N4 · Tienda' },
  { value: 'N5', label: 'N5 · App a medida' },
] as const;

export function statusLabel(value: string) {
  return PROJECT_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}
