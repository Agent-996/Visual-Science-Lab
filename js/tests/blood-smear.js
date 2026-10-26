/* Red and white blood cells (Grade 7, Stage 8: 8Bs.02). */
(function () {
  'use strict';
  const NAMES = ['Red blood cell', 'White blood cell', 'Platelet'];
  const JOBS = ['Carries oxygen', 'Fights infection', 'Helps blood to clot'];
  const Z = 1.6;
  const SAMPLES = [
    { name: 'The many small pink discs', short: 'Pink discs', k: 0, ring: [-55, 50, 22] },
    { name: 'The larger cell with a purple, lobed nucleus', short: 'Larger purple cell', k: 1, ring: [30 * Z, -20 * Z, 26] },
    { name: 'The tiny purple fragments', short: 'Tiny fragments', k: 2, ring: [-22 * Z, 36 * Z, 26] },
  ];
  Observation.run({
    id: 'g7-bloodsmear',
    guide: '../practical.html#g7-bloodsmear',
    objectives: ['I can identify red blood cells and white blood cells on a prepared slide.', 'I can describe how red blood cells are adapted to carry oxygen.'],
    benchLabel: 'The view down a light microscope of a stained blood smear at high power, with one type of cell circled at a time.',
    picture: (x, s) => Microscope.view(s, 'blood', 400, { zoom: Z, ring: x.ring }),
    tests: {
      label: 'Part of the slide',
      title: 'Identify the blood cells',
      text: 'Look at the prepared blood smear on high power. Identify the cells circled in yellow.',
      why: 'The stain colours the nucleus of white blood cells purple, so they stand out from the red cells.',
      task: 'look at the circled cells',
      button: (x) => `Look at: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Cell',
        q: (x) => `${x.name}: what are they?`,
        task: 'name the cells',
        options: NAMES,
        answer: (x) => NAMES[x.k],
        hint: () => 'Red cells are small pink discs with no nucleus. White cells are bigger with a purple nucleus. Platelets are tiny fragments.',
      }, {
        label: 'Job',
        q: (x) => `What is the job of the ${NAMES[x.k].toLowerCase()}?`,
        task: 'choose its job',
        options: JOBS,
        answer: (x) => JOBS[x.k],
        hint: () => 'Red cells transport, white cells defend, platelets seal cuts.',
      }],
    },
    questions: [{
      q: 'How is a red blood cell adapted to carry oxygen?',
      o: ['It has no nucleus and a dented disc shape, so it has lots of room and a large surface for oxygen', 'It has a large nucleus', 'It is very long and thin'],
      hint: 'What is missing from red blood cells that other cells have?',
      right: 'Yes. With no nucleus there is more room for haemoglobin, and the disc shape gives a large surface area.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Red blood cells are small pink discs with no nucleus, adapted to carry oxygen. White blood cells are larger with a purple nucleus and fight infection. Platelets are tiny fragments that help blood clot.',
      rows: [['Red blood cells', 'carry oxygen'], ['White blood cells', 'fight infection'], ['Platelets', 'help blood clot']],
    }),
  });
})();
