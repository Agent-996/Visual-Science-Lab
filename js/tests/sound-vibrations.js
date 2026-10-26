/* Seeing sound vibrations (Grade 6, Stage 7: 7Ps.01, 7TWSm.01). */
(function () {
  'use strict';
  const SEEN = ['The water splashes', 'The rice grains jump', 'The coils squash together and spread apart along the slinky', 'Nothing happens'];
  const SAMPLES = [
    { name: 'A ringing tuning fork touched on water', short: 'Tuning fork', seen: 0, kind: 'fork' },
    { name: 'Rice on a drum when it is tapped', short: 'Drum', seen: 1, kind: 'drum' },
    { name: 'A slinky pushed in and out at one end', short: 'Slinky', seen: 2, kind: 'slinky' },
  ];
  function picture(x, s) {
    if (x.kind === 'fork') return s('g', null, s('path', { d: 'M-8,-90 L-8,-10 M8,-90 L8,-10 M-8,-10 Q0,0 8,-10 M0,-4 L0,-110', stroke: '#8a96a3', 'stroke-width': 5, fill: 'none' }), s('rect', { x: -90, y: 0, width: 180, height: 50, fill: 'rgba(80, 150, 215, 0.55)' }), ...[-20, -8, 8, 20].map((cx, i) => s('circle', { cx, cy: -6 - (i % 2) * 10, r: 3, fill: '#5f9fd8' })));
    if (x.kind === 'drum') return s('g', null, s('ellipse', { cy: 0, rx: 90, ry: 20, fill: '#f4ead6', stroke: '#8a6236', 'stroke-width': 2 }), s('path', { d: 'M-90,0 L-90,60 Q0,80 90,60 L90,0', fill: '#c0392b', opacity: 0.8 }), ...Array.from({ length: 12 }, (_, i) => s('ellipse', { cx: -60 + i * 11, cy: -8 - (i % 3) * 10, rx: 3.5, ry: 1.8, fill: '#ffffff', stroke: '#c9b48a' })));
    const coils = [];
    for (let i = 0; i < 22; i++) {
      const xx = -130 + (i < 8 ? i * 6 : i < 14 ? 48 + (i - 8) * 18 : 156 + (i - 14) * 6) + (i >= 14 ? -50 : 0);
      coils.push(s('ellipse', { cx: xx, cy: 0, rx: 3, ry: 26, fill: 'none', stroke: '#8a96a3', 'stroke-width': 2 }));
    }
    return s('g', null, ...coils, s('path', { d: 'M-160,40 L-140,40 M-148,34 L-140,40 L-148,46', stroke: '#c0392b', 'stroke-width': 3, fill: 'none' }));
  }
  Observation.run({
    id: 'g6-vibrations',
    guide: '../practical.html#g6-vibrations',
    objectives: ['I can show that sounds are made by vibrating objects.', 'I can model a sound wave with a slinky.'],
    benchLabel: 'A tuning fork touching water, rice grains on a drum skin, and a slinky spring on the bench.',
    picture,
    tests: {
      label: 'Station',
      title: 'Look for vibrations',
      text: 'Make a sound at each station and look closely at what happens.',
      why: 'The vibrations are often too fast or too small to see directly, so water, rice and a slinky make them visible.',
      task: 'make the sound',
      button: (x) => `Try the ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the water, the rice or the coils.',
      }],
    },
    questions: [{
      q: 'What do all three stations show?',
      o: ['Sounds are made by vibrating objects', 'Sound only travels through water', 'Loud sounds are always high-pitched'],
      hint: 'What was making the water and rice move?',
      right: 'Yes. Every sound source vibrates.',
    }, {
      q: 'What does the slinky show about a sound wave?',
      o: ['The vibrations squash particles together and spread them apart along the direction the wave travels', 'The wave goes up and down like a rope', 'Sound moves the air from one place to another'],
      hint: 'Which way did the coils move compared with the way the wave travelled?',
      right: 'Yes. Sound is a longitudinal wave: the particles vibrate backwards and forwards along the direction it travels.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The water splashed and the rice jumped, showing that sound sources vibrate. On the slinky, the coils squashed together and spread apart in the direction the wave travelled.',
      rows: [['Tuning fork', 'water splashes'], ['Drum', 'rice jumps'], ['Slinky', 'squashes and stretches']],
    }),
  });
})();
