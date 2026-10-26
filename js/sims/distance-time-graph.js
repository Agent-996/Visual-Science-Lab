/* Distance–time graph for a trolley (Grade 7, Stage 8: 8Pf.02, 8TWSa.05). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const A = 20; // cm/s²: the trolley speeds up
  const dist = (t) => 0.5 * A * t * t;
  const X0 = 90;
  const PX = 5; // px per cm
  Investigation.run({
    id: 'g7-dtgraph',
    guide: '../practical.html#g7-dtgraph',
    objectives: ['I can collect distance and time data for a moving trolley.', 'I can draw and interpret a distance–time graph.'],
    benchLabel: 'A trolley on a runway pulled by a falling mass over a pulley, with a metre rule along the runway and a timer.',
    state: { t: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[330, 'Trolley on a runway with a metre rule'], [600, 'Timer']]);
      const trolley = s('g', null, s('rect', { x: -30, y: -24, width: 60, height: 24, rx: 4, fill: '#4f8fd8', stroke: '#2f6db5' }), s('circle', { cx: -18, cy: 2, r: 6, fill: '#39424b' }), s('circle', { cx: 18, cy: 2, r: 6, fill: '#39424b' }));
      const rule = s('g', null, s('rect', { x: X0, y: 312, width: 100 * PX, height: 16, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let cm = 0; cm <= 100; cm += 5) rule.append(s('line', { x1: X0 + cm * PX, x2: X0 + cm * PX, y1: 312, y2: 312 + (cm % 10 ? 5 : 9), stroke: '#2b2418', 'stroke-width': 0.8 }), cm % 20 ? null : s('text', { class: 'scale-text', x: X0 + cm * PX, y: 338, 'text-anchor': 'middle' }, String(cm)));
      const cord = s('line', { y1: 284, y2: 284, x2: 640, stroke: '#6b7682' });
      const mass = s('rect', { x: 642, width: 18, height: 26, fill: '#5d6874' });
      const timer = D.display(530, 60, 110, 'Timer');
      svg.append(s('rect', { x: X0 - 20, y: 296, width: 100 * PX + 60, height: 14, fill: '#c89b62' }), rule, cord, s('circle', { cx: 650, cy: 290, r: 10, fill: '#9aa5b1' }), mass, trolley, timer.g);
      return {
        update() {
          const x = X0 + dist(st.t) * PX;
          trolley.setAttribute('transform', `translate(${x} 294)`);
          cord.setAttribute('x1', x + 30);
          mass.setAttribute('y', 300 + dist(st.t) * 0.8);
          timer.set(`${st.t.toFixed(1)} s`);
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Metre rule at the front of the trolley (cm)', label: 'Close-up of the metre rule at the front edge of the trolley', span: 12, minor: 1, major: 10, labelEvery: 5, min: 0, max: 100, value: (st) => dist(st.t) },
    measureTitle: 'Record the distance every half second',
    measureText: 'Release the trolley from 0 cm. Every 0.5 s, record how far the front of the trolley has travelled along the metre rule.',
    measureWhy: 'Taking readings at equal time intervals gives you the data for a distance–time graph.',
    measureTask: 'read the distance travelled',
    measureButton: (v) => (v === 0 ? 'Read it at the start' : `Let it run until ${v.toFixed(1)} s`),
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.t;
      await tween(300 + (v - from) * 600, (t, raw) => {
        st.t = from + (v - from) * raw;
        api.draw();
      });
      st.t = v;
      api.draw();
      return dist(v);
    },
    iv: { label: 'Time', unit: 's', values: [0, 0.5, 1, 1.5, 2, 2.5, 3], format: (x) => x.toFixed(1) },
    dv: { label: 'Distance travelled', unit: 'cm', dp: 1, tol: 0.5, placeholder: 'e.g. 22.5', readHint: 'Read the metre rule at the pointer, to the nearest half centimetre.' },
    graph: { title: 'Distance–time graph for the trolley', xLabel: 'Time / s', yLabel: 'Distance / cm', xDomain: [0, 3], yDomain: [0, 100], xStep: 0.5, yStep: 20 },
    pattern: {
      q: 'What does the shape of your graph show?',
      o: ['The line curves upwards and gets steeper, so the trolley was speeding up', 'It is a straight line, so the speed was steady', 'It is flat, so the trolley was not moving'],
      hint: 'On a distance–time graph, the steeper the line, the faster the object is moving.',
      right: 'Yes. The trolley covered more distance in each half second, so the graph got steeper: it was accelerating.',
      why: 'A straight sloping line means steady speed, and a horizontal line means stationary.',
    },
    extra: [{
      title: 'Average speed',
      text: 'Average speed = total distance ÷ total time. Calculate the trolley’s average speed over the 3 seconds.',
      why: 'The average speed tells you the steady speed that would cover the same distance in the same time.',
      label: 'Average speed',
      short: 'Average speed',
      unit: 'cm/s',
      dp: 0,
      placeholder: 'e.g. 25',
      expected: (rows) => rows[rows.length - 1].mean / 3,
      tol: 1,
      hint: 'Divide the distance at 3.0 s by 3.',
      msg: (v) => `About ${Math.round(v)} cm/s on average, though it was going slower than this at the start and faster at the end.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The trolley travelled further in each half second, so the distance–time graph curved upwards: it was speeding up. A straight line would show steady speed.',
      rows: [['After 1.0 s', `${rows[2].mean} cm`], ['After 3.0 s', `${rows[rows.length - 1].mean} cm`]],
    }),
  });
})();
