/* Static electricity (Grade 7, Stage 8: 8Cm.02, 8Cm.03). */
(function () {
  'use strict';
  const SEEN = ['They repel (push apart)', 'They attract (pull together)', 'The water bends towards the balloon', 'Nothing happens'];
  const SAMPLES = [
    { name: 'Charged polythene rod near another charged polythene rod', short: 'Polythene and polythene', seen: 0, charges: 'Like charges (both negative)', kind: 'rods', a: '#4a525b', b: '#4a525b', push: true },
    { name: 'Charged acetate rod near a charged polythene rod', short: 'Acetate and polythene', seen: 1, charges: 'Opposite charges', kind: 'rods', a: '#4a525b', b: '#d8e6ee', push: false },
    { name: 'Charged acetate rod near another charged acetate rod', short: 'Acetate and acetate', seen: 0, charges: 'Like charges (both positive)', kind: 'rods', a: '#d8e6ee', b: '#d8e6ee', push: true },
    { name: 'Charged balloon near a thin stream of water', short: 'Balloon and water', seen: 2, charges: 'A charged object and an uncharged one', kind: 'water' },
  ];
  function picture(x, s) {
    if (x.kind === 'water') return s('g', null, s('rect', { x: -10, y: -90, width: 20, height: 12, fill: '#8a96a3' }), s('path', { d: 'M0,-78 Q4,-20 40,60', fill: 'none', stroke: 'rgba(80, 150, 215, 0.8)', 'stroke-width': 4 }), s('ellipse', { cx: 80, cy: 0, rx: 30, ry: 38, fill: '#e05a5a' }));
    const turn = x.push ? 30 : -14;
    return s('g', null,
      s('line', { x1: -40, y1: -80, x2: -40, y2: -22, stroke: '#6b7682' }),
      s('g', { transform: `rotate(${turn} -40 -20)` }, s('rect', { x: -130, y: -26, width: 140, height: 12, rx: 6, fill: x.a, stroke: '#2b333b' })),
      s('rect', { x: 20, y: 20, width: 140, height: 12, rx: 6, fill: x.b, stroke: '#2b333b', transform: 'rotate(-12 20 26)' }));
  }
  Observation.run({
    id: 'g7-static',
    guide: '../practical.html#g7-static',
    objectives: ['I can charge materials by rubbing and show attraction and repulsion.', 'I can explain charging as the transfer of electrons.'],
    benchLabel: 'A charged rod balanced on a stirrup hanging from a thread, with a second charged rod brought near it, and a charged balloon held near a thin stream of tap water.',
    picture,
    tests: {
      label: 'Test',
      title: 'Bring charged objects together',
      text: 'Rub each rod with a cloth to charge it. Hang one in the stirrup and bring the other near it. Then hold a charged balloon near a thin stream of water.',
      why: 'The hanging rod turns easily, so it shows even a small force between the charges.',
      task: 'bring them close',
      button: (x) => `Try: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.short}: what happens?`,
        task: 'record what happens',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Did the hanging rod turn away, or towards the other rod?',
      }, {
        label: 'Charges',
        q: (x) => `${x.short}: what charges are involved?`,
        task: 'decide which charges are involved',
        options: ['Like charges (both negative)', 'Like charges (both positive)', 'Opposite charges', 'A charged object and an uncharged one'],
        answer: (x) => x.charges,
        hint: () => 'Polythene becomes negative when rubbed; acetate becomes positive. Tap water is uncharged.',
      }],
    },
    questions: [{
      q: 'When a polythene rod is rubbed with a cloth, why does it become negatively charged?',
      o: ['Electrons move from the cloth onto the rod', 'Protons move off the rod', 'The cloth makes new electrons'],
      hint: 'Which particles can move when two materials are rubbed together?',
      right: 'Yes. Only electrons move. The material that gains electrons becomes negative; the one that loses them becomes positive.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Two charged polythene rods repelled, as did two acetate rods. Polythene and acetate attracted. Like charges repel and opposite charges attract. A charged balloon also attracted uncharged water.',
      rows: [['Like charges', 'repel'], ['Opposite charges', 'attract']],
    }),
  });
})();
