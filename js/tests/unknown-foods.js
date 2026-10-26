/* Identifying unknown foods (Grade 7, Stage 8: 8Bp.01, 8TWSa.03). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;

  // Each test: the reagent's colour, and its colour when the nutrient is there.
  const TESTS = [
    { key: 'starch', reagent: 'Iodine', before: 'rgba(196, 120, 40, 0.75)', after: 'rgba(25, 20, 60, 0.92)', yes: 'Yes: blue-black', no: 'No: stays orange-brown' },
    { key: 'glucose', reagent: 'Benedict’s', before: 'rgba(40, 110, 220, 0.7)', after: 'rgba(200, 70, 30, 0.9)', yes: 'Yes: brick red', no: 'No: stays blue' },
    { key: 'protein', reagent: 'Biuret', before: 'rgba(60, 120, 220, 0.6)', after: 'rgba(130, 60, 170, 0.8)', yes: 'Yes: purple', no: 'No: stays blue' },
    { key: 'fat', reagent: 'Ethanol + water', before: 'rgba(225, 236, 244, 0.5)', after: 'rgba(250, 250, 250, 0.95)', yes: 'Yes: cloudy white', no: 'No: stays clear' },
  ];
  const FOODS = ['Bread', 'Egg white', 'Apple juice', 'Whole milk', 'Butter'];
  const SAMPLES = [
    { name: 'Sample A', food: 'Whole milk', has: { starch: false, glucose: true, protein: true, fat: true } },
    { name: 'Sample B', food: 'Bread', has: { starch: true, glucose: false, protein: false, fat: false } },
    { name: 'Sample C', food: 'Egg white', has: { starch: false, glucose: false, protein: true, fat: false } },
    { name: 'Sample D', food: 'Apple juice', has: { starch: false, glucose: true, protein: false, fat: false } },
  ];
  const tubeX = (i) => 170 + i * 120;

  Observation.run({
    id: 'g7-unknownfoods',
    guide: '../practical.html#g7-unknownfoods',
    objectives: ['I can use food test results to identify unknown foods.', 'I can explain my conclusion using evidence.'],
    benchLabel: 'Four test tubes in a rack for the starch, glucose, protein and fat tests, with a hot water bath for the Benedict’s test.',
    state: { sample: null, mixed: TESTS.map(() => 0), heated: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[360, 'Food tests on one sample at a time'], [650, 'Possible foods']]);
      const bath = s('g', null,
        s('rect', { x: tubeX(1) - 44, y: 250, width: 88, height: 140, rx: 6, fill: 'rgba(160, 205, 235, 0.35)', stroke: '#7f97a8', 'stroke-width': 2 }),
        s('text', { x: tubeX(1), y: 404, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 600, fill: '#33404d' }, 'water bath 80 °C'));
      const steam = s('g', null, ...[-20, 0, 20].map((dx) => s('path', { d: `M${tubeX(1) + dx},244 q6,-10 0,-20 q-6,-10 0,-20`, fill: 'none', stroke: '#9fb4c2', 'stroke-width': 2 })));
      const tubes = TESTS.map((x, i) => D.tube(tubeX(i), 380, 36, 170, x.before).setLevel(0.35));
      const labels = TESTS.map((x, i) => s('text', { x: tubeX(i), y: 186, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#33404d' }, x.reagent));
      const title = s('text', { x: 360, y: 60, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#33404d' }, '');
      const list = s('g', null,
        s('rect', { x: 600, y: 120, width: 104, height: 140, rx: 8, fill: '#ffffff', stroke: '#c9d1d9' }),
        ...FOODS.map((f, i) => s('text', { x: 612, y: 148 + i * 24, 'font-size': 13, fill: '#33404d' }, f)));
      svg.append(bath, ...tubes.map((t) => t.g), ...labels, steam, title, list);
      return {
        update() {
          title.textContent = st.sample ? `Testing ${st.sample.name}` : '';
          TESTS.forEach((x, i) => {
            const on = st.sample && st.sample.has[x.key];
            const t = st.mixed[i] * (i === 1 ? st.heated : 1);
            tubes[i].setColour(on && t > 0 ? mixColour(x.before, x.after, t) : x.before).setLevel(0.35 + 0.15 * st.mixed[i]);
          });
          steam.setAttribute('opacity', st.heated > 0 && st.heated < 1 ? 0.8 : 0);
        },
      };
    },
    tests: {
      label: 'Sample',
      title: 'Test each unknown food',
      text: 'Add a little of the food to each test tube. Heat the Benedict’s tube in the water bath. Decide whether each nutrient is there, then identify the food.',
      why: 'Each reagent changes colour only when one particular nutrient is present, so the pattern of results is like a fingerprint for the food.',
      task: 'do all four food tests',
      button: (x) => `Test ${x.name}`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        st.sample = x;
        st.mixed = TESTS.map(() => 0);
        st.heated = 0;
        api.draw();
        await tween(900, (t) => {
          st.mixed = TESTS.map(() => t);
          api.draw();
        });
        await tween(1200, (t) => {
          st.heated = t;
          api.draw();
        });
      },
      columns: [
        ...TESTS.map((x) => ({
          label: { starch: 'Starch', glucose: 'Glucose', protein: 'Protein', fat: 'Fat' }[x.key],
          q: (smp) => `${smp.name}, ${x.reagent} test: is ${x.key} there?`,
          task: `record the ${x.reagent} test`,
          options: [x.yes, x.no],
          short: (v) => v.split(':')[0],
          answer: (smp) => (smp.has[x.key] ? x.yes : x.no),
          hint: () => `Look at the ${x.reagent} tube. Has it changed colour? (${x.yes.split(': ')[1]} means yes.)`,
        })),
        {
          label: 'Food',
          q: (smp) => `Which food is ${smp.name}?`,
          task: 'identify the food',
          options: FOODS,
          answer: (smp) => smp.food,
          hint: () => 'Bread is mostly starch, egg white is protein, apple juice has sugar (glucose), butter is fat, and whole milk has sugar, protein and fat.',
          right: (smp) => `Yes. ${smp.name} is ${smp.food.toLowerCase()}.`,
        },
      ],
    },
    questions: [{
      q: 'Why does the Benedict’s test need a hot water bath?',
      o: ['Benedict’s solution only changes colour with glucose when it is heated', 'To cool the food down', 'To kill any bacteria in the food'],
      hint: 'Which tube went into the water bath, and when did it change colour?',
      right: 'Yes. Benedict’s solution must be heated to about 80 °C before it changes from blue to brick red when glucose is there.',
      why: 'Use a water bath, not a flame, because the ethanol for the fat test is flammable.',
    }, {
      title: 'Use your evidence',
      text: 'Use the pattern of results to explain a conclusion.',
      q: 'Which evidence shows that Sample A could be whole milk and not egg white?',
      o: ['It also tested positive for glucose and fat, not just protein', 'It tested positive for starch', 'It did not change any of the reagents'],
      hint: 'Egg white only contains protein. What else did Sample A contain?',
      right: 'Yes. Both contain protein, but only milk also contains sugar and fat, so the full pattern of results points to milk.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Matching the pattern of positive and negative tests identified each food: iodine for starch, Benedict’s for glucose, biuret for protein and the ethanol test for fat.',
      rows: rows.map((r) => [r.name, r.cells[r.cells.length - 1]]),
    }),
  });

  function mixColour(a, b, t) {
    const pa = a.match(/[\d.]+/g).map(Number);
    const pb = b.match(/[\d.]+/g).map(Number);
    return `rgba(${pa.map((v, k) => (k < 3 ? Math.round(v + (pb[k] - v) * t) : (v + (pb[k] - v) * t).toFixed(2))).join(', ')})`;
  }
})();
