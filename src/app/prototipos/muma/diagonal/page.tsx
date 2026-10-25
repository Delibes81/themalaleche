import Link from 'next/link';
import ContactForm from '../_components/ContactForm';
import MobileMenu from '../_components/MobileMenu';
import PillarPicker from '../_components/PillarPicker';
import { EMAIL, PHONE, serviceGroups, steps, WHATSAPP } from '../content';

const marks = ['mesh-b', 'mesh-a', 'mesh-c'];

export default function DiagonalPrototype() {
  return (
    <div className="d2">
      <div className="proto-bar">
        Prototipo · Dirección 2 «Diagonal» · <Link href="/prototipos/muma/panel">Ver dirección 1</Link>
      </div>

      <header className="top">
        <img className="logo" src="/prototipos/muma/logo-indigo.svg" alt="MUMA creative house" width={157} height={46} />
        <nav className="nav" aria-label="Principal">
          <a href="#servicios">Servicios</a>
          <a href="#metodo">Método</a>
          <a href="#portafolio">Portafolio</a>
          <a href="#contacto">Contacto</a>
          <a className="btn btn-primary" href="#contacto">Agendar</a>
          <MobileMenu />
        </nav>
      </header>

      <main>
        <section className="hero" id="metodo" aria-labelledby="t-hero">
          <div className="slash" aria-hidden="true" />
          <h1 id="t-hero">Creamos marcas líderes.</h1>
          <div className="lead">
            <p>Transformamos marcas en referentes del mercado con estrategias diseñadas para vender. Branding 360° con un solo proveedor.</p>
            <div className="actions">
              <a className="btn btn-primary" href="#contacto">Agendar diagnóstico</a>
              <a className="btn btn-ghost" href="#servicios">Ver servicios</a>
            </div>
          </div>
          <ol className="steps" aria-label="Cómo trabajamos">
            {steps.map((s, i) => (
              <li key={s}><b>{i + 1}</b><span>{s}</span></li>
            ))}
          </ol>
        </section>

        <section className="block" id="servicios" aria-labelledby="t-servicios">
          <h2 id="t-servicios">Lo que tu marca necesita, en un solo lugar.</h2>
          <p className="intro">Contrata el servicio 360° completo o solo la parte que te falta. Empezamos siempre con un diagnóstico.</p>
          <ul className="groups">
            {serviceGroups.map((g, i) => (
              <li key={g.title}><i className={marks[i % 3]} aria-hidden="true" /><h3>{g.title}</h3><p>{g.text}</p></li>
            ))}
          </ul>
          <PillarPicker />
        </section>

        <section className="block" id="portafolio" aria-labelledby="t-portafolio" style={{ paddingTop: 0 }}>
          <h2 id="t-portafolio">Marcas que ya transformamos.</h2>
          <p className="intro">Espacio para un caso protagonista y dos secundarios. Pendiente de que MUMA comparta sus proyectos.</p>
          <div className="work-grid">
            <div className="case"><span>Caso destacado<small>Pendiente de autorización</small></span></div>
            <div className="case"><span>Caso 2<small>Pendiente de autorización</small></span></div>
            <div className="case"><span>Caso 3<small>Pendiente de autorización</small></span></div>
          </div>
        </section>

        <section className="block" id="contacto" aria-labelledby="t-contacto" style={{ paddingTop: 0 }}>
          <div className="contact">
            <aside>
              <h2 id="t-contacto">Agenda tu diagnóstico.</h2>
              <p>Cuéntanos de tu marca y te decimos por dónde empezar.</p>
              <a className="btn btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Escribir por WhatsApp</a>
              <dl>
                <dt>Correo</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
                <dt>Teléfono</dt><dd><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></dd>
              </dl>
            </aside>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 MUMA Creative House</span>
        <span>Prototipo de The Mala Leche</span>
      </footer>
    </div>
  );
}
