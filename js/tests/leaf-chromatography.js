/* Chromatography of leaf pigments (Grade 7, Stage 8: 8Cp.02). */
(function () {
  'use strict';
  const COLOURS = { 'Yellow-orange': '#f0a030', Yellow: '#e8d23a', 'Blue-green': '#2e8a6a', 'Yellow-green': '#9ab83a' };
  const BANDS = [
    { name: 'Band 1 (highest up the paper)', short: 'Band 1', c: 'Yellow-orange', pig: 'Carotene', y: -62 },
    { name: 'Band 2', short: 'Band 2', c: 'Yellow', pig: 'Xanthophyll', y: -22 },
    { name: 'Band 3', short: 'Band 3', c: 'Blue-green', pig: 'Chlorophyll a', y: 8 },
    { name: 'Band 4 (lowest)', short: 'Band 4', c: 'Yellow-green', pig: 'Chlorophyll b', y: 30 },
  ];
  function picture(x, s) {
    const g = s('g', null, s('rect', { x: -40, y: -90, width: 80, height: 180, fill: '#ffffff', stroke: '#9aa5b1' }), s('line', { x1: -36, x2: 36, y1: 58, y2: 58, stroke: '#6b7682', 'stroke-dasharray': '3 2' }), s('rect', { x: -40, y: 74, width: 80, height: 16, fill: 'rgba(214, 232, 242, 0.8)' }), s('text', { x: 46, y: 62, 'font-size': 11, fill: '#455261' }, 'pencil line'));
    BANDS.forEach((b) => g.append(s('ellipse', { cx: 0, cy: b.y, rx: 22, ry: 6, fill: COLOURS[b.c], stroke: b === x ? '#c0392b' : 'none', 'stroke-width': 2.5 })));
    return g;
  }
  Observation.run({
    id: 'g7-leafchroma',
    guide: '../practical.html#g7-leafchroma',
    objectives: ['I can separate the pigments in a leaf.', 'I can explain why some pigments move further than others.'],
    benchLabel: 'A strip of chromatography paper after the solvent has risen up it, with coloured bands of leaf pigment above a pencil line.',
    picture,
    tests: {
      label: 'Band',
      title: 'Look at the chromatogram',
      text: 'Spot green leaf extract on a pencil line and stand the paper in solvent. When the solvent nears the top, look at each band (circled in red).',
      why: 'Each pigment dissolves in the solvent to a different extent, so it is carried a different distance up the paper.',
      task: 'look at the circled band',
      button: (x) => `Look at ${x.short.toLowerCase()}`,
      samples: BANDS,
      bins: false,
      columns: [{
        label: 'Colour',
        q: (x) => `${x.short}: what colour is it?`,
        task: 'record the colour',
        options: Object.keys(COLOURS),
        swatches: COLOURS,
        answer: (x) => x.c,
        hint: () => 'Look closely at the circled band.',
      }],
    },
    questions: [{
      q: 'Why did some pigments move further up the paper than others?',
      o: ['They are more soluble in the solvent, so they are carried further', 'They are heavier', 'They were spotted higher up'],
      hint: 'What carries the pigments up the paper?',
      right: 'Yes. The more soluble a pigment is in the solvent, the further it travels.',
    }, {
      q: 'Why is the start line drawn in pencil, not ink?',
      o: ['Pencil does not dissolve in the solvent, so it will not run and mix with the pigments', 'Pencil is easier to rub out', 'Ink is too dark to see'],
      hint: 'What would happen to an ink line when the solvent reaches it?',
      right: 'Yes. Ink would dissolve and separate too, spoiling your results.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The green leaf extract separated into yellow-orange, yellow, blue-green and yellow-green pigments. Pigments that are more soluble in the solvent moved further up the paper.',
      rows: rows.map((r) => [r.sample.short, `${r.cells[0].toLowerCase()} (${r.sample.pig.toLowerCase()})`]),
    }),
  });
})();
