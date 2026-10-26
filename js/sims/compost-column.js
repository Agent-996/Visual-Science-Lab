/* Mini compost column (Grade 6, Stage 7: 7Be.01, 7Be.02). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, gauss } = K;
  const height = (w) => Math.round((20 - 8 * (1 - Math.exp(-w / 2.5)) + gauss() * 0.1) * 2) / 2;
  const PX = 12;
  const BASE = 380;
  Investigation.run({
    id: 'g6-compost',
    guide: '../practical.html#g6-compost',
    objectives: ['I can build a compost column and record changes over time.', 'I can explain how decomposers return nutrients to the soil.'],
    benchLabel: 'A clear plastic bottle filled with layers of soil and food scraps, with a ruler beside it and a week counter.',
    state: { h: 20, week: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Compost column in a cut-down bottle'], [580, 'Week']]);
      const fill = s('g', null);
      const rule = s('g', null, s('rect', { x: 352, y: BASE - 25 * PX, width: 20, height: 25 * PX, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let cm = 0; cm <= 25; cm++) rule.append(s('line', { x1: 352, x2: 352 + (cm % 5 ? 5 : 9), y1: BASE - cm * PX, y2: BASE - cm * PX, stroke: '#2b2418', 'stroke-width': 0.8 }), cm % 5 ? null : s('text', { class: 'scale-text', x: 362, y: BASE - cm * PX + 3 }, String(cm)));
      const counter = D.display(530, 160, 100, 'Week');
      svg.append(fill, s('path', { d: `M250,${BASE - 300} L250,${BASE} L350,${BASE} L350,${BASE - 300}`, fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), rule, counter.g);
      return {
        update() {
          fill.replaceChildren();
          const top = BASE - st.h * PX;
          const layers = 5;
          for (let i = 0; i < layers; i++) {
            const y0 = BASE - ((i + 1) * (BASE - top)) / layers;
            fill.append(s('rect', { x: 251, y: y0, width: 98, height: (BASE - top) / layers, fill: i % 2 ? (st.week > 3 ? '#5c4030' : '#8aa060') : '#6b4a2f' }));
          }
          counter.set(String(Math.round(st.week)));
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Ruler beside the column (cm)', label: 'Close-up of the ruler at the top of the compost', span: 4, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 25, value: (st) => st.h },
    measureTitle: 'Measure the column each week',
    measureText: 'Fill the bottle with layers of soil and food scraps, water it a little and cover it. Each week, measure the height of the compost.',
    measureWhy: 'As decomposers break down the scraps, the column sinks, so its height shows how much has been broken down.',
    measureTask: 'read the height of the compost',
    measureButton: (v) => (v === 0 ? 'Measure it at the start' : `Wait until week ${v}`),
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.week;
      const fromH = st.h;
      const end = v === 0 ? 20 : height(v);
      await tween(400 + (v - from) * 250, (t, raw) => {
        st.week = from + (v - from) * raw;
        st.h = fromH + (end - fromH) * t;
        api.draw();
      });
      st.week = v;
      st.h = end;
      api.draw();
      return end;
    },
    iv: { label: 'Week', unit: '', values: [0, 1, 2, 3, 4, 5, 6] },
    dv: { label: 'Height of compost', unit: 'cm', dp: 1, tol: 0.3, placeholder: 'e.g. 17.5', readHint: 'Read the ruler level with the top of the compost, to the nearest half centimetre.' },
    graph: { title: 'Height of the compost column over six weeks', xLabel: 'Time / weeks', yLabel: 'Height / cm', xDomain: [0, 6], yDomain: [0, 25], xStep: 1, yStep: 5 },
    pattern: {
      q: 'What do your results show?',
      o: ['The compost sank quickly at first, then more slowly', 'The compost grew taller each week', 'The height did not change'],
      hint: 'Compare how much the height fell in the first two weeks and the last two weeks.',
      right: 'Yes. Decomposers broke the soft scraps down quickly. The tougher material that is left takes longer.',
      why: 'Decomposers turn the scraps into dark, crumbly compost that returns nutrients to the soil.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The scraps shrank and darkened as decomposers broke them down, so the column sank. Their nutrients go back into the soil, where plants can use them again.',
      rows: [['At the start', `${rows[0].mean} cm`], ['After 6 weeks', `${rows[rows.length - 1].mean} cm`]],
    }),
  });
})();
