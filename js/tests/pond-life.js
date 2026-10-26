/* Living single-celled organisms in pond water (Grade 6, Stage 7: 7Bs.01). */
(function () {
  'use strict';
  const NAMES = ['Paramecium', 'Euglena', 'Amoeba', 'Spirogyra'];
  const SAMPLES = [
    { name: 'Organism A', slide: 'paramecium', a: 'Paramecium', green: 'No' },
    { name: 'Organism B', slide: 'euglena', a: 'Euglena', green: 'Yes' },
    { name: 'Organism C', slide: 'amoeba', a: 'Amoeba', green: 'No' },
    { name: 'Organism D', slide: 'spirogyra', a: 'Spirogyra', green: 'Yes' },
  ];
  Observation.run({
    id: 'g6-pondlife',
    guide: '../practical.html#g6-pondlife',
    objectives: ['I can find and observe living single-celled organisms under a microscope.', 'I can explain that a microorganism can be made of just one cell.'],
    benchLabel: 'The view down a light microscope of a drop of pond water, showing one organism at a time.',
    picture: (x, s) => Microscope.view(s, x.slide, 100),
    tests: {
      label: 'Organism',
      title: 'Identify the pond organisms',
      text: 'Put a drop of pond water on a slide and add a coverslip. Use this key: Paramecium is slipper-shaped and covered in tiny hairs. Euglena is green with a whip-like tail and a red eye spot. Amoeba is a blob that changes shape. Spirogyra is a chain of cells with spiral green bands.',
      why: 'A key helps you name organisms from features you can see.',
      task: 'look at the organism',
      button: (x) => `Look at ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Name',
        q: (x) => `${x.name}: what is it?`,
        task: 'identify the organism',
        options: NAMES,
        answer: (x) => x.a,
        hint: () => 'Hairs all over = Paramecium; green with a tail = Euglena; shapeless blob = Amoeba; chain with spirals = Spirogyra.',
      }, {
        label: 'Chloroplasts?',
        q: (x) => `${x.name}: does it have chloroplasts?`,
        task: 'look for chloroplasts',
        options: ['Yes', 'No'],
        answer: (x) => x.green,
        hint: () => 'Chloroplasts are green.',
      }],
    },
    questions: [{
      q: 'What does this practical show about microorganisms?',
      o: ['A living thing can be made of just one cell', 'All living things are made of many cells', 'Pond water contains no living things'],
      hint: 'How many cells make up Paramecium, Euglena and Amoeba?',
      right: 'Yes. Each of these organisms is a single cell that carries out all seven life processes.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'A drop of pond water held several living organisms. Paramecium, Euglena and Amoeba are each made of just one cell; Euglena and Spirogyra have chloroplasts.',
      rows: rows.map((r) => [r.name, r.cells[0]]),
    }),
  });
})();
