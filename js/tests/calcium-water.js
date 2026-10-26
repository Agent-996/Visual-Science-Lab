/* Calcium in water (Grade 7, Stage 8: 8Cc.03, 8Cc.01). */
(function () {
  'use strict';
  const SEEN = ['It fizzes steadily and gives off bubbles', 'The gas makes a squeaky pop', 'The indicator turns blue-purple', 'The gas relights a glowing splint'];
  const SAMPLES = [
    { name: 'Calcium added to the water', seen: 0, shows: 'The calcium is reacting with the water', kind: 'fizz' },
    { name: 'Lit splint held at the mouth of the collected gas', seen: 1, shows: 'The gas is hydrogen', kind: 'pop' },
    { name: 'Universal indicator added to the water afterwards', seen: 2, shows: 'The solution is alkaline', kind: 'indicator' },
  ];
  function picture(x, s) {
    const g = s('g', null, s('path', { d: 'M-60,-50 L-60,70 L60,70 L60,-50', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -59, y: -10, width: 118, height: 79, fill: x.kind === 'indicator' ? 'rgba(80, 60, 190, 0.6)' : 'rgba(225, 236, 244, 0.85)' }));
    if (x.kind === 'fizz') { g.append(s('rect', { x: -8, y: 52, width: 16, height: 12, fill: '#d0d4d8', stroke: '#8a96a3' })); for (let i = 0; i < 10; i++) g.append(s('circle', { cx: -6 + (i % 3) * 6, cy: 44 - i * 5, r: 2.5, fill: 'none', stroke: '#5f88a3' })); }
    if (x.kind === 'pop') g.append(s('path', { d: 'M-12,-110 L-12,-40 A12,12 0 0 0 12,-40 L12,-110', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2, transform: 'rotate(180 0 -75)' }), s('line', { x1: 40, y1: -20, x2: 90, y2: -60, stroke: '#b98a52', 'stroke-width': 4 }), s('text', { x: 30, y: -84, 'font-size': 16, 'font-weight': 700, fill: '#c0392b' }, 'POP!'));
    return g;
  }
  Observation.run({
    id: 'g7-calcium',
    guide: '../practical.html#g7-calcium',
    objectives: ['I can react calcium with water and test the gas produced.', 'I can test the solution formed with indicator.'],
    benchLabel: 'A beaker of water with a piece of calcium in it, a lit splint at the mouth of a tube of collected gas, and the water after adding universal indicator.',
    picture,
    tests: {
      label: 'Observation',
      title: 'Watch the reaction',
      text: 'Add a small piece of calcium to water under an upturned test tube full of water. Collect the gas and test it. Then add indicator to the water.',
      why: 'Testing the gas and the solution tells you what the products of the reaction are.',
      task: 'make the observation',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.name}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'A lit splint pops in hydrogen; a glowing splint relights in oxygen.',
      }, {
        label: 'This shows',
        q: () => 'What does this show?',
        task: 'decide what it shows',
        options: SAMPLES.map((y) => y.shows),
        answer: (x) => x.shows,
        hint: () => 'Match each observation to what it tells you.',
      }],
    },
    questions: [{
      q: 'Which word equation shows this reaction?',
      o: ['calcium + water → calcium hydroxide + hydrogen', 'calcium + water → calcium oxide + oxygen', 'calcium + hydrogen → calcium hydroxide'],
      hint: 'Use what you found out about the gas and the solution.',
      right: 'Yes. Metal + water → metal hydroxide + hydrogen. Calcium hydroxide makes the solution alkaline.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Calcium fizzed steadily. The gas popped with a lit splint, so it is hydrogen, and the indicator turned blue-purple because calcium hydroxide is alkaline.',
      rows: [['Word equation', 'calcium + water → calcium hydroxide + hydrogen']],
    }),
  });
})();
