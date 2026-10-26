/* Energy circus (Grade 6, Stage 7: 7Pf.01). */
(function () {
  'use strict';
  const STORES = ['Chemical', 'Elastic', 'Gravitational', 'Kinetic', 'Thermal'];
  const SAMPLES = [
    { name: 'Battery-powered fan', detail: 'The battery makes the blades spin.', start: 'Chemical', end: 'Kinetic' },
    { name: 'Catapult', detail: 'A stretched elastic band fires a ball.', start: 'Elastic', end: 'Kinetic' },
    { name: 'Ball rolling down a ramp', detail: 'The ball starts at the top and speeds up.', start: 'Gravitational', end: 'Kinetic' },
    { name: 'Candle burning', detail: 'The wax burns, giving out heat and light.', start: 'Chemical', end: 'Thermal' },
    { name: 'Spinning top slowing down', detail: 'Friction with the table slows the top.', start: 'Kinetic', end: 'Thermal' },
  ];
  Observation.run({
    id: 'g6-energycircus',
    guide: '../practical.html#g6-energycircus',
    objectives: ['I can identify energy stores and transfers in everyday devices.', 'I can show that energy is conserved: it is transferred, not used up.'],
    benchLabel: 'A card describing one energy station at a time.',
    tests: {
      label: 'Station',
      title: 'Visit each station',
      text: 'Make each device work. Name the energy store at the start and the main useful store at the end.',
      why: 'Energy is never used up. It is transferred from one store to another.',
      task: 'make the device work',
      button: (x) => `Go to the ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Store at the start',
        q: (x) => `${x.name}: which energy store does the energy start in?`,
        task: 'name the store at the start',
        options: STORES,
        answer: (x) => x.start,
        hint: () => 'Fuels, food and batteries are chemical stores. Stretched or squashed objects are elastic. Raised objects are gravitational.',
      }, {
        label: 'Store at the end',
        q: (x) => `${x.name}: which store does the energy end up in?`,
        task: 'name the store at the end',
        options: STORES,
        answer: (x) => x.end,
        hint: () => 'Moving objects have a kinetic store. Hot objects have a thermal store.',
      }],
    },
    questions: [{
      q: 'In every device, where does some of the energy always end up?',
      o: ['In the thermal store of the surroundings, warming them a little', 'Nowhere: it is used up', 'Back in the battery'],
      hint: 'Did any of the devices warm up, even a little?',
      right: 'Yes. Some energy is always dissipated (spread out) as heating the surroundings.',
    }, {
      q: 'Is any energy used up?',
      o: ['No: it is transferred to other stores, and the total stays the same', 'Yes: it disappears when a device stops', 'Yes: batteries destroy energy'],
      hint: 'Think about the law of conservation of energy.',
      right: 'Yes. Energy cannot be created or destroyed, only transferred from one store to another.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'In every device energy moved from one store to another. Some always ended up heating the surroundings, but the total amount of energy stayed the same.',
      rows: rows.map((r) => [r.name, `${r.cells[0].toLowerCase()} → ${r.cells[1].toLowerCase()}`]),
    }),
  });
})();
