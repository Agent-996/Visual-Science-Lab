/* Pollution and plant growth (Grade 7, Stage 8: 8Be.02, 8TWSp.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const HEIGHT = { 0: 42, 0.5: 35, 1: 27.5, 2: 15, 4: 4.5 };
  const SOIL = 330;
  const PX = 4; // px per mm
  Investigation.run({
    id: 'g7-pollution',
    guide: '../practical.html#g7-pollution',
    objectives: ['I can investigate how detergent or fertiliser concentration affects plant growth.', 'I can link the results to pollution in rivers.'],
    benchLabel: 'A pot of cress seedlings watered with detergent solution of a different concentration each time, with a ruler beside the tallest seedling after 7 days.',
    state: { conc: null, h: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Cress seedlings after 7 days'], [560, 'Ruler (mm)']]);
      const plants = s('g', null);
      const label = s('text', { x: 300, y: 390, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#ffffff' }, '');
      const rule = s('g', null, s('rect', { x: 370, y: SOIL - 50 * PX, width: 22, height: 50 * PX, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let mm = 0; mm <= 50; mm += 5) rule.append(s('line', { x1: 370, x2: 370 + (mm % 10 ? 5 : 9), y1: SOIL - mm * PX, y2: SOIL - mm * PX, stroke: '#2b2418', 'stroke-width': 0.8 }), mm % 10 ? null : s('text', { class: 'scale-text', x: 381, y: SOIL - mm * PX + 3 }, String(mm)));
      svg.append(s('path', { d: `M220,${SOIL} L230,398 L370,398 L380,${SOIL} Z`, fill: '#b5622a' }), s('rect', { x: 216, y: SOIL - 6, width: 168, height: 10, fill: '#5c3a20' }), plants, rule, label);
      return {
        update() {
          plants.replaceChildren();
          if (st.conc === null) return;
          for (let i = 0; i < 9; i++) {
            const x = 236 + i * 16;
            const h = st.h * PX * (i === 8 ? 1 : 0.8 + ((i * 7) % 3) * 0.06);
            const top = SOIL - h;
            plants.append(s('line', { x1: x, x2: x, y1: SOIL - 4, y2: top, stroke: '#7ab04a', 'stroke-width': 2 }), s('ellipse', { cx: x - 4, cy: top, rx: 5, ry: 3, fill: st.conc >= 2 ? '#b8b85a' : '#4f9a3a' }), s('ellipse', { cx: x + 4, cy: top, rx: 5, ry: 3, fill: st.conc >= 2 ? '#b8b85a' : '#4f9a3a' }));
          }
          label.textContent = `${st.conc}% detergent`;
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Ruler at the tallest seedling (mm)', label: 'Close-up of the ruler level with the top of the tallest seedling', span: 12, minor: 0.5, major: 5, labelEvery: 5, min: 0, max: 50, value: (st) => (st.conc === null ? null : st.h) },
    measureTitle: 'Measure the seedlings',
    measureText: 'Grow cress seeds in identical pots. Water each pot with the same volume of a different concentration of detergent. After 7 days, measure the tallest seedling.',
    measureWhy: 'The concentration of detergent is the variable you change. Use the same number of seeds, the same compost, light and temperature, and the same volume of water.',
    measureTask: 'measure the tallest seedling',
    measureButton: (v) => `Look at the pot watered with ${v}% detergent`,
    async measure(v, rep, api) {
      const { st } = api;
      st.conc = v;
      st.h = 0;
      await tween(900, (t) => {
        st.h = HEIGHT[v] * t;
        api.draw();
      });
      st.h = HEIGHT[v];
      api.draw();
      return HEIGHT[v];
    },
    iv: { label: 'Detergent concentration', unit: '%', values: [0, 0.5, 1, 2, 4] },
    dv: { label: 'Height of tallest seedling', unit: 'mm', dp: 1, tol: 0.3, placeholder: 'e.g. 30.5', readHint: 'Read the ruler level with the top of the tallest seedling, to the nearest half millimetre.' },
    graph: { title: 'Seedling height against detergent concentration', xLabel: 'Detergent concentration / %', yLabel: 'Height after 7 days / mm', xDomain: [0, 4], yDomain: [0, 50], xStep: 1, yStep: 10 },
    pattern: {
      q: 'What do your results show?',
      o: ['The higher the detergent concentration, the less the seedlings grew', 'Detergent made the seedlings grow taller', 'The detergent made no difference'],
      hint: 'Compare the seedlings with no detergent and with 4% detergent.',
      right: 'Yes. Detergent harms plant growth more as its concentration increases.',
      why: 'Detergents and too much fertiliser washing into rivers can harm plants and animals living there.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Detergent harmed growth more as its concentration increased. Pollution from detergents and fertilisers can damage river ecosystems.',
      rows: [['No detergent', `${rows[0].mean} mm`], ['4% detergent', `${rows[rows.length - 1].mean} mm`]],
    }),
  });
})();
