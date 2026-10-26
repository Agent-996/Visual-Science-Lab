/* Pitfall traps and sweep netting (Grade 7, Stage 8: 8Be.01, 8TWSc.01). */
(function () {
  'use strict';
  const PIT = 'Pitfall trap';
  const NET = 'Sweep net';
  const SAMPLES = [
    { name: 'Ground beetle', detail: 'Runs across the soil at night.', a: PIT },
    { name: 'Grasshopper', detail: 'Sits on grass stems and jumps.', a: NET },
    { name: 'Woodlouse', detail: 'Crawls under leaves on the ground.', a: PIT },
    { name: 'Aphid', detail: 'Tiny; sucks sap from plant stems.', a: NET },
    { name: 'Wolf spider', detail: 'Hunts on the ground instead of spinning a web.', a: PIT },
    { name: 'Caterpillar', detail: 'Eats the leaves of plants.', a: NET },
  ];
  Observation.run({
    id: 'g7-pitfall',
    guide: '../practical.html#g7-pitfall',
    objectives: ['I can sample invertebrates using pitfall traps and sweep nets.', 'I can identify the invertebrates and record how many of each I find.'],
    benchLabel: 'A card showing one invertebrate at a time, and two trays: animals caught in pitfall traps and animals caught with a sweep net.',
    tests: {
      label: 'Invertebrate',
      title: 'Which method caught it?',
      text: 'You set pitfall traps overnight and swept a net through long grass. Decide which method caught each animal.',
      why: 'Each method samples a different part of the habitat: the ground or the plants.',
      task: 'look at the animal',
      button: (x) => `Look at the ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      columns: [{
        label: 'Caught by',
        q: (x) => `Which method most likely caught the ${x.name.toLowerCase()}?`,
        task: 'decide which method caught it',
        options: [PIT, NET],
        answer: (x) => x.a,
        hint: () => 'Pitfall traps catch animals that walk on the ground. Sweep nets catch animals living on plants.',
      }],
    },
    questions: [{
      q: 'Why is it better to use both methods?',
      o: ['Each catches different animals, so together they give a fuller picture of the habitat', 'It doubles the number of the same animals', 'So you can finish faster'],
      hint: 'Look at your two trays. Did the methods catch the same animals?',
      right: 'Yes. Pitfall traps catch ground animals and sweep nets catch animals on plants.',
    }, {
      q: 'Why should the rim of a pitfall trap be level with the soil?',
      o: ['So animals walking on the ground fall straight in', 'So rain can get in', 'So you can find it again'],
      hint: 'Think about a beetle walking towards the trap.',
      right: 'Yes. A raised rim would stop animals falling in. A raised lid above it keeps out rain and birds.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Pitfall traps caught ground animals such as beetles, woodlice and wolf spiders. The sweep net caught animals on plants, such as grasshoppers, aphids and caterpillars.',
      rows: [[PIT, rows.filter((r) => r.cells[0] === PIT).map((r) => r.name).join(', ')], [NET, rows.filter((r) => r.cells[0] === NET).map((r) => r.name).join(', ')]],
    }),
  });
})();
