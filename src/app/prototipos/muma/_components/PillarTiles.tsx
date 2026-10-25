'use client';

import { useState } from 'react';
import { pillars, WHATSAPP } from '../content';

export default function PillarTiles() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : pillars[active];
  return (
    <>
      <div className="tiles">
        {pillars.map((p, i) => (
          <button key={p.name} type="button" className="tile" aria-expanded={active === i} aria-controls="pillar-detail" onClick={() => setActive(active === i ? null : i)}>
            <span className={`chip ${p.mesh}`}>{p.name}</span>
            <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </button>
        ))}
      </div>
      <div id="pillar-detail" aria-live="polite">
        {current && (
          <div className="pillar-detail">
            <p><b>{current.name}</b>{current.text}</p>
            <a className="btn btn-light" href={WHATSAPP} target="_blank" rel="noreferrer">Quiero empezar por aquí</a>
          </div>
        )}
      </div>
    </>
  );
}
