/* Scale model of the asteroid belt and the galaxy (Grade 7, Stage 8: 8ESs.01, 8ESs.02, 8TWSm.01). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'Mercury', detail: '0.4 AU from the Sun', au: 0.4, a: '0.4 m' },
    { name: 'Earth', detail: '1 AU from the Sun', au: 1, a: '1 m' },
    { name: 'Mars', detail: '1.5 AU from the Sun', au: 1.5, a: '1.5 m' },
    { name: 'Asteroid belt', detail: '2 to 3 AU from the Sun', au: 2.5, a: '2–3 m' },
    { name: 'Jupiter', detail: '5.2 AU from the Sun', au: 5.2, a: '5.2 m' },
    { name: 'Neptune', detail: '30 AU from the Sun', au: 30, a: '30 m' },
  ];
  function picture(x, s) {
    const px = (au) => -150 + Math.min(au, 6) * 50;
    const g = s('g', null, s('line', { x1: -150, x2: 160, y1: 20, y2: 20, stroke: '#8a96a3', 'stroke-width': 2 }), s('circle', { cx: -150, cy: 20, r: 12, fill: '#ffd34d' }));
    for (let m = 0; m <= 6; m++) g.append(s('line', { x1: px(m), x2: px(m), y1: 14, y2: 26, stroke: '#8a96a3' }), s('text', { x: px(m), y: 44, 'text-anchor': 'middle', 'font-size': 11, fill: '#455261' }, `${m} m`));
    if (x.name === 'Asteroid belt') for (let i = 0; i < 14; i++) g.append(s('circle', { cx: px(2) + i * 3.6, cy: 20 + ((i * 7) % 11) - 5, r: 1.8, fill: '#6b5a48' }));
    else if (x.au > 6) g.append(s('path', { d: 'M150,6 l14,14 l-14,14', fill: 'none', stroke: '#c0392b', 'stroke-width': 3 }), s('text', { x: 150, y: -6, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#c0392b' }, 'much further →'));
    else g.append(s('circle', { cx: px(x.au), cy: 20, r: 6, fill: '#3b6fb6' }));
    return g;
  }
  Observation.run({
    id: 'g7-scalemodel',
    guide: '../practical.html#g7-scalemodel',
    objectives: ['I can build a scale model of distances in the Solar System.', 'I can describe where the asteroid belt is and how big the galaxy is.'],
    benchLabel: 'A scale line starting at the Sun, marked in metres, where 1 metre stands for 1 astronomical unit (the distance from the Earth to the Sun).',
    picture,
    tests: {
      label: 'Object',
      title: 'Pace out the Solar System',
      text: 'Use the scale 1 m = 1 AU (the Earth–Sun distance). Put the Sun at one end and work out how far away to place each object.',
      why: 'Space is far too big to draw to scale on paper. Pacing it out helps you feel how big the distances are.',
      task: 'work out where it goes',
      button: (x) => `Place ${x.name === 'Asteroid belt' ? 'the asteroid belt' : x.name}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Distance in the model',
        q: (x) => `${x.name} is ${x.detail.replace(' from the Sun', '')} from the Sun. How far from the Sun is it in your model?`,
        task: 'choose the distance',
        options: SAMPLES.map((y) => y.a),
        answer: (x) => x.a,
        hint: () => 'With 1 m = 1 AU, the number of metres is the same as the number of AU.',
      }],
    },
    questions: [{
      q: 'Where is the asteroid belt?',
      o: ['Between Mars and Jupiter', 'Between the Earth and Mars', 'Beyond Neptune'],
      hint: 'Look at your distances for Mars, the asteroid belt and Jupiter.',
      right: 'Yes. The asteroid belt is a ring of rocky objects 2–3 AU from the Sun, between Mars and Jupiter.',
    }, {
      q: 'At this scale, roughly how far away would the nearest star be?',
      o: ['About 270 km away', 'About 50 m away', 'About 3 km away'],
      hint: 'The nearest star is about 270 000 AU away.',
      right: 'Yes. Even the nearest star is hundreds of kilometres away at this scale. Space is mostly empty, and our galaxy is about 100 000 light years across.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'At a scale of 1 m = 1 AU, the planets spread out over 30 m, with the asteroid belt between Mars and Jupiter. The nearest star would be about 270 km away.',
      rows: rows.map((r) => [r.name, r.cells[0]]),
    }),
  });
})();
