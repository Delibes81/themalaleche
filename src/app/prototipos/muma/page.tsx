import Link from 'next/link';

export default function MumaIndex() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '72px 20px' }}>
      <img src="/prototipos/muma/logo-indigo.svg" alt="MUMA creative house" width={170} height={50} />
      <h1 style={{ font: '900 clamp(40px,6vw,72px)/1 var(--display)', color: 'var(--indigo)', margin: '40px 0 16px' }}>Dos direcciones para tu sitio.</h1>
      <p style={{ fontSize: 22, fontWeight: 300, maxWidth: '40ch' }}>Navega ambas en computadora y celular, y dinos cuál representa mejor a MUMA.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginTop: 40 }}>
        <Link href="/prototipos/muma/panel" className="mesh-a" style={{ color: '#fff', textDecoration: 'none', padding: 32, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', clipPath: 'polygon(0 0,100% 0,88% 100%,0 100%)' }}>
          <strong style={{ font: '900 32px/1 var(--display)' }}>Dirección 1 · Panel</strong>
          <span style={{ marginTop: 8 }}>El degradado como protagonista, igual que tu brochure.</span>
        </Link>
        <Link href="/prototipos/muma/diagonal" style={{ color: 'var(--indigo)', textDecoration: 'none', padding: 32, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'var(--mist)' }}>
          <strong style={{ font: '900 32px/1 var(--display)' }}>Dirección 2 · Diagonal</strong>
          <span style={{ marginTop: 8 }}>Blanco y tipografía índigo, con la diagonal de tu logo como acento.</span>
        </Link>
      </div>
    </main>
  );
}
