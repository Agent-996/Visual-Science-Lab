/* Weather station: weather or climate? (Grade 7, Stage 8: 8ESc.03, 8TWSc.07). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const MAX = { 1: 18.5, 2: 21.0, 3: 23.5, 4: 19.0, 5: 16.5, 6: 20.0, 7: 22.5 };
  const SKY = { 1: 'cloud', 2: 'sun', 3: 'sun', 4: 'rain', 5: 'rain', 6: 'cloud', 7: 'sun' };
  Investigation.run({
    id: 'g7-weather',
    guide: '../practical.html#g7-weather',
    objectives: ['I can collect daily weather readings.', 'I can explain the difference between weather and climate.'],
    benchLabel: 'A school weather station with a maximum thermometer in a white ventilated box, and the sky for each day of the week.',
    state: { day: 0, temp: 15 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[220, 'Weather station'], [480, 'The sky today']]);
      const therm = D.thermometer(220, 110, 200, 0, 40);
      const sky = s('g', null);
      const label = s('text', { x: 480, y: 70, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(s('rect', { x: 170, y: 90, width: 100, height: 250, fill: '#ffffff', stroke: '#9aa5b1' }), s('rect', { x: 214, y: 340, width: 12, height: 58, fill: '#9aa5b1' }), therm.g, sky, label);
      return {
        update() {
          const kind = SKY[st.day];
          sky.replaceChildren(
            kind === 'sun' || kind === 'cloud' ? s('circle', { cx: kind === 'sun' ? 480 : 456, cy: 180, r: 34, fill: '#ffd34d' }) : null,
            kind === 'cloud' || kind === 'rain' ? s('path', { d: 'M420,220 a26,26 0 0 1 20,-44 a34,34 0 0 1 64,-6 a26,26 0 0 1 22,50 Z', fill: kind === 'rain' ? '#9aa5b1' : '#e6ebef' }) : null,
            ...(kind === 'rain' ? [440, 470, 500].map((x) => s('line', { x1: x, y1: 236, x2: x - 8, y2: 262, stroke: '#4f8fd8', 'stroke-width': 3 })) : []));
          therm.set(st.temp);
          label.textContent = st.day ? `Day ${st.day}` : '';
        },
      };
    },
    closeUp: { kind: 'thermometer', caption: 'Maximum thermometer (°C)', label: 'Close-up of the maximum thermometer', span: 8, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 40, value: (st) => (st.day ? st.temp : null) },
    measureTitle: 'Read the weather station every day',
    measureText: 'At the same time each day, read the highest temperature of the last 24 hours from the maximum thermometer, then reset it.',
    measureWhy: 'Reading at the same time every day, in the same place, makes the readings comparable.',
    measureTask: 'read the maximum temperature',
    measureButton: (v) => `Read the station on day ${v}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.day = v;
      const from = st.temp;
      await tween(800, (t) => {
        st.temp = from + (MAX[v] - from) * t;
        api.draw();
      });
      st.temp = MAX[v];
      api.draw();
      return MAX[v];
    },
    iv: { label: 'Day', unit: '', values: [1, 2, 3, 4, 5, 6, 7] },
    dv: { label: 'Maximum temperature', unit: '°C', dp: 1, tol: 0.3, placeholder: 'e.g. 21.5', readHint: 'Read the thermometer at the top of the red liquid, to the nearest half degree.' },
    graph: { title: 'Maximum temperature each day for a week', xLabel: 'Day', yLabel: 'Maximum temperature / °C', xDomain: [1, 7], yDomain: [10, 30], xStep: 1, yStep: 5, curve: 'none' },
    pattern: {
      q: 'What do your readings show about the weather?',
      o: ['The weather changes a lot from day to day', 'The weather is exactly the same every day', 'It gets warmer every single day'],
      hint: 'Look at how much the temperature goes up and down during the week.',
      right: 'Yes. Weather is the conditions on a particular day, and it changes a lot.',
    },
    extra: [{
      title: 'Work out the mean',
      text: 'Add up the seven maximum temperatures and divide by 7.',
      why: 'Climate is the average weather over a long time, usually 30 years or more. A mean is the first step to describing climate.',
      label: 'Mean maximum temperature for the week',
      short: 'Mean for the week',
      unit: '°C',
      dp: 1,
      placeholder: 'e.g. 20.0',
      expected: (rows) => rows.reduce((a, r) => a + r.mean, 0) / rows.length,
      tol: 0.2,
      hint: 'Add all seven readings, then divide by 7.',
      msg: (v) => `About ${v.toFixed(1)} °C. One week is far too short to describe the climate: that needs the average over about 30 years.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Weather is the conditions on a particular day and changes a lot. Climate is the average weather over many years (usually 30 or more).',
      rows: [['Highest this week', `${Math.max(...rows.map((r) => r.mean))} °C`], ['Lowest this week', `${Math.min(...rows.map((r) => r.mean))} °C`]],
    }),
  });
})();
