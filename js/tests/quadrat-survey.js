/* Quadrat or sweep-net survey (Grade 6, Stage 7: 7Bp.04, 7TWSc.07). */
(function () {
  'use strict';
  const LEGS = ['None', '6', '8', '14', 'Lots: on every segment'];
  const NAMES = ['Beetle', 'Spider', 'Woodlouse', 'Centipede', 'Earthworm', 'Snail'];
  const SAMPLES = [
    { name: 'Animal 1', kind: 'Beetle', legs: '6' },
    { name: 'Animal 2', kind: 'Spider', legs: '8' },
    { name: 'Animal 3', kind: 'Woodlouse', legs: '14' },
    { name: 'Animal 4', kind: 'Centipede', legs: 'Lots: on every segment' },
    { name: 'Animal 5', kind: 'Earthworm', legs: 'None' },
    { name: 'Animal 6', kind: 'Snail', legs: 'None' },
  ];
  function legs(s, n, x0, x1, len, y = 0) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + ((x1 - x0) * i) / Math.max(1, n - 1);
      out.push(s('line', { x1: x, y1: y - 6, x2: x - 4, y2: y - len, stroke: '#3a3f44', 'stroke-width': 2 }), s('line', { x1: x, y1: y + 6, x2: x - 4, y2: y + len, stroke: '#3a3f44', 'stroke-width': 2 }));
    }
    return out;
  }
  function picture(x, s) {
    const k = x.kind;
    if (k === 'Beetle') return s('g', null, ...legs(s, 3, -16, 16, 30), s('ellipse', { rx: 34, ry: 22, fill: '#2b3a2a' }), s('line', { x1: -6, x2: 34, y1: 0, y2: 0, stroke: '#5a6a58' }), s('circle', { cx: -40, r: 10, fill: '#2b3a2a' }));
    if (k === 'Spider') return s('g', null, ...legs(s, 4, -18, 18, 36), s('circle', { cx: 18, r: 20, fill: '#5b4636' }), s('circle', { cx: -14, r: 12, fill: '#5b4636' }));
    if (k === 'Woodlouse') return s('g', null, ...legs(s, 7, -30, 30, 24), s('ellipse', { rx: 44, ry: 22, fill: '#6b7178' }), ...[-28, -14, 0, 14, 28].map((cx) => s('line', { x1: cx, x2: cx, y1: -20, y2: 20, stroke: '#4a4f55' })));
    if (k === 'Centipede') return s('g', null, ...legs(s, 15, -100, 100, 18), s('rect', { x: -110, y: -7, width: 220, height: 14, rx: 7, fill: '#a0522d' }));
    if (k === 'Earthworm') return s('g', null, s('path', { d: 'M-110,10 C-60,-30 -20,40 30,0 S90,-20 110,0', fill: 'none', stroke: '#c9787a', 'stroke-width': 14, 'stroke-linecap': 'round' }), s('path', { d: 'M-30,8 L-24,14', stroke: '#a85a5c', 'stroke-width': 10 }));
    return s('g', null, s('path', { d: 'M-70,24 L50,24 Q70,24 74,10 L60,10', fill: '#c9b48a', stroke: '#8a7650' }), s('circle', { cx: -10, cy: -6, r: 30, fill: '#b5835a', stroke: '#7a5232', 'stroke-width': 2 }), s('path', { d: 'M-10,-6 m-6,0 a6,6 0 1,1 12,0 a12,12 0 1,1 -24,0 a18,18 0 1,1 36,0', fill: 'none', stroke: '#7a5232', 'stroke-width': 2 }));
  }
  Observation.run({
    id: 'g6-quadratsurvey',
    guide: '../practical.html#g6-quadratsurvey',
    objectives: ['I can collect organisms using a quadrat or sweep net.', 'I can identify the organisms I find using a key.'],
    benchLabel: 'A card showing one small animal at a time, found in a quadrat or a sweep net, to identify with a key.',
    picture,
    tests: {
      label: 'Animal',
      title: 'Identify what you found',
      text: 'Look closely at each animal. Count its legs, then use the key to name it. Key: no legs and a shell = snail; no legs, no shell = earthworm; 6 legs = beetle; 8 legs = spider; 14 legs = woodlouse; legs on every segment = centipede.',
      why: 'Counting legs is quick and reliable, so it is a good first question in a key.',
      task: 'look closely at the animal',
      button: (x) => `Look at ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Legs',
        q: (x) => `${x.name}: how many legs does it have?`,
        task: 'count the legs',
        options: LEGS,
        answer: (x) => x.legs,
        hint: () => 'Count the legs on one side, then double it.',
      }, {
        label: 'Name',
        q: (x) => `${x.name}: use the key to name it.`,
        task: 'name the animal',
        options: NAMES,
        answer: (x) => x.kind,
        hint: () => 'Key: no legs + shell = snail; no legs = earthworm; 6 = beetle; 8 = spider; 14 = woodlouse; every segment = centipede.',
      }],
    },
    questions: [{
      q: 'Why should you release the animals where you found them?',
      o: ['So they can carry on living in their habitat', 'So you can catch them again tomorrow', 'Because they are dangerous'],
      hint: 'Think about the animals and their habitat.',
      right: 'Yes. Ethical surveys do as little harm as possible to the organisms and their habitat.',
    }, {
      q: 'What does a quadrat survey tell you about an area?',
      o: ['Which species live there and how many of each', 'How old the area is', 'What the weather is like'],
      hint: 'What did you record for each animal?',
      right: 'Yes. Even a small area holds many different species.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Even a small area held many different species. Counting legs and using a key put a name to each one.',
      rows: rows.map((r) => [r.name, `${r.cells[1]} (${r.cells[0] === 'None' ? 'no legs' : r.cells[0].startsWith('Lots') ? 'legs on every segment' : `${r.cells[0]} legs`})`]),
    }),
  });
})();
