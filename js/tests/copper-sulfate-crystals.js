/* Making copper(II) sulfate crystals (Grade 7, Stage 8: 8Cc.04, 8TWSp.05). */
(function () {
  'use strict';
  const SEEN = ['The black powder disappears and the solution turns blue', 'Black powder is left over at the bottom', 'A clear blue solution drips through; black solid stays in the filter', 'Blue crystals form'];
  const SAMPLES = [
    { name: 'Add a spatula of black copper(II) oxide to warm acid', short: 'Add copper oxide', seen: 0, kind: 'dissolve' },
    { name: 'Keep adding until no more dissolves', short: 'Add more until excess', seen: 1, kind: 'excess' },
    { name: 'Filter the mixture', short: 'Filter', seen: 2, kind: 'filter' },
    { name: 'Evaporate some water and leave it to cool', short: 'Crystallise', seen: 3, kind: 'crystals' },
  ];
  function picture(x, s) {
    const blue = 'rgba(40, 110, 220, 0.6)';
    if (x.kind === 'filter') return s('g', null, s('path', { d: 'M-60,-70 L60,-70 L8,0 L8,30 L-8,30 L-8,0 Z', fill: '#ffffff', stroke: '#7f97a8', 'stroke-width': 2 }), ...Array.from({ length: 10 }, (_, i) => s('circle', { cx: -20 + (i * 9) % 40, cy: -40 + (i % 3) * 8, r: 3, fill: '#222' })), s('path', { d: 'M-40,50 L-40,90 L40,90 L40,50', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -39, y: 66, width: 78, height: 23, fill: blue }));
    if (x.kind === 'crystals') return s('g', null, s('path', { d: 'M-80,-10 Q0,70 80,-10 Z', fill: 'rgba(40, 110, 220, 0.3)', stroke: '#7f97a8', 'stroke-width': 2 }), ...[[-30, 10, 14], [8, 18, 18], [36, 6, 11]].map(([cx, cy, r]) => s('path', { d: `M${cx},${cy - r} L${cx + r},${cy} L${cx},${cy + r * 0.7} L${cx - r},${cy} Z`, fill: '#2a6ad0', stroke: '#1a4a9a' })));
    const g = s('g', null, s('path', { d: 'M-50,-60 L-50,60 L50,60 L50,-60', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -49, y: -10, width: 98, height: 69, fill: x.kind === 'dissolve' ? 'rgba(40, 110, 220, 0.35)' : blue }));
    if (x.kind === 'excess') for (let i = 0; i < 18; i++) g.append(s('circle', { cx: -42 + (i * 11) % 84, cy: 54 - (i % 2) * 4, r: 3, fill: '#222' }));
    return g;
  }
  Observation.run({
    id: 'g7-coppersulfate',
    guide: '../practical.html#g7-coppersulfate',
    objectives: ['I can make a salt from copper(II) oxide and dilute sulfuric acid.', 'I can write my own risk assessment for the practical.'],
    benchLabel: 'The stages of making copper(II) sulfate: a beaker of warm acid with black copper(II) oxide, a filter funnel and an evaporating basin with blue crystals.',
    picture,
    tests: {
      label: 'Stage',
      title: 'Make the salt',
      text: 'Warm the dilute sulfuric acid gently. Carry out each stage and record what you see.',
      why: 'Copper(II) oxide is a base: it reacts with the acid to make a salt (copper(II) sulfate) and water.',
      task: 'carry out the stage',
      button: (x) => x.short,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.name}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the colour of the liquid and whether any black powder is left.',
      }],
    },
    questions: [{
      q: 'Why do you add copper(II) oxide until no more dissolves?',
      o: ['So that all the acid reacts, leaving no acid in the salt', 'To make more crystals', 'To keep the mixture warm'],
      hint: 'What is left in the beaker when you add too much on purpose?',
      right: 'Yes. Using excess copper oxide makes sure all the acid is used up. The extra is filtered off.',
    }, {
      title: 'Your risk assessment',
      text: 'Think about the hazards before you start.',
      q: 'Which is the most important safety step?',
      o: ['Wear eye protection and heat the acid gently, never to boiling', 'Use as much acid as possible', 'Taste the crystals to check them'],
      hint: 'What could splash, and what could get too hot?',
      right: 'Yes. Warm dilute acid can spit and hurt your eyes, and copper(II) sulfate is harmful.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Copper(II) oxide + sulfuric acid → copper(II) sulfate + water. The excess black solid was filtered off and blue crystals formed as the solution cooled.',
      rows: [['Word equation', 'copper(II) oxide + sulfuric acid → copper(II) sulfate + water'], ['Product', 'blue crystals']],
    }),
  });
})();
