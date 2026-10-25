'use client';

import { useState } from 'react';
import { pillars } from '../content';

export default function PillarPicker() {
  const [active, setActive] = useState(0);
  const p = pillars[active];
  return (
    <div>
      <div className="pillars-line" role="group" aria-label="Pilares del servicio 360°">
        {pillars.map((x, i) => (
          <button key={x.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>
            {x.name === 'ADN' ? 'ADN' : x.name.charAt(0) + x.name.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      <p className="pillar-text" aria-live="polite"><b>{p.items.join(', ')}.</b> {p.text}</p>
    </div>
  );
}
