/* Invasive species simulation (Grade 7, Stage 8: 8Be.03, 8TWSm.02). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const PREY = [40, 46, 52, 56, 41, 28, 19, 14, 12];
  Investigation.run({
    id: 'g7-invasive',
    guide: '../practical.html#g7-invasive',
    objectives: ['I can model how an invasive predator changes a population over time.', 'I can present results as a graph and describe the trend.'],
    benchLabel: 'A tray of green counters for the native prey animals, with red counters for an invasive predator that arrives in year 3, and a counter of how many prey are left.',
    state: { year: 0, prey: PREY[0] },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Tray modelling the habitat'], [590, 'Prey counters left']]);
      const dots = s('g', null);
      const counter = D.display(530, 160, 120, 'Prey left');
      const yearText = s('text', { x: 300, y: 50, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(s('rect', { x: 150, y: 70, width: 300, height: 300, rx: 10, fill: '#e6efd8', stroke: '#9aaa8a' }), dots, counter.g, yearText);
      return {
        update() {
          dots.replaceChildren();
          for (let i = 0; i < st.prey; i++) dots.append(s('circle', { cx: 170 + (i % 13) * 21, cy: 92 + Math.floor(i / 13) * 24, r: 7, fill: '#3f9a52' }));
          if (st.year >= 3) for (let i = 0; i < Math.min(6, st.year - 1); i++) dots.append(s('circle', { cx: 190 + i * 44, cy: 340, r: 10, fill: '#c0392b' }));
          counter.set(String(st.prey));
          yearText.textContent = `Year ${st.year}${st.year >= 3 ? ': predator present' : ''}`;
        },
      };
    },
    measureTitle: 'Run the model year by year',
    measureText: 'Each round of the model is one year. The prey breed each year. In year 3 an invasive predator arrives and eats prey every round. Count the prey left at the end of each year.',
    measureWhy: 'A model lets you see in minutes a change that would take years to happen in a real habitat.',
    measureTask: 'run the year and count the prey left',
    measureButton: (v) => (v === 0 ? 'Count the prey at the start' : `Run year ${v}`),
    async measure(v, rep, api) {
      const { st } = api;
      await tween(500, () => {});
      st.year = v;
      st.prey = PREY[v];
      api.draw();
      return PREY[v];
    },
    iv: { label: 'Year', unit: '', values: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    dv: { label: 'Prey left', unit: '', dp: 0, tol: 0, placeholder: 'e.g. 30', readHint: 'Copy the number on the "prey left" counter.' },
    graph: { title: 'Prey population over time (predator arrives in year 3)', xLabel: 'Time / years', yLabel: 'Number of prey', xDomain: [0, 8], yDomain: [0, 60], xStep: 1, yStep: 10 },
    pattern: {
      q: 'What happened after the invasive predator arrived?',
      o: ['The prey population fell quickly, because the native prey had not adapted to the new predator', 'The prey population kept rising', 'Nothing changed'],
      hint: 'Compare the trend before and after year 3.',
      right: 'Yes. The prey were rising until year 3, then fell sharply. Native prey have no defences against a predator they have never met.',
      why: 'A change like this can affect the whole food web: animals that eat the prey lose their food too.',
    },
    extra: [{
      title: 'How big was the fall?',
      text: 'How many prey were lost between year 3 and year 8?',
      why: 'Calculating the change gives a clear measure of the predator’s effect.',
      label: 'Prey lost between year 3 and year 8',
      short: 'Prey lost (years 3–8)',
      unit: '',
      dp: 0,
      placeholder: 'e.g. 20',
      expected: (rows) => rows[3].mean - rows[8].mean,
      tol: 0,
      hint: 'Take the year 8 number away from the year 3 number.',
      msg: (v) => `${Math.round(v)} prey were lost: most of the population.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The prey population grew until the invasive predator arrived in year 3, then fell quickly, because the native prey had not adapted to it. This can affect the whole food web.',
      rows: [['Year 3', `${rows[3].mean} prey`], ['Year 8', `${rows[8].mean} prey`]],
    }),
  });
})();
