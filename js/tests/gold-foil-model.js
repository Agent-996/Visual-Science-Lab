/* Modelling Rutherford’s gold-foil experiment (Grade 7, Stage 8: 8Cm.01, 8SIC.04). */
(function () {
  'use strict';
  const THROUGH = 'Went straight through';
  const BENT = 'Was deflected to one side';
  const BACK = 'Bounced back';
  const SAMPLES = [
    { name: 'Roll 1: near the top edge', y: -42, a: THROUGH },
    { name: 'Roll 2: straight at the middle', y: 0, a: BACK },
    { name: 'Roll 3: just above the middle', y: -13, a: BENT },
    { name: 'Roll 4: near the bottom edge', y: 40, a: THROUGH },
    { name: 'Roll 5: halfway down', y: 22, a: THROUGH },
  ];
  function picture(x, s) {
    const end = x.a === BACK ? 'L-12,0 L-120,8' : x.a === BENT ? `L-14,${x.y} L120,${x.y - 50}` : `L120,${x.y}`;
    return s('g', null,
      s('rect', { x: -70, y: -50, width: 140, height: 100, fill: '#c89b62', opacity: 0.35, stroke: '#8a6236' }),
      s('circle', { r: 12, fill: 'none', stroke: '#8a6236', 'stroke-dasharray': '3 3' }),
      s('text', { x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#8a6236' }, '?'),
      s('path', { d: `M-140,${x.y} ${end}`, fill: 'none', stroke: '#c0392b', 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }),
      s('circle', { cx: -140, cy: x.y, r: 6, fill: '#3b6fb6' }));
  }
  Observation.run({
    id: 'g7-rutherford',
    guide: '../practical.html#g7-rutherford',
    objectives: ['I can use a marble model to work out the shape of a hidden object.', 'I can explain how the gold-foil experiment showed that atoms have a small, dense nucleus.'],
    benchLabel: 'A board raised on legs with a small hidden object underneath. Marbles are rolled under it from the left and their paths are shown.',
    picture,
    tests: {
      label: 'Roll',
      title: 'Roll marbles under the board',
      text: 'You cannot see what is under the board. Roll marbles under it along different lines and record what happens to each one.',
      why: 'Like Rutherford, you can work out the shape of something you cannot see from how it changes the paths of things fired at it.',
      task: 'roll the marble',
      button: (x) => x.name,
      samples: SAMPLES,
      columns: [{
        label: 'What happened?',
        q: (x) => `${x.name}: what happened to the marble?`,
        task: 'record what happened',
        options: [THROUGH, BENT, BACK],
        answer: (x) => x.a,
        hint: () => 'Follow the red dashed path of the marble.',
      }],
    },
    questions: [{
      q: 'Most marbles went straight through. What does this tell you about the hidden object?',
      o: ['It is small: most of the space under the board is empty', 'It fills the whole space', 'There is nothing there'],
      hint: 'How many marbles hit anything?',
      right: 'Yes. Rutherford found that most alpha particles went straight through gold foil, so atoms are mostly empty space.',
    }, {
      q: 'A few alpha particles bounced back off the gold foil. What did this show?',
      o: ['Each atom has a tiny, dense, positive nucleus', 'Atoms are solid all the way through', 'Gold is soft'],
      hint: 'In the model, what made a marble bounce back?',
      right: 'Yes. Only a direct hit on the small, dense nucleus could turn an alpha particle back.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Most marbles went straight through and only one bounced back, so the hidden object was small and in the middle. Rutherford’s gold-foil experiment showed in the same way that atoms are mostly empty space with a tiny, dense nucleus.',
      rows: [THROUGH, BENT, BACK].map((k) => [k, `${rows.filter((r) => r.cells[0] === k).length} of ${rows.length}`]),
    }),
  });
})();
