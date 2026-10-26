/* Respiring yeast or seeds with hydrogencarbonate indicator (Grade 7, Stage 8: 8Bp.05, 8TWSa.03). */
(function () {
  'use strict';
  const COLOURS = { Purple: '#7b3fa0', Red: '#d23c46', Orange: '#e8862a', Yellow: '#e2c13a' };
  const SAMPLES = [
    { name: 'Germinating seeds', c: 'Yellow', co2: 'More carbon dioxide', kind: 'seeds' },
    { name: 'Glass beads (control)', c: 'Red', co2: 'No change', kind: 'beads' },
    { name: 'Boiled (dead) seeds', c: 'Red', co2: 'No change', kind: 'dead' },
    { name: 'Yeast in sugar solution', c: 'Yellow', co2: 'More carbon dioxide', kind: 'yeast' },
  ];
  function picture(x, s) {
    const g = s('g', null,
      s('path', { d: 'M-24,-80 L-24,50 A24,24 0 0 0 24,50 L24,-80', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }),
      s('path', { d: 'M-23,20 L-23,50 A23,23 0 0 0 23,50 L23,20 Z', fill: COLOURS[x.c] }),
      s('rect', { x: -28, y: -90, width: 56, height: 12, rx: 3, fill: '#39424b' }));
    if (x.kind === 'yeast') g.append(s('rect', { x: -23, y: -40, width: 46, height: 30, fill: 'rgba(240, 230, 200, 0.9)' }));
    else g.append(s('line', { x1: -23, x2: 23, y1: 4, y2: 4, stroke: '#6b7682', 'stroke-width': 2, 'stroke-dasharray': '3 2' }), ...[-12, 0, 12].map((cx) => s('ellipse', { cx, cy: -4, rx: 6, ry: 4, fill: x.kind === 'beads' ? '#d6e9f5' : x.kind === 'dead' ? '#b5a27a' : '#c9b48a', stroke: '#6b7682' })));
    return g;
  }
  Observation.run({
    id: 'g7-hco3',
    guide: '../practical.html#g7-hco3',
    objectives: ['I can use hydrogencarbonate indicator to detect carbon dioxide from respiration.', 'I can compare results with a control.'],
    benchLabel: 'Sealed boiling tubes of red hydrogencarbonate indicator, each with something different on a gauze platform above it, after one hour.',
    picture,
    tests: {
      label: 'Tube',
      title: 'Look at each tube after an hour',
      text: 'Each sealed tube started with the same volume of red indicator. After an hour, record the colour and what it tells you about carbon dioxide.',
      why: 'Hydrogencarbonate indicator changes from red to orange then yellow as carbon dioxide increases.',
      task: 'look at the tube',
      button: (x) => `Look at the ${x.name.toLowerCase()} tube`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Colour',
        q: (x) => `${x.name}: what colour is the indicator now?`,
        task: 'record the colour',
        options: Object.keys(COLOURS),
        swatches: COLOURS,
        answer: (x) => x.c,
        hint: () => 'Compare the colour with the red it started as.',
      }, {
        label: 'Carbon dioxide',
        q: (x) => `${x.name}: what has happened to the carbon dioxide in the tube?`,
        task: 'decide what happened to the carbon dioxide',
        options: ['More carbon dioxide', 'No change', 'Less carbon dioxide'],
        answer: (x) => x.co2,
        hint: () => 'Yellow means more carbon dioxide; red means no change.',
      }],
    },
    questions: [{
      q: 'Why does the tube with germinating seeds turn yellow?',
      o: ['The living seeds respire and release carbon dioxide', 'The seeds give out oxygen', 'Light changes the indicator'],
      hint: 'Which living process makes carbon dioxide?',
      right: 'Yes. Respiration releases carbon dioxide, which makes the indicator turn yellow.',
    }, {
      q: 'Why do we set up a tube with glass beads?',
      o: ['As a control, to show that the colour change is caused by living things', 'To make the tube heavier', 'To feed the seeds'],
      hint: 'What is the only difference between the bead tube and the seed tube?',
      right: 'Yes. The control stays red, so the change in the seed tube must be caused by the living seeds.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The indicator turned yellow with living seeds and yeast, because they respire and release carbon dioxide. The control (glass beads) and dead seeds stayed red.',
      rows: rows.map((r) => [r.name, r.cells[0].toLowerCase()]),
    }),
  });
})();
