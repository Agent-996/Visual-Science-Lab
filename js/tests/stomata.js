/* Stomata and guard cells: nail varnish leaf peel (Grade 6, Stage 7: 7Bs.03, 7Bs.05). */
(function () {
  'use strict';
  const SEEN = ['Many stomata: pairs of bean-shaped guard cells', 'Very few or no stomata', 'One gap between two bean-shaped guard cells'];
  const SAMPLES = [
    { name: 'Peel from the lower surface (×100)', short: 'Lower surface', slide: 'stomata', mag: 100, seen: 0 },
    { name: 'Peel from the upper surface (×100)', short: 'Upper surface', slide: 'stomata-upper', mag: 100, seen: 1 },
    { name: 'One stoma close up (×400)', short: 'One stoma', slide: 'stomata', mag: 400, seen: 2 },
  ];
  Observation.run({
    id: 'g6-stomata',
    guide: '../practical.html#g6-stomata',
    objectives: ['I can make a nail-varnish impression of a leaf surface.', 'I can identify stomata and guard cells and say what they do.'],
    benchLabel: 'The view down a light microscope of nail-varnish peels from the lower and upper surfaces of a leaf.',
    picture: (x, s) => Microscope.view(s, x.slide, x.mag, x.mag === 400 ? { zoom: 3.2 } : {}),
    setup: [{
      title: 'Make the leaf peels',
      text: 'Paint a thin patch of clear nail varnish on the lower and upper surfaces of a leaf. When it is dry, press clear sticky tape on it, peel it off and stick it to a slide.',
      why: 'The dried varnish keeps an exact print of the leaf surface, including the tiny pores.',
      button: 'Make the peels',
      done: 'Both peels are on slides.',
      async run() {},
    }],
    tests: {
      label: 'Peel',
      title: 'Compare the two surfaces',
      text: 'Look at the peel from the lower surface, then the upper surface, then zoom in on one stoma.',
      why: 'Comparing the surfaces shows where most gas exchange happens.',
      task: 'look down the microscope',
      button: (x) => `Look at: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what can you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Stomata are small gaps between two bean-shaped guard cells.',
      }],
    },
    questions: [{
      q: 'Why are most stomata on the lower surface of a leaf?',
      o: ['It is shaded and cooler there, so less water evaporates', 'The top of the leaf has no cells', 'Rain would block them'],
      hint: 'Which surface faces the Sun?',
      right: 'Yes. Having most stomata underneath helps the plant lose less water.',
    }, {
      q: 'What do guard cells do?',
      o: ['They open and close the stoma to let gases in and out and control water loss', 'They make food', 'They carry water to the roots'],
      hint: 'They are on either side of each gap.',
      right: 'Yes. Carbon dioxide gets in and oxygen and water vapour get out through the stomata.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The lower surface had many stomata; the upper surface had very few. Each stoma is a gap between two guard cells, which open and close it to control gas exchange and water loss.',
      rows: [['Lower surface', 'many stomata'], ['Upper surface', 'very few stomata']],
    }),
  });
})();
