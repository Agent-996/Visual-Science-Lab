/* Ball on a string: a model of an orbit (Grade 6, Stage 7: 7ESs.02, 7TWSm.01). */
(function () {
  'use strict';
  const CIRCLE = 'It moves in a circle';
  const PULL = 'It moves in a circle and you feel a bigger pull';
  const OFF = 'It flies off in a straight line';
  const SAMPLES = [
    { name: 'Swing the ball steadily', detail: 'Swing it in a horizontal circle above your head (seen from above).', a: CIRCLE, kind: 'steady' },
    { name: 'Swing the ball faster', detail: 'Same string, more speed.', a: PULL, kind: 'fast' },
    { name: 'Let go of the string', detail: 'Only in a clear space, with nobody nearby!', a: OFF, kind: 'free' },
  ];
  function picture(x, s) {
    const a = -Math.PI / 4;
    const bx = Math.cos(a) * 80;
    const by = Math.sin(a) * 80;
    const g = s('g', null, s('circle', { r: 80, fill: 'none', stroke: '#9aa5b1', 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }), s('circle', { r: 10, fill: '#e2b48c', stroke: '#b5835a' }));
    if (x.kind !== 'free') g.append(s('line', { x1: 0, y1: 0, x2: bx, y2: by, stroke: '#8a6236', 'stroke-width': x.kind === 'fast' ? 4 : 2 }));
    else g.append(s('path', { d: `M${bx},${by} L${bx + 90},${by + 90}`, stroke: '#c0392b', 'stroke-width': 2.5, 'stroke-dasharray': '6 4', fill: 'none' }), s('path', { d: `M${bx + 90},${by + 90} l-12,-2 l6,-8 z`, fill: '#c0392b' }));
    const ball = x.kind === 'free' ? [bx + 60, by + 60] : [bx, by];
    g.append(s('circle', { cx: ball[0], cy: ball[1], r: 12, fill: '#3b6fb6', stroke: '#1d3f70', 'stroke-width': 1.5 }));
    if (x.kind === 'fast') g.append(s('path', { d: `M${bx * 0.75},${by * 0.75} L${bx * 0.35},${by * 0.35}`, stroke: '#c0392b', 'stroke-width': 3 }), s('text', { x: bx * 0.55 + 10, y: by * 0.55 - 4, 'font-size': 12, 'font-weight': 700, fill: '#c0392b' }, 'bigger pull'));
    return g;
  }
  Observation.run({
    id: 'g6-orbit',
    guide: '../practical.html#g6-orbit',
    objectives: ['I can model how gravity keeps a planet in orbit.', 'I can say what the string represents in the model.'],
    benchLabel: 'Seen from above: a ball on a string swung in a circle around a hand, and what happens when the string is let go.',
    picture,
    tests: {
      label: 'What you do',
      title: 'Swing the ball',
      text: 'Swing the ball in a horizontal circle. Notice the pull in the string. Predict what will happen if you let go, then try it carefully in a clear space.',
      why: 'The ball needs a pull towards the centre to keep moving in a circle, just like a planet going round the Sun.',
      task: 'try it',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.name}: what happens?`,
        task: 'record what happens',
        options: [CIRCLE, PULL, OFF, 'It falls straight towards your hand'],
        answer: (x) => x.a,
        hint: () => 'Look at the path of the ball in the picture.',
      }],
    },
    questions: [{
      q: 'In this model of the Solar System, what does the string represent?',
      o: ['The pull of the Sun’s gravity', 'The planet', 'The Sun'],
      hint: 'What keeps the ball moving in a circle?',
      right: 'Yes. Gravity pulls each planet towards the Sun, just as the string pulls the ball towards your hand.',
    }, {
      q: 'If the Sun’s gravity suddenly disappeared, what would the Earth do?',
      o: ['Fly off in a straight line', 'Keep going round the Sun', 'Fall into the Sun'],
      hint: 'What did the ball do when you let go?',
      right: 'Yes. Without a pull towards the centre, an object keeps moving in a straight line.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The string pulled the ball towards the centre and kept it moving in a circle, just as gravity from the Sun keeps planets in orbit. When the string was let go, the ball flew off in a straight line.',
      rows: [['The string', 'gravity'], ['The ball', 'a planet'], ['Your hand', 'the Sun']],
    }),
  });
})();
