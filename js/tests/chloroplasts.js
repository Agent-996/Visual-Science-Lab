/* Chloroplasts in pondweed or moss (Grade 6, Stage 7: 7Bs.02, 7Bs.04). */
(function () {
  'use strict';
  const SEEN = ['Rows of brick-shaped cells with tiny green dots', 'Large cells packed with many green discs (chloroplasts)', 'Blue, irregular cells with no green parts'];
  const SAMPLES = [
    { name: 'Medium power (×100)', mag: 100, seen: 0 },
    { name: 'High power (×400)', mag: 400, seen: 1 },
  ];
  Observation.run({
    id: 'g6-chloroplasts',
    guide: '../practical.html#g6-chloroplasts',
    objectives: ['I can find chloroplasts in living plant cells.', 'I can explain what chloroplasts do.'],
    benchLabel: 'The view down a light microscope of a living pondweed leaf, at medium and high power.',
    picture: (x, s) => Microscope.view(s, 'elodea', x.mag),
    setup: [{
      title: 'Prepare the slide',
      text: 'Put a single young pondweed leaf in a drop of water on a slide and add a coverslip. No stain is needed.',
      why: 'A pondweed leaf is only two cells thick, so light passes through it and you can see the living cells.',
      button: 'Prepare the slide',
      done: 'The slide is ready.',
      async run() {},
    }],
    tests: {
      label: 'Magnification',
      title: 'Look at the leaf cells',
      text: 'Look at the leaf on medium power, then high power.',
      why: 'Chloroplasts are small, so you need high power to see them clearly.',
      task: 'look down the microscope',
      button: (x) => `Look at ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.name}: what can you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the green parts inside each cell.',
      }],
    },
    questions: [{
      q: 'What do chloroplasts do?',
      o: ['They absorb light to make food by photosynthesis', 'They control the cell', 'They store water'],
      hint: 'Why are leaves green?',
      right: 'Yes. Chloroplasts contain green chlorophyll, which absorbs light for photosynthesis.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The pondweed cells were packed with green chloroplasts. Chloroplasts absorb light and make food for the plant by photosynthesis.',
      rows: [['×400', 'many green chloroplasts in each cell']],
    }),
  });
})();
