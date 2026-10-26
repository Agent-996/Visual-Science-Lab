/* Virus models: are viruses alive? (Grade 6, Stage 7: 7Bp.02, 7TWSm.01). */
(function () {
  'use strict';
  const NO = 'No';
  const HOST = 'Only inside a host cell';
  const SAMPLES = [
    { name: 'Movement', detail: 'Moving all or part of the body by itself.', a: NO },
    { name: 'Respiration', detail: 'Releasing energy from food.', a: NO },
    { name: 'Sensitivity', detail: 'Detecting and responding to surroundings.', a: NO },
    { name: 'Growth', detail: 'Getting bigger over time.', a: NO },
    { name: 'Reproduction', detail: 'Making more of itself.', a: HOST },
    { name: 'Excretion', detail: 'Getting rid of waste.', a: NO },
    { name: 'Nutrition', detail: 'Taking in food.', a: NO },
  ];
  Observation.run({
    id: 'g6-virus',
    guide: '../practical.html#g6-virus',
    objectives: ['I can describe the structure of a virus using a model.', 'I can argue whether viruses are living, using the characteristics of life.'],
    benchLabel: 'A model virus: a protein coat with spikes on the outside and genetic material inside, with the seven life processes to check one at a time.',
    picture: (x, s) => s('g', null,
      ...Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return s('g', null, s('line', { x1: Math.cos(a) * 34, y1: Math.sin(a) * 34, x2: Math.cos(a) * 46, y2: Math.sin(a) * 46, stroke: '#8a4bb0', 'stroke-width': 3 }), s('circle', { cx: Math.cos(a) * 48, cy: Math.sin(a) * 48, r: 4, fill: '#b07fd0' }));
      }),
      s('circle', { r: 34, fill: '#e9dbf3', stroke: '#8a4bb0', 'stroke-width': 3 }),
      s('path', { d: 'M-18,-6 q6,-12 12,0 t12,0 t12,0 M-18,8 q6,-12 12,0 t12,0 t12,0', fill: 'none', stroke: '#c0392b', 'stroke-width': 2.5 })),
    tests: {
      label: 'Life process',
      title: 'Check each life process',
      text: 'Go through the seven life processes one at a time. Decide whether a virus can do each one on its own.',
      why: 'To count as living, something must carry out all seven life processes.',
      task: 'think about this life process',
      button: (x) => `Check ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      columns: [{
        label: 'Can a virus do it?',
        q: (x) => `${x.name}: can a virus do this on its own?`,
        task: 'decide whether a virus can do it',
        options: ['Yes', NO, HOST],
        answer: (x) => x.a,
        hint: () => 'A virus is just a protein coat with genetic material inside. It has no cell parts of its own to do this.',
        right: (x) => (x.a === HOST ? 'Yes. A virus can only reproduce by taking over a host cell and making it build new viruses.' : `Yes. A virus cannot carry out ${x.name.toLowerCase()} on its own.`),
      }],
    },
    questions: [{
      q: 'Are viruses living?',
      o: ['Most scientists say no: they cannot carry out life processes on their own and only reproduce inside a host cell', 'Yes: they carry out all seven life processes', 'Yes, because they are made of cells'],
      hint: 'How many of the seven life processes can a virus do on its own?',
      right: 'Yes. Viruses are on the edge of life: they can only reproduce inside a living host cell.',
    }, {
      q: 'How does the size of a virus compare with a cell?',
      o: ['Viruses are much smaller than cells', 'Viruses are bigger than most cells', 'They are the same size'],
      hint: 'A virus can get inside a cell.',
      right: 'Yes. Most viruses are about a hundred times smaller than a typical cell, so you need an electron microscope to see them.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'A virus cannot move, respire, sense, grow, excrete or feed on its own. It can only reproduce inside a host cell, so most scientists do not count viruses as living.',
      rows: [['Life processes on its own', 'none'], ['Reproduction', 'only inside a host cell']],
    }),
  });
})();
