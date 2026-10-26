/* Making a red cabbage indicator (Grade 6, Stage 7: 7Cp.03, 7TWSp.03). */
(function () {
  'use strict';
  const COLOURS = { 'Pink-red': '#d6457a', Purple: '#7b3fa0', Blue: '#3b6fd1', Green: '#3f9a52', Yellow: '#d9c43a' };
  const SAMPLES = [
    { name: 'Lemon juice', c: 'Pink-red', t: 'Acid' },
    { name: 'Vinegar', c: 'Pink-red', t: 'Acid' },
    { name: 'Tap water', c: 'Purple', t: 'Neutral' },
    { name: 'Baking soda solution', c: 'Blue', t: 'Alkali' },
    { name: 'Washing soda solution', c: 'Green', t: 'Alkali' },
    { name: 'Dilute sodium hydroxide', c: 'Yellow', t: 'Alkali' },
  ];
  const tube = (s, colour) => s('g', null,
    s('path', { d: 'M-18,-70 L-18,50 A18,18 0 0 0 18,50 L18,-70', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }),
    s('path', { d: 'M-17,-10 L-17,50 A17,17 0 0 0 17,50 L17,-10 Z', fill: colour, opacity: 0.85 }));
  Observation.run({
    id: 'g6-cabbage',
    guide: '../practical.html#g6-cabbage',
    objectives: ['I can make an indicator from red cabbage.', 'I can compare my indicator with universal indicator.'],
    benchLabel: 'A test tube of each household solution with a few drops of purple red cabbage indicator added.',
    picture: (x, s) => tube(s, COLOURS[x.c]),
    tests: {
      label: 'Solution',
      title: 'Test each solution',
      text: 'Soak chopped red cabbage in hot water and sieve it to collect the purple liquid. Add a few drops to each solution and record the colour.',
      why: 'The pigment in red cabbage changes colour in acids and alkalis, so it works as an indicator.',
      task: 'add a few drops of cabbage indicator',
      button: (x) => `Test the ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Colour',
        q: (x) => `What colour does the cabbage indicator turn in the ${x.name.toLowerCase()}?`,
        task: 'record the colour',
        options: Object.keys(COLOURS),
        swatches: COLOURS,
        answer: (x) => x.c,
        hint: () => 'Look at the colour of the liquid in the tube and choose the closest.',
      }, {
        label: 'Acid, neutral or alkali?',
        q: (x) => `So is the ${x.name.toLowerCase()} an acid, neutral or an alkali?`,
        task: 'decide acid, neutral or alkali',
        options: ['Acid', 'Neutral', 'Alkali'],
        answer: (x) => x.t,
        hint: () => 'Cabbage indicator is pink-red in acids, purple when neutral, and blue, green or yellow in alkalis.',
      }],
    },
    questions: [{
      q: 'Why is universal indicator more useful than red cabbage indicator?',
      o: ['It has a colour for every pH number, so it shows how strong an acid or alkali is more precisely', 'It is purple', 'It only works on acids'],
      hint: 'Which indicator gives more different colours?',
      right: 'Yes. Cabbage indicator shows acid, neutral or alkali, but universal indicator gives a more precise pH.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Red cabbage indicator turned pink-red in acids, stayed purple in neutral water, and turned blue, green or yellow in alkalis.',
      rows: rows.map((r) => [r.name, `${r.cells[0].toLowerCase()} (${r.cells[1].toLowerCase()})`]),
    }),
  });
})();
