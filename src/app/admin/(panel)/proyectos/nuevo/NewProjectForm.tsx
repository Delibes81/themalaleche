'use client';

import { useActionState, useState } from 'react';
import { createProject, type ActionState } from '../../../actions';
import { LEVELS, slugify } from '@/lib/phases';
import { FormMessage, SubmitButton, inputCls, labelCls } from '@/components/admin/ui';

export default function NewProjectForm({ clients, defaultClient }: { clients: { id: string; name: string }[]; defaultClient?: string }) {
  const [state, action] = useActionState<ActionState, FormData>(createProject, null);
  const [clientId, setClientId] = useState(defaultClient ?? (clients.length ? clients[0].id : 'nuevo'));
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <form action={action} className="space-y-6">
      <div>
        <label className={labelCls} htmlFor="client_id">Cliente</label>
        <select id="client_id" name="client_id" value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputCls}>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          <option value="nuevo">+ Cliente nuevo</option>
        </select>
      </div>

      {clientId === 'nuevo' && (
        <div className="grid gap-4 border-l-2 border-[#111418] pl-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelCls}>Nombre del negocio</span>
            <input name="client_name" required className={inputCls} />
          </label>
          <label className="block">
            <span className={labelCls}>Contacto</span>
            <input name="contact_name" className={inputCls} />
          </label>
          <label className="block">
            <span className={labelCls}>Correo</span>
            <input name="email" type="email" className={inputCls} />
          </label>
          <label className="block">
            <span className={labelCls}>WhatsApp / teléfono</span>
            <input name="phone" className={inputCls} />
          </label>
          <label className="block">
            <span className={labelCls}>¿Tiene branding?</span>
            <select name="has_branding" className={inputCls} defaultValue="no">
              <option value="si">Sí → cuestionario A</option>
              <option value="no">No → cuestionario B</option>
            </select>
          </label>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelCls}>Nombre del proyecto</span>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="Ej. Sitio web Clínica Aurora"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Identificador (para agentes)</span>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className={`${inputCls} font-mono`}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Nivel estimado</span>
          <select name="level" defaultValue="" className={inputCls}>
            <option value="">Aún no sé</option>
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton>Crear proyecto</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
