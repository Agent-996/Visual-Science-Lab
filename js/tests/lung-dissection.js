/* Lung dissection (Grade 7, Stage 8: 8Bs.03). */
(function () {
  'use strict';
  const SEEN = ['Stiff C-shaped rings of cartilage', 'They inflate like a sponge', 'It floats', 'It sinks straight to the bottom'];
  const WHY = ['They keep the trachea open so air can always get through', 'The lungs are elastic and full of tiny air sacs', 'Lung tissue is full of air in tiny sacs (alveoli)'];
  const SAMPLES = [
    { name: 'Look closely at the trachea (windpipe)', short: 'Trachea', seen: 0, why: 0, kind: 'trachea' },
    { name: 'Pump air into the lungs through the trachea', short: 'Inflating the lungs', seen: 1, why: 1, kind: 'inflate' },
    { name: 'Drop a small piece of lung tissue into water', short: 'Lung tissue in water', seen: 2, why: 2, kind: 'float' },
  ];
  function picture(x, s) {
    if (x.kind === 'trachea') return s('g', null, s('rect', { x: -22, y: -90, width: 44, height: 180, rx: 10, fill: '#f0c8c0', stroke: '#b5776a' }), ...Array.from({ length: 10 }, (_, i) => s('path', { d: `M-20,${-80 + i * 17} Q0,${-72 + i * 17} 20,${-80 + i * 17}`, fill: 'none', stroke: '#f8f2ea', 'stroke-width': 5 })));
    if (x.kind === 'inflate') return s('g', null, s('rect', { x: -8, y: -90, width: 16, height: 50, fill: '#f0c8c0', stroke: '#b5776a' }), s('path', { d: 'M-8,-42 Q-90,-40 -86,40 Q-60,90 -10,40 Z M8,-42 Q90,-40 86,40 Q60,90 10,40 Z', fill: '#e8a0a8', stroke: '#b5576a', 'stroke-width': 2 }));
    return s('g', null, s('path', { d: 'M-70,-40 L-70,70 L70,70 L70,-40', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -69, y: -20, width: 138, height: 89, fill: 'rgba(160, 205, 235, 0.55)' }), s('ellipse', { cy: -20, rx: 20, ry: 10, fill: '#e8a0a8', stroke: '#b5576a' }));
  }
  Observation.run({
    id: 'g7-lungdissection',
    guide: '../practical.html#g7-lungdissection',
    objectives: ['I can identify the trachea, bronchi and lung tissue.', 'I can describe how the structure of the lungs suits gas exchange.'],
    benchLabel: 'A set of lungs on a dissecting tray: the trachea with its rings, the lungs being inflated with a pump, and a small piece of lung tissue in a beaker of water.',
    picture,
    tests: {
      label: 'Stage',
      title: 'Watch the dissection',
      text: 'Your teacher shows the trachea, inflates the lungs with a pump, and drops a small piece of lung into water.',
      why: 'Looking at real lungs shows how their structure suits their job of gas exchange.',
      task: 'watch closely',
      button: (x) => `Watch: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the picture of this stage.',
      }, {
        label: 'Why?',
        q: (x) => `${x.short}: why?`,
        task: 'explain it',
        options: WHY,
        answer: (x) => WHY[x.why],
        hint: () => 'Think about what each part needs to do.',
      }],
    },
    questions: [{
      q: 'Why are the lungs made of millions of tiny alveoli?',
      o: ['They give a huge surface area for gas exchange', 'They make the lungs heavier', 'They stop air getting in'],
      hint: 'More, smaller sacs means more of what?',
      right: 'Yes. A huge surface area lets lots of oxygen and carbon dioxide diffuse quickly.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Rings of cartilage keep the trachea open. The lungs inflated like a sponge and the tissue floated, because it is full of tiny air sacs (alveoli) that give a huge surface area for gas exchange.',
      rows: [['Trachea', 'rings of cartilage'], ['Lungs', 'inflate like a sponge'], ['Lung tissue', 'floats']],
    }),
  });
})();
