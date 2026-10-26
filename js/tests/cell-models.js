/* 3D models of plant and animal cells (Grade 6, Stage 7: 7Bs.02, 7Bs.04, 7TWSm.01). */
(function () {
  'use strict';
  const BOTH = 'Both';
  const PLANT = 'Plant cells only';
  const SAMPLES = [
    { name: 'Cell membrane', detail: 'Controls what goes in and out.', where: BOTH, model: 'A thin plastic bag', part: 'membrane' },
    { name: 'Cytoplasm', detail: 'Jelly-like; where reactions happen.', where: BOTH, model: 'Clear jelly', part: 'cytoplasm' },
    { name: 'Nucleus', detail: 'Controls the cell.', where: BOTH, model: 'A ping-pong ball', part: 'nucleus' },
    { name: 'Cell wall', detail: 'Strong layer that supports the cell.', where: PLANT, model: 'A shoebox', part: 'wall' },
    { name: 'Chloroplasts', detail: 'Make food by photosynthesis.', where: PLANT, model: 'Green peas', part: 'chloroplast' },
    { name: 'Vacuole', detail: 'Large space filled with cell sap.', where: PLANT, model: 'A water balloon', part: 'vacuole' },
  ];
  function picture(x, s) {
    const hi = (p) => (x.part === p ? { stroke: '#c0392b', 'stroke-width': 3.5 } : {});
    return s('g', null,
      s('rect', { x: -84, y: -46, width: 168, height: 92, rx: 4, fill: '#e3f1d4', stroke: '#6b8e3a', 'stroke-width': 4, ...hi('wall') }),
      s('rect', { x: -78, y: -40, width: 156, height: 80, rx: 3, fill: x.part === 'cytoplasm' ? '#f3e2a4' : '#f2f8ea', stroke: '#9aa5b1', 'stroke-width': 1.5, ...hi('membrane'), ...hi('cytoplasm') }),
      s('rect', { x: -40, y: -26, width: 86, height: 52, rx: 16, fill: '#d6e9f5', stroke: '#7f97a8', ...hi('vacuole') }),
      s('circle', { cx: -58, cy: -14, r: 13, fill: '#c9b2dd', stroke: '#7a4fa0', ...hi('nucleus') }),
      ...[[-60, 22], [62, -26], [64, 24], [-20, 33]].map(([cx, cy]) => s('ellipse', { cx, cy, rx: 8, ry: 5, fill: '#4f9a3a', stroke: '#2f6a22', ...hi('chloroplast') })));
  }
  Observation.run({
    id: 'g6-cellmodels',
    guide: '../practical.html#g6-cellmodels',
    objectives: ['I can build a 3D model of a plant or animal cell with labelled parts.', 'I can describe the strengths and limitations of my model.'],
    benchLabel: 'A plant cell diagram with one part outlined in red at a time, and three trays: parts found in both cells, in plant cells only and in animal cells only.',
    picture,
    tests: {
      label: 'Cell part',
      title: 'Plan your cell model',
      text: 'For each part (outlined in red), decide whether plant cells, animal cells or both have it, then choose the best material for your model.',
      why: 'Choosing a material that behaves like the real part makes your model more useful, and helps you explain what each part does.',
      task: 'look at the part outlined in red',
      button: (x) => `Look at the ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      columns: [{
        label: 'Found in',
        q: (x) => `Which cells have a ${x.name.toLowerCase().replace(/s$/, '')}?`,
        task: 'decide which cells have it',
        options: [BOTH, PLANT, 'Animal cells only'],
        answer: (x) => x.where,
        hint: () => 'Plant and animal cells both have a membrane, cytoplasm and a nucleus. Only plant cells have a cell wall, chloroplasts and a large vacuole.',
      }, {
        label: 'Model material',
        q: (x) => `What is the best material for the ${x.name.toLowerCase()}?`,
        task: 'choose a model material',
        options: SAMPLES.map((y) => y.model),
        answer: (x) => x.model,
        hint: (x) => `Think about what the ${x.name.toLowerCase()} is like: ${x.detail.toLowerCase()}`,
      }],
    },
    questions: [{
      q: 'What is one limitation of a 3D cell model?',
      o: ['It is far bigger than a real cell, the colours are not real and the parts are fixed in place', 'It shows where the parts are', 'It has labels'],
      hint: 'How is the model different from a real cell under the microscope?',
      right: 'Yes. Models help you see the parts and their positions, but they are not exactly like the real thing.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Both plant and animal cells have a membrane, cytoplasm and a nucleus. Only plant cells have a cell wall, chloroplasts and a large vacuole.',
      rows: rows.map((r) => [r.name, r.cells[1].toLowerCase()]),
    }),
  });
})();
