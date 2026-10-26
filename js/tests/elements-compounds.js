/* Modelling elements, compounds and mixtures (Grade 6, Stage 7: 7Cm.01, 7Cm.04, 7Cm.07). */
(function () {
  'use strict';
  const R = '#d64545';
  const B = '#3b6fb6';
  const G = '#9aa5b1';
  // Each model is a list of particles; each particle is a list of [dx, dy, colour] atoms.
  const atom = (c) => [[0, 0, c]];
  const pair = (a, b) => [[-7, 0, a], [7, 0, b]];
  const tri = (mid, side) => [[0, 0, mid], [-12, 7, side], [12, 7, side]];
  const SAMPLES = [
    { name: 'Model A', detail: 'Single red atoms, all the same.', parts: Array(8).fill(atom(R)), a: 'Element' },
    { name: 'Model B', detail: 'Pairs of red atoms joined together.', parts: Array(6).fill(pair(R, R)), a: 'Element' },
    { name: 'Model C', detail: 'Each particle is a red atom joined to a blue atom.', parts: Array(6).fill(pair(R, B)), a: 'Compound' },
    { name: 'Model D', detail: 'Red atoms and blue atoms, not joined.', parts: [atom(R), atom(B), atom(R), atom(B), atom(B), atom(R), atom(R), atom(B)], a: 'Mixture' },
    { name: 'Model E', detail: 'A blue atom joined to two red atoms, all the same.', parts: Array(6).fill(tri(B, R)), a: 'Compound' },
    { name: 'Model F', detail: 'Red–blue particles with single grey atoms between them.', parts: [pair(R, B), atom(G), pair(R, B), atom(G), pair(R, B), atom(G), pair(R, B), atom(G)], a: 'Mixture' },
  ];
  Observation.run({
    id: 'g6-elements-model',
    guide: '../practical.html#g6-elements-model',
    objectives: ['I can model atoms, elements, compounds and mixtures with coloured blocks.', 'I can explain the difference between a compound and a mixture.'],
    benchLabel: 'A card showing a particle model made of coloured atoms, and three trays: element, compound and mixture.',
    picture: (x, s) => s('g', null,
      s('rect', { x: -120, y: -48, width: 240, height: 96, rx: 8, fill: '#f6f8f9', stroke: '#c9d1d9' }),
      ...x.parts.map((p, i) => s('g', { transform: `translate(${-90 + (i % 4) * 60} ${-22 + Math.floor(i / 4) * 44})` },
        ...p.map(([dx, dy, c]) => s('circle', { cx: dx, cy: dy, r: 8, fill: c, stroke: '#2b333b', 'stroke-width': 1 }))))),
    tests: {
      label: 'Model',
      title: 'Identify each model',
      text: 'Each colour stands for one type of atom. Atoms touching each other are joined. Decide whether each model shows an element, a compound or a mixture.',
      why: 'Building and naming models helps you picture what is happening to the atoms, which are far too small to see.',
      task: 'look at the model',
      button: (x) => `Look at ${x.name}`,
      samples: SAMPLES,
      columns: [{
        label: 'Element, compound or mixture?',
        q: (x) => `Does ${x.name} show an element, a compound or a mixture?`,
        task: 'identify the model',
        options: ['Element', 'Compound', 'Mixture'],
        answer: (x) => x.a,
        hint: () => 'One type of atom only = element. Different atoms joined, every particle the same = compound. Different particles not joined = mixture.',
      }],
    },
    questions: [{
      q: 'What is the difference between a compound and a mixture?',
      o: ['In a compound different atoms are chemically joined; in a mixture the substances are not joined', 'A compound has only one type of atom', 'There is no difference'],
      hint: 'Compare Model C with Model D.',
      right: 'Yes. In a compound the atoms are joined in a fixed way. A mixture is just different substances mixed together.',
    }, {
      q: 'Which can be separated easily, for example with a magnet or by filtering?',
      o: ['A mixture', 'A compound', 'An element'],
      hint: 'Which one has substances that are not joined together?',
      right: 'Yes. The parts of a mixture are not joined, so they can be separated by physical methods. Splitting a compound needs a chemical reaction.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'An element has only one type of atom. In a compound, different atoms are chemically joined. In a mixture, different substances are mixed but not joined.',
      rows: ['Element', 'Compound', 'Mixture'].map((g) => [g, rows.filter((r) => r.cells[0] === g).map((r) => r.name).join(', ')]),
    }),
  });
})();
