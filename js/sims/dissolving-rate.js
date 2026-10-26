/* What affects how fast sugar dissolves? (Grade 7, Stage 8: 8Cp.01, 8TWSp.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss } = K;
  const time = (T) => Math.round(480 * Math.exp(-0.032 * (T - 20)) * (1 + gauss() * 0.03));
  Investigation.run({
    id: 'g7-dissolving',
    guide: '../practical.html#g7-dissolving',
    objectives: ['I can plan a fair test of one factor that affects dissolving rate.', 'I can explain the results using particles.'],
    benchLabel: 'A beaker of water with a thermometer, a sugar cube dropped into it, and a stopwatch.',
    state: { temp: 20, cube: 0, seconds: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Beaker of water with a sugar cube'], [590, 'Stopwatch']]);
      const beaker = D.beaker(300, 400, 160, 180, 'rgba(160, 205, 235, 0.45)').setLevel(0.8);
      const therm = D.thermometer(250, 200, 180, 0, 80);
      const cube = s('rect', { fill: '#ffffff', stroke: '#9aa5b1', rx: 2 });
      const watch = D.display(540, 160, 110, 'Stopwatch');
      svg.append(beaker.g, cube, therm.g, watch.g);
      return {
        update() {
          therm.set(st.temp);
          const size = 26 * st.cube;
          cube.setAttribute('x', 320 - size / 2);
          cube.setAttribute('y', 394 - size);
          cube.setAttribute('width', size);
          cube.setAttribute('height', size);
          watch.set(`${Math.round(st.seconds)} s`);
        },
      };
    },
    measureTitle: 'Time how long each cube takes to dissolve',
    measureText: 'Use water at each temperature. Drop in one sugar cube without stirring and time how long it takes to disappear completely.',
    measureWhy: 'Temperature is the variable you change. Use the same volume of water, the same size of sugar cube and never stir, so the test is fair.',
    measureTask: 'drop in the cube and time it',
    measureButton: (v) => `Use water at ${v} °C`,
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.temp;
      st.seconds = 0;
      st.cube = 1;
      await tween(600, (t) => {
        st.temp = lerp(from, v, t);
        api.draw();
      });
      const end = time(v);
      await tween(900 + end * 2, (t, raw) => {
        st.seconds = end * raw;
        st.cube = 1 - raw;
        api.draw();
      });
      st.seconds = end;
      st.cube = 0;
      api.draw();
      return end;
    },
    iv: { label: 'Water temperature', unit: '°C', values: [20, 30, 40, 50, 60, 70] },
    dv: { label: 'Time to dissolve', unit: 's', dp: 0, tol: 0, placeholder: 'e.g. 240', readHint: 'Copy the time on the stopwatch, in seconds.' },
    graph: { title: 'Time for a sugar cube to dissolve against water temperature', xLabel: 'Water temperature / °C', yLabel: 'Time to dissolve / s', xDomain: [10, 80], yDomain: [0, 500], xStep: 10, yStep: 100 },
    pattern: {
      q: 'What do your results show?',
      o: ['The hotter the water, the faster the sugar dissolved', 'The colder the water, the faster the sugar dissolved', 'Temperature made no difference'],
      hint: 'A shorter time means faster dissolving.',
      right: 'Yes. In hotter water the water particles move faster and hit the sugar more often and harder, so it breaks up and spreads out faster.',
      why: 'Crushing the sugar (more surface area) and stirring also make it dissolve faster.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Sugar dissolved faster in hotter water, because the particles move faster. Smaller pieces and stirring also make sugar dissolve faster.',
      rows: [['At 20 °C', `${rows[0].mean} s`], ['At 70 °C', `${rows[rows.length - 1].mean} s`]],
    }),
  });
})();
