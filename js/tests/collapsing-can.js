/* Collapsing can (Grade 6, Stage 7: 7Cm.05, 7TWSa.04). */
(function () {
  'use strict';
  const SEEN = ['Steam comes out of the top', 'The can is crushed instantly with a crunch', 'Nothing happens to the can'];
  const SAMPLES = [
    { name: 'A little water is heated in the can until it boils', short: 'Heating', seen: 0, kind: 'heat' },
    { name: 'The can is flipped upside down into cold water', short: 'Into cold water', seen: 1, kind: 'crush' },
  ];
  function picture(x, s) {
    if (x.kind === 'heat') return s('g', null, s('rect', { x: -30, y: -50, width: 60, height: 90, rx: 6, fill: '#c9d1d9', stroke: '#6b7682', 'stroke-width': 2 }), s('path', { d: 'M-14,70 Q-18,52 0,42 Q18,52 14,70 Z', fill: '#3f7de0' }), ...[-10, 6].map((dx) => s('path', { d: `M${dx},-56 q8,-12 0,-24 q-8,-12 0,-24`, fill: 'none', stroke: '#9fb4c2', 'stroke-width': 3 })));
    return s('g', null, s('rect', { x: -120, y: 10, width: 240, height: 60, fill: 'rgba(120, 180, 230, 0.5)' }), s('path', { d: 'M-30,40 L-24,-10 L-34,-30 L-10,-40 L4,-24 L22,-44 L32,-14 L24,10 L30,40 Z', fill: '#c9d1d9', stroke: '#6b7682', 'stroke-width': 2 }), s('text', { x: 70, y: -40, 'font-size': 18, 'font-weight': 700, fill: '#c0392b' }, 'CRUNCH!'));
  }
  Observation.run({
    id: 'g6-can',
    guide: '../practical.html#g6-can',
    objectives: ['I can describe what happens when air pressure inside a can drops.', 'I can explain the collapse using air pressure from outside.'],
    benchLabel: 'An open drinks can with a little water being heated until steam comes out, then turned upside down into a bowl of cold water.',
    picture,
    tests: {
      label: 'Stage',
      title: 'Watch the demonstration',
      text: 'Your teacher heats a little water in a can until steam comes out, then flips it upside down into cold water with tongs. Watch and listen.',
      why: 'The steam pushes most of the air out of the can before it is cooled.',
      task: 'watch',
      button: (x) => `Watch: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.short}: what happens?`,
        task: 'record what happens',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the can in the picture.',
      }],
    },
    questions: [{
      q: 'Why is the can crushed?',
      o: ['The steam condenses, so there is very little gas inside, and the air pressure outside is much bigger', 'The cold water is heavy', 'The can melts'],
      hint: 'What happens to steam when it is cooled suddenly?',
      right: 'Yes. Steam condenses into a few drops of water. With almost no gas pushing out, the air pressure outside crushes the can.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The can was crushed instantly. The steam inside condensed, leaving very little gas inside, so the air pressure outside was much bigger than inside.',
      rows: [['Heated', 'steam comes out'], ['Into cold water', 'crushed instantly']],
    }),
  });
})();
