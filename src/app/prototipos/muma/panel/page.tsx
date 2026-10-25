import Link from 'next/link';
import ContactForm from '../_components/ContactForm';
import PillarTiles from '../_components/PillarTiles';
import { EMAIL, PHONE, steps, WHATSAPP } from '../content';

export default function PanelPrototype() {
  return (
    <div className="d1">
      <div className="proto-bar">
        Prototipo · Dirección 1 «Panel» · <Link href="/prototipos/muma/diagonal">Ver dirección 2</Link>
      </div>

      <header className="hero">
        <div className="panel mesh-a">
          <img className="logo" src="/prototipos/muma/logo-lima.svg" alt="MUMA creative house" width={177} height={52} />
          <a className="btn btn-light m-cta" href="#contacto">Agendar</a>
          <h1>Creamos marcas líderes.</h1>
          <p className="tag">Casa creativa de branding 360°.</p>
        </div>
        <div className="side">
          <nav className="nav" aria-label="Principal">
            <a href="#servicios">Servicios</a>
            <a href="#metodo">Método</a>
            <a href="#portafolio">Portafolio</a>
            <a href="#contacto">Contacto</a>
            <a className="btn btn-primary" href="#contacto">Agendar diagnóstico</a>
          </nav>
          <div className="lead">
            <p>Transformamos marcas en referentes del mercado con <strong>estrategias diseñadas para vender</strong>. Todo lo que tu marca necesita, con un solo proveedor.</p>
            <div className="actions">
              <a className="btn btn-primary" href="#contacto">Agendar diagnóstico</a>
              <a className="btn btn-ghost" href="#servicios">Ver servicios</a>
            </div>
            <div className="facts">
              <div><span>360°</span>de la idea al crecimiento</div>
              <div><span>21</span>servicios en un solo lugar</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="block" id="servicios" aria-labelledby="t-servicios">
          <div className="block-head">
            <h2 id="t-servicios">¿En qué etapa se encuentra tu marca?</h2>
            <p>Elige un pilar para ver qué hacemos ahí. Puedes contratar el 360° completo o empezar por lo que más te urge.</p>
          </div>
          <PillarTiles />
        </section>

        <section className="block method" id="metodo" aria-labelledby="t-metodo">
          <div className="block-head">
            <h2 id="t-metodo">Así trabajamos.</h2>
            <p>Un solo equipo de principio a fin, para que tu marca no se pierda entre proveedores.</p>
          </div>
          <ol>
            {steps.map((s, i) => (
              <li key={s}><b className={['mesh-c', 'mesh-b', 'mesh-a'][i]}>{i + 1}</b>{s}</li>
            ))}
          </ol>
        </section>

        <section className="block" id="portafolio" aria-labelledby="t-portafolio">
          <div className="block-head">
            <h2 id="t-portafolio">Marcas que ya transformamos.</h2>
            <p>Espacio para tres casos con problema, decisión y resultado. Pendiente de que MUMA comparta sus proyectos.</p>
          </div>
          <div className="work">
            <div className="case mesh-e"><div>Caso 1<span>Pendiente de autorización</span></div></div>
            <div className="case mesh-d"><div>Caso 2<span>Pendiente de autorización</span></div></div>
            <div className="case mesh-f"><div>Caso 3<span>Pendiente de autorización</span></div></div>
          </div>
        </section>

        <section className="block" id="contacto" aria-labelledby="t-contacto">
          <div className="contact">
            <div className="contact-panel mesh-b">
              <h2 id="t-contacto">Agenda tu diagnóstico.</h2>
              <p>Cuéntanos de tu marca y te decimos por dónde empezar.</p>
              <a className="btn btn-light" href={WHATSAPP} target="_blank" rel="noreferrer">Escribir por WhatsApp</a>
              <dl>
                <dt>Correo</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
                <dt>Teléfono</dt><dd><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></dd>
              </dl>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="mesh-a">
        <img className="logo" src="/prototipos/muma/logo-lima.svg" alt="MUMA creative house" width={116} height={34} />
        <span>© 2026 MUMA Creative House · Prototipo de The Mala Leche</span>
      </footer>
    </div>
  );
}
