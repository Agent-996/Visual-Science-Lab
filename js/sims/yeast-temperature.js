/* Yeast activity at different temperatures (Grade 6, Stage 7: 7Be.01, 7TWSc.04, 7TWSa.02). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, clamp, tween, gauss } = K;

  // Bubbles of carbon dioxide per minute. Fastest near 35–40 °C; above about 42 °C the yeast is damaged.
  function bubbles(T) {
    let r = 30 * Math.exp(-Math.pow((T - 37) / 11, 2));
    if (T > 42) r *= Math.exp(-(T - 42) / 4);
    return Math.max(0, Math.round(r + gauss() * 1.2));
  }
  const bathColour = (T) => `rgba(${Math.round(lerp(150, 255, T / 55))}, ${Math.round(lerp(200, 170, T / 55))}, ${Math.round(lerp(240, 140, T / 55))}, 0.5)`;

  Investigation.run({
    id: 'g6-yeasttemp',
    guide: '../practical.html#g6-yeasttemp',
    objectives: ['I can measure how temperature affects yeast activity.', 'I can present the results as a line graph and describe the pattern.'],
    benchLabel: 'Lab bench: a water bath with a thermometer, a boiling tube of yeast and sugar solution, a delivery tube into a beaker of water, and a bubble counter.',
    state: { temp: 20, count: 0, yeast: false, bubbles: [] },
    scene(svg, D, st) {
      D.bench(svg, 440, [[200, 'Water bath with', 'yeast and sugar'], [430, 'Beaker of water', '(bubbles collect here)'], [610, 'Counter and timer']]);
      const bath = D.beaker(200, 400, 170, 140, bathColour(20)).setLevel(0.75);
      const therm = D.thermometer(150, 220, 160, 0, 60);
      const yeastFill = s('path', { d: 'M226,300 L226,366 A12,12 0 0 0 250,366 L250,300 Z', fill: '#e8d6a8', opacity: 0 });
      const tube = s('g', null, yeastFill, s('path', { d: 'M225,240 L225,366 A13,13 0 0 0 251,366 L251,240', ...D.GLASS, fill: 'none' }), s('rect', { x: 222, y: 234, width: 32, height: 10, rx: 2, fill: '#444' }),
        s('path', { d: 'M238,234 L238,200 L420,200 L420,370', fill: 'none', stroke: '#9fb4c2', 'stroke-width': 4, 'stroke-linejoin': 'round' }));
      const collect = D.beaker(430, 400, 80, 110, 'rgba(196, 223, 240, 0.7)').setLevel(0.85);
      const bubbleLayer = s('g', null);
      const counter = D.display(545, 250, 130, 'Bubbles counted');
      const timer = D.display(545, 320, 130, 'Timer');
      svg.append(bath.g, therm.g, tube, collect.g, bubbleLayer, counter.g, timer.g);
      return {
        update() {
          bath.setColour(bathColour(st.temp));
          therm.set(st.temp);
          yeastFill.setAttribute('opacity', st.yeast ? 1 : 0);
          counter.set(String(st.count));
          timer.set(`${Math.round(st.seconds || 0)} s`);
          bubbleLayer.replaceChildren(...st.bubbles.map((b) => s('circle', { cx: 420 + b.dx, cy: lerp(372, 312, b.t), r: 3, fill: 'rgba(255,255,255,0.9)', stroke: '#7f97a8', 'stroke-width': 0.8 })));
        },
      };
    },
    setup: [{
      title: 'Set up the yeast',
      text: 'Mix yeast with warm sugar solution in a boiling tube. Fit a bung and delivery tube so the gas bubbles out into a beaker of water.',
      why: 'Yeast respires using the sugar and makes carbon dioxide. Counting the bubbles of gas shows how fast the yeast is respiring.',
      button: 'Mix the yeast and sugar',
      done: 'The yeast mixture is ready. Each bubble is carbon dioxide made by respiring yeast.',
      async run(api) {
        api.st.yeast = true;
        api.draw();
      },
    }],
    measureTitle: 'Count the bubbles at each temperature',
    measureText: 'Set the water bath to each temperature, give the yeast a few minutes to warm up, then count the bubbles in 1 minute.',
    measureWhy: 'Temperature is the variable you change. Keep everything else the same: the amount of yeast, the amount and concentration of sugar, and the counting time.',
    measureTask: 'set the water bath and count the bubbles for 1 minute',
    measureButton: (v) => `Set to ${v} °C and count for 1 minute`,
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.temp;
      await tween(800, (t) => {
        st.temp = lerp(from, v, t);
        api.draw();
      });
      const n = bubbles(v);
      st.count = 0;
      st.bubbles = [];
      let made = 0;
      await tween(2600, (t) => {
        st.seconds = 60 * t;
        while (made < n && made < n * t + 0.001) {
          st.bubbles.push({ t: 0, dx: (Math.random() - 0.5) * 8 });
          made += 1;
        }
        for (const b of st.bubbles) b.t += 0.06;
        st.bubbles = st.bubbles.filter((b) => b.t < 1);
        st.count = made;
        api.draw();
      });
      st.bubbles = [];
      st.count = n;
      st.seconds = 60;
      api.draw();
      return n;
    },
    iv: { label: 'Temperature', unit: '°C', values: [10, 20, 30, 35, 40, 45, 50] },
    dv: { label: 'Bubbles in 1 minute', unit: '', dp: 0, tol: 0, placeholder: 'e.g. 12', readHint: 'Copy the number shown on the bubble counter.' },
    graph: { title: 'Yeast activity against temperature', xLabel: 'Temperature / °C', yLabel: 'Bubbles in 1 minute', xDomain: [0, 60], yDomain: [0, 35], yStep: 5 },
    pattern: {
      q: 'How does temperature affect how active the yeast is?',
      o: ['Activity increases up to about 35–40 °C, then falls quickly', 'Activity keeps increasing as the temperature rises', 'Temperature makes no difference'],
      hint: 'Look at where your graph is highest, and what happens at the hottest temperatures.',
      right: 'Yes. Yeast works fastest when warm, but above about 45 °C the high temperature damages it.',
      why: 'Yeast is a living microorganism. Its reactions speed up with warmth, but too much heat damages the yeast cells.',
    },
    extra: [{
      title: 'Find the best temperature',
      text: 'From your results, at what temperature was the yeast most active?',
      why: 'The temperature where something works fastest is called the optimum temperature.',
      label: 'Temperature where the yeast was most active',
      short: 'Most active at',
      unit: '°C',
      dp: 0,
      placeholder: 'e.g. 35',
      expected: (rows) => rows.reduce((a, b) => (b.mean > a.mean ? b : a)).x,
      tol: 5.1,
      hint: 'Find the highest point on your graph and read the temperature below it.',
      msg: (v) => `The yeast was most active at about ${Math.round(v)} °C.`,
    }],
    summary: (rows) => {
      const best = rows.reduce((a, b) => (b.mean > a.mean ? b : a));
      return {
        title: 'Practical complete',
        summary: 'Yeast respired fastest when it was warm, around 35–40 °C. It was slow in the cold, and above about 45 °C the heat damaged it. This is why bread dough is left to rise somewhere warm, but not hot.',
        rows: [['Most bubbles', `${best.mean} at ${best.x} °C`], ['At 10 °C', `${rows[0].mean} bubbles`], ['At 50 °C', `${rows[rows.length - 1].mean} bubbles`]],
      };
    },
  });
})();
