// Cuestionario de entrevista. Fuente equivalente: tml-agencia/cuestionarios/*.md
export type Field =
  | { id: string; type: 'text' | 'textarea'; label: string; hint?: string }
  | { id: string; type: 'radio'; label: string; options: string[]; hint?: string }
  | { id: string; type: 'checkbox'; label: string; options: string[]; other?: boolean; max?: number; hint?: string }
  | { id: string; type: 'scale'; label: string; pairs: [string, string][]; hint?: string };

export type Section = { id: string; title: string; intro?: string; fields: Field[] };

const negocio: Section = {
  id: 'negocio',
  title: 'Tu negocio',
  fields: [
    { id: 'negocio_descripcion', type: 'textarea', label: 'Nombre del negocio y a qué se dedica', hint: 'En dos o tres líneas, como se lo explicarías a un amigo.' },
    { id: 'negocio_ubicacion', type: 'text', label: '¿Desde cuándo opera y dónde? (ciudad, zona, en línea)' },
    { id: 'negocio_oferta', type: 'textarea', label: '¿Cuáles son tus productos o servicios principales?', hint: 'Indica cuál es el que más quieres vender.' },
    { id: 'negocio_diferenciador', type: 'textarea', label: '¿Qué te hace diferente de tu competencia? ¿Por qué te eligen?' },
    { id: 'negocio_sitio_actual', type: 'text', label: '¿Tienes sitio web? Dirección y qué no te gusta de él' },
  ],
};

const objetivo: Section = {
  id: 'objetivo',
  title: 'Objetivo de la web',
  fields: [
    {
      id: 'objetivo_principal',
      type: 'checkbox',
      label: '¿Qué es lo más importante que debe lograr tu web?',
      hint: 'Elige hasta dos.',
      max: 2,
      other: true,
      options: [
        'Que me conozcan y se vea profesional',
        'Que me contacten (llamadas, WhatsApp, formulario)',
        'Vender productos en línea',
        'Agendar citas o reservas',
        'Que mis clientes o empleados entren con usuario a una plataforma',
        'Automatizar un proceso de mi negocio',
      ],
    },
    { id: 'objetivo_accion', type: 'text', label: 'Cuando alguien visita tu web, ¿qué acción quieres que haga primero?' },
    { id: 'objetivo_exito', type: 'textarea', label: '¿Cómo sabrás dentro de seis meses que la web valió la pena?' },
  ],
};

const clientes: Section = {
  id: 'clientes',
  title: 'Tus clientes',
  fields: [
    { id: 'cliente_ideal', type: 'textarea', label: '¿Quién es tu cliente ideal?', hint: 'Edad, tipo de empresa, ciudad, qué busca.' },
    { id: 'cliente_dudas', type: 'textarea', label: '¿Qué dudas o miedos tiene antes de comprarte o contratarte?' },
    { id: 'cliente_dispositivo', type: 'radio', label: '¿Desde dónde te buscarán más?', options: ['Celular', 'Computadora', 'Ambos'] },
  ],
};

const contenido: Section = {
  id: 'contenido',
  title: 'Páginas y contenido',
  fields: [
    {
      id: 'paginas',
      type: 'checkbox',
      label: '¿Qué secciones o páginas imaginas?',
      other: true,
      options: ['Inicio', 'Nosotros', 'Servicios / productos', 'Portafolio o casos de éxito', 'Testimonios', 'Preguntas frecuentes', 'Blog o noticias', 'Contacto'],
    },
    { id: 'paginas_servicios_cantidad', type: 'text', label: '¿Cuántos servicios o productos quieres mostrar?' },
    { id: 'textos', type: 'radio', label: '¿Quién escribirá los textos?', options: ['Yo los entrego', 'Necesito que los redacten', 'Mitad y mitad'] },
    { id: 'fotos', type: 'radio', label: '¿Tienes fotos y videos propios de buena calidad?', options: ['Sí', 'Algunas', 'No, necesito que se consigan'] },
    { id: 'idiomas', type: 'checkbox', label: '¿En qué idiomas debe estar la web?', options: ['Español', 'Inglés'], other: true },
  ],
};

const funciones: Section = {
  id: 'funciones',
  title: 'Funciones que necesitas',
  fields: [
    {
      id: 'funciones',
      type: 'checkbox',
      label: 'Marca lo que tu web debe hacer',
      other: true,
      options: [
        'Formulario de contacto',
        'Botón de WhatsApp',
        'Mapa y ubicación',
        'Agenda de citas / reservas',
        'Tienda en línea',
        'Cobros en línea (pagos únicos o suscripciones)',
        'Registro e inicio de sesión de usuarios',
        'Panel para actualizar contenido, productos o pedidos',
        'Conexión con otro sistema (CRM, facturación, inventario, ERP)',
        'Blog',
      ],
    },
    { id: 'funciones_detalle', type: 'textarea', label: 'Detalles: número aproximado de productos, sistema a conectar, etc.' },
    { id: 'proceso_actual', type: 'textarea', label: 'Si necesitas una plataforma o sistema, describe cómo funciona hoy ese proceso', hint: 'Paso a paso, aunque sea en papel o Excel.' },
  ],
};

