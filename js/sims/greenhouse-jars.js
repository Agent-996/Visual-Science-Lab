/* Greenhouse effect model (Grade 7, Stage 8: 8ESc.02, 8TWSa.03). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, gauss } = K;
  const END = { 'Jar of air': 24.0, 'Jar with extra carbon dioxide': 25.5 };
  Investigation.run({
    id: 'g7-greenhouse',
    guide: '../practical.html#g7-greenhouse',
    objectives: ['I can model the greenhouse effect with jars of air and extra carbon dioxide.', 'I can explain how greenhouse gases warm the Earth.'],
    benchLabel: 'Two sealed jars with thermometers inside, one of air and one with extra carbon dioxide, under the same lamp, and a timer.',
    state: { jar: null, temp: 20, minutes: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Sealed jar under a lamp'], [580, 'Timer']]);
      const therm = D.thermometer(300, 180, 170, 0, 40);
      const label = s('text', { x: 300, y: 170, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      const gas = s('rect', { x: 232, y: 182, width: 136, height: 214, fill: 'rgba(200, 200, 200, 0)' });
      const timer = D.display(530, 160, 110, 'Timer');
      svg.append(s('path', { d: 'M260,40 L340,40 L360,90 L240,90 Z', fill: '#4a525b' }), s('circle', { cx: 300, cy: 96, r: 14, fill: '#fff3b0' }), gas, s('path', { d: 'M230,180 L230,398 L370,398 L370,180', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: 226, y: 172, width: 148, height: 10, rx: 3, fill: '#6b7682' }), therm.g, label, timer.g);
      return {
        update() {
          therm.set(st.temp);
          gas.setAttribute('fill', st.jar === 'Jar with extra carbon dioxide' ? 'rgba(180, 180, 180, 0.25)' : 'rgba(214, 232, 242, 0.25)');
          label.textContent = st.jar ? st.jar.replace('Jar with extra carbon dioxide', 'Extra carbon dioxide').replace('Jar of air', 'Air') : '';
          timer.set(`${Math.round(st.minutes)} min`);
        },
      };
    },
    closeUp: { kind: 'thermometer', caption: 'Thermometer in the jar (°C)', label: 'Close-up of the thermometer in the jar', span: 8, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 40, value: (st) => st.temp },
    measureTitle: 'Heat each jar for 20 minutes',
    measureText: 'Both jars start at 20.0 °C. Put each jar under the lamp for 20 minutes and read the thermometer. Repeat three times for each jar.',
    measureWhy: 'The gas in the jar is the variable you change. Use the same lamp, distance and time. The temperature changes are small, so repeat each test and take a mean.',
    measureTask: 'heat the jar for 20 minutes and read the thermometer',
    measureButton: (v, rep) => `${v}: 20 minutes under the lamp${rep ? ` (repeat ${rep + 1})` : ''}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.jar = v;
      st.temp = 20;
      st.minutes = 0;
      const end = Math.round((END[v] + gauss() * 0.3) * 2) / 2;
      await tween(1400, (t, raw) => {
        st.minutes = 20 * raw;
        st.temp = 20 + (end - 20) * t;
        api.draw();
      });
      st.temp = end;
      st.minutes = 20;
      api.draw();
      return end;
    },
    repeats: 3,
    iv: { label: 'Jar', unit: '', values: Object.keys(END), categorical: true, format: (x) => (x === 'Jar of air' ? 'Air' : 'Extra CO₂') },
    dv: { label: 'Temperature after 20 minutes', unit: '°C', dp: 1, tol: 0.3, placeholder: 'e.g. 24.5', readHint: 'Read the thermometer at the top of the red liquid, to the nearest half degree.' },
    graph: { title: 'Mean temperature after 20 minutes under the lamp', xLabel: 'Jar', yLabel: 'Temperature / °C', yDomain: [15, 30], yStep: 5 },
    pattern: {
      q: 'What do your results show?',
      o: ['The jar with extra carbon dioxide warmed more than the jar of air', 'The jar of air warmed more', 'Both jars warmed exactly the same'],
      hint: 'Compare the two means. Both jars started at 20.0 °C.',
      right: 'Yes. Carbon dioxide absorbs heat and traps it, so the jar with more carbon dioxide warmed more.',
      why: 'In the atmosphere, greenhouse gases absorb heat radiated from the Earth’s surface and trap it, warming the planet.',
    },
    extra: [{
      title: 'Compare the means',
      text: 'How much warmer was the mean for the jar with extra carbon dioxide than the mean for the jar of air?',
      why: 'The difference is small, which is why repeats and means matter.',
      label: 'Difference between the means',
      short: 'Difference',
      unit: '°C',
      dp: 1,
      placeholder: 'e.g. 1.0',
      expected: (rows) => rows[1].mean - rows[0].mean,
      tol: 0.2,
      hint: 'Take the air mean away from the carbon dioxide mean.',
      msg: (v) => `About ${v.toFixed(1)} °C warmer. A small difference, but it was there every time.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The jar with extra carbon dioxide usually warmed more. Greenhouse gases absorb heat radiated from the Earth’s surface and trap it in the atmosphere.',
      rows: rows.map((r) => [r.x === 'Jar of air' ? 'Air' : 'Extra carbon dioxide', `${r.mean} °C (mean)`]),
    }),
  });
})();
