/* Chicken wing dissection (Grade 7, Stage 8: 8Bs.01). */
(function () {
  'use strict';
  const SEEN = ['The joint bends', 'The joint straightens', 'Shiny white cords that join muscle to bone (tendons)', 'A smooth, slippery white layer on the ends of the bones (cartilage)'];
  const SAMPLES = [
    { name: 'Pull the muscle on the top of the upper wing', short: 'Pull the top muscle', seen: 0, kind: 'bend' },
    { name: 'Pull the muscle underneath the upper wing', short: 'Pull the bottom muscle', seen: 1, kind: 'straight' },
    { name: 'Look at the ends of the muscles', short: 'Ends of the muscles', seen: 2, kind: 'tendon' },
    { name: 'Look at the joint itself', short: 'The joint', seen: 3, kind: 'joint' },
  ];
  function picture(x, s) {
    const bent = x.kind === 'bend';
    return s('g', null,
      s('rect', { x: -120, y: -14, width: 110, height: 28, rx: 12, fill: '#f0c8b0', stroke: '#b5776a' }),
      s('g', { transform: `rotate(${bent ? -55 : 0} -10 0)` }, s('rect', { x: -10, y: -12, width: 110, height: 24, rx: 10, fill: '#f0c8b0', stroke: '#b5776a' })),
      s('circle', { cx: -10, cy: 0, r: 13, fill: '#f8f4ec', stroke: x.kind === 'joint' ? '#c0392b' : '#b5a27a', 'stroke-width': x.kind === 'joint' ? 3 : 1.5 }),
      s('path', { d: 'M-110,-14 Q-60,-34 -18,-12', fill: 'none', stroke: x.kind === 'tendon' ? '#c0392b' : '#d96a6a', 'stroke-width': x.kind === 'bend' ? 7 : 4 }),
      s('path', { d: 'M-110,14 Q-60,34 -18,12', fill: 'none', stroke: '#d96a6a', 'stroke-width': x.kind === 'straight' ? 7 : 4 }),
      x.kind === 'tendon' ? s('path', { d: 'M-24,-12 L-6,-6', stroke: '#ffffff', 'stroke-width': 4 }) : null);
  }
  Observation.run({
    id: 'g7-chickenwing',
    guide: '../practical.html#g7-chickenwing',
    objectives: ['I can identify muscles, tendons and the joint in a chicken wing.', 'I can show how antagonistic muscles move a joint.'],
    benchLabel: 'A chicken wing with the skin removed, showing the muscles on the top and bottom of the upper wing, the tendons and the elbow joint.',
    picture,
    tests: {
      label: 'Step',
      title: 'Explore the wing',
      text: 'With the skin removed, pull each muscle gently and watch the joint. Then look at the ends of the muscles and the joint itself.',
      why: 'A chicken wing has the same arrangement of bones, muscles and tendons as your arm.',
      task: 'look closely',
      button: (x) => x.short,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the part outlined or moving in the picture.',
      }],
    },
    questions: [{
      q: 'Why do the two muscles work as an antagonistic pair?',
      o: ['Muscles can only pull, so one bends the joint and the other straightens it', 'Both muscles bend the joint', 'One muscle pushes and one pulls'],
      hint: 'What did each muscle do when you pulled it?',
      right: 'Yes. Because muscles can only pull, a pair working in opposite directions is needed to move a joint both ways.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Pulling one muscle bent the joint and pulling the other straightened it: they are an antagonistic pair. Tendons attach muscles to bones, and cartilage protects the ends of the bones at the joint.',
      rows: [['Top muscle', 'bends the joint'], ['Bottom muscle', 'straightens the joint'], ['Tendons', 'join muscle to bone']],
    }),
  });
})();
