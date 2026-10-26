/* Gas pressure: syringes and balloons (Grade 7, Stage 8: 8Pf.06, 8TWSm.01). */
(function () {
  'use strict';
  const SEEN = ['It gets harder to push, and springs back when you let go', 'The balloon shrinks', 'The balloon gets bigger'];
  const WHY = ['The particles are squashed closer, so they hit the walls more often', 'The particles move more slowly and hit the walls less hard', 'The particles move faster and hit the walls harder'];
  const SAMPLES = [
    { name: 'Push in the plunger of a sealed syringe of air', short: 'Sealed syringe', i: 0, kind: 'syringe' },
    { name: 'Put a blown-up balloon in cold water', short: 'Balloon in cold water', i: 1, kind: 'cold' },
    { name: 'Put the balloon in hot water', short: 'Balloon in hot water', i: 2, kind: 'hot' },
  ];
  function picture(x, s) {
    if (x.kind === 'syringe') return s('g', null, s('rect', { x: -110, y: -18, width: 160, height: 36, fill: 'rgba(214, 232, 242, 0.6)', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -40, y: -16, width: 10, height: 32, fill: '#6b7682' }), s('rect', { x: -30, y: -4, width: 130, height: 8, fill: '#9aa5b1' }), s('path', { d: 'M120,0 L104,0 M110,-6 L104,0 L110,6', stroke: '#c0392b', 'stroke-width': 3, fill: 'none' }), ...Array.from({ length: 12 }, (_, i) => s('circle', { cx: -104 + (i * 13) % 62, cy: -10 + (i * 7) % 20, r: 2.5, fill: '#2563d4' })), s('rect', { x: -116, y: -6, width: 6, height: 12, fill: '#39424b' }));
    const r = x.kind === 'hot' ? 56 : 34;
    return s('g', null, s('path', { d: 'M-110,0 Q-110,80 0,80 Q110,80 110,0', fill: x.kind === 'hot' ? 'rgba(230, 120, 80, 0.4)' : 'rgba(120, 180, 230, 0.45)', stroke: '#7f97a8', 'stroke-width': 2 }), s('circle', { cy: 30 - r, r, fill: '#e05a5a', opacity: 0.9 }), s('text', { x: 90, y: 70, 'font-size': 12, fill: '#455261' }, x.kind === 'hot' ? 'hot' : 'cold'));
  }
  Observation.run({
    id: 'g7-gaspressure',
    guide: '../practical.html#g7-gaspressure',
    objectives: ['I can show how gas pressure changes with volume and temperature.', 'I can explain gas pressure as particles hitting the walls.'],
    benchLabel: 'A sealed syringe of air with its plunger being pushed in, and a blown-up balloon in bowls of cold and hot water.',
    picture,
    tests: {
      label: 'Test',
      title: 'Squash and heat a gas',
      text: 'Push in the plunger of a sealed syringe, then put a blown-up balloon in cold water and then in hot water.',
      why: 'Gas pressure is caused by gas particles hitting the walls of their container.',
      task: 'try it',
      button: (x) => x.short,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see or feel',
        q: (x) => `${x.short}: what happens?`,
        task: 'record what happens',
        options: SEEN,
        answer: (x) => SEEN[x.i],
        hint: () => 'Look at the size of the balloon, or think about the push you feel.',
      }, {
        label: 'Why?',
        q: (x) => `${x.short}: why does this happen?`,
        task: 'explain it',
        options: WHY,
        answer: (x) => WHY[x.i],
        hint: () => 'Squashing a gas puts the particles closer together. Heating makes them move faster.',
      }],
    },
    questions: [{
      q: 'What causes the pressure of a gas?',
      o: ['Gas particles hitting the walls of the container', 'The weight of the container', 'The colour of the gas'],
      hint: 'Use your answers to the "why" questions.',
      right: 'Yes. The more often and the harder the particles hit the walls, the higher the pressure.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Squashing the air in the syringe raised its pressure because the particles hit the walls more often. Heating the balloon made the particles move faster and hit harder, so it got bigger; cooling made it shrink.',
      rows: [['Squashed gas', 'higher pressure'], ['Heated gas', 'expands'], ['Cooled gas', 'shrinks']],
    }),
  });
})();
