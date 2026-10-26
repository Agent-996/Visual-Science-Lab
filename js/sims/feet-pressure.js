/* Pressure under your feet (Grade 7, Stage 8: 8Pf.05, 8TWSm.03). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const AREA = { 'Standing on two feet': 300, 'Standing on one foot': 150, 'On tiptoe on one foot': 30 };
  const WEIGHT = 500;
  Investigation.run({
    id: 'g7-feetpressure',
    guide: '../practical.html#g7-feetpressure',
    objectives: ['I can measure the area of my foot using squared paper.', 'I can calculate pressure = force ÷ area.'],
    benchLabel: 'Squared paper with the outline of the part of a foot touching the floor, and a counter showing how many 1 cm squares are inside the outline.',
    state: { pose: null, counted: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[260, 'Footprint on 1 cm squared paper'], [580, 'Squares counted']]);
      const grid = s('g', null, s('rect', { x: 100, y: 40, width: 320, height: 340, fill: '#ffffff', stroke: '#c9d1d9' }));
      for (let x = 100; x <= 420; x += 10) grid.append(s('line', { x1: x, x2: x, y1: 40, y2: 380, stroke: '#d6e4f0', 'stroke-width': x % 50 ? 0.5 : 1 }));
      for (let y = 40; y <= 380; y += 10) grid.append(s('line', { x1: 100, x2: 420, y1: y, y2: y, stroke: '#d6e4f0', 'stroke-width': y % 50 ? 0.5 : 1 }));
      const feet = s('g', null);
      const counter = D.display(530, 160, 110, 'Squares');
      const name = s('text', { x: 260, y: 30, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(grid, feet, counter.g, name);
      return {
        update() {
          const foot = (cx, tip) => (tip ? s('ellipse', { cx, cy: 110, rx: 30, ry: 22, fill: 'rgba(200, 120, 80, 0.3)', stroke: '#a0522d', 'stroke-width': 2 }) : s('path', { d: `M${cx - 28},120 Q${cx - 34},60 ${cx},58 Q${cx + 34},60 ${cx + 28},130 Q${cx + 22},230 ${cx + 20},300 Q${cx},340 ${cx - 20},300 Q${cx - 24},220 ${cx - 28},120 Z`, fill: 'rgba(200, 120, 80, 0.3)', stroke: '#a0522d', 'stroke-width': 2 }));
          feet.replaceChildren(...(st.pose === 'Standing on two feet' ? [foot(200), foot(320)] : st.pose === 'Standing on one foot' ? [foot(260)] : st.pose ? [foot(260, true)] : []));
          counter.set(String(Math.round(st.counted)));
          name.textContent = st.pose || '';
        },
      };
    },
    measureTitle: 'Measure the area in contact with the floor',
    measureText: 'Stand on squared paper and draw round the part of your foot touching the paper. Count the 1 cm squares inside (count a square if more than half of it is inside).',
    measureWhy: 'Your weight (the force) stays the same; only the area changes. Each square is 1 cm², so the number of squares is the area in cm².',
    measureTask: 'count the squares inside the outline',
    measureButton: (v) => v,
    async measure(v, rep, api) {
      const { st } = api;
      st.pose = v;
      st.counted = 0;
      await tween(900, (t) => {
        st.counted = AREA[v] * t;
        api.draw();
      });
      st.counted = AREA[v];
      api.draw();
      return AREA[v];
    },
    iv: { label: 'How you stand', unit: '', values: Object.keys(AREA), categorical: true, format: (x) => ({ 'Standing on two feet': 'Two feet', 'Standing on one foot': 'One foot', 'On tiptoe on one foot': 'Tiptoe' })[x] },
    dv: { label: 'Area in contact', unit: 'cm²', dp: 0, tol: 0, placeholder: 'e.g. 140', readHint: 'Copy the number of squares counted: each square is 1 cm².' },
    graph: { title: 'Area in contact with the floor', xLabel: 'How you stand', yLabel: 'Area / cm²', yDomain: [0, 350], yStep: 50 },
    pattern: {
      q: 'Your weight is 500 N in every position. When is the pressure on the floor greatest?',
      o: ['On tiptoe, because the same force acts on the smallest area', 'On two feet, because the area is biggest', 'It is the same every time'],
      hint: 'Pressure = force ÷ area. What happens when you divide by a smaller number?',
      right: 'Yes. Standing on one foot doubles the pressure; on tiptoe it is about ten times bigger.',
      why: 'That is why snowshoes and wide tyres stop things sinking: they spread the force over a large area.',
    },
    extra: [{
      title: 'Calculate the pressure',
      text: 'Pressure = force ÷ area. Your weight is 500 N. Calculate the pressure when you stand on one foot.',
      why: 'Pressure tells you how concentrated a force is.',
      label: 'Pressure on one foot',
      short: 'Pressure on one foot',
      unit: 'N/cm²',
      dp: 1,
      placeholder: 'e.g. 2.5',
      expected: (rows) => WEIGHT / rows[1].mean,
      tol: 0.1,
      hint: 'Divide 500 N by the area for one foot.',
      msg: (v) => `About ${v.toFixed(1)} N/cm², twice the pressure of standing on two feet.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Standing on one foot halves the area, so it doubles the pressure, because the same force acts on half the area. Pressure = force ÷ area.',
      rows: rows.map((r) => [r.x, `${r.mean} cm²: ${(WEIGHT / r.mean).toFixed(1)} N/cm²`]),
    }),
  });
})();