const marcaA: Section = {
  id: 'marca',
  title: 'Tu marca',
  intro: 'Ya tienes identidad. Envíanos tus archivos (logo, manual, fotos) por correo o WhatsApp.',
  fields: [
    {
      id: 'marca_activos',
      type: 'checkbox',
      label: '¿Qué archivos de marca tienes?',
      options: ['Logotipo en alta calidad (SVG, AI, PDF o PNG grande)', 'Manual o guía de marca', 'Colores oficiales', 'Tipografías oficiales', 'Fotografías o ilustraciones de marca'],
    },
    { id: 'marca_colores', type: 'text', label: 'Colores oficiales (códigos si los tienes)' },
    {
      id: 'marca_libertad',
      type: 'radio',
      label: '¿Qué tan estricta debe ser la web con tu marca?',
      options: ['Totalmente fiel, no se cambia nada', 'Fiel, pero se puede modernizar', 'Estoy abierto a una actualización de la imagen'],
    },
    { id: 'marca_palabras', type: 'text', label: 'Tres palabras de cómo debe sentirse tu marca en la web' },
    { id: 'marca_trato', type: 'radio', label: '¿Cómo le hablas a tus clientes?', options: ['De tú, cercano', 'De tú, divertido', 'De usted, formal', 'De usted, cercano'] },
    { id: 'marca_evitar', type: 'textarea', label: '¿Algo de tu imagen actual que no te guste o quieras evitar?' },
  ],
};

const marcaB: Section = {
  id: 'marca',
  title: 'Tu marca',
  intro: 'Aún no tienes identidad definida. Con estas respuestas proponemos una imagen para tu web.',
  fields: [
    { id: 'marca_existente', type: 'checkbox', label: '¿Tienes algo de lo siguiente, aunque sea básico?', options: ['Logo', 'Colores que ya uso', 'Nada todavía'] },
    { id: 'marca_logo', type: 'radio', label: '¿Necesitas que diseñemos tu logotipo?', options: ['Sí', 'No, solo la imagen de la web', 'No estoy seguro'] },
    {
      id: 'marca_ejes',
      type: 'scale',
      label: '¿Dónde ubicas tu marca en cada línea?',
      pairs: [
        ['Clásica', 'Moderna'],
        ['Seria', 'Divertida'],
        ['Minimalista', 'Llamativa'],
        ['Accesible', 'Premium'],
        ['Cálida', 'Tecnológica'],
      ],
    },
    { id: 'marca_palabras', type: 'text', label: 'Tres palabras de cómo quieres que te perciban' },
    { id: 'marca_colores_si', type: 'text', label: 'Colores que te gustan para tu marca' },
    { id: 'marca_colores_no', type: 'text', label: 'Colores que NO quieres' },
    { id: 'marca_admira', type: 'text', label: 'Marcas (de cualquier giro) cuya imagen admires' },
    { id: 'marca_trato', type: 'radio', label: '¿Cómo le hablas a tus clientes?', options: ['De tú, cercano', 'De tú, divertido', 'De usted, formal', 'De usted, cercano'] },
  ],
};

const referencias: Section = {
  id: 'referencias',
  title: 'Referencias y competencia',
  fields: [
    { id: 'ref_gustan', type: 'textarea', label: 'Tres páginas web que te gusten y qué te gusta de cada una' },
    { id: 'ref_no_gusta', type: 'text', label: 'Una página que NO te guste y por qué' },
    { id: 'competencia', type: 'textarea', label: 'Tus dos o tres competidores principales (nombre o web)' },
  ],
};

const fechas: Section = {
  id: 'fechas',
  title: 'Fechas, presupuesto y decisiones',
  fields: [
    { id: 'fecha', type: 'text', label: '¿Para cuándo necesitas la web? ¿Hay una fecha clave?' },
    {
      id: 'presupuesto',
      type: 'radio',
      label: 'Rango de inversión que tienes contemplado',
      options: ['Menos de $10,000 MXN', '$10,000 – $25,000 MXN', '$25,000 – $50,000 MXN', '$50,000 – $100,000 MXN', 'Más de $100,000 MXN', 'Aún no lo sé, quiero una recomendación'],
    },
    { id: 'decisor', type: 'text', label: '¿Quién aprueba el diseño y los pagos? (nombre y puesto)' },
    { id: 'mantenimiento', type: 'radio', label: '¿Te interesa mantenimiento y mejoras mensuales después del lanzamiento?', options: ['Sí', 'Tal vez', 'No'] },
  ],
};

const cuentas: Section = {
  id: 'cuentas',
  title: 'Dominio y cuentas',
  fields: [
    { id: 'dominio', type: 'text', label: '¿Ya tienes dominio? ¿Cuál?' },
    { id: 'correo_dominio', type: 'radio', label: '¿Tienes correo con tu dominio?', options: ['Sí', 'No'] },
    { id: 'redes', type: 'textarea', label: 'Redes sociales activas (enlaces)' },
    { id: 'extra', type: 'textarea', label: '¿Algo más que debamos saber?' },
  ],
};

export function sectionsFor(variant: 'A' | 'B'): Section[] {
  return [negocio, objetivo, clientes, contenido, funciones, variant === 'A' ? marcaA : marcaB, referencias, fechas, cuentas];
}

export type Answers = Record<string, string | string[] | Record<string, number>>;

/** Convierte respuestas en Markdown legible (para el dashboard y los agentes). */
export function answersToMarkdown(variant: 'A' | 'B', answers: Answers) {
  const lines: string[] = [];
  for (const s of sectionsFor(variant)) {
    lines.push(`## ${s.title}`, '');
    for (const f of s.fields) {
      const v = answers[f.id];
      let text = '—';
      if (Array.isArray(v)) text = v.length ? v.join('; ') : '—';
      else if (v && typeof v === 'object' && f.type === 'scale') {
        text = f.pairs.map(([a, b]) => `${a} ${v[`${a}-${b}`] ?? '?'}/5 ${b}`).join(' · ');
      } else if (typeof v === 'string' && v.trim()) text = v.trim();
      lines.push(`- **${f.label}:** ${text}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
