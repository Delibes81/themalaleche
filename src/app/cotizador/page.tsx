"use client";

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { ProposalModule, ProposalStep, RecurringCost } from '../../types/proposal';
import { Session } from '@supabase/supabase-js';

const AVAILABLE_FONTS = [
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Cinzel', family: "'Cinzel', serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'JetBrains Mono', family: "'JetBrains Mono', monospace" }
];

export default function Cotizador() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientLogoType, setClientLogoType] = useState<'text' | 'image'>('text');
  const [clientLogoValue, setClientLogoValue] = useState('H. DE HELENA');
  const [clientLogoFont, setClientLogoFont] = useState('Inter');
  const [description, setDescription] = useState('Ejecución de una plataforma web de alto rendimiento. El sistema fusiona una interfaz de usuario minimalista y vanguardista con una arquitectura de backend robusta, diseñada para la escalabilidad.');
  const [timeEstimate, setTimeEstimate] = useState('4 SEMANAS');
  const [stack, setStack] = useState('REACT+VITE / SUPABASE');
  const [status, setStatus] = useState('PENDIENTE');
  const [includeMockups, setIncludeMockups] = useState(false);
  const [mockupUrls, setMockupUrls] = useState('');
  
  const [modules, setModules] = useState<ProposalModule[]>([
    {
      id: '1',
      title: 'Frontend Core',
      features: ['UX/UI Reactivo & Animado', 'Catálogo Filtrable'],
      cost: 5000
    }
  ]);

  const [recurringCosts, setRecurringCosts] = useState<RecurringCost[]>([]);

  const [steps, setSteps] = useState<ProposalStep[]>([
    { id: '1', label: 'Diseño & DB' },
    { id: '2', label: 'Admin Panel' },
    { id: '3', label: 'Tienda Core' },
    { id: '4', label: 'QA & Launch' }
  ]);

  const totalBudget = useMemo(() => modules.reduce((sum, mod) => sum + mod.cost, 0), [modules]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchProposals();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProposals();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchProposals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching proposals:', error);
      alert('Error al cargar cotizaciones: ' + error.message);
    } else {
      setProposals(data || []);
    }
    setLoading(false);
  };

  const handleNew = () => {
    setCurrentId(null);
    setClientName('');
    setClientLogoType('text');
    setClientLogoValue('');
    setClientLogoFont('Inter');
    setDescription('Ejecución de una plataforma web de alto rendimiento. El sistema fusiona una interfaz de usuario minimalista y vanguardista con una arquitectura de backend robusta, diseñada para la escalabilidad.');
    setTimeEstimate('4 SEMANAS');
    setStack('REACT+VITE / SUPABASE');
    setStatus('PENDIENTE');
    setIncludeMockups(false);
    setMockupUrls('');
    setModules([{ id: Date.now().toString(), title: 'Frontend Core', features: ['UX/UI Reactivo'], cost: 5000 }]);
    setRecurringCosts([]);
    setSteps([
      { id: '1', label: 'Diseño & DB' },
      { id: '2', label: 'Admin Panel' },
      { id: '3', label: 'Tienda Core' },
      { id: '4', label: 'QA & Launch' }
    ]);
  };

  const handleEdit = (p: any) => {
    setCurrentId(p.id);
    setClientName(p.client_name || '');
    setClientLogoType(p.client_logo_type || 'text');
    setClientLogoValue(p.client_logo_value || '');
    setClientLogoFont(p.client_logo_font || 'Inter');
    setDescription(p.description || '');
    setTimeEstimate(p.time_estimate || '');
    setStack(p.stack || '');
    setStatus(p.status || 'PENDIENTE');
    setModules(p.modules || []);
    setRecurringCosts(p.recurring_costs || []);
    setSteps(p.steps || []);
    
    if (p.mockups && p.mockups.length > 0) {
      setIncludeMockups(true);
      setMockupUrls(p.mockups.join(', '));
    } else {
      setIncludeMockups(false);
      setMockupUrls('');
    }
    
    window.scrollTo({ top: document.getElementById('form-section')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta cotización?')) return;
    
    const { error } = await supabase.from('proposals').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      if (currentId === id) handleNew();
      fetchProposals();
    }
  };

  const handleSave = async () => {
    if (!clientName) {
      alert('El nombre del cliente es requerido.');
      return;
    }

    setSaving(true);
    const mockupsArray = includeMockups ? mockupUrls.split(',').map(u => u.trim()).filter(Boolean) : [];

    const payload = {
      client_name: clientName,
      description,
      budget: totalBudget,
      time_estimate: timeEstimate,
      stack,
      status,
      modules,
      steps,
      recurring_costs: recurringCosts,
      mockups: mockupsArray,
      client_logo_type: clientLogoType,
      client_logo_value: clientLogoValue || clientName,
      client_logo_font: clientLogoFont
    };

    let error;
    if (currentId) {
      const { error: updateError } = await supabase.from('proposals').update(payload).eq('id', currentId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('proposals').insert([payload]);
      error = insertError;
    }

    setSaving(false);

    if (error) {
      console.error(error);
      alert('Error al guardar: ' + error.message);
    } else {
      alert('¡Cotización guardada exitosamente!');
      fetchProposals();
      handleNew();
    }
  };

  // Module Helpers
  const addModule = () => setModules([...modules, { id: Date.now().toString(), title: 'Nuevo Módulo', features: ['Característica 1'], cost: 1000 }]);
  const updateModule = (id: string, field: keyof ProposalModule, value: any) => setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m));
  const removeModule = (id: string) => setModules(modules.filter(m => m.id !== id));
  
  const addFeature = (moduleId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, features: [...m.features, 'Nueva característica'] };
      }
      return m;
    }));
  };

  const updateFeature = (moduleId: string, featureIndex: number, newValue: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        const newFeatures = [...m.features];
        newFeatures[featureIndex] = newValue;
        return { ...m, features: newFeatures };
      }
      return m;
    }));
  };

  const removeFeature = (moduleId: string, featureIndex: number) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, features: m.features.filter((_, idx) => idx !== featureIndex) };
      }
      return m;
    }));
  };

  // Recurring Costs Helpers
  const addRecurringCost = () => {
    setRecurringCosts([...recurringCosts, { id: Date.now().toString(), name: 'Hosting (Ej. Supabase)', cost: 500, period: 'Mensual' }]);
  };
  const updateRecurringCost = (id: string, field: keyof RecurringCost, value: any) => {
    setRecurringCosts(recurringCosts.map(rc => rc.id === id ? { ...rc, [field]: value } : rc));
  };
  const removeRecurringCost = (id: string) => {
    setRecurringCosts(recurringCosts.filter(rc => rc.id !== id));
  };

  // Step Helpers
  const addStep = () => { if (steps.length < 5) setSteps([...steps, { id: Date.now().toString(), label: 'Nuevo Paso' }]); };
  const updateStep = (id: string, label: string) => setSteps(steps.map(s => s.id === id ? { ...s, label } : s));
  const removeStep = (id: string) => setSteps(steps.filter(s => s.id !== id));

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Cargando...</p></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border border-gray-100">
          <h1 className="text-2xl font-bold text-center mb-6">Cotizador Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-black focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2 px-4 bg-black text-white font-medium rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-6">
            Solo administradores autorizados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* CRUD Panel */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestor de Cotizaciones</h1>
              <p className="text-sm text-gray-500">Sesión iniciada como: {session.user.email}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleNew} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                + Nueva
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                Salir
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500">Cargando cotizaciones...</p>
          ) : proposals.length === 0 ? (
            <p className="text-gray-500">No hay cotizaciones guardadas. Crea una nueva.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="p-3 border-b">Cliente</th>
                    <th className="p-3 border-b">Fecha</th>
                    <th className="p-3 border-b">Monto Inicial</th>
                    <th className="p-3 border-b">Status</th>
                    <th className="p-3 border-b text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map(p => (
                    <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{p.client_name}</td>
                      <td className="p-3 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-sm font-semibold">${p.budget?.toLocaleString()} MXN</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'APROBADO' ? 'bg-green-100 text-green-700' : p.status === 'EN PROGRESO' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <a href={`/propuesta/${p.id}`} target="_blank" rel="noreferrer" className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Ver Web</a>
                        <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100">Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Form */}
        <div id="form-section" className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
            {currentId ? `Editando Cotización: ${clientName}` : 'Crear Nueva Cotización'}
          </h2>
          
          <div className="space-y-8">
            {/* General Data */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Datos Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
                  <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-2 border rounded focus:ring-black focus:border-black" placeholder="Ej. H de Helena" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo Estimado</label>
                  <input type="text" value={timeEstimate} onChange={e => setTimeEstimate(e.target.value)} className="w-full p-2 border rounded focus:ring-black focus:border-black" placeholder="Ej. 4 SEMANAS" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stack Tecnológico</label>
                  <input type="text" value={stack} onChange={e => setStack(e.target.value)} className="w-full p-2 border rounded focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border rounded focus:ring-black focus:border-black">
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="APROBADO">APROBADO</option>
                    <option value="EN PROGRESO">EN PROGRESO</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Proyecto</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded focus:ring-black focus:border-black h-24" />
                </div>
              </div>
            </section>

            {/* Client Logo Config */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Logo del Cliente (Para la Propuesta)</h3>
              <div className="flex items-center gap-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="logoType" value="text" checked={clientLogoType === 'text'} onChange={() => setClientLogoType('text')} />
                  <span className="text-sm">Solo Texto (con tipografía)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                  <input type="radio" name="logoType" value="image" checked={clientLogoType === 'image'} disabled onChange={() => setClientLogoType('image')} />
                  <span className="text-sm">Imagen (Próximamente)</span>
                </label>
              </div>
              
              {clientLogoType === 'text' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Texto a mostrar como logo</label>
                    <input type="text" value={clientLogoValue} onChange={e => setClientLogoValue(e.target.value)} className="w-full p-2 border rounded text-sm font-serif" placeholder="Ej. H. DE HELENA" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Elegir Tipografía</label>
                    <select value={clientLogoFont} onChange={e => setClientLogoFont(e.target.value)} className="w-full p-2 border rounded text-sm focus:ring-black focus:border-black">
                      {AVAILABLE_FONTS.map(font => (
                        <option key={font.name} value={font.name}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </section>

            {/* Modules */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Módulos y Costos (Inversión Inicial)</h3>
                <button onClick={addModule} className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800">+ Módulo</button>
              </div>
              <div className="space-y-4">
                {modules.map((mod) => (
                  <div key={mod.id} className="bg-white p-4 rounded border relative">
                    <button onClick={() => removeModule(mod.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold">✕</button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div className="md:col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">Título del Módulo</label>
                        <input type="text" value={mod.title} onChange={(e) => updateModule(mod.id, 'title', e.target.value)} className="w-full p-2 border rounded text-sm font-semibold" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Costo (MXN)</label>
                        <input type="number" step="1000" value={mod.cost} onChange={(e) => updateModule(mod.id, 'cost', Number(e.target.value))} className="w-full p-2 border rounded text-sm" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs text-gray-500">Características del Módulo</label>
                        <button onClick={() => addFeature(mod.id)} className="text-xs text-blue-600 hover:underline">+ Agregar característica</button>
                      </div>
                      <div className="space-y-2">
                        {mod.features.map((feat, featIdx) => (
                          <div key={featIdx} className="flex gap-2">
                            <input 
                              type="text" 
                              value={feat} 
                              onChange={(e) => updateFeature(mod.id, featIdx, e.target.value)} 
                              className="flex-1 p-2 border rounded text-sm" 
                              placeholder="Ej. Responsive, SEO, etc."
                            />
                            <button 
                              onClick={() => removeFeature(mod.id, featIdx)} 
                              className="px-2 text-gray-400 hover:text-red-500 transition"
                              title="Eliminar característica"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <span className="text-lg font-bold text-gray-800">Inversión Inicial Total: ${totalBudget.toLocaleString()} MXN</span>
              </div>
            </section>

            {/* Recurring Costs */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Gastos Recurrentes (Opcional)</h3>
                <button onClick={addRecurringCost} className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800">+ Gasto Recurrente</button>
              </div>
              {recurringCosts.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No hay gastos recurrentes configurados para esta cotización.</p>
              ) : (
                <div className="space-y-3">
                  {recurringCosts.map((rc) => (
                    <div key={rc.id} className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded border items-end relative">
                      <button onClick={() => removeRecurringCost(rc.id)} className="absolute top-1 right-1 text-red-500 text-xs font-bold md:static md:mb-2">✕</button>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Nombre del Servicio</label>
                        <input type="text" value={rc.name} onChange={(e) => updateRecurringCost(rc.id, 'name', e.target.value)} className="w-full p-2 border rounded text-sm font-medium" placeholder="Ej. Hosting AWS" />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-xs text-gray-500 mb-1">Costo (MXN)</label>
                        <input type="number" step="100" value={rc.cost} onChange={(e) => updateRecurringCost(rc.id, 'cost', Number(e.target.value))} className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-xs text-gray-500 mb-1">Periodicidad</label>
                        <select value={rc.period} onChange={(e) => updateRecurringCost(rc.id, 'period', e.target.value)} className="w-full p-2 border rounded text-sm">
                          <option value="Mensual">Mensual</option>
                          <option value="Anual">Anual</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Timeline */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Cronograma (Pasos)</h3>
                <button onClick={addStep} className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800" disabled={steps.length >= 5}>+ Paso (Máx 5)</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((step, idx) => (
                  <div key={step.id} className="bg-white p-3 rounded border relative">
                    <button onClick={() => removeStep(step.id)} className="absolute top-1 right-1 text-red-500 text-xs font-bold">✕</button>
                    <label className="block text-xs text-gray-500 mb-1">Paso 0{idx + 1}</label>
                    <input type="text" value={step.label} onChange={(e) => updateStep(step.id, e.target.value)} className="w-full p-1 border rounded text-sm text-center font-medium" />
                  </div>
                ))}
              </div>
            </section>

            {/* Mockups */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Mockups / Imágenes</h3>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={includeMockups} onChange={(e) => setIncludeMockups(e.target.checked)} />
                    <div className={`block w-14 h-8 rounded-full transition ${includeMockups ? 'bg-black' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${includeMockups ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">Incluir Mockups</span>
                </label>
              </div>
              {includeMockups && (
                <div className="bg-white p-4 rounded border">
                  <label className="block text-xs text-gray-500 mb-1">URLs de imágenes (separadas por coma) - Sugerencia: .webp</label>
                  <textarea value={mockupUrls} onChange={(e) => setMockupUrls(e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Ej. https://i.imgur.com/xyz.webp, /mockup.webp" rows={3} />
                </div>
              )}
            </section>

            {/* Action */}
            <div className="border-t pt-8 flex justify-end gap-4">
              <button onClick={handleNew} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300 transition">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition disabled:opacity-50">
                {saving ? 'Guardando...' : currentId ? 'Guardar Cambios' : 'Crear Cotización'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
