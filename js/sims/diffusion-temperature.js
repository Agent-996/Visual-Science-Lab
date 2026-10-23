/* Diffusion rate and temperature (Grade 7, Stage 8: 8Pf.07, 8TWSa.03). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss, round } = K;

  // Seconds for the colour to spread evenly through still water.
  const spreadTime = (T) => Math.round(600 * Math.exp(-0.035 * (T - 10)) * (1 + gauss() * 0.03));
  const waterColour = (T) => `rgba(${Math.round(lerp(170, 240, T / 70))}, ${Math.round(lerp(210, 200, T / 70))}, ${Math.round(lerp(245, 190, T / 70))}, 0.45)`;

  Investigation.run({
    id: 'g7-diffusiontemp',
    guide: '../practical.html#g7-diffusiontemp',
    objectives: ['I can compare diffusion in hot and cold water.', 'I can explain the result using particle speed.'],
    benchLabel: 'A beaker of water with a thermometer, a dropper of food colouring and a stopwatch.',
    state: { temp: 20, spread: 0, seconds: 0, drop: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Beaker of still water'], [470, 'Food colouring'], [610, 'Stopwatch']]);
      const beaker = D.beaker(300, 400, 180, 200, waterColour(20)).setLevel(0.8);
      const therm = D.thermometer(232, 200, 180, 0, 80);
      const clipId = 'dif-water';
      const cloud = s('ellipse', { cx: 310, cy: 260, rx: 0, ry: 0, fill: 'url(#dye)', 'clip-path': `url(#${clipId})` });
      const tint = s('rect', { x: 212, y: 245, width: 176, height: 152, fill: '#7b3fb0', opacity: 0, 'clip-path': `url(#${clipId})` });
      const defs = s('defs', null,
        s('clipPath', { id: clipId }, s('rect', { x: 212, y: 244, width: 176, height: 154, rx: 4 })),
        s('radialGradient', { id: 'dye' }, s('stop', { offset: '0%', 'stop-color': '#6a2fa3', 'stop-opacity': 0.85 }), s('stop', { offset: '100%', 'stop-color': '#7b3fb0', 'stop-opacity': 0.15 })));
      const bottle = s('g', null,
        s('rect', { x: 452, y: 360, width: 36, height: 40, rx: 4, fill: '#fdfdfd', stroke: '#7f97a8' }),
        s('rect', { x: 456, y: 372, width: 28, height: 24, rx: 2, fill: '#7b3fb0' }),
        s('ellipse', { cx: 470, cy: 350, rx: 6, ry: 10, fill: '#33373b' }));
      const dropEl = s('circle', { cx: 310, r: 4, fill: '#7b3fb0', visibility: 'hidden' });
      const watch = D.display(545, 250, 130, 'Stopwatch');
      svg.append(defs, beaker.g, tint, cloud, therm.g, bottle, dropEl, watch.g);
      return {
        update() {
          beaker.setColour(waterColour(st.temp));
          therm.set(st.temp);
          const r = st.spread;
          cloud.setAttribute('rx', 15 + r * 160);
          cloud.setAttribute('ry', 12 + r * 120);
          cloud.setAttribute('cy', 262 + r * 70);
          cloud.setAttribute('opacity', st.spread > 0 || st.drop !== null ? 1 - r * 0.6 : 0);
          tint.setAttribute('opacity', (r * 0.55).toFixed(3));
          dropEl.setAttribute('visibility', st.drop === null ? 'hidden' : 'visible');
          if (st.drop !== null) dropEl.setAttribute('cy', st.drop);
          watch.set(`${Math.round(st.seconds)} s`);
        },
      };
    },
    measureTitle: 'Time how long the colour takes to spread',
    measureText: 'Fill the beaker with water at each temperature. Add one drop of food colouring without stirring, and time how long it takes for the colour to spread evenly through the water.',
    measureWhy: 'Temperature is the variable you change. Use the same volume of water, the same size of drop and never stir, so that only diffusion spreads the colour.',
    measureTask: 'add one drop of colouring and time it',
    measureButton: (v) => `Use water at ${v} °C and add one drop`,
    async measure(v, rep, api) {
      const { st } = api;
      st.spread = 0;
      st.seconds = 0;
      const from = st.temp;
      await tween(700, (t) => {
        st.temp = lerp(from, v, t);
        api.draw();
      });
      st.drop = 225;
      await tween(350, (t) => {
        st.drop = lerp(225, 258, t * t);
        api.draw();
      });
      st.drop = null;
      const time = spreadTime(v);
      await tween(900 + time * 3, (t) => {
        st.spread = t;
        st.seconds = time * t;
        api.draw();
      });
      st.spread = 1;
      st.seconds = time;
      api.draw();
      return time;
    },
    iv: { label: 'Water temperature', unit: '°C', values: [10, 20, 30, 40, 50, 60] },
    dv: { label: 'Time to spread evenly', unit: 's', dp: 0, tol: 0, placeholder: 'e.g. 320', readHint: 'Copy the time shown on the stopwatch, in seconds.' },
    graph: { title: 'Time for the colour to spread against water temperature', xLabel: 'Water temperature / °C', yLabel: 'Time to spread / s', xDomain: [0, 70], yDomain: [0, 700], yStep: 100 },
    pattern: {
      q: 'What do your results show?',
      o: ['The hotter the water, the faster the colour spreads', 'The colder the water, the faster the colour spreads', 'The temperature makes no difference to diffusion'],
      hint: 'A shorter time means the colour spread faster. How does the time change as the water gets hotter?',
      right: 'Yes. In hotter water the particles move faster, so the colour particles spread out by diffusion more quickly.',
      why: 'Diffusion happens because particles move randomly. Heating gives particles more energy, so they move faster.',
    },
    extra: [{
      title: 'Compare hot and cold',
      text: 'How many times faster did the colour spread at 60 °C than at 10 °C? Divide the time at 10 °C by the time at 60 °C.',
      why: 'Comparing values with a ratio shows how big an effect is, not just that there is one.',
      label: 'Time at 10 °C ÷ time at 60 °C',
      short: 'Faster at 60 °C by',
      unit: 'times',
      dp: 1,
      placeholder: 'e.g. 5.8',
      expected: (rows) => rows[0].mean / rows[rows.length - 1].mean,
      tol: 0.3,
      hint: 'Take the time from the 10 °C row and divide it by the time from the 60 °C row.',
      msg: (v) => `About ${v.toFixed(1)} times faster in the hot water.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The colour spread much faster in hot water. Particles move faster at higher temperatures, so diffusion is quicker.',
      rows: [['Time at 10 °C', `${rows[0].mean} s`], ['Time at 60 °C', `${rows[rows.length - 1].mean} s`]],
    }),
  });
})();
