/* Model arm with antagonistic muscles (Grade 7, Stage 8: 8Bs.01, 8TWSm.01). */
(function () {
  'use strict';
  const BEND = 'The arm bends at the elbow';
  const STRAIGHT = 'The arm straightens';
  const SAMPLES = [
    { name: 'Pull the front string (biceps)', short: 'Biceps contracts', a: BEND, bent: true },
    { name: 'Pull the back string (triceps)', short: 'Triceps contracts', a: STRAIGHT, bent: false },
  ];
  function picture(x, s) {
    const elbow = [-20, 34];
    const r = ((x.bent ? -45 : 82) * Math.PI) / 180;
    const at = (d) => [elbow[0] + Math.cos(r) * d, elbow[1] + Math.sin(r) * d];
    const hand = at(100);
    const grip = at(34);
    return s('g', null,
      s('rect', { x: -32, y: -96, width: 24, height: 134, rx: 8, fill: '#e6dccb', stroke: '#8a6236', 'stroke-width': 2 }),
      s('line', { x1: elbow[0], y1: elbow[1], x2: hand[0], y2: hand[1], stroke: '#c9a46a', 'stroke-width': 22, 'stroke-linecap': 'round' }),
      s('circle', { cx: elbow[0], cy: elbow[1], r: 5, fill: '#5d6874' }),
      s('path', { d: `M-6,-80 Q${x.bent ? 34 : 0},${x.bent ? -24 : -10} ${grip[0] + 9},${grip[1] - 4}`, fill: 'none', stroke: x.bent ? '#c0392b' : '#8a96a3', 'stroke-width': x.bent ? 5 : 2.5 }),
      s('path', { d: `M-34,-80 Q${x.bent ? -64 : -46},-10 ${elbow[0] - 14},${elbow[1] + 12}`, fill: 'none', stroke: x.bent ? '#8a96a3' : '#c0392b', 'stroke-width': x.bent ? 2.5 : 5 }),
      s('text', { x: 30, y: -40, 'font-size': 12, 'font-weight': 700, fill: '#455261' }, 'biceps'),
      s('text', { x: -112, y: -40, 'font-size': 12, 'font-weight': 700, fill: '#455261' }, 'triceps'));
  }
  Observation.run({
    id: 'g7-modelarm',
    guide: '../practical.html#g7-modelarm',
    objectives: ['I can build a model arm with biceps and triceps.', 'I can explain how antagonistic muscles bend and straighten the elbow.'],
    benchLabel: 'A card model of an arm: the upper and lower arm joined at the elbow with a split pin, with a string on the front for the biceps and one on the back for the triceps.',
    picture,
    tests: {
      label: 'Muscle pulled',
      title: 'Pull each string',
      text: 'Pull the front string, then the back string. Watch what the arm does and what happens to the other string.',
      why: 'The strings model muscles. A muscle can only pull when it contracts; it cannot push.',
      task: 'pull the string',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What the arm does',
        q: (x) => `${x.name}: what does the arm do?`,
        task: 'record what the arm does',
        options: [BEND, STRAIGHT],
        answer: (x) => x.a,
        hint: () => 'Look at the angle at the elbow.',
      }, {
        label: 'The other muscle',
        q: (x) => `${x.name}: what does the other muscle do?`,
        task: 'record what the other muscle does',
        options: ['It relaxes', 'It contracts too'],
        answer: () => 'It relaxes',
        hint: () => 'Look at the grey string. Is it being pulled tight?',
      }],
    },
    questions: [{
      q: 'Why are the biceps and triceps called an antagonistic pair?',
      o: ['They pull in opposite directions: when one contracts, the other relaxes', 'They both bend the arm', 'They work at the same time'],
      hint: 'Compare what each muscle does to the arm.',
      right: 'Yes. Antagonistic muscles work against each other to move a joint both ways.',
    }, {
      q: 'Why does the arm need two muscles to bend and straighten?',
      o: ['Muscles can only pull, not push', 'One muscle is not strong enough', 'The second muscle is a spare'],
      hint: 'Can a string push the arm back?',
      right: 'Yes. Because muscles can only pull, each movement back needs its own muscle.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'When the biceps contracted, the arm bent and the triceps relaxed. When the triceps contracted, the arm straightened and the biceps relaxed. They are an antagonistic pair.',
      rows: [['Biceps contracts', 'arm bends'], ['Triceps contracts', 'arm straightens']],
    }),
  });
})();
