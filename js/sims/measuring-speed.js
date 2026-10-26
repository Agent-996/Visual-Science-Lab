/* Measuring speed (Grade 7, Stage 8: 8Pf.01, 8TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const TIME = { Walking: 14.3, 'Fast walking': 9.5, Jogging: 5.6, Running: 3.6 };
  const X0 = 110;
  const X1 = 590;
  Investigation.run({
    id: 'g7-measurespeed',
    guide: '../practical.html#g7-measurespeed',
    objectives: ['I can measure distance and time to calculate speed.', 'I can use speed = distance ÷ time.'],
    benchLabel: 'A 20 metre track marked out with cones, a student moving along it and a stopwatch.',
    state: { move: null, pos: 0, seconds: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[350, '20 m track'], [600, 'Stopwatch']]);
      const runner = s('g', null, s('circle', { r: 12, fill: '#e2b48c', stroke: '#b5835a' }), s('rect', { x: -8, y: 12, width: 16, height: 30, rx: 6, fill: '#4f8fd8' }));
      const watch = D.display(540, 60, 120, 'Stopwatch');
      const name = s('text', { x: 350, y: 150, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(s('rect', { x: X0 - 20, y: 330, width: X1 - X0 + 40, height: 24, fill: '#c9b48a' }), ...[X0, X1].map((x) => s('path', { d: `M${x - 10},330 L${x},300 L${x + 10},330 Z`, fill: '#f08c00' })), s('text', { x: X0, y: 290, 'text-anchor': 'middle', 'font-size': 12, fill: '#455261' }, 'start'), s('text', { x: X1, y: 290, 'text-anchor': 'middle', 'font-size': 12, fill: '#455261' }, '20 m'), runner, watch.g, name);
      return {
        update() {
          runner.setAttribute('transform', `translate(${X0 + (X1 - X0) * st.pos} 270)`);
          watch.set(`${st.seconds.toFixed(1)} s`);
          name.textContent = st.move || '';
        },
      };
    },
    measureTitle: 'Time each way of moving',
    measureText: 'Your partner walks, walks fast, jogs and then runs from the start cone to the 20 m cone. Start the stopwatch as they pass the start and stop it as they pass the finish.',
    measureWhy: 'Measuring the time over the same distance lets you compare speeds. Speed = distance ÷ time.',
    measureTask: 'time the 20 m',
    measureButton: (v) => `Time: ${v.toLowerCase()}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.move = v;
      st.pos = 0;
      st.seconds = 0;
      await tween(500 + TIME[v] * 120, (t, raw) => {
        st.pos = raw;
        st.seconds = TIME[v] * raw;
        api.draw();
      });
      st.pos = 1;
      st.seconds = TIME[v];
      api.draw();
      return TIME[v];
    },
    afterReading(api) {
      api.st.pos = 0;
      api.draw();
    },
    iv: { label: 'Movement', unit: '', values: Object.keys(TIME), categorical: true },
    dv: { label: 'Time for 20 m', unit: 's', dp: 1, tol: 0.05, placeholder: 'e.g. 8.2', readHint: 'Copy the time on the stopwatch, in seconds.' },
    graph: { title: 'Time to cover 20 m', xLabel: 'Movement', yLabel: 'Time / s', yDomain: [0, 16], yStep: 4 },
    pattern: {
      q: 'What do your results show?',
      o: ['The faster the movement, the shorter the time for the same distance', 'Running took the longest', 'All the times were the same'],
      hint: 'Compare walking with running.',
      right: 'Yes. A shorter time for the same distance means a higher speed.',
    },
    extra: [{
      title: 'Calculate a speed',
      text: 'Speed = distance ÷ time. Calculate the running speed over 20 m.',
      why: 'Speed lets you compare movements over different distances.',
      label: 'Running speed',
      short: 'Running speed',
      unit: 'm/s',
      dp: 1,
      placeholder: 'e.g. 4.0',
      expected: (rows) => 20 / rows[3].mean,
      tol: 0.1,
      hint: 'Divide 20 m by the running time.',
      msg: (v) => `About ${v.toFixed(1)} m/s. Walking is about 1–2 m/s and running about 4–7 m/s.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The faster the movement, the shorter the time to cover 20 m. Walking speed is about 1–2 m/s and running about 4–7 m/s. Speed = distance ÷ time.',
      rows: rows.map((r) => [r.x, `${(20 / r.mean).toFixed(1)} m/s`]),
    }),
  });
})();
