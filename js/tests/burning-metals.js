/* Burning metals in air (Grade 7, Stage 8: 8Cc.03, 8Cc.01). */
(function () {
  'use strict';
  const SEEN = ['A brilliant white flame', 'It glows orange and gives off sparks', 'A white powder', 'A black-grey solid'];
  const SAMPLES = [
    { name: 'Magnesium ribbon held in the flame', short: 'Magnesium burning', seen: 0, kind: 'mg' },
    { name: 'What is left after the magnesium burns', short: 'Magnesium product', seen: 2, kind: 'mgo' },
    { name: 'Iron wool held in the flame', short: 'Iron wool burning', seen: 1, kind: 'fe' },
    { name: 'What is left after the iron wool burns', short: 'Iron product', seen: 3, kind: 'feo' },
  ];
  function picture(x, s) {
    const g = s('g', null, s('line', { x1: -120, y1: 60, x2: -20, y2: 0, stroke: '#5d6874', 'stroke-width': 5 }));
    if (x.kind === 'mg') g.append(s('circle', { cx: 0, cy: -10, r: 34, fill: '#ffffff', opacity: 0.95 }), s('circle', { cx: 0, cy: -10, r: 50, fill: '#fffbe0', opacity: 0.6 }));
    if (x.kind === 'mgo') g.append(s('ellipse', { cx: 0, cy: 0, rx: 30, ry: 10, fill: '#f6f7f8', stroke: '#c9d1d9' }));
    if (x.kind === 'fe') { g.append(s('ellipse', { cx: 0, cy: -6, rx: 28, ry: 18, fill: '#e8862a', opacity: 0.85 })); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; g.append(s('line', { x1: Math.cos(a) * 30, y1: -6 + Math.sin(a) * 22, x2: Math.cos(a) * 52, y2: -6 + Math.sin(a) * 40, stroke: '#ffb000', 'stroke-width': 2 })); } }
    if (x.kind === 'feo') g.append(s('ellipse', { cx: 0, cy: -6, rx: 28, ry: 18, fill: '#3a3f44' }));
    return g;
  }
  Observation.run({
    id: 'g7-burningmetals',
    guide: '../practical.html#g7-burningmetals',
    objectives: ['I can describe how magnesium and iron burn in air.', 'I can write word equations for metals reacting with oxygen.'],
    benchLabel: 'Magnesium ribbon and iron wool held in a Bunsen flame with tongs, and the solids left afterwards.',
    picture,
    tests: {
      label: 'Observation',
      title: 'Watch the metals burn',
      text: 'Your teacher holds magnesium ribbon in a flame with tongs, then iron wool. Don’t look directly at the burning magnesium. Look at the products afterwards.',
      why: 'When metals burn they react with oxygen in the air to make metal oxides.',
      task: 'watch closely',
      button: (x) => `Look: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the colour of the flame or of the solid left behind.',
      }],
    },
    questions: [{
      q: 'Which word equation shows magnesium burning?',
      o: ['magnesium + oxygen → magnesium oxide', 'magnesium + water → magnesium hydroxide', 'magnesium oxide → magnesium + oxygen'],
      hint: 'What does the metal react with when it burns in air?',
      right: 'Yes. Metal + oxygen → metal oxide. For iron: iron + oxygen → iron oxide.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Magnesium burned with a brilliant white flame, leaving white magnesium oxide. Iron wool glowed and sparked, leaving black iron oxide. Metal + oxygen → metal oxide.',
      rows: [['Magnesium', 'white flame → white magnesium oxide'], ['Iron', 'sparks → black iron oxide']],
    }),
  });
})();
