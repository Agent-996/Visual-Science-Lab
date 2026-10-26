/* Electric bell in a vacuum (Grade 6, Stage 7: 7Ps.01, 7Cm.05). */
(function () {
  'use strict';
  const SEEN = ['Loud ringing, and the hammer hits the bell', 'The sound fades, but the hammer still hits the bell', 'The ringing gets loud again'];
  const SAMPLES = [
    { name: 'The bell rings inside the jar full of air', short: 'Jar full of air', seen: 0, bars: 5 },
    { name: 'The air is pumped out slowly', short: 'Air pumped out', seen: 1, bars: 1 },
    { name: 'The air is let back in', short: 'Air let back in', seen: 2, bars: 5 },
  ];
  function picture(x, s) {
    const g = s('g', null,
      s('path', { d: 'M-90,70 L-90,-30 Q-90,-90 0,-90 Q90,-90 90,-30 L90,70 Z', fill: 'rgba(214, 232, 242, 0.35)', stroke: '#7f97a8', 'stroke-width': 2 }),
      s('rect', { x: -110, y: 70, width: 220, height: 10, fill: '#6b7682' }),
      s('path', { d: 'M-30,10 A30,30 0 0 1 30,10 Z', fill: '#d4b04a', stroke: '#9a7a20' }),
      s('line', { x1: 0, y1: 40, x2: 18, y2: 6, stroke: '#4a525b', 'stroke-width': 3 }), s('circle', { cx: 18, cy: 6, r: 5, fill: '#4a525b' }));
    for (let k = 0; k < 5; k++) g.append(s('rect', { x: 120 + k * 10, y: 40 - k * 12, width: 7, height: 20 + k * 12, fill: k < x.bars ? '#2563d4' : '#dfe5ea' }));
    return g;
  }
  Observation.run({
    id: 'g6-bellvacuum',
    guide: '../practical.html#g6-bellvacuum',
    objectives: ['I can show that sound needs a medium to travel through.', 'I can explain why sound cannot travel through a vacuum.'],
    benchLabel: 'An electric bell ringing inside a glass bell jar connected to a vacuum pump, with a meter showing how loud it sounds.',
    picture,
    tests: {
      label: 'Stage',
      title: 'Listen and watch',
      text: 'Your teacher switches on the bell, then pumps the air out slowly, then lets the air back in. Listen to the sound and watch the hammer.',
      why: 'You can see the bell all the time, so you can tell whether it is still ringing even when you cannot hear it.',
      task: 'listen and watch',
      button: (x) => `Listen: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you notice',
        q: (x) => `${x.short}: what do you notice?`,
        task: 'record what you notice',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the loudness bars and at the hammer.',
      }],
    },
    questions: [{
      q: 'Why does the sound fade when the air is removed?',
      o: ['Sound needs particles to pass on the vibrations, and there are almost none left', 'The bell stops working', 'The glass blocks the sound'],
      hint: 'The hammer was still hitting the bell. What was missing?',
      right: 'Yes. Sound cannot travel through a vacuum because there are no particles to vibrate.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The sound faded as the air was removed, even though the hammer kept hitting the bell. Sound needs particles to pass on vibrations, so it cannot travel through a vacuum.',
      rows: [['In air', 'loud'], ['In a near vacuum', 'almost silent'], ['Air let back in', 'loud again']],
    }),
  });
})();
