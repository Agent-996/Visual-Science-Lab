/* Specialised cells on prepared slides (Grade 6, Stage 7: 7Bs.03). */
(function () {
  'use strict';
  const NAMES = ['Red blood cell', 'Nerve cell (neurone)', 'Root hair cell', 'Ciliated cell', 'Palisade cell'];
  const JOBS = [
    'No nucleus and a dented disc shape, so it can carry lots of oxygen',
    'Very long, to carry messages around the body',
    'A long, thin extension that gives a big surface to take in water',
    'Tiny hairs (cilia) that sweep mucus along the airways',
    'Packed with chloroplasts for photosynthesis',
  ];
  const SAMPLES = [
    { name: 'Slide 1', slide: 'rbc', mag: 400, zoom: 1.4, k: 0 },
    { name: 'Slide 2', slide: 'nerve', mag: 100, zoom: 0.9, k: 1 },
    { name: 'Slide 3', slide: 'roothair', mag: 100, zoom: 0.7, k: 2 },
    { name: 'Slide 4', slide: 'ciliated', mag: 400, zoom: 1.1, k: 3 },
    { name: 'Slide 5', slide: 'palisade', mag: 400, zoom: 1.5, k: 4 },
  ];
  Observation.run({
    id: 'g6-specialised',
    guide: '../practical.html#g6-specialised',
    objectives: ['I can identify specialised cells: root hair, palisade, red blood cell, neurone and ciliated cell.', 'I can explain how the shape of a cell helps it do its job.'],
    benchLabel: 'The view down a light microscope of five prepared slides, each showing a different specialised cell.',
    picture: (x, s) => Microscope.view(s, x.slide, x.mag, { zoom: x.zoom }),
    tests: {
      label: 'Slide',
      title: 'Look at each prepared slide',
      text: 'Look at each slide. Name the specialised cell and say how its shape helps it do its job.',
      why: 'Specialised cells have special features that make them good at one particular job.',
      task: 'look at the slide',
      button: (x) => `Look at ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Cell',
        q: (x) => `${x.name}: which specialised cell is this?`,
        task: 'name the cell',
        options: NAMES,
        answer: (x) => NAMES[x.k],
        hint: () => 'Look for: pink discs, a very long thin cell, a long finger-like extension, tiny hairs, or columns full of green dots.',
      }, {
        label: 'How it is adapted',
        q: (x) => `How is the ${NAMES[x.k].toLowerCase()} adapted to its job?`,
        task: 'choose how it is adapted',
        options: JOBS,
        answer: (x) => JOBS[x.k],
        hint: () => 'Think about what the cell does in the body or the plant.',
      }],
    },
    questions: [{
      q: 'Why are specialised cells different shapes?',
      o: ['Each shape helps the cell do its particular job', 'Cells are different shapes by chance', 'They grew in different places'],
      hint: 'Look at your "how it is adapted" column.',
      right: 'Yes. A cell’s shape and parts are suited to its job: its structure matches its function.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Each specialised cell has a shape that suits its job: red blood cells carry oxygen, nerve cells carry messages, root hair cells take in water, ciliated cells sweep mucus and palisade cells photosynthesise.',
      rows: rows.map((r) => [r.name, r.cells[0]]),
    }),
  });
})();
