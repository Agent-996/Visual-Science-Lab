/* Onion cells stained with iodine (Grade 6, Stage 7: 7Bs.02, 7Bs.04, 7TWSa.05). */
(function () {
  'use strict';
  const SEEN = ['Lots of tiny box-shaped cells in rows', 'Brick-shaped cells, each with a dark dot', 'Part of one big cell: its wall and a dark nucleus'];
  const SAMPLES = [
    { name: 'Low power (×40)', mag: 40, seen: 0, across: 'About 8' },
    { name: 'Medium power (×100)', mag: 100, seen: 1, across: 'About 3' },
    { name: 'High power (×400)', mag: 400, seen: 2, across: 'Less than 1' },
  ];
  Observation.run({
    id: 'g6-onion',
    guide: '../practical.html#g6-onion',
    objectives: ['I can make a slide of onion epidermis and stain it with iodine.', 'I can identify the cell wall, nucleus and cytoplasm in plant cells.'],
    benchLabel: 'The view down a light microscope of onion skin stained with iodine, at low, medium and high power.',
    picture: (x, s) => Microscope.view(s, 'onion', x.mag),
    setup: [{
      title: 'Prepare the slide',
      text: 'Peel a thin layer of skin from the inside of an onion. Lay it flat on a slide, add a drop of iodine and lower a coverslip at an angle.',
      why: 'A thin layer lets light through. Iodine stains the cells so their parts show up. Lowering the coverslip at an angle stops air bubbles.',
      button: 'Prepare the slide',
      done: 'The slide is ready. Put it on the stage and start with the lowest power.',
      async run() {},
    }],
    tests: {
      label: 'Magnification',
      title: 'Look at the slide',
      text: 'Focus on low power first, then turn to medium and high power, refocusing with the fine focus knob each time.',
      why: 'Starting on low power makes it easier to find the cells and focus on them.',
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
        hint: () => 'Look at the shape and size of the cells, and for dark dots.',
      }, {
        label: 'Cells across the view',
        q: (x) => `${x.name}: about how many cells fit across the field of view?`,
        task: 'estimate the number of cells',
        options: ['About 8', 'About 3', 'Less than 1'],
        answer: (x) => x.across,
        hint: () => 'Count the cells along a line through the middle of the circle.',
      }],
    },
    questions: [{
      q: 'What is the dark dot inside each onion cell?',
      o: ['The nucleus', 'A chloroplast', 'An air bubble'],
      hint: 'Which part of a cell controls it?',
      right: 'Yes. The nucleus controls the cell. Iodine stains it darker than the cytoplasm.',
    }, {
      q: 'Why do onion cells have no chloroplasts?',
      o: ['The onion grows underground, where there is no light for photosynthesis', 'They have been stained away', 'Onions are not plants'],
      hint: 'What do chloroplasts need to work?',
      right: 'Yes. Only plant cells that get light, like leaf cells, have chloroplasts.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Onion cells are brick-shaped and fit together in rows. At high power you can see the cell wall, the cytoplasm and a dark, stained nucleus. There are no chloroplasts.',
      rows: [['×40', 'about 8 cells across'], ['×100', 'about 3 cells across'], ['×400', 'part of one cell']],
    }),
  });
})();
