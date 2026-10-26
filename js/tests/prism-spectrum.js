/* Splitting white light with a prism (Grade 7, Stage 8: 8Ps.03). */
(function () {
  'use strict';
  const COLOURS = { Red: '#e03131', Orange: '#f08c00', Yellow: '#fcc419', Green: '#2f9e44', Blue: '#1c7ed6', Indigo: '#4c3fb0', Violet: '#8e44ad' };
  const SAMPLES = [
    { name: 'The colour bent the least (top of the band)', short: 'Bent least', c: 'Red', k: 0 },
    { name: 'The colour in the middle of the band', short: 'Middle', c: 'Green', k: 3 },
    { name: 'The colour bent the most (bottom of the band)', short: 'Bent most', c: 'Violet', k: 6 },
  ];
  function picture(x, s) {
    const g = s('g', null, s('path', { d: 'M-40,40 L0,-50 L40,40 Z', fill: 'rgba(214, 232, 242, 0.6)', stroke: '#7f97a8', 'stroke-width': 2 }), s('line', { x1: -150, y1: -20, x2: -22, y2: 0, stroke: '#ffffff', 'stroke-width': 4 }), s('line', { x1: -150, y1: -20, x2: -22, y2: 0, stroke: '#9aa5b1', 'stroke-width': 1 }), s('rect', { x: 130, y: -50, width: 8, height: 110, fill: '#f4f6f8', stroke: '#9aa5b1' }));
    Object.values(COLOURS).forEach((c, i) => g.append(s('path', { d: `M18,4 L130,${-30 + i * 12} L130,${-24 + i * 12} Z`, fill: c, opacity: 0.85 })));
    g.append(s('rect', { x: 138, y: -32 + x.k * 12, width: 18, height: 10, fill: 'none', stroke: '#1f2a33', 'stroke-width': 2 }));
    return g;
  }
  Observation.run({
    id: 'g7-prism',
    guide: '../practical.html#g7-prism',
    objectives: ['I can use a prism to split white light into a spectrum.', 'I can explain dispersion.'],
    benchLabel: 'A narrow beam of white light from a ray box entering a triangular glass prism and spreading into a band of colours on a white screen.',
    picture,
    tests: {
      label: 'Part of the spectrum',
      title: 'Look at the spectrum',
      text: 'Shine a narrow beam of white light into the prism and turn it until a band of colours appears on the screen. Look at the part of the band marked with a box.',
      why: 'Each colour of light refracts by a different amount in glass, so the colours spread out.',
      task: 'look at the marked colour',
      button: (x) => `Look at the colour: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Colour',
        q: (x) => `${x.name}: which colour is it?`,
        task: 'name the colour',
        options: Object.keys(COLOURS),
        swatches: COLOURS,
        answer: (x) => x.c,
        hint: () => 'The order is red, orange, yellow, green, blue, indigo, violet.',
      }],
    },
    questions: [{
      q: 'What does the prism show about white light?',
      o: ['White light is a mixture of all the colours of the spectrum', 'The prism adds colours to the light', 'White light is one single colour'],
      hint: 'Where did all the colours come from?',
      right: 'Yes. The prism separates the colours that were already mixed in the white light. This is called dispersion.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The prism split white light into red, orange, yellow, green, blue, indigo and violet. Each colour refracts by a different amount: violet bends most and red least.',
      rows: [['Bent least', 'red'], ['Bent most', 'violet']],
    }),
  });
})();
