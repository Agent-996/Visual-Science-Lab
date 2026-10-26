/* Living, once-living or never-living? (Grade 6, Stage 7: 7Bp.01, 7TWSc.01). */
(function () {
  'use strict';
  const GROUPS = ['Living', 'Once-living', 'Never-living'];
  const SAMPLES = [
    { name: 'Cat', detail: 'Moves, breathes, eats, grows and has kittens.', group: 'Living', why: 'Yes. A cat carries out all seven life processes.' },
    { name: 'Wooden chair', detail: 'Made from the wood of a tree.', group: 'Once-living', why: 'Yes. The wood was part of a living tree.' },
    { name: 'Rock', detail: 'Made of minerals. It has never fed or grown.', group: 'Never-living', why: 'Yes. A rock was never alive.' },
    { name: 'Mushroom', detail: 'Grows on rotting wood and releases spores.', group: 'Living', why: 'Yes. A mushroom is a fungus: it feeds, grows and reproduces.' },
    { name: 'Bread', detail: 'Made from wheat flour.', group: 'Once-living', why: 'Yes. Flour comes from wheat, a plant.' },
    { name: 'Glass bottle', detail: 'Made by melting sand.', group: 'Never-living', why: 'Yes. Sand and glass were never alive.' },
    { name: 'Seashell', detail: 'The empty shell of a sea snail.', group: 'Once-living', why: 'Yes. The shell was made by a living snail.' },
    { name: 'Oak tree', detail: 'Grows new leaves every spring and makes acorns.', group: 'Living', why: 'Yes. Plants carry out all seven life processes too.' },
  ];
  Observation.run({
    id: 'g6-living',
    guide: '../practical.html#g6-living',
    objectives: ['I can use the seven characteristics of living things to sort objects.', 'I can explain why something is once-living or never-living.'],
    benchLabel: 'A card showing one specimen at a time, and three sorting trays: living, once-living and never-living.',
    tests: {
      label: 'Specimen',
      title: 'Sort the specimens',
      text: 'Look at each specimen. Use the seven life processes (MRS GREN: movement, respiration, sensitivity, growth, reproduction, excretion, nutrition) to sort it.',
      why: 'Living things carry out all seven life processes. Once-living things came from something that was alive. Never-living things were never alive.',
      task: 'look at the specimen',
      button: (x) => `Look at the ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      columns: [{
        label: 'Group',
        q: (x) => `Is the ${x.name.toLowerCase()} living, once-living or never-living?`,
        task: 'sort the specimen',
        options: GROUPS,
        answer: (x) => x.group,
        right: (x) => x.why,
        hint: () => 'Does it carry out MRS GREN now? If not, did it come from something that was once alive?',
      }],
    },
    questions: [{
      q: 'A car moves, takes in fuel and gives out waste gases. Why is it not alive?',
      o: ['It cannot grow or reproduce, so it does not carry out all seven life processes', 'It is made of metal', 'It cannot move by itself'],
      hint: 'Check the car against all seven of MRS GREN.',
      right: 'Yes. A living thing must carry out all seven life processes. A car cannot grow, reproduce or sense its surroundings.',
    }, {
      q: 'Why is the wooden chair once-living and not never-living?',
      o: ['Wood comes from a tree, which was once alive', 'Chairs can move', 'Wood can grow back'],
      hint: 'Where does wood come from?',
      right: 'Yes. Wood was part of a living tree, so it is once-living, even though the chair is not alive now.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Living things carry out all seven life processes. Once-living things, such as wood, bread and shells, came from something alive. Never-living things, such as rock and glass, were never alive.',
      rows: GROUPS.map((g) => [g, rows.filter((r) => r.cells[0] === g).map((r) => r.name).join(', ')]),
    }),
  });
})();
