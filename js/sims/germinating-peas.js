/* Respiration releases energy: germinating peas (Grade 7, Stage 8: 8Bp.04, 8TWSp.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, gauss } = K;
  const temp = (d) => Math.round((20 + 6 * (1 - Math.exp(-d / 1.8)) + gauss() * 0.1) * 2) / 2;
  Investigation.run({
    id: 'g7-peas',
    guide: '../practical.html#g7-peas',
    objectives: ['I can show that respiration in living seeds releases energy as heat.', 'I can explain why boiled peas are used as a control.'],
    benchLabel: 'A vacuum flask of germinating peas and a vacuum flask of boiled peas, each with a thermometer through the cotton wool plug, and a day counter.',
    state: { day: 0, t: 20, control: 20 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[240, 'Germinating peas'], [400, 'Boiled peas (control)'], [600, 'Day']]);
      const t1 = D.thermometer(240, 60, 170, 0, 40);
      const t2 = D.thermometer(400, 60, 170, 0, 40);
      const flask = (x) => s('g', null, s('rect', { x: x - 40, y: 220, width: 80, height: 178, rx: 14, fill: '#d9dee2', stroke: '#8a96a3' }), s('rect', { x: x - 30, y: 250, width: 60, height: 140, rx: 10, fill: '#f4f0e0' }), s('rect', { x: x - 16, y: 210, width: 32, height: 22, rx: 4, fill: '#f6f7f8', stroke: '#c9d1d9' }));
      const counter = D.display(550, 140, 100, 'Day');
      svg.append(flask(240), flask(400), ...[240, 400].flatMap((x) => Array.from({ length: 12 }, (_, i) => s('circle', { cx: x - 22 + (i % 4) * 15, cy: 360 - Math.floor(i / 4) * 14, r: 6, fill: x === 240 ? '#9cc95a' : '#c9b48a' }))), t1.g, t2.g, counter.g);
      return {
        update() {
          t1.set(st.t);
          t2.set(st.control);
          counter.set(String(Math.round(st.day)));
        },
      };
    },
    closeUp: { kind: 'thermometer', caption: 'Thermometer in the germinating peas (°C)', label: 'Close-up of the thermometer in the flask of germinating peas', span: 8, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 40, value: (st) => st.t },
    measureTitle: 'Read the thermometer each day',
    measureText: 'Set up one vacuum flask of germinating peas and one of boiled (dead) peas. Read the thermometer in the germinating peas each day.',
    measureWhy: 'The boiled peas are a control: they are the same in every way except that they are dead, so they cannot respire.',
    measureTask: 'read the thermometer in the germinating peas',
    measureButton: (v) => (v === 0 ? 'Read it at the start' : `Wait until day ${v}`),
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.day;
      const fromT = st.t;
      const end = v === 0 ? 20 : temp(v);
      await tween(400 + (v - from) * 300, (t, raw) => {
        st.day = from + (v - from) * raw;
        st.t = fromT + (end - fromT) * t;
        api.draw();
      });
      st.day = v;
      st.t = end;
      api.draw();
      return end;
    },
    iv: { label: 'Day', unit: '', values: [0, 1, 2, 3, 4, 5] },
    dv: { label: 'Temperature of germinating peas', unit: '°C', dp: 1, tol: 0.3, placeholder: 'e.g. 23.5', readHint: 'Read the thermometer at the top of the red liquid, to the nearest half degree.' },
    graph: { title: 'Temperature in the flask of germinating peas', xLabel: 'Time / days', yLabel: 'Temperature / °C', xDomain: [0, 5], yDomain: [15, 30], xStep: 1, yStep: 5 },
    pattern: {
      q: 'What do your results show?',
      o: ['The flask of germinating peas got warmer, but the boiled peas stayed at 20 °C', 'Both flasks got warmer by the same amount', 'The germinating peas got colder'],
      hint: 'The thermometer in the control flask stayed at 20 °C.',
      right: 'Yes. Living seeds respire, and some of the energy released heats their surroundings. Dead peas cannot respire.',
      why: 'The vacuum flasks stop the heat escaping, so even a small amount of energy shows up as a rise in temperature.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The flask of germinating peas got warmer while the boiled peas stayed at room temperature. Respiration in the living seeds releases energy, some of it as heat.',
      rows: [['Germinating peas, day 0', `${rows[0].mean} °C`], ['Germinating peas, day 5', `${rows[rows.length - 1].mean} °C`], ['Boiled peas (control)', '20 °C throughout']],
    }),
  });
})();
