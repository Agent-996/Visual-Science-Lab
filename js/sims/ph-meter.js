/* pH meter compared with indicator paper (Grade 6, Stage 7: 7Cp.02, 7TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, lerp } = K;
  const PH = { 'Lemon juice': 2.3, Vinegar: 2.9, Milk: 6.6, 'Tap water': 7.2, 'Baking soda': 8.3, Soap: 9.8 };
  const UI = (p) => ['#d7263d', '#d7263d', '#e8452c', '#f07a2a', '#f2a530', '#f2c230', '#c8c83a', '#2e9e44', '#2a8a7a', '#1f6fd1', '#3a4fc0', '#4b3aa8', '#5a2a9a', '#6a2a9a', '#6a2a9a'][Math.round(p)];
  Investigation.run({
    id: 'g6-phmeter',
    guide: '../practical.html#g6-phmeter',
    objectives: ['I can measure pH with a pH meter and with indicator paper.', 'I can compare the two methods for accuracy.'],
    benchLabel: 'A beaker of solution with the probe of a digital pH meter dipped into it, and a strip of universal indicator paper.',
    state: { sol: null, reading: 7, dip: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Solution with a pH meter probe'], [560, 'Indicator paper']]);
      const beaker = D.beaker(300, 400, 120, 120, 'rgba(214, 232, 242, 0.6)').setLevel(0.7);
      const meter = D.display(380, 120, 120, 'pH meter');
      const probe = s('g', null);
      const paper = s('rect', { x: 545, y: 250, width: 30, height: 90, rx: 3 });
      const name = s('text', { x: 300, y: 260, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(beaker.g, probe, meter.g, paper, name, s('path', { d: 'M310,140 Q360,120 380,136', fill: 'none', stroke: '#39424b', 'stroke-width': 2 }));
      return {
        update() {
          const y = lerp(170, 300, st.dip);
          probe.replaceChildren(s('rect', { x: 304, y: 140, width: 10, height: y - 140, fill: '#6b7682' }), s('circle', { cx: 309, cy: y, r: 7, fill: '#d6e9f5', stroke: '#6b7682' }));
          meter.set(st.sol && st.dip >= 1 ? st.reading.toFixed(1) : '--');
          paper.setAttribute('fill', st.sol && st.dip >= 1 ? UI(PH[st.sol]) : '#f2c230');
          name.textContent = st.sol || '';
        },
      };
    },
    measureTitle: 'Measure the pH of each solution',
    measureText: 'Rinse the probe, dip it in the solution and wait for the reading to settle. Dip a strip of indicator paper in too and compare its colour with the chart.',
    measureWhy: 'Rinsing the probe between solutions stops one solution contaminating the next.',
    measureTask: 'dip the probe in and read the pH meter',
    measureButton: (v) => `Test the ${v.toLowerCase()}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.sol = v;
      st.dip = 0;
      await tween(500, (t) => {
        st.dip = t;
        api.draw();
      });
      st.dip = 1;
      const from = st.reading;
      await tween(700, (t) => {
        st.reading = lerp(from, PH[v], t);
        api.draw();
      });
      st.reading = PH[v];
      api.draw();
      return PH[v];
    },
    iv: { label: 'Solution', unit: '', values: Object.keys(PH), categorical: true },
    dv: { label: 'pH from the meter', unit: '', dp: 1, tol: 0.05, placeholder: 'e.g. 4.5', readHint: 'Copy the number on the pH meter display.' },
    graph: { title: 'pH of each solution (pH meter)', xLabel: 'Solution', yLabel: 'pH', yDomain: [0, 14], yStep: 2 },
    pattern: {
      q: 'How does the pH meter compare with indicator paper?',
      o: ['The meter gives a precise number (such as 2.3); the paper only gives a whole number from a colour match', 'The paper is more precise than the meter', 'They always give exactly the same reading'],
      hint: 'Look at the meter readings. Could you tell pH 2.3 from pH 2.9 by colour alone?',
      right: 'Yes. A pH meter is more precise and does not depend on judging a colour.',
      why: 'Indicator paper is quick and cheap; a pH meter needs calibrating but gives more precise results.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The pH meter gave precise readings, from about 2.3 for lemon juice to 9.8 for soap. Indicator paper only gives a whole number from a colour match, so the meter is more precise.',
      rows: rows.map((r) => [r.x, `pH ${r.mean}`]),
    }),
  });
})();
