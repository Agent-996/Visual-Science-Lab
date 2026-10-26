/* Renewable energy: solar cells and wind turbines (Grade 7, Stage 8: 8ESp.02, 8TWSp.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const volts = (a) => Math.round(2 * Math.cos((a * Math.PI) / 180) * 100) / 100;
  Investigation.run({
    id: 'g7-renewables',
    guide: '../practical.html#g7-renewables',
    objectives: ['I can investigate how one factor affects the output of a solar cell or model turbine.', 'I can compare renewable and non-renewable energy resources.'],
    benchLabel: 'A lamp shining on a small solar cell that can be tilted, connected to a voltmeter.',
    state: { angle: 0, v: 0, on: false },
    scene(svg, D, st) {
      D.bench(svg, 440, [[140, 'Lamp'], [380, 'Solar cell on a hinge'], [600, 'Voltmeter']]);
      const panel = s('g', null);
      const meter = D.display(540, 160, 120, 'Voltmeter');
      svg.append(s('path', { d: 'M110,140 L170,140 L190,190 L90,190 Z', fill: '#4a525b' }), s('rect', { x: 134, y: 190, width: 12, height: 208, fill: '#6b7682' }), s('circle', { cx: 140, cy: 196, r: 14, fill: '#fff3b0' }), s('path', { d: 'M160,200 L360,240 L360,320 L160,210 Z', fill: '#fff8d0', opacity: 0.5 }), panel, meter.g, s('rect', { x: 370, y: 330, width: 20, height: 68, fill: '#6b7682' }));
      return {
        update() {
          panel.replaceChildren(s('g', { transform: `rotate(${-st.angle} 380 330)` }, s('rect', { x: 374, y: 230, width: 12, height: 100, fill: '#1f3f70', stroke: '#9aa5b1' }), ...[0, 1, 2, 3].map((i) => s('line', { x1: 374, x2: 386, y1: 255 + i * 20, y2: 255 + i * 20, stroke: '#9aa5b1' }))), s('text', { x: 420, y: 230, 'font-size': 13, fill: '#455261' }, `${Math.round(st.angle)}°`));
          meter.set(`${st.v.toFixed(2)} V`);
        },
      };
    },
    measureTitle: 'Tilt the solar cell',
    measureText: 'Start with the solar cell facing the lamp directly (0°). Tilt it away in 15° steps and read the voltmeter each time.',
    measureWhy: 'The angle is the variable you change. Keep the lamp, the distance and the solar cell the same.',
    measureTask: 'tilt the solar cell and read the voltmeter',
    measureButton: (v) => `Tilt the cell to ${v}°`,
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.angle;
      await tween(700, (t) => {
        st.angle = from + (v - from) * t;
        st.v = volts(st.angle);
        api.draw();
      });
      st.angle = v;
      st.v = volts(v);
      api.draw();
      return st.v;
    },
    iv: { label: 'Angle away from the lamp', unit: '°', values: [0, 15, 30, 45, 60, 75, 90] },
    dv: { label: 'Voltage', unit: 'V', dp: 2, tol: 0.005, placeholder: 'e.g. 1.50', readHint: 'Copy the reading on the voltmeter.' },
    graph: { title: 'Solar cell output against angle', xLabel: 'Angle away from the lamp / °', yLabel: 'Voltage / V', xDomain: [0, 90], yDomain: [0, 2.5], xStep: 15, yStep: 0.5 },
    pattern: {
      q: 'What do your results show?',
      o: ['The solar cell gives most output when it faces the light directly', 'It gives most output when it is tilted at 90°', 'The angle makes no difference'],
      hint: 'Which angle gave the highest voltage?',
      right: 'Yes. Facing the light directly, the most light falls on the cell. That is why solar panels are angled towards the Sun.',
      why: 'Sunlight and wind are renewable: they will not run out, unlike fossil fuels.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The solar cell gave most output when it faced the light directly, and none at 90°. Renewable resources like sunlight and wind will not run out, unlike fossil fuels.',
      rows: [['Facing the lamp (0°)', `${rows[0].mean} V`], ['Side-on (90°)', `${rows[rows.length - 1].mean} V`]],
    }),
  });
})();
