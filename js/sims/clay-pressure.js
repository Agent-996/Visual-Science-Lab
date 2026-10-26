/* Pressure of blocks and drawing pins on clay (Grade 7, Stage 8: 8Pf.05). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const DEPTH = { 'Largest face': 1.0, 'Middle face': 2.5, 'Smallest face': 5.0, 'Drawing pin point': 14.0 };
  const WIDTH = { 'Largest face': 150, 'Middle face': 90, 'Smallest face': 46, 'Drawing pin point': 6 };
  const SURF = 300;
  const PX = 4; // px per mm of depth
  Investigation.run({
    id: 'g7-claypressure',
    guide: '../practical.html#g7-claypressure',
    objectives: ['I can show that the same force makes a deeper dent on a smaller area.', 'I can explain sharp and blunt objects using pressure.'],
    benchLabel: 'A slab of modelling clay seen from the side, with the same weight pressing on it through faces of different areas, and a depth gauge.',
    state: { face: null, press: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Slab of modelling clay (cut-away view)']]);
      const clay = s('path', { fill: '#c97b5a', stroke: '#8a4a30' });
      const block = s('g', null);
      svg.append(clay, block);
      return {
        update() {
          const w = WIDTH[st.face] || 0;
          const d = (DEPTH[st.face] || 0) * PX * st.press;
          clay.setAttribute('d', `M120,${SURF} L${300 - w / 2},${SURF} L${300 - w / 2},${SURF + d} L${300 + w / 2},${SURF + d} L${300 + w / 2},${SURF} L480,${SURF} L480,398 L120,398 Z`);
          block.replaceChildren();
          if (!st.face) return;
          const y = SURF + d;
          if (st.face === 'Drawing pin point') block.append(s('path', { d: `M300,${y} L296,${y - 30} L304,${y - 30} Z`, fill: '#9aa5b1' }), s('rect', { x: 270, y: y - 36, width: 60, height: 6, rx: 3, fill: '#d64545' }), s('rect', { x: 250, y: y - 136, width: 100, height: 100, fill: '#5d6874' }), s('text', { x: 300, y: y - 80, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#ffffff' }, '10 N'));
          else block.append(s('rect', { x: 300 - w / 2, y: y - 120, width: w, height: 120, fill: '#5d6874' }), s('text', { x: 300, y: y - 56, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#ffffff' }, '10 N'));
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Depth gauge (mm)', label: 'Close-up of the depth gauge at the bottom of the dent', span: 5, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 20, value: (st) => (st.face && st.press >= 1 ? DEPTH[st.face] : null) },
    measureTitle: 'Press each face into the clay',
    measureText: 'Rest the same 10 N block on the clay on each face in turn, then on a drawing pin. Lift it off and measure the depth of the dent.',
    measureWhy: 'The force is always 10 N; only the area touching the clay changes.',
    measureTask: 'press it into the clay and measure the dent',
    measureButton: (v) => `Press with the ${v.toLowerCase()}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.face = v;
      st.press = 0;
      await tween(900, (t) => {
        st.press = t;
        api.draw();
      });
      st.press = 1;
      api.draw();
      return DEPTH[v];
    },
    afterReading(api) {
      api.say('Smooth the clay flat again before the next test.', 'info');
    },
    iv: { label: 'Face pressing on the clay', unit: '', values: Object.keys(DEPTH), categorical: true, format: (x) => x.replace(' face', '').replace('Drawing pin point', 'Pin point') },
    dv: { label: 'Depth of dent', unit: 'mm', dp: 1, tol: 0.3, placeholder: 'e.g. 3.5', readHint: 'Read the depth gauge at the pointer, to the nearest half millimetre.' },
    graph: { title: 'Depth of dent made by the same 10 N force', xLabel: 'Face pressing on the clay', yLabel: 'Depth / mm', yDomain: [0, 16], yStep: 4 },
    pattern: {
      q: 'What do your results show?',
      o: ['The smaller the area, the deeper the dent, because the pressure is bigger', 'The bigger the area, the deeper the dent', 'All the dents were the same depth'],
      hint: 'The force was the same every time. Which area made the deepest dent?',
      right: 'Yes. The same force on a smaller area gives a bigger pressure. That is why a drawing pin goes in easily.',
      why: 'Sharp knives and pins have a tiny area at the edge or point, so they give a very large pressure.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The smallest face and the pin’s point made the deepest dents. The same force on a smaller area gives a bigger pressure.',
      rows: rows.map((r) => [r.x, `${r.mean} mm`]),
    }),
  });
})();
