/* Diffusion model with Visking tubing (Grade 7, Stage 8: 8Bs.04, 8TWSm.02). */
(function () {
  'use strict';
  const COLOURS = { 'Blue-black': '#1c1a3a', 'Orange-brown': '#c47a2a', Colourless: '#e9f1f6', Milky: '#f2f2ea' };
  const SAMPLES = [
    { name: 'Starch solution inside the tubing', short: 'Inside the tubing', c: 'Blue-black', moved: 'Iodine particles moved in through the tubing' },
    { name: 'Iodine solution outside the tubing', short: 'Outside the tubing', c: 'Orange-brown', moved: 'Starch particles did not move out' },
  ];
  const picture = (x, s) => s('g', null,
    s('path', { d: 'M-70,-70 L-70,70 L70,70 L70,-70', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }),
    s('rect', { x: -69, y: -40, width: 138, height: 109, fill: 'rgba(196, 122, 42, 0.55)' }),
    s('rect', { x: -22, y: -80, width: 44, height: 130, rx: 14, fill: '#1c1a3a', stroke: '#8a96a3', 'stroke-width': 2 }),
    s('circle', { cx: x.c === 'Blue-black' ? 0 : 48, cy: 20, r: 30, fill: 'none', stroke: '#c0392b', 'stroke-width': 3, 'stroke-dasharray': '5 4' }));
  Observation.run({
    id: 'g7-visking',
    guide: '../practical.html#g7-visking',
    objectives: ['I can use Visking tubing to model diffusion through a membrane.', 'I can link the model to gas exchange in the alveoli.'],
    benchLabel: 'A tube of Visking tubing filled with starch solution, standing in a beaker of orange iodine solution, after 15 minutes.',
    picture,
    tests: {
      label: 'Where',
      title: 'Compare inside and outside',
      text: 'Fill the Visking tubing with starch solution, rinse it, and stand it in water with iodine solution. After 15 minutes, compare the colours inside and outside.',
      why: 'Iodine turns blue-black where there is starch, so the colours show which particles have moved through the tubing.',
      task: 'look at the circled part',
      button: (x) => `Look ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Colour',
        q: (x) => `${x.short}: what colour is it after 15 minutes?`,
        task: 'record the colour',
        options: Object.keys(COLOURS),
        swatches: COLOURS,
        answer: (x) => x.c,
        hint: () => 'Look inside the circle.',
      }, {
        label: 'What moved?',
        q: () => 'What does this tell you?',
        task: 'explain what moved',
        options: SAMPLES.map((y) => y.moved),
        answer: (x) => x.moved,
        hint: () => 'Blue-black inside means iodine got in. Outside staying orange means starch did not get out.',
      }],
    },
    questions: [{
      q: 'Why could iodine pass through the tubing but starch could not?',
      o: ['Iodine particles are small enough to pass through the tiny holes, but starch molecules are too big', 'Starch is heavier', 'The tubing only lets liquids out'],
      hint: 'Think about the size of the particles and the holes in the tubing.',
      right: 'Yes. Visking tubing is partially permeable: small particles diffuse through, large ones cannot.',
    }, {
      q: 'In the lungs, what does the Visking tubing represent?',
      o: ['The thin walls of the alveoli that gases diffuse through', 'The trachea', 'The ribs'],
      hint: 'Where do oxygen and carbon dioxide diffuse in the lungs?',
      right: 'Yes. Oxygen and carbon dioxide diffuse through the thin alveolus walls.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The starch inside turned blue-black, but the water outside stayed orange. Small iodine particles diffused in through the tubing, but the large starch molecules could not get out.',
      rows: [['Inside the tubing', 'blue-black'], ['Outside the tubing', 'orange-brown']],
    }),
  });
})();
