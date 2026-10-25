// Contenido del prototipo MUMA (tomado del brochure MUMA-26.pdf). Proyecto de práctica.
export const WHATSAPP = 'https://w.app/muma-creative-house';
export const EMAIL = 'info@mumach.com';
export const PHONE = '+52 55 3572 1488';

export const pillars = [
  { name: 'ADN', items: ['Filosofía', 'Valores', 'Público objetivo', 'Competencia'], mesh: 'mesh-c', text: 'Definimos qué cree tu marca, a quién le habla y contra quién compite.' },
  { name: 'TONO', items: ['Nombre', 'Voz', 'Personalidad', 'Narrativa'], mesh: 'mesh-d', text: 'Le damos nombre, voz y una historia que se reconoce.' },
  { name: 'IDENTIDAD VISUAL', items: ['Logotipo', 'Sistema gráfico', 'Colores', 'Tipografías'], mesh: 'mesh-e', text: 'Diseñamos el sistema que hace tu marca inconfundible.' },
  { name: 'ESTRATEGIA', items: ['Comunicación', 'Estructura', 'Contenido'], mesh: 'mesh-b', text: 'Ordenamos qué decir, dónde y cuándo.' },
  { name: 'ACTIVACIÓN', items: ['Experiencias', 'Contacto', 'Comunidad'], mesh: 'mesh-f', text: 'Llevamos la marca a donde está tu cliente.' },
  { name: 'CRECIMIENTO', items: ['Auditoría', 'Gestión', 'Seguimiento'], mesh: 'mesh-a', text: 'Medimos, ajustamos y la hacemos crecer.' },
] as const;

export const serviceGroups = [
  { title: 'Nombre y voz', text: 'Creación de nombre, eslogan y redacción.' },
  { title: 'Identidad', text: 'Logotipo, identidad visual, aplicaciones de marca, empaque y diseño gráfico.' },
  { title: 'Diseño', text: 'Diseño web, editorial y de tipografía. Ilustración.' },
  { title: 'Contenido', text: 'Estrategia y creación de contenido. Manejo de redes sociales.' },
  { title: 'Producción', text: 'Fotografía y video.' },
  { title: 'Mercado', text: 'Estudios de mercado, estrategias de marketing, re-marketing y campañas publicitarias.' },
] as const;

export const steps = [
  'Identificamos en qué punto de madurez se encuentra tu marca.',
  'Te damos un diagnóstico y una estrategia.',
  'Implementamos el plan desde todos los ángulos.',
] as const;

export const stages = ['Apenas es una idea', 'Ya existe, pero no se ve profesional', 'Funciona y quiero que crezca', 'No estoy seguro'] as const;
