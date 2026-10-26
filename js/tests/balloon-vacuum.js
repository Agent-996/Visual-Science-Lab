/* Balloon or marshmallow in a vacuum (Grade 6, Stage 7: 7Cm.05). */
(function () {
  'use strict';
  const SEEN = ['The balloon gets bigger', 'The balloon shrinks back', 'The balloon bursts straight away'];
  const SAMPLES = [
    { name: 'The air is pumped out of the bell jar', short: 'Air pumped out', seen: 0, r: 46 },
    { name: 'The air is let back in', short: 'Air let back in', seen: 1, r: 26 },
  ];
  const picture = (x, s) => s('g', null,
    s('path', { d: 'M-90,70 L-90,-30 Q-90,-90 0,-90 Q90,-90 90,-30 L90,70 Z', fill: 'rgba(214, 232, 242, 0.35)', stroke: '#7f97a8', 'stroke-width': 2 }),
    s('rect', { x: -110, y: 70, width: 220, height: 10, fill: '#6b7682' }),
    s('circle', { cy: 60 - x.r, r: x.r, fill: '#e05a5a', opacity: 0.9 }),
    s('text', { x: 120, y: 60, 'font-size': 12, fill: '#455261' }, x.r > 30 ? 'to pump →' : ''));
  Observation.run({
    id: 'g6-belljar',
    guide: '../practical.html#g6-belljar',
    objectives: ['I can describe what happens to a balloon when the air around it is removed.', 'I can explain it using gas particles and pressure.'],
    benchLabel: 'A slightly blown-up balloon under a glass bell jar connected to a vacuum pump.',
    picture,
    tests: {
      label: 'Stage',
      title: 'Watch the balloon',
      text: 'Your teacher pumps the air out of the bell jar, then lets it back in. Watch the balloon.',
      why: 'The air inside the balloon stays the same; only the air outside it changes.',
      task: 'watch the balloon',
      button: (x) => `Watch: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.short}: what happens to the balloon?`,
        task: 'record what happens',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Compare the size of the balloon with before.',
      }],
    },
    questions: [{
      q: 'Why does the balloon get bigger when the air is pumped out?',
      o: ['The gas particles inside keep pushing out, but fewer particles push back from outside', 'The pump blows air into the balloon', 'The balloon gets warmer'],
      hint: 'Which particles are pushing on the balloon from inside and from outside?',
      right: 'Yes. With less air pressure outside, the gas inside pushes the rubber outwards.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The balloon swelled as the air was pumped out, because fewer particles pushed on it from outside. When the air returned, it shrank again.',
      rows: [['Air pumped out', 'balloon grows'], ['Air let back in', 'balloon shrinks']],
    }),
  });
})();
