'use client';

import { useState, type FormEvent } from 'react';
import { stages, WHATSAPP } from '../content';

type Errors = Partial<Record<'nombre' | 'marca' | 'contacto', string>>;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nombre = String(data.get('nombre') ?? '').trim();
    const marca = String(data.get('marca') ?? '').trim();
    const contacto = String(data.get('contacto') ?? '').trim();
    const next: Errors = {};
    if (!nombre) next.nombre = 'Escribe tu nombre.';
    if (!marca) next.marca = 'Escribe el nombre de tu marca.';
    if (!/^\S+@\S+\.\S+$/.test(contacto) && contacto.replace(/\D/g, '').length < 10) next.contacto = 'Escribe un correo válido o un WhatsApp de 10 dígitos.';
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(nombre.split(' ')[0]);
  };

  if (sent) {
    return (
      <div className="sent" role="status">
        <strong>Listo, {sent}. Recibimos tu solicitud.</strong>
        Te contactaremos para agendar tu diagnóstico. Si prefieres, escríbenos directo por{' '}
        <a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp</a>.
        <p className="note" style={{ marginTop: 12 }}>Prototipo: en esta versión el formulario no envía datos.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label>
        Tu nombre
        <input name="nombre" autoComplete="name" aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? 'e-nombre' : undefined} />
        {errors.nombre && <span id="e-nombre" className="err">{errors.nombre}</span>}
      </label>
      <label>
        Tu marca
        <input name="marca" aria-invalid={!!errors.marca} aria-describedby={errors.marca ? 'e-marca' : undefined} />
        {errors.marca && <span id="e-marca" className="err">{errors.marca}</span>}
      </label>
      <label>
        Correo o WhatsApp
        <input name="contacto" autoComplete="email" aria-invalid={!!errors.contacto} aria-describedby={errors.contacto ? 'e-contacto' : undefined} />
        {errors.contacto && <span id="e-contacto" className="err">{errors.contacto}</span>}
      </label>
      <label>
        ¿En qué etapa está tu marca?
        <select name="etapa" defaultValue={stages[0]}>
          {stages.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>
        Cuéntanos qué necesitas (opcional)
        <textarea name="mensaje" />
      </label>
      <button className="btn btn-primary" type="submit">Agendar diagnóstico</button>
      <p className="note">La reunión de diagnóstico es el primer paso para conocer tu marca.</p>
    </form>
  );
}
