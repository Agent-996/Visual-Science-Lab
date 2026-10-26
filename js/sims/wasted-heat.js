/* Energy wasted as heat: filament lamp or LED? (Grade 6, Stage 7: 7Pf.02, 7TWSc.07). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss } = K;
  const START = 20;
  const RISE = { 'Filament lamp': 14.5, 'Energy-saving lamp': 5.5, LED: 1.5 };
  Investigation.run({
    id: 'g6-wastedheat',
    guide: '../practical.html#g6-wastedheat',
    objectives: ['I can compare how much energy two lamps waste by heating.', 'I can explain that wasted energy is dissipated to the surroundings.'],
    benchLabel: 'A lamp in a holder with a thermometer bulb held 2 cm above it, and a timer.',
    state: { lamp: null, temp: START, on: false, seconds: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Lamp with a thermometer above it'], [600, 'Timer']]);
      const therm = D.thermometer(300, 40, 150, 0, 50);
      const glow = s('circle', { cx: 300, cy: 260, r: 60, fill: '#fff3b0', opacity: 0 });
      const bulb = s('g', null);
      const timer = D.display(550, 60, 110, 'Timer');
      svg.append(glow, bulb, s('rect', { x: 280, y: 300, width: 40, height: 30, fill: '#6b7682' }), s('rect', { x: 250, y: 330, width: 100, height: 70, rx: 6, fill: '#4a525b' }), therm.g, timer.g);
      return {
        update() {
          therm.set(st.temp);
          glow.setAttribute('opacity', st.on ? 0.7 : 0);
          const lamp = st.lamp || 'Filament lamp';
          bulb.replaceChildren(lamp === 'LED'
            ? s('path', { d: 'M282,300 L282,262 Q300,236 318,262 L318,300 Z', fill: st.on ? '#fffbe0' : '#eef2f5', stroke: '#9aa5b1' })
            : s('g', null, s('circle', { cx: 300, cy: 262, r: 30, fill: st.on ? '#fff3b0' : 'rgba(240, 246, 250, 0.9)', stroke: '#9aa5b1' }), lamp === 'Filament lamp' ? s('path', { d: 'M290,280 L292,258 L296,268 L300,256 L304,268 L308,258 L310,280', fill: 'none', stroke: '#c07a20', 'stroke-width': 2 }) : s('path', { d: 'M288,282 L288,250 Q300,240 312,250 L312,282', fill: 'none', stroke: '#9aa5b1', 'stroke-width': 4 })));
          timer.set(`${Math.floor(st.seconds / 60)}:${String(Math.floor(st.seconds % 60)).padStart(2, '0')}`);
        },
      };
    },
    closeUp: { kind: 'thermometer', caption: 'Thermometer (°C)', label: 'Close-up of the thermometer', span: 8, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 50, value: (st) => st.temp },
    measureTitle: 'Switch on each lamp for 5 minutes',
    measureText: 'Each lamp gives about the same amount of light. Switch it on, wait 5 minutes and read the thermometer above it.',
    measureWhy: 'The type of lamp is the variable you change. Keep the thermometer at the same distance and time each lamp for the same 5 minutes.',
    measureTask: 'switch on the lamp for 5 minutes and read the thermometer',
    measureButton: (v) => `Switch on the ${v.toLowerCase()} for 5 minutes`,
    async measure(v, rep, api) {
      const { st } = api;
      st.lamp = v;
      st.temp = START;
      st.on = true;
      const end = Math.round((START + RISE[v] + gauss() * 0.15) * 2) / 2;
      await tween(1800, (t, raw) => {
        st.seconds = 300 * raw;
        st.temp = START + (end - START) * (1 - Math.exp(-raw * 4)) / (1 - Math.exp(-4));
        api.draw();
      });
      st.temp = end;
      api.draw();
      return end;
    },
    afterReading(api) {
      api.st.on = false;
      api.draw();
      api.say('Switch off and let the thermometer cool back to 20 °C before the next lamp.', 'info');
    },
    iv: { label: 'Lamp', unit: '', values: ['Filament lamp', 'Energy-saving lamp', 'LED'], categorical: true },
    dv: { label: 'Temperature after 5 minutes', unit: '°C', dp: 1, tol: 0.3, placeholder: 'e.g. 27.5', readHint: 'Read the thermometer at the top of the red liquid, to the nearest half degree.' },
    graph: { title: 'Temperature above each lamp after 5 minutes', xLabel: 'Lamp', yLabel: 'Temperature / °C', yDomain: [0, 40], yStep: 10 },
    pattern: {
      q: 'What do your results show?',
      o: ['The filament lamp heated the air most, so it wastes the most energy as heat', 'The LED wasted the most energy', 'All the lamps wasted the same amount'],
      hint: 'All three gave the same light. Which one also made the most heat?',
      right: 'Yes. For the same light, the filament lamp transfers far more energy by heating. The LED is the most efficient.',
    },
    extra: [{
      title: 'Work out the temperature rise',
      text: 'The thermometer started at 20.0 °C. How much did the temperature rise above the filament lamp?',
      why: 'The rise in temperature is a fairer comparison than the final temperature if the starting temperatures differ.',
      label: 'Temperature rise above the filament lamp',
      short: 'Rise, filament lamp',
      unit: '°C',
      dp: 1,
      placeholder: 'e.g. 12.0',
      expected: (rows) => rows[0].mean - START,
      tol: 0.2,
      hint: 'Take 20.0 away from the filament lamp reading.',
      msg: (v) => `A rise of about ${v.toFixed(1)} °C. That energy is wasted, because a lamp is meant to give light.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'For the same brightness, the filament lamp heated the air much more than the LED. More of its energy is dissipated as heating, so the LED is the most efficient.',
      rows: rows.map((r) => [r.x, `${r.mean} °C`]),
    }),
  });
})();
