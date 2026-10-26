/* Building a key for school-grounds specimens (Grade 6, Stage 7: 7Bp.04). */
(function () {
  'use strict';
  const GOOD = 'Yes: anyone would give the same answer';
  const BAD = 'No: people could disagree';
  const SAMPLES = [
    { name: '“Is the leaf pretty?”', short: 'Is it pretty?', a: BAD, why: 'Right: “pretty” is an opinion, so two people could answer differently.' },
    { name: '“Are the leaf edges jagged?”', short: 'Jagged edges?', a: GOOD, why: 'Right: you can see the edges clearly, so everyone agrees.' },
    { name: '“Is the leaf longer than 5 cm?”', short: 'Longer than 5 cm?', a: GOOD, why: 'Right: you can measure it with a ruler.' },
    { name: '“Is it a nice shade of green?”', short: 'Nice green?', a: BAD, why: 'Right: “nice” is an opinion.' },
    { name: '“Is the leaf split into smaller leaflets?”', short: 'Split into leaflets?', a: GOOD, why: 'Right: you can count the leaflets.' },
    { name: '“Does the leaf smell nice?”', short: 'Smells nice?', a: BAD, why: 'Right: people like different smells.' },
  ];
  Observation.run({
    id: 'g6-buildkey',
    guide: '../practical.html#g6-buildkey',
    objectives: ['I can write my own dichotomous key using observable features.', 'I can test and improve a key using feedback.'],
    benchLabel: 'A card showing one possible yes/no question for a leaf key, and two trays: good key questions and poor key questions.',
    tests: {
      label: 'Question',
      title: 'Choose good key questions',
      text: 'A dichotomous key splits specimens into two groups with yes/no questions. Decide whether each question would work in a key.',
      why: 'A key only works if everyone who uses it gives the same answer to each question.',
      task: 'read the question',
      button: (x) => `Read: ${x.short}`,
      samples: SAMPLES,
      columns: [{
        label: 'Good key question?',
        q: (x) => `Would ${x.name} work in a key?`,
        task: 'decide whether it is a good key question',
        options: [GOOD, BAD],
        answer: (x) => x.a,
        right: (x) => x.why,
        hint: () => 'Would two different people always give the same answer? Opinions do not work in a key.',
      }],
    },
    questions: [{
      q: 'You have a holly leaf (spiky edges) and a beech leaf (smooth edges). Which question splits them?',
      o: ['Are the leaf edges spiky?', 'Is it a leaf?', 'Is it green?'],
      hint: 'Look for a feature that one leaf has and the other does not.',
      right: 'Yes. The question must split the leaves into two groups using a feature you can see.',
    }, {
      q: 'Why should you give your key to another pair to test?',
      o: ['To find questions that confuse people, so you can improve them', 'To make the key longer', 'So they can copy it'],
      hint: 'What does testing tell you about your key?',
      right: 'Yes. If someone else gets the wrong answer, a question needs to be clearer.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Good key questions use features you can see or measure, such as jagged edges or length, so everyone gives the same answer. Opinions such as “pretty” or “nice” do not work.',
      rows: [['Good questions', rows.filter((r) => r.cells[0] === GOOD).map((r) => r.sample.short).join(', ')], ['Poor questions', rows.filter((r) => r.cells[0] === BAD).map((r) => r.sample.short).join(', ')]],
    }),
  });
})();
