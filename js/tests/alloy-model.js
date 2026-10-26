/* Particle model of why alloys are hard (Grade 6, Stage 7: 7Cp.07, 7TWSm.01). */
(function () {
  'use strict';
  const SLIDE = 'The rows slide over each other easily';
  const JAM = 'The rows jam and do not slide';
  const SAMPLES = [
    { name: 'Pure metal', detail: 'Marbles all the same size, packed in neat rows. Push one side.', alloy: false },
    { name: 'Alloy', detail: 'A few bigger balls mixed in among the marbles. Push again.', alloy: true },
  ];
  // Four rows of atoms; in the pure metal the top two rows have slid along.
  function picture(x, s) {
    const g = s('g', null);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 9; col++) {
        const big = x.alloy && (row * 9 + col) % 7 === 3;
        const shift = !x.alloy && row < 2 ? 14 : 0;
        g.append(s('circle', { cx: -96 + col * 24 + shift, cy: -36 + row * 24, r: big ? 15 : 11.5, fill: big ? '#c46f3c' : '#aab3bb', stroke: '#4a5058', 'stroke-width': 1 }));
      }
    }
    g.append(s('path', { d: 'M-150,-30 L-122,-30 M-130,-36 L-122,-30 L-130,-24', stroke: '#c0392b', 'stroke-width': 3, fill: 'none' }));
    return g;
  }
  Observation.run({
    id: 'g6-alloymodel',
    guide: '../practical.html#g6-alloymodel',
    objectives: ['I can model the arrangement of atoms in a pure metal and in an alloy.', 'I can explain why different-sized atoms make an alloy harder.'],
    benchLabel: 'A tray of marbles in rows modelling the atoms in a metal, pushed from one side. In the alloy some bigger balls are mixed in.',
    picture,
    tests: {
      label: 'Model',
      title: 'Push the rows of atoms',
      text: 'Pack marbles in neat rows to model a pure metal and push one side gently. Then add a few bigger balls to model an alloy and push again.',
      why: 'When a metal bends, layers of atoms slide over each other. The model lets you see how easily that happens.',
      task: 'push the side of the tray',
      button: (x) => `Push the ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.name}: what happens when you push?`,
        task: 'record what happens',
        options: [SLIDE, JAM],
        answer: (x) => (x.alloy ? JAM : SLIDE),
        hint: () => 'Look at the top two rows. Have they moved along?',
      }, {
        label: 'So the metal is…',
        q: (x) => `So is the ${x.name.toLowerCase()} soft or hard?`,
        task: 'decide whether it is soft or hard',
        options: ['Soft: easy to bend', 'Hard: difficult to bend'],
        answer: (x) => (x.alloy ? 'Hard: difficult to bend' : 'Soft: easy to bend'),
        hint: () => 'If the rows slide easily, the metal bends easily.',
      }],
    },
    questions: [{
      q: 'Why is steel (iron with a little carbon) harder than pure iron?',
      o: ['Atoms of a different size disrupt the rows, so they cannot slide over each other easily', 'Carbon atoms are glue', 'Steel has fewer atoms'],
      hint: 'Think about what the bigger balls did in the model.',
      right: 'Yes. The different-sized atoms stop the layers sliding, so the alloy is harder.',
    }, {
      q: 'What is one limitation of the marble model?',
      o: ['Real atoms are far smaller and are held together by forces, not just packed in a tray', 'It shows the atoms in rows', 'It uses different sizes'],
      hint: 'How is the model different from a real metal?',
      right: 'Yes. Models simplify things: real metal atoms are tiny and are held together by strong forces.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Neat rows of same-sized atoms slide over each other easily, so pure metals are soft. Different-sized atoms in an alloy stop the rows sliding, so alloys are harder.',
      rows: [['Pure metal', 'rows slide: soft'], ['Alloy', 'rows jam: hard']],
    }),
  });
})();
