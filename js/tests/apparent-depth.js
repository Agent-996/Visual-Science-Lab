/* Apparent depth: the bent pencil (Grade 7, Stage 8: 8Ps.02). */
(function () {
  'use strict';
  const SEEN = ['The pencil looks bent where it enters the water', 'You cannot see the coin', 'The coin appears again', 'The pencil looks straight'];
  const SAMPLES = [
    { name: 'A pencil in a glass of water, seen from the side', short: 'Pencil in water', seen: 0, kind: 'pencil' },
    { name: 'A coin in an empty cup; move back until it just disappears', short: 'Coin in an empty cup', seen: 1, kind: 'empty' },
    { name: 'Your partner slowly pours water into the cup', short: 'Water poured in', seen: 2, kind: 'full' },
  ];
  function picture(x, s) {
    if (x.kind === 'pencil') return s('g', null, s('path', { d: 'M-50,-70 L-50,70 L50,70 L50,-70', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -49, y: -10, width: 98, height: 79, fill: 'rgba(160, 205, 235, 0.55)' }), s('line', { x1: -70, y1: -90, x2: -4, y2: -10, stroke: '#e0a526', 'stroke-width': 7 }), s('line', { x1: -4, y1: -10, x2: 26, y2: 50, stroke: '#e0a526', 'stroke-width': 7 }));
    const g = s('g', null, s('path', { d: 'M-40,-30 L-34,60 L34,60 L40,-30', fill: x.kind === 'full' ? 'rgba(160, 205, 235, 0.55)' : '#ffffff', stroke: '#7f97a8', 'stroke-width': 2 }), s('ellipse', { cx: 0, cy: 54, rx: 12, ry: 4, fill: '#d4b04a' }), s('circle', { cx: 130, cy: -60, r: 8, fill: '#33404d' }));
    g.append(s('path', { d: x.kind === 'full' ? 'M0,52 L40,-30 L130,-60' : 'M0,52 L58,-40', fill: 'none', stroke: '#e03131', 'stroke-width': 2, 'stroke-dasharray': x.kind === 'full' ? '' : '5 4' }));
    return g;
  }
  Observation.run({
    id: 'g7-apparentdepth',
    guide: '../practical.html#g7-apparentdepth',
    objectives: ['I can observe refraction effects in water.', 'I can explain why a pool looks shallower than it is.'],
    benchLabel: 'A pencil standing in a glass of water, and a coin at the bottom of a cup seen from the side before and after water is poured in.',
    picture,
    tests: {
      label: 'Test',
      title: 'Look at objects in water',
      text: 'Look at a pencil in a glass of water from the side. Then look at a coin in a cup and step back until it just disappears, while your partner pours in water.',
      why: 'Light changes direction as it passes from water into air. Your brain assumes light travels in straight lines, so things look in the wrong place.',
      task: 'look carefully',
      button: (x) => x.short,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the pencil where it enters the water, or at whether the coin can be seen.',
      }],
    },
    questions: [{
      q: 'Why does the coin appear again when water is poured in?',
      o: ['Light from the coin bends as it leaves the water, so it now reaches your eye', 'The water lifts the coin up', 'The water makes the coin bigger'],
      hint: 'Follow the red ray in the picture.',
      right: 'Yes. Refraction bends the light from the coin at the water surface so it reaches your eye.',
    }, {
      q: 'Why does a swimming pool look shallower than it really is?',
      o: ['Light from the bottom bends away from the normal as it leaves the water, so the bottom looks closer', 'Water magnifies everything', 'The pool is painted blue'],
      hint: 'Where does your brain think the light came from?',
      right: 'Yes. Your brain traces the light back in a straight line, so the bottom seems nearer the surface than it is.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The pencil looked bent and the hidden coin reappeared when water was added. Light refracts as it leaves the water, so objects under water look closer to the surface than they are.',
      rows: [['Pencil in water', 'looks bent'], ['Coin in water', 'appears again']],
    }),
  });
})();
