"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ProposalData } from '../../../types/proposal';
import './Proposal.css';

export default function Proposal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { id } = useParams<{ id: string }>();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProposal() {
      if (!id) return;
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error fetching proposal", error);
        setError("No se pudo cargar la propuesta. Es posible que el enlace no sea válido.");
      } else if (data) {
        // Map snake_case to camelCase
        setProposalData({
          id: data.id,
          clientName: data.client_name,
          date: new Date(data.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
          budget: data.budget,
          timeEstimate: data.time_estimate,
          stack: data.stack,
          status: data.status,
          description: data.description,
          modules: data.modules || [],
          steps: data.steps || [],
          mockups: data.mockups || [],
          recurringCosts: data.recurring_costs || [],
          paymentPlans: data.payment_plans || [],
          clientLogoType: data.client_logo_type,
          clientLogoValue: data.client_logo_value,
          clientLogoFont: data.client_logo_font || 'Inter'
        });
      }
    }
    fetchProposal();
  }, [id]);

  useEffect(() => {
    if (proposalData?.clientLogoFont && proposalData.clientLogoFont !== 'Inter' && proposalData.clientLogoFont !== 'JetBrains Mono') {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${proposalData.clientLogoFont.replace(/ /g, '+')}:wght@400;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [proposalData?.clientLogoFont]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: any[] = [];
    let animationFrameId: number;

    const particleCount = 60;
    const connectionDistance = 150;
    const particleSpeed = 0.5;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      animate();
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 0, 0, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [proposalData]); // Re-run if data changes, though canvas is BG

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono text-center p-8 border border-red-200">
      <div>
        <h1 className="text-xl font-bold mb-2 text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    </div>;
  }

  if (!proposalData) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono">Loading...</div>;
  }

  const data = proposalData;

  return (
    <div className="proposal-wrapper">
      <canvas id="bg-canvas" ref={canvasRef}></canvas>

      <div className="page-container">
        <header>
          <div className="header-left">
            <img src="/logo.png" alt="Logo" className="logo-img" style={{ filter: 'invert(1)', mixBlendMode: 'normal' }} />
            <h1>Propuesta<br />Técnica</h1>
            <div className="subtitle">PROJECT: THE MALA LECHE // V.1.0</div>
          </div>

          <div className="client-logo-container" style={{ marginRight: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {data.clientLogoType === 'text' ? (
              <h2 style={{ fontSize: '28px', letterSpacing: '2px', textTransform: 'uppercase', color: '#000', margin: 0, border: 'none', fontFamily: `'${data.clientLogoFont || 'Inter'}', sans-serif` }}>
                {data.clientLogoValue || data.clientName}
              </h2>
            ) : (
              // Placeholder para el futuro
              <div style={{ width: '80px', height: '80px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999', border: '1px dashed #ccc' }}>
                CLIENT LOGO
              </div>
            )}
          </div>

          <div className="header-right">
            <div>
              <span>CLIENTE</span>
              <strong style={{textTransform: 'uppercase'}}>{data.clientName}</strong>
            </div>
            <div>
              <span>FECHA</span>
              <strong>{data.date}</strong>
            </div>
            <div>
              <span>ID</span>
              <strong>{data.id.split('-')[0]}</strong> {/* Show start of UUID as ID */}
            </div>
          </div>
        </header>

        <div className="system-status">
          <div className="status-item">
            <span className="status-label">Tiempo Est.</span>
            <span className="status-value" style={{textTransform: 'uppercase'}}>{data.timeEstimate}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Stack</span>
            <span className="status-value" style={{textTransform: 'uppercase'}}>{data.stack}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Status</span>
            <span className="status-value" style={{textTransform: 'uppercase'}}>{data.status}</span>
          </div>
        </div>

        <h2>01 // INICIALIZACIÓN</h2>
        <p>{data.description}</p>

        <h2>02 // MÓDULOS DEL SISTEMA</h2>
        <div className="grid">
          {data.modules.map((mod) => (
            <div className="card" key={mod.id}>
              <h3>{mod.title}</h3>
              <ul>
                {mod.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2>03 // CRONOGRAMA DE EJECUCIÓN</h2>
        <div className="timeline-container">
          <div className="timeline-line"></div>
          <div className="timeline-steps">
            {data.steps.map((step, idx) => (
              <div className="step" key={step.id}>
                <div className="step-dot">{(idx + 1).toString().padStart(2, '0')}</div>
                <div className="step-label">{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        {data.mockups && data.mockups.length > 0 && (
          <>
            <h2>04 // MOCKUPS & REFERENCIAS</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              {data.mockups.map((url, idx) => (
                <div key={idx} className="card" style={{ padding: '10px' }}>
                  <img 
                    src={url} 
                    alt={`Mockup ${idx + 1}`} 
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', border: '1px solid var(--border)' }} 
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <h2>{data.mockups && data.mockups.length > 0 ? '05' : '04'} // DESGLOSE DE INVERSIÓN INICIAL</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Módulo</th>
                <th style={{ textAlign: 'right' }}>Costo (MXN)</th>
              </tr>
            </thead>
            <tbody>
              {data.modules.map(mod => (
                <tr key={mod.id}>
                  <td><strong style={{textTransform: 'uppercase'}}>{mod.title}</strong></td>
                  <td style={{ textAlign: 'right' }}>${mod.cost.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td>INVERSIÓN INICIAL TOTAL</td>
                <td style={{ textAlign: 'right' }}>${data.budget.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {data.recurringCosts && data.recurringCosts.length > 0 && (
          <>
            <h2>{data.mockups && data.mockups.length > 0 ? '06' : '05'} // GASTOS RECURRENTES (SERVICIOS)</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Periodicidad</th>
                    <th style={{ textAlign: 'right' }}>Costo (MXN)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recurringCosts.map(rc => (
                    <tr key={rc.id}>
                      <td><strong style={{textTransform: 'uppercase'}}>{rc.name}</strong></td>
                      <td style={{textTransform: 'uppercase'}}>{rc.period}</td>
                      <td style={{ textAlign: 'right' }}>${rc.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Planes de Pago */}
        {data.paymentPlans && data.paymentPlans.length > 0 ? (
          <>
            <h2>
              {data.recurringCosts && data.recurringCosts.length > 0 
                ? (data.mockups && data.mockups.length > 0 ? '07' : '06') 
                : (data.mockups && data.mockups.length > 0 ? '06' : '05')} // ESTRUCTURA DE PAGOS
            </h2>
            <div className="table-container payment-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Pago</th>
                    <th>Porcentaje</th>
                    <th>Monto (MXN)</th>
                    <th>Hito de Activación / Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {data.paymentPlans.map((pp) => {
                    const amount = data.budget * (pp.percentage / 100);
                    return (
                      <tr key={pp.id}>
                        <td style={{ verticalAlign: 'top' }}>
                          <strong style={{ fontSize: '1.05rem', color: '#000' }}>{pp.name}</strong>
                        </td>
                        <td style={{ verticalAlign: 'top' }}>{pp.percentage}%</td>
                        <td style={{ verticalAlign: 'top' }}>
                          <strong style={{ color: '#000' }}>${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                        </td>
                        <td style={{ verticalAlign: 'top', color: '#555', lineHeight: '1.5' }}>
                          {pp.condition}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <h2>
              {data.recurringCosts && data.recurringCosts.length > 0 
                ? (data.mockups && data.mockups.length > 0 ? '07' : '06') 
                : (data.mockups && data.mockups.length > 0 ? '06' : '05')} // ESTRUCTURA DE PAGOS
            </h2>
            <div className="table-container payment-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Pago</th>
                    <th>Porcentaje</th>
                    <th>Monto (MXN)</th>
                    <th>Hito de Activación / Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>
                      <strong style={{ fontSize: '1.05rem', color: '#000' }}>Pago Único</strong>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>100%</td>
                    <td style={{ verticalAlign: 'top' }}>
                      <strong style={{ color: '#000' }}>${data.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </td>
                    <td style={{ verticalAlign: 'top', color: '#555', lineHeight: '1.5' }}>
                      Pago de contado en 1 exhibición.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="footer-spacer"></div>

        <footer>
          <div className="footer-brand">
            GENERATED BY
            <span>THE MALA LECHE STUDIO</span>
          </div>
          <div className="footer-dev">
            <div className="dev-info">
              <strong>TEAM TML</strong>
              DIGITAL CRAFTERS
            </div>
            <img src="/logo.png" className="raven-footer" alt="TML Logo" style={{ filter: 'invert(1)', mixBlendMode: 'normal', width: '80px', objectFit: 'contain' }} />
          </div>
        </footer>
      </div>
    </div>
  );
}
