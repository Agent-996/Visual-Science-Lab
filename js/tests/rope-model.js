/* Rope model of current (Grade 6, Stage 7: 7Pe.01, 7TWSm.01). */
(function () {
  'use strict';
  const PARTS = ['Electrons (the current)', 'The cell', 'The lamp', 'The wires'];
  const SAMPLES = [
    { name: 'The rope moving round', short: 'Moving rope', a: PARTS[0] },
    { name: 'The person pulling the rope round', short: 'Person pulling', a: PARTS[1] },
    { name: 'The person gripping the rope, whose hands get warm', short: 'Person gripping', a: PARTS[2] },
    { name: 'The path the rope follows round the circle', short: 'Path of the rope', a: PARTS[3] },
  ];
  Observation.run({
    id: 'g6-electronmodel',
    guide: '../practical.html#g6-electronmodel',
    objectives: ['I can use a rope loop to model current as a flow of electrons.', 'I can describe the limitations of the model.'],
    benchLabel: 'A card describing one part of the rope model at a time, and four trays: electrons, the cell, the lamp and the wires.',
    tests: {
      label: 'Part of the model',
      title: 'Match the model to the circuit',
      text: 'Everyone stands in a circle holding a loop of rope loosely. One person pulls it round; another grips it gently. Decide what each part of the model represents.',
      why: 'Matching each part of a model to the real thing helps you see what the model explains, and what it does not.',
      task: 'think about this part of the model',
      button: (x) => `Look at: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      columns: [{
        label: 'Represents',
        q: (x) => `${x.name}: what does this represent in a circuit?`,
        task: 'match it to the circuit',
        options: PARTS,
        answer: (x) => x.a,
        hint: () => 'The cell pushes the current round. A lamp turns electrical energy into heat (and light).',
      }],
    },
    questions: [{
      q: 'When the cell starts pulling, the whole rope moves at once. What does this show about current?',
      o: ['Current flows everywhere in the circuit at the same time', 'Current starts at the cell and slowly travels round', 'Current is used up by the lamp'],
      hint: 'Did any part of the rope wait before moving?',
      right: 'Yes. Electrons all round the circuit start moving at once, so a lamp lights as soon as you switch on.',
    }, {
      q: 'What is one limitation of the rope model?',
      o: ['Electrons are separate particles, not joined like a rope, and a real lamp also gives out light', 'It shows the current moving', 'It shows the lamp getting warm'],
      hint: 'What is different about real electrons and a real lamp?',
      right: 'Yes. Every model is simpler than the real thing.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The moving rope models electrons flowing round a circuit: the whole rope moves at once, just as current flows everywhere at the same time. Electrons are not really joined, and lamps also give out light.',
      rows: rows.map((r) => [r.sample.short, r.cells[0]]),
    }),
  });
})();
