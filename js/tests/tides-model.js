/* Tides model (Grade 6, Stage 7: 7ESs.03, 7TWSm.01). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'The town faces the Moon', short: 'Facing the Moon', angle: 0, a: 'High tide' },
    { name: '6 hours later', short: '6 hours later', angle: -90, a: 'Low tide' },
    { name: '12 hours later', short: '12 hours later', angle: 180, a: 'High tide' },
    { name: '18 hours later', short: '18 hours later', angle: 90, a: 'Low tide' },
  ];
  function picture(x, s) {
    const r = (x.angle * Math.PI) / 180;
    return s('g', null,
      s('ellipse', { cx: -30, rx: 52, ry: 38, fill: 'rgba(80, 150, 215, 0.55)' }),
      s('circle', { cx: -30, r: 34, fill: '#6fae5a', stroke: '#3b6e22' }),
      s('circle', { cx: -30 + Math.cos(r) * 40, cy: -Math.sin(r) * 40, r: 6, fill: '#c0392b', stroke: '#ffffff', 'stroke-width': 2 }),
      s('circle', { cx: 110, r: 12, fill: '#d9dee2', stroke: '#8a96a3' }),
      s('text', { x: 110, y: 30, 'text-anchor': 'middle', 'font-size': 12, fill: '#455261' }, 'Moon'));
  }
  Observation.run({
    id: 'g6-tides',
    guide: '../practical.html#g6-tides',
    objectives: ['I can model how the Moon’s gravity causes tides.', 'I can explain why most places have two high tides a day.'],
    benchLabel: 'The Earth with two bulges of ocean water, one facing the Moon and one on the far side, and a red dot for a seaside town as the Earth turns.',
    picture,
    tests: {
      label: 'Time',
      title: 'Turn the Earth',
      text: 'The red dot is a seaside town. Turn the Earth a quarter of a turn (6 hours) at a time. Decide whether the town has a high or a low tide.',
      why: 'The Earth turns once a day, so a town is carried through both bulges of water in that time.',
      task: 'turn the Earth',
      button: (x) => (x.angle === 0 ? 'Start with the town facing the Moon' : `Turn the Earth: ${x.short}`),
      samples: SAMPLES,
      columns: [{
        label: 'Tide',
        q: (x) => `${x.name}: does the town have a high tide or a low tide?`,
        task: 'decide high or low tide',
        options: ['High tide', 'Low tide'],
        answer: (x) => x.a,
        hint: () => 'Is the red dot inside one of the blue bulges of water?',
      }],
    },
    questions: [{
      q: 'How many high tides does the town get each day?',
      o: ['Two', 'One', 'Four'],
      hint: 'Count the high tides in your table over 24 hours.',
      right: 'Yes. There is a bulge facing the Moon and another on the opposite side, so a town passes through two each day.',
    }, {
      q: 'What causes the bulge of water facing the Moon?',
      o: ['The Moon’s gravity pulls the ocean water towards it', 'The wind', 'The Sun heating the sea'],
      hint: 'What force does the Moon exert on the Earth?',
      right: 'Yes. The Moon’s gravity pulls on the oceans, making them bulge.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The Moon’s gravity pulls the oceans into two bulges. As the Earth turns once a day, a town passes through both, so it has two high tides and two low tides a day.',
      rows: rows.map((r) => [r.sample.short, r.cells[0].toLowerCase()]),
    }),
  });
})();
