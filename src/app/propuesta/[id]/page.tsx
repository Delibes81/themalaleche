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
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);

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

    // Elegant SaaS configuration
    const particleCount = 80; // More particles but smaller
    const connectionDistance = 180;
    const particleSpeed = 0.2; // Slower, more relaxing
    const sunriseColors = [
      '66, 133, 244',  // Blue
      '255, 122, 0',   // Orange
      '255, 75, 130',  // Pink
      '251, 188, 5'    // Gold
    ];

    // Mouse interaction
    let mouse = {
      x: -1000,
      y: -1000,
      radius: 250 // Interaction radius
    };

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
      baseX: number;
      baseY: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * 1.5 + 0.5; // Smaller, elegant dots
        this.color = sunriseColors[Math.floor(Math.random() * sunriseColors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges smoothly
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interactivity (parallax repulsion)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 1;
          const directionY = forceDirectionY * force * 1;
          
          // Gently push away
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, 0.5)`;
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

        // Connect particles to each other
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            // Opacity fades as distance increases
            const opacity = (1 - distance / connectionDistance) * 0.45;
            ctx.strokeStyle = `rgba(${particles[i].color}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect particles to mouse
        const mouseDx = particles[i].x - mouse.x;
        const mouseDy = particles[i].y - mouse.y;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        
        if (mouseDistance < connectionDistance) {
          ctx.beginPath();
          const opacity = (1 - mouseDistance / connectionDistance) * 0.6;
          ctx.strokeStyle = `rgba(${particles[i].color}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    init();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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
          <div className="header-top">
            <div className="header-left">
              <img src="/logo.png" alt="Logo" className="logo-img" style={{ filter: 'invert(1)', mixBlendMode: 'normal' }} />
              <h1>Propuesta<br />Técnica</h1>
              <div className="subtitle">PROJECT: THE MALA LECHE // V.1.0</div>
            </div>

            <div className="client-logo-container">
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
          </div>

          <div className="header-right-container">
            <div className="header-right">
              <div>
                <span>FECHA</span>
                <strong>{data.date}</strong>
              </div>
              <div>
                <span>ID</span>
                <strong>{data.id.split('-')[0]}</strong>
              </div>
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

        <div className="section-wrapper">
          <h2>01 // INICIALIZACIÓN</h2>
          <p>{data.description}</p>
        </div>

        <div className="section-wrapper">
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
        </div>

        <div className="section-wrapper">
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
        </div>

        {data.mockups && data.mockups.length > 0 && (
          <div className="section-wrapper">
            <h2>04 // MOCKUPS & REFERENCIAS</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              {data.mockups.map((url, idx) => (
                <div key={idx} className="card mockup-card" onClick={() => setSelectedMockup(url)}>
                  <img src={url} alt={`Mockup ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section-wrapper">
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
        </div>

        {data.recurringCosts && data.recurringCosts.length > 0 && (
          <div className="section-wrapper">
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
          </div>
        )}

        {/* Planes de Pago */}
        {data.paymentPlans && data.paymentPlans.length > 0 ? (
          <div className="section-wrapper">
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
          </div>
        ) : (
          <div className="section-wrapper">
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
          </div>
        )}

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

      {/* Botón flotante para PDF */}
      <div className="floating-actions">
        <button className="pdf-button" onClick={() => window.print()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Descargar PDF
        </button>
      </div>

      {selectedMockup && (
        <div className="lightbox-overlay" onClick={() => setSelectedMockup(null)}>
          <div className="lightbox-close">×</div>
          <img src={selectedMockup} alt="Mockup Ampliado" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
