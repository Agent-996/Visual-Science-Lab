/* Gravity compared with magnetism (Grade 6, Stage 7: 7Pf.03). */
(function () {
  'use strict';
  const FLOAT = 'The paperclip floats up and the thread goes tight';
  const FALL = 'The paperclip falls back down';
  const SAMPLES = [
    { name: 'Magnet held 2 cm above the paperclip', gap: 2, a: FLOAT, big: 'Magnetic force' },
    { name: 'Magnet raised to 4 cm above', gap: 4, a: FLOAT, big: 'Magnetic force' },
    { name: 'Magnet raised to 7 cm above', gap: 7, a: FALL, big: 'Gravity' },
  ];
  function picture(x, s) {
    const float = x.a === FLOAT;
    const clipY = float ? 10 : 70;
    return s('g', null,
      s('rect', { x: -120, y: 80, width: 240, height: 8, fill: '#c89b62' }),
      s('rect', { x: -26, y: clipY - 30 - x.gap * 10, width: 52, height: 18, fill: '#d64545' }),
      s('text', { x: 0, y: clipY - 17 - x.gap * 10, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#ffffff' }, 'N'),
      s('path', { d: `M0,80 L0,${clipY + 10}`, stroke: '#6b7682', 'stroke-width': 1.2, fill: 'none', 'stroke-dasharray': float ? '' : '3 3' }),
      s('rect', { x: -6, y: clipY - 8, width: 12, height: 18, rx: 5, fill: 'none', stroke: '#6b7682', 'stroke-width': 2.5 }),
      s('text', { x: 40, y: clipY - x.gap * 5, 'font-size': 12, fill: '#455261' }, `gap ${x.gap} cm`));
  }
  Observation.run({
    id: 'g6-gravmag',
    guide: '../practical.html#g6-gravmag',
    objectives: ['I can show that a magnetic force can be bigger than gravity on a small object.', 'I can describe gravity as a force of attraction between masses.'],
    benchLabel: 'A paperclip tied to a thread taped to the bench, with a bar magnet held above it at different heights.',
    picture,
    tests: {
      label: 'Gap',
      title: 'Make the paperclip float',
      text: 'Hold the magnet above the paperclip without touching it. Raise the magnet slowly and watch the paperclip.',
      why: 'Gravity pulls the paperclip down and the magnet pulls it up. Whichever force is bigger wins.',
      task: 'hold the magnet there',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.name}: what happens?`,
        task: 'record what happens',
        options: [FLOAT, FALL],
        answer: (x) => x.a,
        hint: () => 'Is the thread tight, with the paperclip in the air?',
      }, {
        label: 'Bigger force',
        q: () => 'Which force on the paperclip is bigger?',
        task: 'decide which force is bigger',
        options: ['Magnetic force', 'Gravity'],
        answer: (x) => x.big,
        hint: () => 'If the paperclip stays up, the upward force is bigger.',
      }],
    },
    questions: [{
      q: 'What do gravity and magnetism have in common?',
      o: ['Both are non-contact forces: they act without touching', 'Both only act on iron', 'Both push things apart'],
      hint: 'Did the magnet or the Earth touch the paperclip?',
      right: 'Yes. Both act across a gap. Gravity pulls on everything with mass; magnetism only acts on magnetic materials.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Close to the paperclip, the magnetic force was bigger than gravity and held it up without touching. Further away the magnetic force was weaker, and gravity pulled the paperclip back down.',
      rows: [['2 cm and 4 cm', 'paperclip floats'], ['7 cm', 'paperclip falls']],
    }),
  });
})();
