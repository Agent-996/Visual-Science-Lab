/* Feather and coin in a vacuum (Grade 6, Stage 7: 7Pf.04, 7Cm.05). */
(function () {
  'use strict';
  const SEEN = ['The coin lands first; the feather drifts down slowly', 'They fall together and land at the same time', 'The feather lands first'];
  const SAMPLES = [
    { name: 'The tube is full of air', short: 'Tube full of air', seen: 0, vac: false },
    { name: 'The air is pumped out of the tube', short: 'Air pumped out', seen: 1, vac: true },
  ];
  const picture = (x, s) => s('g', null,
    s('rect', { x: -26, y: -100, width: 52, height: 200, rx: 10, fill: x.vac ? 'rgba(214, 232, 242, 0.15)' : 'rgba(214, 232, 242, 0.5)', stroke: '#7f97a8', 'stroke-width': 2 }),
    s('ellipse', { cx: 0, cy: 86, rx: 12, ry: 4, fill: '#d4b04a', stroke: '#9a7a20' }),
    s('path', { d: `M-14,${x.vac ? 84 : -30} q14,-10 28,0 q-14,4 -28,0 z`, fill: '#ffffff', stroke: '#8a96a3' }),
    s('text', { x: 50, y: 0, 'font-size': 12, fill: '#455261' }, x.vac ? 'no air' : 'air'));
  Observation.run({
    id: 'g6-feathercoin',
    guide: '../practical.html#g6-feathercoin',
    objectives: ['I can explain why a feather falls slowly in air.', 'I can predict what happens to falling objects in a vacuum.'],
    benchLabel: 'A long glass tube with a feather and a coin inside, turned over so they fall, first with air inside and then with the air pumped out.',
    picture,
    tests: {
      label: 'Tube',
      title: 'Drop the feather and the coin',
      text: 'Turn the tube over and watch the feather and coin fall. Then your teacher pumps the air out of the tube and you watch again.',
      why: 'The only difference between the two drops is the air in the tube.',
      task: 'turn the tube over',
      button: (x) => `Drop them: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.short}: what happens?`,
        task: 'record what happens',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Where is the feather when the coin lands?',
      }],
    },
    questions: [{
      q: 'Why does the feather fall slowly in air?',
      o: ['Air resistance on the feather is large compared with its weight', 'Feathers have no weight', 'Gravity does not pull on feathers'],
      hint: 'What force acts on a falling object as it moves through air?',
      right: 'Yes. A feather has a large surface and a small weight, so air resistance slows it a lot.',
    }, {
      q: 'Why do they land together in a vacuum?',
      o: ['There is no air resistance, so gravity makes them fall in the same way', 'The feather gets heavier', 'The coin gets lighter'],
      hint: 'What is missing in a vacuum?',
      right: 'Yes. Without air, nothing slows the feather, so all objects fall together.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'In air the coin landed first because air resistance slowed the feather. In a vacuum there was no air resistance, so the feather and coin fell together.',
      rows: [['In air', 'coin first'], ['In a vacuum', 'land together']],
    }),
  });
})();
