/* Measuring lung volume (Grade 7, Stage 8: 8Bs.03, 8TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, gauss } = K;
  const BREATH = { 'Normal breath out': 0.5, 'Deepest breath out': 3.1 };
  const PX = 60; // px per litre
  const TOP = 90;
  Investigation.run({
    id: 'g7-lungvolume',
    guide: '../practical.html#g7-lungvolume',
    objectives: ['I can measure lung volume by displacing water from an upturned bottle.', 'I can read a volume scale accurately.'],
    benchLabel: 'A 5-litre bottle full of water, upside down in a bowl of water, with a tube to breathe out into it. A scale in litres runs down the side of the bottle.',
    state: { air: 0, kind: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Upturned bottle of water in a bowl']]);
      const water = s('rect', { x: 242, width: 116, fill: 'rgba(80, 150, 215, 0.55)' });
      const scale = s('g', null);
      for (let l = 0; l <= 5; l += 0.5) scale.append(s('line', { x1: 358, x2: 358 + (l % 1 ? 6 : 12), y1: TOP + l * PX, y2: TOP + l * PX, stroke: '#33404d' }), l % 1 ? null : s('text', { class: 'scale-text', x: 374, y: TOP + l * PX + 3 }, `${l} L`));
      svg.append(s('rect', { x: 180, y: 330, width: 240, height: 70, fill: 'rgba(80, 150, 215, 0.4)', stroke: '#7f97a8' }), water, s('path', { d: `M240,${TOP} L240,370 L360,370 L360,${TOP} Q300,${TOP - 30} 240,${TOP}`, fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), scale, s('path', { d: 'M150,250 Q200,380 290,360 L290,330', fill: 'none', stroke: '#9aa5b1', 'stroke-width': 6 }));
      return {
        update() {
          const y = TOP + st.air * PX;
          water.setAttribute('y', y);
          water.setAttribute('height', 370 - y);
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Bottle scale (litres)', label: 'Close-up of the litre scale at the water level', span: 1.2, minor: 0.1, major: 0.5, labelEvery: 0.5, min: 0, max: 5, value: (st) => (st.kind ? st.air : null) },
    measureTitle: 'Breathe out into the bottle',
    measureText: 'Take a normal breath and breathe out through the tube. Read how much water was pushed out. Refill the bottle, then do the same with your deepest possible breath. Do each one three times.',
    measureWhy: 'The air you breathe out pushes out the same volume of water, so the scale shows the volume of air. Repeating makes the result more reliable.',
    measureTask: 'breathe out through the tube and read the scale',
    measureButton: (v, rep) => `${v}${rep ? ` (try ${rep + 1})` : ''}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.kind = v;
      st.air = 0;
      const end = Math.round((BREATH[v] + gauss() * (v.startsWith('Normal') ? 0.05 : 0.12)) * 10) / 10;
      await tween(1200, (t) => {
        st.air = end * t;
        api.draw();
      });
      st.air = end;
      api.draw();
      return end;
    },
    afterReading(api) {
      api.say('Refill the bottle with water before the next breath.', 'info');
    },
    repeats: 3,
    iv: { label: 'Breath', unit: '', values: Object.keys(BREATH), categorical: true },
    dv: { label: 'Volume of air', unit: 'L', dp: 1, tol: 0.05, placeholder: 'e.g. 2.8', readHint: 'Read the scale level with the water surface, to 0.1 litre.' },
    graph: { title: 'Mean volume of air breathed out', xLabel: 'Breath', yLabel: 'Volume / litres', yDomain: [0, 4], yStep: 1 },
    pattern: {
      q: 'What do your results show?',
      o: ['A deep breath out is several times bigger than a normal breath', 'A normal breath is bigger than a deep breath', 'Both breaths are the same size'],
      hint: 'Compare the two means.',
      right: 'Yes. A normal breath is only about 0.5 litres; most people can breathe out 2–4 litres in one deep breath.',
      why: 'Taller and fitter people tend to have larger lung volumes.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'A normal breath pushed out about half a litre of water; a deepest breath pushed out about 3 litres. Most people breathe out 2–4 litres in one deep breath.',
      rows: rows.map((r) => [r.x, `${r.mean} L (mean of 3)`]),
    }),
  });
})();
