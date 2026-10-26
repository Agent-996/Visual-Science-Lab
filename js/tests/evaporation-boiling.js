/* Evaporation compared with boiling (Grade 6, Stage 7: 7Cm.06, 7ESc.01). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'Drops of water on a watch glass on the windowsill', short: 'Evaporation', seen: 'The drops slowly get smaller and disappear', where: 'Only at the surface', temp: 'About 20 °C', kind: 'evap' },
    { name: 'A beaker of water heated until it boils', short: 'Boiling', seen: 'Big bubbles form and rise all through the water', where: 'All through the liquid', temp: '100 °C', kind: 'boil' },
  ];
  function picture(x, s) {
    if (x.kind === 'evap') return s('g', null, s('path', { d: 'M-90,10 Q0,40 90,10', fill: 'none', stroke: '#7f97a8', 'stroke-width': 3 }), ...[-40, 0, 36].map((cx) => s('ellipse', { cx, cy: 18, rx: 10, ry: 4, fill: 'rgba(80, 150, 215, 0.6)' })), ...[-40, 0, 36].map((cx) => s('circle', { cx: cx + 4, cy: -10, r: 2, fill: '#9fb4c2' })), s('circle', { cx: 110, cy: -50, r: 18, fill: '#ffd34d' }));
    const g = s('g', null, s('path', { d: 'M-50,-60 L-50,50 L50,50 L50,-60', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -49, y: -30, width: 98, height: 79, fill: 'rgba(160, 205, 235, 0.6)' }), s('path', { d: 'M-12,80 Q-16,62 0,52 Q16,62 12,80 Z', fill: '#3f7de0', opacity: 0.8 }));
    for (let i = 0; i < 12; i++) g.append(s('circle', { cx: -36 + (i * 19) % 72, cy: 40 - (i * 13) % 64, r: 3 + (i % 3), fill: 'rgba(255, 255, 255, 0.8)', stroke: '#5f88a3' }));
    return g;
  }
  Observation.run({
    id: 'g6-evaporation',
    guide: '../practical.html#g6-evaporation',
    objectives: ['I can describe the difference between evaporation and boiling.', 'I can explain evaporation using the particle model.'],
    benchLabel: 'Drops of water on a watch glass in sunlight, and a beaker of water boiling over a Bunsen flame.',
    picture,
    tests: {
      label: 'Change',
      title: 'Compare evaporation and boiling',
      text: 'Leave drops of water on a watch glass on the windowsill. Heat a beaker of water until it boils. Look at where the change happens and measure the temperature.',
      why: 'Both turn liquid water into a gas, but they happen in different ways.',
      task: 'look closely',
      button: (x) => `Look at the ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SAMPLES.map((y) => y.seen),
        answer: (x) => x.seen,
        hint: () => 'Look for bubbles inside the liquid.',
      }, {
        label: 'Where it happens',
        q: (x) => `${x.short}: where does the water turn into a gas?`,
        task: 'decide where it happens',
        options: ['Only at the surface', 'All through the liquid'],
        answer: (x) => x.where,
        hint: () => 'Bubbles of steam inside the water show gas forming all through it.',
      }, {
        label: 'Temperature',
        q: (x) => `${x.short}: what is the temperature of the water?`,
        task: 'read the temperature',
        options: ['About 20 °C', '100 °C'],
        answer: (x) => x.temp,
        hint: () => 'Water boils at 100 °C. Evaporation happens at any temperature.',
      }],
    },
    questions: [{
      q: 'Using the particle model, why can water evaporate at room temperature?',
      o: ['Some particles at the surface have enough energy to escape into the air', 'All the particles are at 100 °C', 'The Sun boils the water'],
      hint: 'Do all the particles in a liquid move at the same speed?',
      right: 'Yes. The fastest particles at the surface escape, so evaporation happens slowly at any temperature.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Evaporation happened only at the surface, at room temperature. Boiling happened all through the liquid, at the boiling point (100 °C for water).',
      rows: [['Evaporation', 'at the surface, any temperature'], ['Boiling', 'all through the liquid, at 100 °C']],
    }),
  });
})();
