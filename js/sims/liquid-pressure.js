/* Pressure in liquids: water jets (Grade 7, Stage 8: 8Pf.06). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss } = K;

  const PX_PER_CM = 10;
  const WALL = 210; // right-hand wall of the bottle, where the holes are
  const LINE = 110; // water line near the top of the bottle
  const FLOOR = 392; // floor of the tray, where the jets land
  const DEPTHS = [2, 4, 6, 8, 10, 12];
  const holeY = (d) => LINE + d * PX_PER_CM;
  // Distance along the tray for a hole d cm below the surface (a jet from height y lands 2√(d·y) away).
  const distanceFor = (d) => 0.9 * 2 * Math.sqrt(d * ((FLOOR - holeY(d)) / PX_PER_CM)) * (1 + gauss() * 0.012);

  Investigation.run({
    id: 'g7-liquidpressure',
    guide: '../practical.html#g7-liquidpressure',
    objectives: ['I can show that pressure in a liquid increases with depth.', 'I can explain it using the weight of liquid above.'],
    benchLabel: 'A tall plastic bottle of water standing on a block in a tray. It has a column of taped-over holes at different depths, and a ruler runs along the tray.',
    state: { fill: 0, open: null, jet: 0, dist: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[170, 'Bottle on a block'], [450, 'Tray with a ruler along it']]);
      const tray = s('path', { d: `M${WALL},${FLOOR - 14} L${WALL},${FLOOR + 6} L690,${FLOOR + 6} L690,${FLOOR - 14}`, fill: 'none', stroke: '#8a9aa8', 'stroke-width': 3 });
      const block = s('rect', { x: 120, y: 300, width: 100, height: 98, fill: '#b98a52', stroke: '#8a6236' });
      const clipId = 'bottle-water';
      const water = s('rect', { x: 132, width: 76, fill: 'rgba(120, 180, 225, 0.6)', 'clip-path': `url(#${clipId})` });
      const bottle = s('g', null,
        s('defs', null, s('clipPath', { id: clipId }, s('rect', { x: 132, y: 80, width: 76, height: 218 }))),
        water,
        s('path', { d: `M130,298 L130,96 Q130,70 156,62 L156,40 L184,40 L184,62 Q${WALL},70 ${WALL},96 L${WALL},298 Z`, ...D.GLASS, fill: 'rgba(214, 232, 242, 0.2)', 'stroke-width': 2 }),
        s('line', { x1: 124, x2: 136, y1: LINE, y2: LINE, stroke: '#2b6cb0', 'stroke-width': 2 }),
        s('text', { class: 'bench-label', x: 120, y: LINE + 4, 'text-anchor': 'end' }, 'water line'));
      const holes = s('g', null);
      const tapes = DEPTHS.map((d) => s('rect', { x: WALL - 3, y: holeY(d) - 5, width: 9, height: 10, rx: 2, fill: '#f0e2b6', stroke: '#c8b27a' }));
      for (const d of DEPTHS) {
        holes.append(s('circle', { cx: WALL, cy: holeY(d), r: 2.5, fill: '#33404d' }));
        holes.append(s('text', { class: 'scale-text', x: WALL - 8, y: holeY(d) + 3, 'text-anchor': 'end' }, `${d} cm`));
      }
      holes.append(...tapes);
      const jet = s('path', { fill: 'none', stroke: 'rgba(70, 140, 210, 0.85)', 'stroke-width': 4, 'stroke-linecap': 'round' });
      const splash = s('ellipse', { rx: 10, ry: 3, fill: 'rgba(70, 140, 210, 0.6)' });
      const rule = s('g', null, s('rect', { x: WALL, y: FLOOR - 10, width: 470, height: 10, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let cm = 0; cm <= 46; cm++) {
        const x = WALL + cm * PX_PER_CM;
        rule.append(s('line', { x1: x, x2: x, y1: FLOOR - 10, y2: FLOOR - 10 + (cm % 5 ? 4 : 7), stroke: '#2b2418', 'stroke-width': 0.8 }));
        if (cm % 10 === 0) rule.append(s('text', { class: 'scale-text', x, y: FLOOR - 13, 'text-anchor': 'middle' }, String(cm)));
      }
      svg.append(tray, block, rule, bottle, holes, jet, splash);
      return {
        update() {
          const top = lerp(298, LINE, st.fill);
          water.setAttribute('y', top);
          water.setAttribute('height', 298 - top);
          DEPTHS.forEach((d, i) => tapes[i].setAttribute('visibility', st.open === d ? 'hidden' : 'visible'));
          const show = st.open !== null && st.dist !== null;
          jet.setAttribute('visibility', show ? 'visible' : 'hidden');
          splash.setAttribute('visibility', show && st.jet >= 1 ? 'visible' : 'hidden');
          if (!show) return;
          const y0 = holeY(st.open);
          const reach = st.dist * PX_PER_CM;
          const pts = [];
          for (let i = 0; i <= 24; i++) {
            const u = (i / 24) * st.jet;
            pts.push(`${i ? 'L' : 'M'}${(WALL + reach * u).toFixed(1)},${(y0 + (FLOOR - 10 - y0) * u * u).toFixed(1)}`);
          }
          jet.setAttribute('d', pts.join(' '));
          splash.setAttribute('cx', WALL + reach);
          splash.setAttribute('cy', FLOOR - 10);
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Ruler: where the jet lands (cm)', label: 'Close-up of the ruler where the jet hits the tray', span: 6, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 46, value: (st) => (st.jet >= 1 ? st.dist : null) },
    setup: [{
      title: 'Fill the bottle',
      text: 'Cover all the holes with tape. Stand the bottle on a block in a tray and fill it with water up to the line.',
      why: 'Filling to the same line every time means the only thing that changes is how deep each hole is below the surface.',
      button: 'Fill the bottle to the line',
      done: 'The bottle is full to the line.',
      async run(api) {
        await tween(900, (t) => {
          api.st.fill = t;
          api.draw();
        });
      },
    }],
    measureTitle: 'Measure how far each jet travels',
    measureText: 'Take the tape off one hole at a time. Measure how far along the tray the jet of water lands, then cover the hole again and top the water up to the line.',
    measureWhy: 'The depth of the hole is the variable you change. Opening one hole at a time, and keeping the water at the same level, makes it a fair test.',
    measureTask: 'take the tape off and measure where the jet lands',
    measureButton: (v) => `Open the hole ${v} cm below the surface`,
    async measure(v, rep, api) {
      const { st } = api;
      st.open = v;
      st.dist = distanceFor(v);
      st.jet = 0;
      await tween(900, (t, raw) => {
        st.jet = raw;
        api.draw();
      });
      st.jet = 1;
      api.draw();
      return st.dist;
    },
    afterReading(api) {
      api.st.open = null;
      api.st.jet = 0;
      api.draw();
      api.say('Cover the hole with tape again and top the water up to the line.', 'info');
    },
    iv: { label: 'Depth of hole', unit: 'cm', values: DEPTHS },
    dv: { label: 'Distance the jet travels', unit: 'cm', dp: 1, tol: 0.3, placeholder: 'e.g. 18.5', readHint: 'Read the ruler where the jet hits the tray, to the nearest half centimetre.' },
    graph: { title: 'Distance of the jet against depth of the hole', xLabel: 'Depth of hole below the surface / cm', yLabel: 'Distance jet travels / cm', xDomain: [0, 14], yDomain: [0, 30], xStep: 2, yStep: 5 },
    pattern: {
      q: 'What do your results show?',
      o: ['The deeper the hole, the further the water squirts', 'The shallower the hole, the further the water squirts', 'All the jets travel the same distance'],
      hint: 'Compare the distance for the 2 cm hole with the distance for the 12 cm hole.',
      right: 'Yes. Pressure in a liquid increases with depth, because there is more water above pushing down. Higher pressure pushes the water out faster, so the jet goes further.',
      why: 'Dams are built much thicker at the bottom because that is where the water pressure is greatest.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Water squirted further from the deeper holes. Pressure in a liquid increases with depth because of the weight of the liquid above.',
      rows: [['Hole 2 cm deep', `${rows[0].mean} cm`], ['Hole 12 cm deep', `${rows[rows.length - 1].mean} cm`]],
    }),
  });
})();
