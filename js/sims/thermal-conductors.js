/* Thermal conductivity rods (Grade 6, Stage 7: 7Cp.05). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, gauss, clamp } = K;

  const X0 = 170; // heated end of the rod, over the flame
  const PX_PER_CM = 20;
  const ROD_Y = 196;
  const LOOK = {
    Copper: { fill: '#c46f3c', stroke: '#8f4a22', melt: 14.6 },
    Iron: { fill: '#7d838a', stroke: '#565b61', melt: 5.8 },
    Glass: { fill: 'rgba(190, 225, 240, 0.9)', stroke: '#7f97a8', melt: 1.4 },
    Wood: { fill: '#b98a52', stroke: '#8a6236', melt: 0.6 },
  };

  Investigation.run({
    id: 'g6-thermalrods',
    guide: '../practical.html#g6-thermalrods',
    objectives: ['I can compare how well different materials conduct heat.', 'I can explain why metals are good thermal conductors.'],
    benchLabel: 'A rod coated in wax, clamped with one end in a Bunsen flame, with a ruler underneath and a timer.',
    state: { rod: null, melt: 0, seconds: 0, flame: false },
    scene(svg, D, st) {
      D.bench(svg, 440, [[X0, 'Bunsen burner'], [370, 'Rod coated in wax'], [612, 'Timer']]);
      const stand = s('g', null,
        s('rect', { x: 600, y: 120, width: 8, height: 280, fill: '#7a8794' }),
        s('rect', { x: 572, y: 392, width: 64, height: 8, fill: '#5d6874' }),
        s('rect', { x: 548, y: ROD_Y - 9, width: 60, height: 8, fill: '#7a8794' }));
      const burner = s('g', null,
        s('rect', { x: X0 - 9, y: 300, width: 18, height: 92, fill: '#9aa5b1', stroke: '#6b7682' }),
        s('rect', { x: X0 - 24, y: 390, width: 48, height: 10, rx: 2, fill: '#6b7682' }));
      const flame = s('g', null,
        s('path', { d: `M${X0 - 10},300 Q${X0 - 14},250 ${X0},${ROD_Y + 4} Q${X0 + 14},250 ${X0 + 10},300 Z`, fill: '#7fb2ff', opacity: 0.75 }),
        s('path', { d: `M${X0 - 5},300 Q${X0 - 6},266 ${X0},236 Q${X0 + 6},266 ${X0 + 5},300 Z`, fill: '#3f7de0', opacity: 0.85 }));
      const rod = s('rect', { x: X0 - 10, y: ROD_Y - 6, width: 20 * PX_PER_CM + 10, height: 12, rx: 3 });
      const wax = s('rect', { y: ROD_Y - 8, height: 16, rx: 3, fill: '#f6e7a6', stroke: '#d8c374', 'stroke-width': 1 });
      const name = s('text', { x: X0 + 10 * PX_PER_CM, y: ROD_Y - 22, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#33404d' }, '');
      const rule = s('g', null, s('rect', { x: X0 - 4, y: ROD_Y + 20, width: 20 * PX_PER_CM + 8, height: 22, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let cm = 0; cm <= 20; cm++) {
        const x = X0 + cm * PX_PER_CM;
        rule.append(s('line', { x1: x, x2: x, y1: ROD_Y + 20, y2: ROD_Y + 20 + (cm % 5 ? 6 : 10), stroke: '#2b2418', 'stroke-width': 0.8 }));
        if (cm % 5 === 0) rule.append(s('text', { class: 'scale-text', x, y: ROD_Y + 38, 'text-anchor': 'middle' }, String(cm)));
      }
      const timer = D.display(560, 40, 104, 'Timer');
      svg.append(stand, burner, flame, rod, wax, name, rule, timer.g);
      return {
        update() {
          const look = LOOK[st.rod];
          rod.setAttribute('visibility', look ? 'visible' : 'hidden');
          wax.setAttribute('visibility', look ? 'visible' : 'hidden');
          if (look) {
            rod.setAttribute('fill', look.fill);
            rod.setAttribute('stroke', look.stroke);
            const front = X0 + st.melt * PX_PER_CM;
            wax.setAttribute('x', front);
            wax.setAttribute('width', Math.max(0, X0 + 20 * PX_PER_CM - front));
          }
          name.textContent = st.rod || '';
          flame.setAttribute('visibility', st.flame ? 'visible' : 'hidden');
          const m = Math.floor(st.seconds / 60);
          timer.set(`${m}:${String(Math.floor(st.seconds % 60)).padStart(2, '0')}`);
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Ruler: wax melted (cm)', label: 'Close-up of the ruler at the edge of the wax', span: 3, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: 20, value: (st) => (st.rod && st.melt > 0 ? st.melt : null) },
    setup: [{
      title: 'Light the Bunsen burner',
      text: 'Light the Bunsen burner and open the air hole to get a blue flame.',
      why: 'Use the same flame, and put each rod in the same place in it, so that every rod gets the same amount of heating.',
      button: 'Light the Bunsen burner',
      done: 'The flame is lit.',
      async run(api) {
        api.st.flame = true;
        api.draw();
      },
    }],
    measureTitle: 'Heat each rod and measure the melted wax',
    measureText: 'Each rod is coated with a thin layer of wax. Clamp the rod with its end in the flame. After 3 minutes, measure how far along the rod the wax has melted.',
    measureWhy: 'The material is the variable you change. The rods are the same length and thickness, and each one gets the same flame for the same time, so the test is fair.',
    measureTask: 'heat the rod for 3 minutes and measure how far the wax has melted',
    measureButton: (v) => `Heat the ${v.toLowerCase()} rod for 3 minutes`,
    async measure(v, rep, api) {
      const { st } = api;
      st.rod = v;
      st.melt = 0;
      st.seconds = 0;
      api.draw();
      const melt = clamp(LOOK[v].melt * (1 + gauss() * 0.03), 0.3, 19);
      await tween(1800, (t, raw) => {
        st.seconds = 180 * raw;
        st.melt = melt * Math.pow(raw, 0.8);
        api.draw();
      });
      st.seconds = 180;
      st.melt = melt;
      api.draw();
      return melt;
    },
    afterReading(api) {
      api.say('Let the rod cool on a heatproof mat, then clamp the next one.', 'info');
    },
    iv: { label: 'Material', unit: '', values: ['Copper', 'Iron', 'Glass', 'Wood'], categorical: true },
    dv: { label: 'Wax melted along the rod', unit: 'cm', dp: 1, tol: 0.1, placeholder: 'e.g. 6.2', readHint: 'Read the ruler at the pointer, where the wax starts, to the nearest millimetre (0.1 cm).' },
    graph: { title: 'Wax melted in 3 minutes for each material', xLabel: 'Material', yLabel: 'Wax melted / cm', yDomain: [0, 16], yStep: 4 },
    pattern: {
      q: 'What do your results show?',
      o: ['The metals conducted heat much better than glass and wood, and copper was the best', 'All four materials conducted heat equally well', 'Glass and wood conducted heat better than the metals'],
      hint: 'The further the wax melted, the more heat travelled along the rod.',
      right: 'Yes. Metals are good thermal conductors, and copper is one of the best. Glass and wood are poor conductors, so they are thermal insulators.',
      why: 'This is why saucepans are made of metal but have handles made of plastic or wood.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Heat travelled furthest along the copper rod, then iron. Glass and wood hardly warmed up beyond the flame. Metals are good thermal conductors; non-metals such as glass and wood are insulators.',
      rows: rows.map((r) => [r.x, `${r.mean} cm`]),
    }),
  });
})();
