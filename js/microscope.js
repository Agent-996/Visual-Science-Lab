/* Visual Science Lab: what you see down a light microscope.
   Microscope.view(s, slide, mag, opts) draws the circular field of view of a slide at a
   magnification (40, 100 or 400). Slides: onion, cheek, elodea, stomata, stomata-upper, roots,
   blood, paramecium, euglena, amoeba, spirogyra, rbc, nerve, roothair, ciliated, palisade.
   opts.ring = [x, y, r] circles one part of the view; opts.zoom draws at a different scale from mag. */
(function () {
  'use strict';

  const R = 92; // radius of the field of view

  // Seeded random numbers, so a slide looks the same every time it is drawn.
  function rng(seed) {
    let t = seed >>> 0;
    return () => {
      t = (t * 1664525 + 1013904223) >>> 0;
      return t / 4294967296;
    };
  }

  // A wobbly closed shape around (cx, cy), for cells that are not neat boxes.
  function blob(s, cx, cy, r, rand, attrs) {
    const pts = [];
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const rr = r * (0.8 + rand() * 0.35);
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.85).toFixed(1)}`);
    }
    return s('polygon', { points: pts.join(' '), ...attrs });
  }

  // Rows of brick-shaped plant cells, each with optional extras drawn inside.
  function bricks(s, z, rand, w, h, look, inside) {
    const out = [];
    const cw = w * z;
    const ch = h * z;
    for (let row = -Math.ceil(R / ch) - 1; row <= Math.ceil(R / ch); row++) {
      const shift = (row % 2) * cw * 0.5;
      for (let col = -Math.ceil(R / cw) - 1; col <= Math.ceil(R / cw); col++) {
        const x = col * cw + shift;
        const y = row * ch;
        out.push(s('rect', { x, y, width: cw, height: ch, ...look, 'stroke-width': Math.max(0.6, 1.4 * z) }));
        if (inside) out.push(...inside(x, y, cw, ch));
      }
    }
    return out;
  }

  const SLIDES = {
    onion: { bg: '#f8f1d8', draw: (s, z, rand) => bricks(s, z, rand, 60, 22, { fill: '#f1dc9c', stroke: '#9c7430' }, (x, y, w, h) => (z >= 0.9 ? [s('ellipse', { cx: x + w * (0.3 + rand() * 0.4), cy: y + h * 0.5, rx: 3.6 * z, ry: 2.8 * z, fill: '#7a4f12' })] : [])) },
    elodea: { bg: '#eef6e4', draw: (s, z, rand) => bricks(s, z, rand, 46, 18, { fill: '#dcefc7', stroke: '#5f8a3a' }, (x, y, w, h) => {
      const out = [];
      const n = z >= 3 ? 26 : 12;
      for (let i = 0; i < n; i++) out.push(s('circle', { cx: x + 3 * z + rand() * (w - 6 * z), cy: y + 2.5 * z + rand() * (h - 5 * z), r: Math.max(0.7, 1.7 * z), fill: '#3c8a2a' }));
      return out;
    }) },
    palisade: { bg: '#eef6e4', draw: (s, z, rand) => bricks(s, z, rand, 16, 46, { fill: '#dcefc7', stroke: '#5f8a3a' }, (x, y, w, h) => Array.from({ length: 14 }, () => s('circle', { cx: x + 2 * z + rand() * (w - 4 * z), cy: y + 2 * z + rand() * (h - 4 * z), r: 1.8 * z, fill: '#3c8a2a' }))) },
    cheek: { bg: '#eef2fa', draw: (s, z, rand) => {
      const out = [];
      const n = Math.max(2, Math.min(40, Math.round(14 / (z * z))));
      for (let i = 0; i < n; i++) {
        const cx = (rand() * 2 - 1) * R * 0.9;
        const cy = (rand() * 2 - 1) * R * 0.9;
        out.push(blob(s, cx, cy, 22 * z, rand, { fill: '#c4d2f2', stroke: '#5a72b8', 'stroke-width': Math.max(0.6, 1.2 * z), opacity: 0.9 }));
        out.push(s('circle', { cx: cx + 3 * z, cy, r: 3.2 * z, fill: '#2f3f8a' }));
      }
      return out;
    } },
    stomata: { bg: '#eaf2e4', draw: (s, z, rand) => stomata(s, z, rand, 0.55) },
    'stomata-upper': { bg: '#eaf2e4', draw: (s, z, rand) => stomata(s, z, rand, 0.04) },
    roots: { bg: '#f6f4ee', draw: (s, z) => {
      const out = [s('rect', { x: -14 * z, y: -R - 10, width: 28 * z, height: 2 * R + 20, fill: '#efe5c8', stroke: '#b5a27a' })];
      for (let i = 0; i < 40; i++) {
        const y = -R + i * 5 * Math.max(1, z * 0.6);
        const len = 30 * z * (0.6 + ((i * 37) % 10) / 20);
        out.push(s('line', { x1: -14 * z, x2: -14 * z - len, y1: y, y2: y - 4 * z, stroke: '#c9b48a', 'stroke-width': Math.max(0.6, 1.4 * z) }), s('line', { x1: 14 * z, x2: 14 * z + len, y1: y + 2, y2: y - 2 * z, stroke: '#c9b48a', 'stroke-width': Math.max(0.6, 1.4 * z) }));
      }
      return out;
    } },
    roothair: { bg: '#f6f4ee', draw: (s, z) => [s('path', { d: `M${-60 * z},${-14 * z} L${-10 * z},${-14 * z} L${120 * z},${-20 * z} Q${130 * z},${-14 * z} ${120 * z},${-8 * z} L${-10 * z},${2 * z} L${-10 * z},${14 * z} L${-60 * z},${14 * z} Z`, fill: '#f4ebcf', stroke: '#9c8a5a', 'stroke-width': 1.5 }), s('ellipse', { cx: -36 * z, cy: 0, rx: 7 * z, ry: 5 * z, fill: '#7a5a20' })] },
    blood: { bg: '#fbeef0', draw: (s, z, rand) => {
      const out = [];
      const n = Math.max(6, Math.min(70, Math.round(40 / (z * z))));
      for (let i = 0; i < n; i++) {
        const cx = (rand() * 2 - 1) * R;
        const cy = (rand() * 2 - 1) * R;
        out.push(s('circle', { cx, cy, r: 7.5 * z, fill: '#e98a96', stroke: '#c0556a', 'stroke-width': 0.8 }), s('circle', { cx, cy, r: 3 * z, fill: '#f4bcc4' }));
      }
      out.push(s('circle', { cx: 30 * z, cy: -20 * z, r: 13 * z, fill: '#e9e0f4', stroke: '#8a6ab0' }), s('path', { d: `M${22 * z},${-22 * z} q6,-8 10,0 q6,6 10,-2`, fill: 'none', stroke: '#5a2a8a', 'stroke-width': 4 * z, 'stroke-linecap': 'round' }));
      for (let i = 0; i < 5; i++) out.push(s('circle', { cx: -40 * z + i * 9 * z, cy: 35 * z + (i % 2) * 5 * z, r: 1.6 * z, fill: '#7a3a9a' }));
      return out;
    } },
    paramecium: { bg: '#eef4f6', draw: (s, z) => [s('path', { d: `M${-50 * z},0 Q${-40 * z},${-24 * z} ${10 * z},${-22 * z} Q${54 * z},${-18 * z} ${50 * z},0 Q${40 * z},${22 * z} 0,${20 * z} Q${-40 * z},${22 * z} ${-50 * z},0 Z`, fill: '#e2ecd8', stroke: '#6a8a5a', 'stroke-width': 1.5 }), ...Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * Math.PI * 2; return s('line', { x1: Math.cos(a) * 50 * z, y1: Math.sin(a) * 21 * z, x2: Math.cos(a) * 56 * z, y2: Math.sin(a) * 26 * z, stroke: '#6a8a5a', 'stroke-width': 0.8 }); }), s('ellipse', { cx: 5 * z, cy: 2 * z, rx: 10 * z, ry: 6 * z, fill: '#8aa07a' })] },
    euglena: { bg: '#eef4f6', draw: (s, z) => [s('path', { d: `M${-50 * z},0 Q0,${-18 * z} ${40 * z},0 Q0,${18 * z} ${-50 * z},0 Z`, fill: '#9ccc7a', stroke: '#4a8a3a', 'stroke-width': 1.5 }), s('path', { d: `M${40 * z},0 q${12 * z},${-10 * z} ${24 * z},0 t${24 * z},0`, fill: 'none', stroke: '#4a8a3a', 'stroke-width': 1.5 }), s('circle', { cx: 30 * z, cy: -3 * z, r: 3 * z, fill: '#d23c46' }), ...[-30, -18, -6, 6, 18].map((dx) => s('ellipse', { cx: dx * z, cy: 2 * z, rx: 4 * z, ry: 2.5 * z, fill: '#3c8a2a' }))] },
    amoeba: { bg: '#eef4f6', draw: (s, z) => [s('path', { d: `M${-40 * z},${-10 * z} Q${-30 * z},${-40 * z} 0,${-30 * z} Q${10 * z},${-50 * z} ${30 * z},${-30 * z} Q${60 * z},${-20 * z} ${40 * z},${10 * z} Q${50 * z},${40 * z} ${10 * z},${35 * z} Q${-20 * z},${50 * z} ${-30 * z},${20 * z} Q${-60 * z},${10 * z} ${-40 * z},${-10 * z} Z`, fill: '#e6e2d4', stroke: '#8a826a', 'stroke-width': 1.5 }), s('ellipse', { cx: 0, cy: 0, rx: 9 * z, ry: 7 * z, fill: '#9a8a6a' })] },
    spirogyra: { bg: '#eef4f6', draw: (s, z) => {
      const out = [];
      for (let i = -3; i <= 3; i++) out.push(s('rect', { x: i * 34 * z - 17 * z, y: -12 * z, width: 34 * z, height: 24 * z, fill: '#e4f2d8', stroke: '#4a8a3a', 'stroke-width': 1.2 }), s('path', { d: `M${i * 34 * z - 15 * z},${-8 * z} q${8 * z},${16 * z} ${15 * z},0 t${15 * z},0`, fill: 'none', stroke: '#2e8a2a', 'stroke-width': 3 * z }));
      return out;
    } },
    rbc: { bg: '#fbeef0', draw: (s, z, rand) => Array.from({ length: 16 }, () => { const cx = (rand() * 2 - 1) * R * 0.8; const cy = (rand() * 2 - 1) * R * 0.8; return s('g', null, s('circle', { cx, cy, r: 12 * z, fill: '#e98a96', stroke: '#c0556a' }), s('circle', { cx, cy, r: 5 * z, fill: '#f4bcc4' })); }) },
    nerve: { bg: '#f4f2f8', draw: (s, z) => [s('path', { d: `M${-70 * z},0 L${90 * z},0`, stroke: '#8a6ab0', 'stroke-width': 4 * z }), ...[-1, 1].flatMap((d) => [s('path', { d: `M${-70 * z},0 l${-14 * z},${d * 18 * z} M${-70 * z},0 l${-22 * z},${d * 4 * z} M${90 * z},0 l${12 * z},${d * 14 * z}`, stroke: '#8a6ab0', 'stroke-width': 2 * z, fill: 'none' })]), s('circle', { cx: -70 * z, cy: 0, r: 14 * z, fill: '#d8ccec', stroke: '#8a6ab0', 'stroke-width': 2 }), s('circle', { cx: -70 * z, cy: 0, r: 5 * z, fill: '#5a2a8a' })] },
    ciliated: { bg: '#f4f2f8', draw: (s, z) => { const out = []; for (let i = -3; i <= 3; i++) { out.push(s('rect', { x: i * 24 * z - 12 * z, y: -20 * z, width: 24 * z, height: 50 * z, fill: '#ece4f4', stroke: '#8a6ab0' }), s('ellipse', { cx: i * 24 * z, cy: 15 * z, rx: 5 * z, ry: 7 * z, fill: '#5a2a8a' })); for (let k = 0; k < 5; k++) out.push(s('line', { x1: i * 24 * z - 10 * z + k * 5 * z, x2: i * 24 * z - 12 * z + k * 5 * z, y1: -20 * z, y2: -30 * z, stroke: '#8a6ab0', 'stroke-width': 1 })); } return out; } },
  };
  SLIDES.palisadecells = SLIDES.palisade;

  function stomata(s, z, rand, density) {
    const out = [];
    const cell = 26 * z;
    for (let gy = -R - cell; gy < R + cell; gy += cell) {
      for (let gx = -R - cell; gx < R + cell; gx += cell * 1.3) {
        const cx = gx + (rand() - 0.5) * cell * 0.3;
        const cy = gy + (rand() - 0.5) * cell * 0.3;
        if (rand() < density) {
          out.push(s('ellipse', { cx: cx - 4 * z, cy, rx: 4 * z, ry: 8 * z, fill: '#9ccc7a', stroke: '#4a8a3a' }), s('ellipse', { cx: cx + 4 * z, cy, rx: 4 * z, ry: 8 * z, fill: '#9ccc7a', stroke: '#4a8a3a' }), s('ellipse', { cx, cy, rx: 1.2 * z, ry: 5 * z, fill: '#2b3a2a' }));
        } else {
          out.push(blob(s, cx, cy, cell * 0.55, rand, { fill: '#f2f6ec', stroke: '#9aaa8a', 'stroke-width': Math.max(0.5, 1 * z) }));
        }
      }
    }
    return out;
  }

  let n = 0;
  function view(s, slide, mag, opts = {}) {
    const look = SLIDES[slide];
    const z = opts.zoom || mag / 100;
    const id = 'mscope' + ++n;
    const seed = [...slide].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) + mag;
    return s('g', null,
      s('defs', null, s('clipPath', { id }, s('circle', { r: R }))),
      s('circle', { r: R + 7, fill: '#1b1f24' }),
      s('g', { 'clip-path': `url(#${id})` }, s('rect', { x: -R, y: -R, width: 2 * R, height: 2 * R, fill: look.bg }), ...look.draw(s, z, rng(seed))),
      opts.ring ? s('circle', { cx: opts.ring[0], cy: opts.ring[1], r: opts.ring[2], fill: 'none', stroke: '#f2c230', 'stroke-width': 3 }) : null,
      s('text', { x: R + 16, y: -R + 16, 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, `×${mag}`));
  }

  window.Microscope = { view };
})();
