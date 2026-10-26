/* Making a bioplastic (Grade 7, Stage 8: 8ESp.02). */
(function () {
  'use strict';
  const SEEN = ['It bends without snapping', 'It has started to break down', 'No change at all'];
  const SAMPLES = [
    { name: 'Bend the dried bioplastic film', seen: 0, made: 'Plants (renewable)', kind: 'bend' },
    { name: 'Bioplastic left in damp soil for 4 weeks', seen: 1, made: 'Plants (renewable)', kind: 'rotten' },
    { name: 'Ordinary plastic bag left in damp soil for 4 weeks', seen: 2, made: 'Crude oil (non-renewable)', kind: 'bag' },
  ];
  function picture(x, s) {
    if (x.kind === 'bend') return s('path', { d: 'M-90,20 Q0,-70 90,20', fill: 'none', stroke: 'rgba(230, 220, 170, 0.95)', 'stroke-width': 16, 'stroke-linecap': 'round' });
    const g = s('g', null, s('rect', { x: -110, y: -10, width: 220, height: 80, fill: '#6b4a2f' }));
    if (x.kind === 'rotten') g.append(s('path', { d: 'M-60,-30 L-20,-34 L-10,-20 L20,-32 L50,-26 L40,-12 L-50,-10 Z', fill: 'rgba(230, 220, 170, 0.9)', stroke: '#8a7650' }), ...[-30, 0, 24].map((cx) => s('circle', { cx, cy: -22, r: 5, fill: '#6b4a2f' })));
    else g.append(s('rect', { x: -60, y: -40, width: 120, height: 30, rx: 3, fill: '#4aa3df', 'fill-opacity': 0.85, stroke: '#1f6fa8' }));
    return g;
  }
  Observation.run({
    id: 'g7-bioplastic',
    guide: '../practical.html#g7-bioplastic',
    objectives: ['I can make a plastic from starch or milk.', 'I can compare bioplastics with plastics made from crude oil.'],
    benchLabel: 'A dried film of bioplastic made from cornflour, and pieces of bioplastic and an ordinary plastic bag after four weeks in damp soil.',
    picture,
    tests: {
      label: 'Test',
      title: 'Test your bioplastic',
      text: 'Mix cornflour, water, glycerol and vinegar, heat gently until it thickens, spread it out and leave it to dry. Then test it and compare it with ordinary plastic.',
      why: 'Comparing the bioplastic with ordinary plastic shows the advantages and disadvantages of each.',
      task: 'carry out the test',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.name}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the shape and the edges of the material.',
      }, {
        label: 'Made from',
        q: () => 'What is this plastic made from?',
        task: 'decide what it is made from',
        options: ['Plants (renewable)', 'Crude oil (non-renewable)'],
        answer: (x) => x.made,
        hint: () => 'Cornflour comes from maize plants. Most ordinary plastics are made from crude oil.',
      }],
    },
    questions: [{
      q: 'Give one advantage of bioplastics over plastics made from crude oil.',
      o: ['They are made from a renewable resource and many are biodegradable', 'They last for ever in the soil', 'They are made from crude oil'],
      hint: 'Look at both of your columns.',
      right: 'Yes. Plants can be grown again, and microorganisms can break many bioplastics down.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Starch formed a flexible plastic film. It began to break down in soil, but the ordinary plastic bag did not change. Bioplastics come from renewable plants and many are biodegradable.',
      rows: [['Bioplastic', 'flexible; breaks down in soil'], ['Ordinary plastic', 'no change in soil']],
    }),
  });
})();
