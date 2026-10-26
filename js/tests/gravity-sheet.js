/* Stretchy-sheet model of gravity (Grade 6, Stage 7: 7ESs.01, 7ESs.02, 7TWSm.01). */
(function () {
  'use strict';
  const SPIRAL = 'It curves in and spirals into the heavy ball';
  const ORBIT = 'It goes round the heavy ball a few times';
  const STRAIGHT = 'It hardly curves at all';
  const SAMPLES = [
    { name: 'Roll a marble slowly past the heavy ball', detail: 'Seen from above. The heavy ball makes a deep dip in the sheet.', a: SPIRAL, heavy: true, path: 'spiral' },
    { name: 'Roll it faster, at just the right speed', detail: 'Aim it to one side of the heavy ball.', a: ORBIT, heavy: true, path: 'orbit' },
    { name: 'Swap in a light ball and roll the marble past', detail: 'The light ball makes only a shallow dip.', a: STRAIGHT, heavy: false, path: 'straight' },
  ];
  function picture(x, s) {
    const g = s('g', null);
    const rings = x.heavy ? [26, 44, 64, 88] : [20, 40, 70];
    rings.forEach((r, i) => g.append(s('circle', { r, fill: 'none', stroke: '#9fb4c2', 'stroke-width': x.heavy ? 2.4 - i * 0.4 : 1, opacity: x.heavy ? 1 : 0.5 })));
    g.append(s('circle', { r: x.heavy ? 18 : 9, fill: x.heavy ? '#39424b' : '#9aa5b1' }));
    const d = x.path === 'spiral' ? 'M-150,-60 C-60,-70 40,-60 40,0 C40,30 10,30 4,12'
      : x.path === 'orbit' ? 'M-150,-50 C-60,-56 60,-60 60,0 C60,50 -50,50 -50,0 C-50,-34 30,-38 40,-6'
        : 'M-150,-50 C-50,-48 50,-44 150,-36';
    g.append(s('path', { d, fill: 'none', stroke: '#c0392b', 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }));
    return g;
  }
  Observation.run({
    id: 'g6-gravitywell',
    guide: '../practical.html#g6-gravitywell',
    objectives: ['I can use a stretchy-sheet model to show that bigger masses have stronger gravity.', 'I can evaluate the model.'],
    benchLabel: 'Seen from above: a stretchy sheet with a heavy ball making a dip in the middle, and the path of a marble rolled across it.',
    picture,
    tests: {
      label: 'What you do',
      title: 'Roll marbles across the sheet',
      text: 'Put the heavy ball in the middle of the sheet. Roll a marble past it at different speeds. Then swap in a light ball.',
      why: 'The dip in the sheet models how a big mass pulls on objects near it.',
      task: 'roll the marble',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What the marble does',
        q: (x) => `${x.name}: what does the marble do?`,
        task: 'record what the marble does',
        options: [SPIRAL, ORBIT, STRAIGHT],
        answer: (x) => x.a,
        hint: () => 'Follow the red dashed path of the marble.',
      }],
    },
    questions: [{
      q: 'What do the heavy ball and the light ball show about gravity?',
      o: ['Objects with more mass have stronger gravity', 'Light objects have stronger gravity', 'Mass makes no difference'],
      hint: 'Which ball made the deeper dip and bent the marble’s path more?',
      right: 'Yes. The heavy ball made a deeper dip, so the marble curved towards it more strongly.',
    }, {
      q: 'What is one limitation of this model?',
      o: ['The marbles slow down because of friction, but planets do not; and real gravity needs no sheet', 'It shows that bigger masses pull harder', 'It shows orbits'],
      hint: 'What happens in the model that does not happen in space?',
      right: 'Yes. Friction with the sheet makes the marble spiral in, which planets do not do.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The heavy ball made a deeper dip, so marbles curved towards it more strongly: objects with more mass have stronger gravity. At the right speed a marble circled the ball, like an orbit.',
      rows: [['Heavy ball, slow marble', 'spirals in'], ['Heavy ball, right speed', 'orbits'], ['Light ball', 'hardly curves']],
    }),
  });
})();
