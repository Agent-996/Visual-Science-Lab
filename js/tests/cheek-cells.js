/* Cheek cells stained with methylene blue (Grade 6, Stage 7: 7Bs.01, 7Bs.04, 7TWSp.05). */
(function () {
  'use strict';
  const SEEN = ['Lots of tiny blue specks', 'Separate, irregular blue cells, each with a dark dot', 'A few large, flat cells: the membrane, cytoplasm and a dark nucleus'];
  const SAMPLES = [
    { name: 'Low power (×40)', mag: 40, seen: 0 },
    { name: 'Medium power (×100)', mag: 100, seen: 1 },
    { name: 'High power (×400)', mag: 400, seen: 2 },
  ];
  Observation.run({
    id: 'g6-cheek',
    guide: '../practical.html#g6-cheek',
    objectives: ['I can prepare a slide of my own cheek cells safely.', 'I can identify the nucleus, cytoplasm and cell membrane in animal cells.'],
    benchLabel: 'The view down a light microscope of cheek cells stained with methylene blue, at low, medium and high power.',
    picture: (x, s) => Microscope.view(s, 'cheek', x.mag),
    setup: [{
      title: 'Prepare the slide',
      text: 'Gently rub the inside of your own cheek with a clean cotton bud. Smear it on a slide, add a drop of methylene blue and lower a coverslip. Put the used cotton bud straight into disinfectant.',
      why: 'Only use your own cells, and disinfect everything, so that no germs are passed on. The stain makes the see-through cells show up.',
      button: 'Prepare the slide',
      done: 'The slide is ready. Start with the lowest power.',
      async run() {},
    }],
    tests: {
      label: 'Magnification',
      title: 'Look at the slide',
      text: 'Focus on low power first, then turn to medium and high power, refocusing each time.',
      why: 'Cheek cells are thin and spread out, so it is easiest to find them on low power first.',
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
        hint: () => 'Look at the size of the cells and for the dark dots.',
      }],
    },
    questions: [{
      q: 'Which parts do onion cells have that cheek cells do not?',
      o: ['A cell wall (and, in leaf cells, chloroplasts and a large vacuole)', 'A nucleus', 'Cytoplasm'],
      hint: 'Compare the outline of cheek cells with the neat walls of onion cells.',
      right: 'Yes. Animal cells have a membrane but no cell wall, which is why cheek cells have irregular shapes.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Cheek cells are flat with irregular shapes. Each has a cell membrane, cytoplasm and a nucleus stained dark blue. Unlike plant cells, they have no cell wall.',
      rows: [['Parts seen', 'membrane, cytoplasm, nucleus'], ['Missing', 'cell wall, chloroplasts']],
    }),
  });
})();
