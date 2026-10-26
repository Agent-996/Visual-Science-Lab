/* Separating sand and salt (Grade 6, Stage 7: 7Cm.04). */
(function () {
  'use strict';
  const SEEN = ['The salt dissolves but the sand does not', 'The sand stays in the filter paper; salty water drips through', 'The water evaporates, leaving salt crystals', 'Everything dissolves'];
  const SAMPLES = [
    { name: 'Step 1: add warm water and stir', step: 'Dissolving', seen: 0, kind: 'beaker' },
    { name: 'Step 2: pour through a filter funnel', step: 'Filtering', seen: 1, kind: 'funnel' },
    { name: 'Step 3: heat the salty water gently', step: 'Evaporating', seen: 2, kind: 'basin' },
  ];
  function picture(x, s) {
    if (x.kind === 'beaker') return s('g', null, s('path', { d: 'M-50,-60 L-50,60 L50,60 L50,-60', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -49, y: -20, width: 98, height: 79, fill: 'rgba(214, 232, 242, 0.8)' }), ...Array.from({ length: 22 }, (_, i) => s('circle', { cx: -44 + (i * 17) % 88, cy: 52 - (i % 3) * 4, r: 3, fill: '#c9a46a' })));
    if (x.kind === 'funnel') return s('g', null, s('path', { d: 'M-60,-70 L60,-70 L8,0 L8,30 L-8,30 L-8,0 Z', fill: '#ffffff', stroke: '#7f97a8', 'stroke-width': 2 }), ...Array.from({ length: 16 }, (_, i) => s('circle', { cx: -26 + (i * 13) % 52, cy: -44 + (i % 3) * 8, r: 3, fill: '#c9a46a' })), s('path', { d: 'M-40,50 L-40,90 L40,90 L40,50', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -39, y: 70, width: 78, height: 19, fill: 'rgba(214, 232, 242, 0.8)' }), s('circle', { cx: 0, cy: 44, r: 3, fill: '#8ab6d6' }));
    return s('g', null, s('path', { d: 'M-60,0 Q0,60 60,0 Z', fill: '#f4f6f8', stroke: '#7f97a8', 'stroke-width': 2 }), ...Array.from({ length: 10 }, (_, i) => s('rect', { x: -30 + i * 6, y: 14 + (i % 2) * 4, width: 5, height: 5, fill: '#ffffff', stroke: '#9aa5b1' })), ...[-20, 0, 20].map((dx) => s('path', { d: `M${dx},-8 q6,-10 0,-20 q-6,-10 0,-20`, fill: 'none', stroke: '#9fb4c2', 'stroke-width': 2 })));
  }
  Observation.run({
    id: 'g6-sandsalt',
    guide: '../practical.html#g6-sandsalt',
    objectives: ['I can separate a mixture of sand and salt by dissolving, filtering and evaporating.', 'I can explain why each step works.'],
    benchLabel: 'The three steps for separating sand and salt: a beaker of the mixture with water, a filter funnel and an evaporating basin being heated.',
    picture,
    tests: {
      label: 'Step',
      title: 'Separate the mixture',
      text: 'Carry out each step in order and record what you see.',
      why: 'Each step uses a difference between sand and salt: salt dissolves in water, sand does not.',
      task: 'carry out the step',
      button: (x) => x.name.replace(/^Step \d: /, '').replace(/^./, (c) => c.toUpperCase()),
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.name}: what happens?`,
        task: 'record what happens',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Salt is soluble in water; sand is insoluble.',
      }, {
        label: 'Name of the step',
        q: () => 'What is the name of this step?',
        task: 'name the step',
        options: ['Dissolving', 'Filtering', 'Evaporating'],
        answer: (x) => x.step,
        hint: () => 'Dissolving mixes a solid into a liquid; filtering separates an insoluble solid; evaporating removes the water.',
      }],
    },
    questions: [{
      q: 'Why does filtering separate the sand from the salt water?',
      o: ['The sand grains are too big to pass through the filter paper, but the dissolved salt passes through', 'The filter paper dissolves the sand', 'The salt sticks to the paper'],
      hint: 'What was left in the filter paper, and what dripped through?',
      right: 'Yes. Insoluble sand stays behind as the residue; the salty water (the filtrate) passes through.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Salt dissolves in water but sand does not. Filtering removed the sand (the residue), and evaporating the water from the filtrate left the salt behind as crystals.',
      rows: [['Dissolving', 'salt dissolves'], ['Filtering', 'sand stays in the filter'], ['Evaporating', 'salt crystals are left']],
    }),
  });
})();
