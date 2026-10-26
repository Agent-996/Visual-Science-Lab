/* Diffusion of a smell and of a coloured crystal (Grade 6, Stage 7: 7Cm.06). */
(function () {
  'use strict';
  const SEEN = ['People at the front smell it first, then people further back', 'Everyone smells it at exactly the same moment', 'The purple colour slowly spreads out through the water on its own', 'The purple colour stays as a dot'];
  const SAMPLES = [
    { name: 'Air freshener sprayed at the front of the room', short: 'Air freshener', seen: 0, kind: 'room' },
    { name: 'A crystal of potassium manganate(VII) in still water, 10 minutes later', short: 'Purple crystal', seen: 2, kind: 'crystal' },
  ];
  function picture(x, s) {
    if (x.kind === 'room') {
      const g = s('g', null, s('rect', { x: -150, y: -70, width: 300, height: 140, fill: '#ffffff', stroke: '#c9d1d9' }), s('rect', { x: -146, y: -20, width: 14, height: 40, fill: '#5d6874' }));
      for (let i = 0; i < 40; i++) g.append(s('circle', { cx: -128 + Math.pow((i * 37) % 100 / 100, 2) * 250, cy: -60 + (i * 53) % 120, r: 3, fill: '#8e44ad', opacity: 0.7 }));
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) g.append(s('circle', { cx: -80 + c * 60, cy: -40 + r * 40, r: 8, fill: c === 0 ? '#e2b48c' : '#d9dee2', stroke: '#8a96a3' }));
      return g;
    }
    return s('g', null, s('path', { d: 'M-70,-70 L-70,70 L70,70 L70,-70', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('rect', { x: -69, y: -50, width: 138, height: 119, fill: 'rgba(214, 232, 242, 0.6)' }), s('ellipse', { cx: 0, cy: 50, rx: 60, ry: 40, fill: '#8e44ad', opacity: 0.35 }), s('ellipse', { cx: 0, cy: 60, rx: 30, ry: 16, fill: '#6c2a8a', opacity: 0.6 }));
  }
  Observation.run({
    id: 'g6-diffusion',
    guide: '../practical.html#g6-diffusion',
    objectives: ['I can describe diffusion as particles spreading out from where there are many to where there are few.', 'I can explain diffusion using the particle model.'],
    benchLabel: 'A classroom with air freshener sprayed at the front, and a beaker of still water with a purple crystal at the bottom.',
    picture,
    tests: {
      label: 'Demonstration',
      title: 'Watch the demonstrations',
      text: 'Put your hand up when you smell the air freshener. Then watch the purple crystal in still water for 10 minutes, without stirring.',
      why: 'Nobody moves the particles: they spread out on their own because they move randomly.',
      task: 'watch closely',
      button: (x) => `Watch: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you notice',
        q: (x) => `${x.short}: what do you notice?`,
        task: 'record what you notice',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at where the purple particles are in the picture.',
      }],
    },
    questions: [{
      q: 'What is diffusion?',
      o: ['Particles spreading out from where there are many to where there are few', 'Particles being stirred', 'Particles disappearing'],
      hint: 'Where did the particles start, and where did they move to?',
      right: 'Yes. Particles move randomly and spread from a high concentration to a low concentration.',
    }, {
      q: 'Why did the smell spread faster than the purple colour?',
      o: ['Gas particles move faster and have more space than particles in a liquid', 'The crystal is heavier than the room', 'Water stops diffusion'],
      hint: 'Compare particles in a gas and in a liquid.',
      right: 'Yes. Diffusion is faster in gases than in liquids.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The smell and the purple colour spread out slowly on their own. Particles move randomly and spread from where there are many of them to where there are fewer. This is diffusion.',
      rows: [['Air freshener', 'front of the room smelled it first'], ['Purple crystal', 'colour spread out on its own']],
    }),
  });
})();
