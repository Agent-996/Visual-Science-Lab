/* Physical or chemical change? (Grade 6, Stage 7: 7Cc.01, 7Cp.01). */
(function () {
  'use strict';
  const PHYS = 'Physical change';
  const CHEM = 'Chemical change';
  const SAMPLES = [
    { name: 'Melting wax', detail: 'The wax turns runny, then sets again when it cools.', a: PHYS },
    { name: 'Burning a candle', detail: 'The wick and wax burn with a flame. Smoke and gases rise.', a: CHEM },
    { name: 'Dissolving sugar in water', detail: 'The sugar disappears. The water tastes sweet.', a: PHYS },
    { name: 'Vinegar and baking soda', detail: 'The mixture fizzes and bubbles of gas form.', a: CHEM },
    { name: 'Ice melting', detail: 'Solid ice turns into liquid water.', a: PHYS },
    { name: 'Toasting bread', detail: 'The bread turns brown and smells different.', a: CHEM },
  ];
  Observation.run({
    id: 'g6-physchem',
    guide: '../practical.html#g6-physchem',
    objectives: ['I can tell a physical change from a chemical change.', 'I can explain that chemical changes make new substances.'],
    benchLabel: 'A card describing one change at a time, and two trays: physical changes and chemical changes.',
    tests: {
      label: 'Change',
      title: 'Decide what kind of change',
      text: 'Watch each change. Decide whether a new substance is made, then sort it.',
      why: 'The key test is whether a new substance is made. Signs include gas, a colour change, heat or light, and a change that cannot easily be reversed.',
      task: 'watch the change',
      button: (x) => `Watch: ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      binColumn: 1,
      columns: [{
        label: 'New substance?',
        q: (x) => `${x.name}: is a new substance made?`,
        task: 'decide whether a new substance is made',
        options: ['Yes', 'No'],
        answer: (x) => (x.a === CHEM ? 'Yes' : 'No'),
        hint: () => 'Could you easily get the starting substance back? Are there signs such as gas, a new colour or a new smell?',
      }, {
        label: 'Type of change',
        q: (x) => `${x.name}: physical or chemical change?`,
        task: 'sort the change',
        options: [PHYS, CHEM],
        answer: (x) => x.a,
        hint: () => 'A chemical change makes a new substance. A physical change does not.',
      }],
    },
    questions: [{
      q: 'Why is dissolving sugar a physical change?',
      o: ['No new substance is made: you can get the sugar back by evaporating the water', 'The sugar is destroyed', 'It makes a gas'],
      hint: 'What happens if you leave the sugar water to evaporate?',
      right: 'Yes. The sugar is still there, just spread out in the water, and you can get it back.',
    }, {
      q: 'Which sign shows that vinegar and baking soda make a new substance?',
      o: ['Bubbles of a new gas (carbon dioxide) form', 'The mixture is wet', 'You can see both liquids'],
      hint: 'What did you see when they were mixed?',
      right: 'Yes. The fizzing is carbon dioxide gas, a new substance, so this is a chemical change.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Melting and dissolving are physical changes: no new substance forms and they are easily reversed. Burning, toasting and vinegar with baking soda are chemical changes: new substances are made.',
      rows: [PHYS, CHEM].map((g) => [g, rows.filter((r) => r.cells[1] === g).map((r) => r.name).join(', ')]),
    }),
  });
})();
