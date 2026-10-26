/* How do hand warmers and cold packs work? (Grade 7, Stage 8: 8Cc.02, 8SIC.02). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const START = 20;
  const END = { 'Iron powder hand warmer': 48.0, 'Reusable hand warmer': 52.5, 'Instant cold pack': 6.0 };
  const LOOK = { 'Iron powder hand warmer': '#8a7a6a', 'Reusable hand warmer': 'rgba(214, 232, 242, 0.85)', 'Instant cold pack': '#e9eef2' };
  Investigation.run({
    id: 'g7-handwarmers',
    guide: '../practical.html#g7-handwarmers',
    objectives: ['I can find out how hand warmers and cold packs work.', 'I can link them to exothermic and endothermic changes.'],
    benchLabel: 'A hand warmer or cold pack with a thermometer taped to it, and a timer.',
    state: { pack: null, temp: START, minutes: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Pack with a thermometer taped to it'], [580, 'Timer']]);
      const therm = D.thermometer(300, 110, 210, -10, 60);
      const pack = s('rect', { x: 220, y: 300, width: 160, height: 90, rx: 18, stroke: '#8a96a3', 'stroke-width': 2 });
      const label = s('text', { x: 300, y: 290, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      const timer = D.display(530, 160, 110, 'Timer');
      svg.append(pack, therm.g, label, timer.g);
      return {
        update() {
          pack.setAttribute('fill', LOOK[st.pack] || '#e9eef2');
          pack.setAttribute('visibility', st.pack ? 'visible' : 'hidden');
          therm.set(st.temp);
          label.textContent = st.pack || '';
          timer.set(`${Math.round(st.minutes)} min`);
        },
      };
    },
    closeUp: { kind: 'thermometer', caption: 'Thermometer on the pack (°C)', label: 'Close-up of the thermometer taped to the pack', span: 10, minor: 0.5, major: 1, labelEvery: 2, min: -10, max: 60, value: (st) => st.temp },
    measureTitle: 'Activate each pack',
    measureText: 'Each pack starts at room temperature, 20 °C. Activate it (shake it, click the metal disc or squeeze it), wait 2 minutes and read the thermometer.',
    measureWhy: 'Measuring the temperature after the same time shows whether the change inside releases or takes in energy.',
    measureTask: 'activate the pack and read the thermometer after 2 minutes',
    measureButton: (v) => `Activate the ${v.toLowerCase()}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.pack = v;
      st.temp = START;
      st.minutes = 0;
      await tween(1600, (t, raw) => {
        st.minutes = 2 * raw;
        st.temp = START + (END[v] - START) * (1 - Math.exp(-raw * 4)) / (1 - Math.exp(-4));
        api.draw();
      });
      st.temp = END[v];
      api.draw();
      return END[v];
    },
    iv: { label: 'Pack', unit: '', values: Object.keys(END), categorical: true, format: (x) => x.replace(' hand warmer', '').replace('Instant cold pack', 'Cold pack') },
    dv: { label: 'Temperature after 2 minutes', unit: '°C', dp: 1, tol: 0.3, placeholder: 'e.g. 35.0', readHint: 'Read the thermometer at the top of the red liquid, to the nearest half degree.' },
    graph: { title: 'Temperature of each pack after 2 minutes (started at 20 °C)', xLabel: 'Pack', yLabel: 'Temperature / °C', yDomain: [0, 60], yStep: 10 },
    pattern: {
      q: 'What do your results show?',
      o: ['The hand warmers release energy (exothermic); the cold pack takes in energy (endothermic)', 'All three packs got hotter', 'All three packs got colder'],
      hint: 'Every pack started at 20 °C. Which got hotter and which got colder?',
      right: 'Yes. Hand warmers use exothermic changes such as iron rusting quickly. Cold packs use endothermic dissolving, such as ammonium nitrate in water.',
    },
    extra: [{
      title: 'Temperature change of the cold pack',
      text: 'Temperature change = final temperature − starting temperature. Work out the change for the cold pack. It started at 20.0 °C.',
      why: 'A negative temperature change shows that energy was taken in from the surroundings.',
      label: 'Temperature change of the cold pack',
      short: 'Cold pack change',
      unit: '°C',
      dp: 1,
      placeholder: 'e.g. -10.0',
      expected: (rows) => rows[2].mean - START,
      tol: 0.2,
      hint: 'Take 20.0 away from the cold pack reading. The answer is negative.',
      msg: (v) => `${v.toFixed(1)} °C. The negative sign shows the temperature fell: an endothermic change.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Hand warmers use exothermic changes to release heat; the cold pack used an endothermic change and took in heat, so it got colder.',
      rows: rows.map((r) => [r.x, `${r.mean} °C`]),
    }),
  });
})();
