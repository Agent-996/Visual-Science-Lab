/* Balanced and unbalanced forces on a trolley (Grade 7, Stage 8: 8Pf.03). */
(function () {
  'use strict';
  const MOTION = ['It stays still', 'It keeps moving at a steady speed', 'It speeds up to the right', 'It speeds up to the left'];
  const SAMPLES = [
    { name: 'Still trolley: 5 N left and 5 N right', left: 5, right: 5, moving: false, res: '0 N', m: 0 },
    { name: 'Still trolley: 5 N left and 8 N right', left: 5, right: 8, moving: false, res: '3 N to the right', m: 2 },
    { name: 'Moving trolley: 5 N left and 5 N right', left: 5, right: 5, moving: true, res: '0 N', m: 1 },
    { name: 'Still trolley: 6 N left and 2 N right', left: 6, right: 2, moving: false, res: '4 N to the left', m: 3 },
  ];
  function picture(x, s) {
    const arrow = (dir, n) => {
      const len = n * 12;
      const x0 = dir < 0 ? -60 : 60;
      return s('g', null, s('path', { d: `M${x0},0 L${x0 + dir * len},0`, stroke: '#c0392b', 'stroke-width': 4 }), s('path', { d: `M${x0 + dir * len},0 l${-dir * 10},-7 l0,14 z`, fill: '#c0392b' }), s('text', { x: x0 + (dir * len) / 2, y: -10, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#c0392b' }, `${n} N`));
    };
    return s('g', null,
      s('rect', { x: -60, y: -20, width: 120, height: 40, rx: 6, fill: '#4f8fd8', stroke: '#2f6db5' }),
      s('circle', { cx: -34, cy: 26, r: 9, fill: '#39424b' }), s('circle', { cx: 34, cy: 26, r: 9, fill: '#39424b' }),
      s('line', { x1: -170, x2: 170, y1: 35, y2: 35, stroke: '#8a96a3', 'stroke-width': 2 }),
      x.moving ? s('text', { x: 0, y: 60, 'text-anchor': 'middle', 'font-size': 12, fill: '#455261' }, 'already moving to the right') : null,
      arrow(-1, x.left), arrow(1, x.right));
  }
  Observation.run({
    id: 'g7-balanced',
    guide: '../practical.html#g7-balanced',
    objectives: ['I can show what happens to a trolley when forces are balanced and unbalanced.', 'I can calculate the resultant force.'],
    benchLabel: 'A trolley on a runway pulled by two newtonmeters in opposite directions, with the size of each force shown by an arrow.',
    picture,
    tests: {
      label: 'Forces',
      title: 'Pull the trolley both ways',
      text: 'Pull the trolley with two forces in opposite directions. Work out the resultant force and watch what the trolley does.',
      why: 'The resultant force is the single force that has the same effect as all the forces together.',
      task: 'pull with these forces',
      button: (x) => `Pull: ${x.left} N left, ${x.right} N right${x.moving ? ' (moving)' : ''}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Resultant force',
        q: (x) => `${x.left} N left and ${x.right} N right: what is the resultant force?`,
        task: 'work out the resultant force',
        options: ['0 N', '3 N to the right', '4 N to the left', '13 N to the right'],
        answer: (x) => x.res,
        hint: () => 'Forces in opposite directions: take the smaller one away from the bigger one. The resultant points the way of the bigger force.',
      }, {
        label: 'Motion',
        q: (x) => `${x.name}: what does the trolley do?`,
        task: 'record what the trolley does',
        options: MOTION,
        answer: (x) => MOTION[x.m],
        hint: () => 'Balanced forces (0 N) do not change the motion. An unbalanced force speeds the trolley up in its direction.',
      }],
    },
    questions: [{
      q: 'A trolley is moving with balanced forces on it. What happens?',
      o: ['It keeps moving at the same speed in the same direction', 'It stops straight away', 'It speeds up'],
      hint: 'Look at the moving trolley in your table.',
      right: 'Yes. Balanced forces do not change motion: a still object stays still and a moving one keeps moving steadily.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Balanced forces (resultant 0 N) left the trolley still or moving at a steady speed. Unbalanced forces made it speed up in the direction of the resultant force.',
      rows: rows.map((r) => [`${r.sample.left} N left, ${r.sample.right} N right${r.sample.moving ? ' (moving)' : ''}`, `${r.cells[0]}: ${r.cells[1].toLowerCase()}`]),
    }),
  });
})();
