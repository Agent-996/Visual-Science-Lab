/* Root hairs on germinating seeds (Grade 6, Stage 7: 7Bs.03). */
(function () {
  'use strict';
  const SEEN = ['A root covered in fine, fuzzy hairs', 'Many long, thin hairs sticking out from the root', 'One cell with a long, thin extension and a nucleus'];
  const SAMPLES = [
    { name: 'Low power (×40)', slide: 'roots', mag: 40, zoom: 0.5, seen: 0 },
    { name: 'Medium power (×100)', slide: 'roots', mag: 100, zoom: 1.1, seen: 1 },
    { name: 'High power (×400): one root hair cell', short: 'High power (×400)', slide: 'roothair', mag: 400, zoom: 0.7, seen: 2 },
  ];
  Observation.run({
    id: 'g6-roothairs',
    guide: '../practical.html#g6-roothairs',
    objectives: ['I can grow seedlings and observe their root hairs.', 'I can explain how root hairs help a plant take in water.'],
    benchLabel: 'The view down a light microscope of the root of a germinating seed, at low, medium and high power.',
    picture: (x, s) => Microscope.view(s, x.slide, x.mag, { zoom: x.zoom }),
    setup: [{
      title: 'Grow the seedlings',
      text: 'Put cress or radish seeds on damp paper in a covered dish. After 3–4 days, lay a seedling on a slide in a drop of water.',
      why: 'Germinating seeds grow lots of root hairs quickly, and they are thin enough to see through.',
      button: 'Put a seedling on a slide',
      done: 'The seedling is on the slide. Start with the lowest power.',
      async run() {},
    }],
    tests: {
      label: 'Magnification',
      title: 'Look at the root',
      text: 'Look at the root on low power, then medium and high power.',
      why: 'Each root hair is a single cell, so you need high power to see one clearly.',
      task: 'look down the microscope',
      button: (x) => `Look at ${(x.short || x.name).toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short || x.name}: what can you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the edges of the root.',
      }],
    },
    questions: [{
      q: 'How do root hairs help the plant?',
      o: ['They give a very large surface area for taking in water and minerals from the soil', 'They hold the seed on the paper', 'They make food by photosynthesis'],
      hint: 'Why would a plant need lots of thin hairs touching the soil?',
      right: 'Yes. Thousands of root hairs give a huge surface for water and minerals to enter.',
    }, {
      q: 'Why do root hair cells have no chloroplasts?',
      o: ['They are underground, where there is no light', 'They are too small', 'They have been stained'],
      hint: 'What do chloroplasts need?',
      right: 'Yes. Chloroplasts are only useful where light reaches the cells.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The root was covered in fine root hairs. Each root hair is one cell with a long, thin extension, which gives a large surface area for taking in water and minerals.',
      rows: [['×40', 'fuzzy root'], ['×400', 'one root hair cell']],
    }),
  });
})();
