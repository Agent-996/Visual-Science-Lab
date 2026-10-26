/* Making a compass (Grade 7, Stage 8: 8ESp.01). */
(function () {
  'use strict';
  const SEEN = ['It turns and settles pointing north–south', 'It turns back to north–south', 'It stays pointing whichever way it is put'];
  const SAMPLES = [
    { name: 'Magnetised needle floated on cork', short: 'Magnetised needle', seen: 0, angle: 0 },
    { name: 'Turn the dish round slowly', short: 'Dish turned', seen: 1, angle: 0 },
    { name: 'An unmagnetised needle floated on cork', short: 'Plain needle', seen: 2, angle: 50 },
  ];
  const picture = (x, s) => s('g', null,
    s('ellipse', { rx: 90, ry: 60, fill: 'rgba(160, 205, 235, 0.5)', stroke: '#7f97a8', 'stroke-width': 2 }),
    s('g', { transform: `rotate(${x.angle})` }, s('ellipse', { rx: 20, ry: 14, fill: '#d4a86a', stroke: '#8a6236' }), s('line', { x1: 0, y1: -60, x2: 0, y2: 60, stroke: '#6b7682', 'stroke-width': 3 }), s('circle', { cx: 0, cy: -60, r: 3, fill: '#d64545' })),
    s('text', { x: 120, y: -50, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, 'N ↑'));
  Observation.run({
    id: 'g7-compass',
    guide: '../practical.html#g7-compass',
    objectives: ['I can make a compass from a magnetised needle.', 'I can explain that the Earth has a magnetic field.'],
    benchLabel: 'A needle pushed through a slice of cork floating in a dish of water, with an arrow showing north.',
    picture,
    tests: {
      label: 'Test',
      title: 'Test your compass',
      text: 'Stroke a steel needle 30 times in the same direction with one pole of a magnet. Push it through a slice of cork and float it on water. Compare with a needle that has not been stroked.',
      why: 'Stroking the needle magnetises it. Floating it lets it turn freely.',
      task: 'watch the needle',
      button: (x) => x.short,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.short}: what does the needle do?`,
        task: 'record what the needle does',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Compare the direction of the needle with the north arrow.',
      }],
    },
    questions: [{
      q: 'Why does the magnetised needle point north–south?',
      o: ['The Earth has a magnetic field, as if it had a giant bar magnet inside it', 'The water flows north', 'The cork is magnetic'],
      hint: 'What is the needle lining up with?',
      right: 'Yes. A magnetised needle lines up with the Earth’s magnetic field, just like a real compass.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The magnetised needle turned to point north–south and turned back when the dish was moved. The plain needle did not. The Earth has a magnetic field.',
      rows: [['Magnetised needle', 'points north–south'], ['Plain needle', 'no preferred direction']],
    }),
  });
})();
