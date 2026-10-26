/* Yeast respiration: blowing up a balloon (Grade 6, Stage 7: 7Bp.01, 7Bs.01). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, gauss } = K;
  const circ = (g) => Math.round((11 + 19 * (1 - Math.exp(-g / 3.5)) + gauss() * 0.2) * 2) / 2;
  Investigation.run({
    id: 'g6-yeastballoon',
    guide: '../practical.html#g6-yeastballoon',
    objectives: ['I can show that yeast is living because it respires and makes a gas.', 'I can explain that yeast is a single-celled fungus.'],
    benchLabel: 'A bottle of warm water, yeast and sugar with a balloon stretched over its neck, a tape measure and a timer.',
    state: { sugar: 0, size: 0, minutes: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Bottle of yeast, sugar and warm water'], [560, 'Tape measure']]);
      const balloon = s('ellipse', { cx: 300, fill: '#e05a5a', opacity: 0.9 });
      const label = s('text', { x: 300, y: 372, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      const timer = D.display(520, 60, 110, 'Time');
      svg.append(
        s('path', { d: 'M270,400 L270,250 Q270,226 290,214 L290,192 L310,192 L310,214 Q330,226 330,250 L330,400 Z', fill: 'rgba(214, 232, 242, 0.35)', stroke: '#7f97a8', 'stroke-width': 2 }),
        s('rect', { x: 272, y: 300, width: 56, height: 98, fill: 'rgba(225, 205, 150, 0.8)' }),
        balloon, label, s('rect', { x: 520, y: 260, width: 90, height: 14, fill: '#f3e6c4', stroke: '#b59a63' }), timer.g);
      return {
        update() {
          const r = Math.max(6, st.size * 1.6);
          balloon.setAttribute('cy', 192 - r * 0.9);
          balloon.setAttribute('rx', r * 0.85);
          balloon.setAttribute('ry', r);
          label.textContent = `${st.sugar} g of sugar`;
          timer.set(`${Math.round(st.minutes)} min`);
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Tape measure round the balloon (cm)', label: 'Close-up of the tape measure where it meets itself round the balloon', span: 6, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 40, value: (st) => (st.minutes >= 30 ? st.size : null) },
    measureTitle: 'Measure each balloon',
    measureText: 'Set up a bottle with the same yeast and warm water but a different mass of sugar. Leave it for 30 minutes, then measure round the widest part of the balloon.',
    measureWhy: 'The mass of sugar is the variable you change. Use the same yeast, the same volume of water at the same temperature and the same time.',
    measureTask: 'wait 30 minutes and measure round the balloon',
    measureButton: (v) => `Set up with ${v} g of sugar and wait 30 minutes`,
    async measure(v, rep, api) {
      const { st } = api;
      st.sugar = v;
      st.size = 10;
      st.minutes = 0;
      const end = circ(v);
      await tween(1600, (t, raw) => {
        st.minutes = 30 * raw;
        st.size = 10 + (end - 10) * t;
        api.draw();
      });
      st.minutes = 30;
      st.size = end;
      api.draw();
      return end;
    },
    iv: { label: 'Sugar', unit: 'g', values: [0, 2, 4, 6, 8, 10] },
    dv: { label: 'Balloon circumference', unit: 'cm', dp: 1, tol: 0.3, placeholder: 'e.g. 22.5', readHint: 'Read the tape measure at the pointer, to the nearest half centimetre.' },
    graph: { title: 'Balloon size against mass of sugar', xLabel: 'Mass of sugar / g', yLabel: 'Circumference / cm', xDomain: [0, 10], yDomain: [0, 35], xStep: 2, yStep: 5 },
    pattern: {
      q: 'What do your results show?',
      o: ['More sugar made a bigger balloon, but the effect levelled off', 'More sugar made a smaller balloon', 'Sugar made no difference'],
      hint: 'Compare the balloon with no sugar and with 10 g of sugar.',
      right: 'Yes. Yeast respires using sugar and makes carbon dioxide, which fills the balloon. With no sugar it makes very little gas.',
      why: 'Above about 6 g, something else, such as the amount of yeast, limits how fast the gas is made.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The balloon filled with carbon dioxide made by the yeast as it respired using the sugar. The bottle without sugar made little gas.',
      rows: [['No sugar', `${rows[0].mean} cm`], ['10 g of sugar', `${rows[rows.length - 1].mean} cm`]],
    }),
  });
})();
