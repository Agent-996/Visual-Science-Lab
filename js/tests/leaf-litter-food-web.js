/* Food web with decomposers from leaf litter (Grade 6, Stage 7: 7Be.02, 7TWSc.01). */
(function () {
  'use strict';
  const DEAD = 'Dead leaves and dead material';
  const ANIMALS = 'Other small animals';
  const SAMPLES = [
    { name: 'Woodlouse', detail: 'Grey, 14 legs, found under damp leaves.', a: DEAD },
    { name: 'Centipede', detail: 'Fast, one pair of legs on each segment, poison claws.', a: ANIMALS },
    { name: 'Earthworm', detail: 'Pulls leaves down into the soil.', a: DEAD },
    { name: 'Spider', detail: 'Eight legs; spins webs or hunts on the ground.', a: ANIMALS },
    { name: 'Millipede', detail: 'Slow, two pairs of legs on each segment.', a: DEAD },
    { name: 'Fungus', detail: 'White threads spreading through rotting leaves.', a: DEAD },
  ];
  Observation.run({
    id: 'g6-foodweb',
    guide: '../practical.html#g6-foodweb',
    objectives: ['I can collect and identify animals living in leaf litter.', 'I can draw a food web that includes decomposers.'],
    benchLabel: 'A card showing one organism found in leaf litter at a time, and two trays: organisms that feed on dead leaves, and organisms that eat other animals.',
    tests: {
      label: 'Organism',
      title: 'What does each organism eat?',
      text: 'Look at each organism you found in the leaf litter. Decide what it feeds on.',
      why: 'Knowing what each organism eats lets you draw the arrows in a food web.',
      task: 'look at the organism',
      button: (x) => `Look at the ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      columns: [{
        label: 'Feeds on',
        q: (x) => `What does the ${x.name.toLowerCase()} feed on?`,
        task: 'decide what it feeds on',
        options: [DEAD, ANIMALS],
        answer: (x) => x.a,
        right: (x) => (x.a === DEAD ? `Yes. The ${x.name.toLowerCase()} is a decomposer: it breaks down dead material.` : `Yes. The ${x.name.toLowerCase()} is a predator that eats the decomposers.`),
        hint: () => 'Hunters have fast legs, poison claws or webs. Decomposers are slow and live in the rotting leaves they eat.',
      }],
    },
    questions: [{
      q: 'In a food web, which way does the arrow between dead leaves and a woodlouse point?',
      o: ['From the dead leaves to the woodlouse', 'From the woodlouse to the dead leaves', 'Both ways'],
      hint: 'Arrows show the direction that energy moves when something is eaten.',
      right: 'Yes. Arrows point from the food to the animal that eats it, showing which way the energy flows.',
    }, {
      q: 'What would happen in a wood if there were no decomposers?',
      o: ['Dead leaves would pile up and their nutrients would not return to the soil', 'Trees would grow faster', 'Nothing would change'],
      hint: 'What job do decomposers do with dead leaves?',
      right: 'Yes. Decomposers recycle nutrients from dead material back into the soil for plants to use.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Woodlice, earthworms, millipedes and fungi are decomposers that feed on dead leaves. Centipedes and spiders are predators that eat the decomposers.',
      rows: [['Decomposers', rows.filter((r) => r.cells[0] === DEAD).map((r) => r.name).join(', ')], ['Predators', rows.filter((r) => r.cells[0] === ANIMALS).map((r) => r.name).join(', ')]],
    }),
  });
})();
