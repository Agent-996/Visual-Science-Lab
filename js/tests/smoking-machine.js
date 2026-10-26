/* Smoking machine (Grade 7, Stage 8: 8Bp.03). */
(function () {
  'use strict';
  const SEEN = ['Brown and sticky with tar', 'It stays clean and white', 'The indicator changes to an acidic colour (yellow-orange)', 'The indicator stays the same colour'];
  const SAMPLES = [
    { name: 'Cotton wool after the smoke has passed through', short: 'Used cotton wool', seen: 0, kind: 'tar' },
    { name: 'Clean cotton wool (for comparison)', short: 'Clean cotton wool', seen: 1, kind: 'clean' },
    { name: 'The indicator after the smoke has bubbled through', short: 'Indicator', seen: 2, kind: 'indicator' },
  ];
  function picture(x, s) {
    if (x.kind === 'indicator') return s('g', null, s('path', { d: 'M-24,-70 L-24,50 A24,24 0 0 0 24,50 L24,-70', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('path', { d: 'M-23,-10 L-23,50 A23,23 0 0 0 23,50 L23,-10 Z', fill: '#e8a43a' }), s('line', { x1: 0, y1: -90, x2: 0, y2: 50, stroke: '#9aa5b1', 'stroke-width': 3 }));
    return s('g', null, s('ellipse', { rx: 70, ry: 44, fill: x.kind === 'tar' ? '#8a5a2a' : '#fbfbf7', stroke: '#9aa5b1' }), ...Array.from({ length: 8 }, (_, i) => s('circle', { cx: -40 + (i * 23) % 80, cy: -20 + (i * 13) % 40, r: 8, fill: x.kind === 'tar' ? '#6a4020' : '#ffffff', opacity: 0.8 })));
  }
  Observation.run({
    id: 'g7-smoking',
    guide: '../practical.html#g7-smoking',
    objectives: ['I can describe what the smoking machine shows about cigarette smoke.', 'I can explain how tar damages the lungs.'],
    benchLabel: 'A smoking machine that draws cigarette smoke through cotton wool and then through indicator solution, with clean cotton wool for comparison.',
    picture,
    tests: {
      label: 'Item',
      title: 'Look at the results',
      text: 'Your teacher draws smoke from a cigarette through cotton wool and then through indicator. Compare the cotton wool with clean cotton wool, and look at the indicator.',
      why: 'The cotton wool collects what would land in a smoker’s lungs.',
      task: 'look closely',
      button: (x) => `Look at the ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Compare the colour with the clean cotton wool.',
      }],
    },
    questions: [{
      q: 'How does tar damage the lungs?',
      o: ['It coats the airways and alveoli, damaging them and possibly causing cancer', 'It cleans the lungs', 'It makes the lungs stronger'],
      hint: 'What did the tar do to the cotton wool?',
      right: 'Yes. Tar is sticky and contains chemicals that can cause cancer. Nicotine is the addictive drug in tobacco.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The cotton wool turned brown with sticky tar, and the indicator showed the smoke is acidic. Tar coats the lungs, damages the alveoli and can cause cancer. Nicotine is addictive.',
      rows: [['Used cotton wool', 'brown and sticky'], ['Indicator', 'acidic colour']],
    }),
  });
})();
