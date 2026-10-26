/* Mapping magnetic field lines (Grade 7, Stage 8: 8Pe.01, 8TWSa.05). */
(function () {
  'use strict';
  const DIRS = ['Away from the north pole', 'Towards the south pole', 'Along the magnet, from the N end towards the S end'];
  const SAMPLES = [
    { name: 'Compass just beyond the north pole', short: 'Beyond N', at: [-130, 0], angle: 180, a: 0 },
    { name: 'Compass just beyond the south pole', short: 'Beyond S', at: [130, 0], angle: 180, a: 1 },
    { name: 'Compass beside the middle of the magnet', short: 'Beside the middle', at: [0, -55], angle: 0, a: 2 },
  ];
  function picture(x, s) {
    const g = s('g', null);
    [30, 55, 85].forEach((h) => g.append(s('path', { d: `M-70,0 C-70,${-h * 1.6} 70,${-h * 1.6} 70,0 M-70,0 C-70,${h * 1.6} 70,${h * 1.6} 70,0`, fill: 'none', stroke: '#b9c6d2', 'stroke-width': 1.2 })));
    g.append(s('rect', { x: -70, y: -14, width: 70, height: 28, fill: '#d64545' }), s('rect', { x: 0, y: -14, width: 70, height: 28, fill: '#3b6fb6' }), s('text', { x: -56, y: 6, 'font-size': 16, 'font-weight': 700, fill: '#fff' }, 'N'), s('text', { x: 48, y: 6, 'font-size': 16, 'font-weight': 700, fill: '#fff' }, 'S'));
    const [cx, cy] = x.at;
    const point = x.a === 0 ? 180 : x.a === 1 ? 180 : 0;
    g.append(s('circle', { cx, cy, r: 16, fill: '#ffffff', stroke: '#33404d', 'stroke-width': 2 }), s('g', { transform: `translate(${cx} ${cy}) rotate(${point})` }, s('path', { d: 'M12,0 L-2,-4 L-2,4 Z', fill: '#d64545' }), s('path', { d: 'M-12,0 L-2,-4 L-2,4 Z', fill: '#9aa5b1' })));
    return g;
  }
  Observation.run({
    id: 'g7-fieldlines',
    guide: '../practical.html#g7-fieldlines',
    objectives: ['I can map the magnetic field around a bar magnet with plotting compasses and iron filings.', 'I can draw field lines with arrows from north to south.'],
    benchLabel: 'A bar magnet under paper with a faint pattern of iron filings, and a plotting compass placed at different points around it.',
    picture,
    tests: {
      label: 'Compass position',
      title: 'Map the field with a compass',
      text: 'Sprinkle iron filings over the paper to see the pattern. Then put a plotting compass at different places and see which way its red (north) end points.',
      why: 'A compass needle lines up with the magnetic field, so its north end shows the direction of the field line at that point.',
      task: 'look at the compass',
      button: (x) => `Put the compass ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Compass points',
        q: (x) => `${x.name}: which way does the red end of the needle point?`,
        task: 'record the direction',
        options: DIRS,
        answer: (x) => DIRS[x.a],
        hint: () => 'Look at which way the red end of the needle points compared with the magnet.',
      }],
    },
    questions: [{
      q: 'Which way do magnetic field lines go?',
      o: ['From the north pole to the south pole', 'From the south pole to the north pole', 'Straight out in all directions'],
      hint: 'Put your three compass directions together.',
      right: 'Yes. Field lines leave the north pole and curve round to the south pole.',
    }, {
      q: 'Where is the magnetic field strongest?',
      o: ['Near the poles, where the field lines are closest together', 'In the middle of the magnet’s side', 'Far away from the magnet'],
      hint: 'Where were the iron filings most crowded?',
      right: 'Yes. The closer together the field lines, the stronger the field.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The compass pointed away from the north pole, towards the south pole, and along the magnet beside it. Field lines leave the north pole and curve round to the south pole, closest together at the poles.',
      rows: [['Beyond N', 'points away from N'], ['Beyond S', 'points towards S'], ['Beside the magnet', 'points from N towards S']],
    }),
  });
})();
