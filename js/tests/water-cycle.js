/* Water cycle in a bag (Grade 6, Stage 7: 7ESc.01, 7TWSm.01). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'Warm water at the bottom of the bag', short: 'Warm water', p: 'Evaporation', real: 'The Sun warming the sea', spot: [0, 58] },
    { name: 'Tiny droplets on the cool top of the bag', short: 'Droplets at the top', p: 'Condensation', real: 'Clouds forming', spot: [0, -58] },
    { name: 'Droplets running down the inside', short: 'Running droplets', p: 'Precipitation', real: 'Rain falling', spot: [-52, 0] },
    { name: 'Water collecting at the bottom again', short: 'Water collecting', p: 'Collection', real: 'Rivers flowing back to the sea', spot: [52, 50] },
  ];
  function picture(x, s) {
    const g = s('g', null,
      s('circle', { cx: 120, cy: -70, r: 22, fill: '#ffd34d' }),
      s('path', { d: 'M-70,-80 L70,-80 L76,80 Q0,92 -76,80 Z', fill: 'rgba(214, 232, 242, 0.45)', stroke: '#7f97a8', 'stroke-width': 2 }),
      s('path', { d: 'M-74,52 Q0,60 74,52 L76,80 Q0,92 -76,80 Z', fill: 'rgba(80, 150, 215, 0.7)' }));
    for (let i = 0; i < 12; i++) g.append(s('circle', { cx: -60 + i * 11, cy: -72 + (i % 2) * 4, r: 2.5, fill: '#5f9fd8' }));
    for (let i = 0; i < 4; i++) g.append(s('path', { d: `M${-66 + (i % 2) * 4},${-40 + i * 22} q3,6 0,10 q-3,-4 0,-10 z`, fill: '#5f9fd8' }));
    for (let i = 0; i < 3; i++) g.append(s('path', { d: `M${-20 + i * 20},40 q4,-8 0,-16`, fill: 'none', stroke: '#9fb4c2', 'stroke-width': 2 }));
    g.append(s('circle', { cx: x.spot[0], cy: x.spot[1], r: 24, fill: 'none', stroke: '#c0392b', 'stroke-width': 3, 'stroke-dasharray': '5 4' }));
    return g;
  }
  Observation.run({
    id: 'g6-watercycle',
    guide: '../practical.html#g6-watercycle',
    objectives: ['I can build a model of the water cycle.', 'I can describe evaporation, condensation and precipitation in the water cycle.'],
    benchLabel: 'A sealed plastic bag with a little warm blue water, taped to a sunny window. Droplets form at the top and run down the sides.',
    picture,
    tests: {
      label: 'What you see',
      title: 'Watch the bag every 10 minutes',
      text: 'Look at the part of the bag circled in red each time. Name the process happening there, and what it models in the real water cycle.',
      why: 'The bag is a small model of the water cycle: the Sun, the sea, clouds and rain all have a part in it.',
      task: 'look at the circled part of the bag',
      button: (x) => `Look at: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Process',
        q: (x) => `${x.name}: which process is this?`,
        task: 'name the process',
        options: ['Evaporation', 'Condensation', 'Precipitation', 'Collection'],
        answer: (x) => x.p,
        hint: () => 'Evaporation: liquid to gas. Condensation: gas to liquid. Precipitation: water falling. Collection: water gathering.',
      }, {
        label: 'In the real water cycle',
        q: (x) => `In the real water cycle, "${x.short.toLowerCase()}" is like…`,
        task: 'link it to the real water cycle',
        options: SAMPLES.map((y) => y.real),
        answer: (x) => x.real,
        hint: () => 'Match each part of the bag to the sea, clouds, rain or rivers.',
      }],
    },
    questions: [{
      q: 'Why do droplets form at the top of the bag?',
      o: ['Water vapour cools there and condenses back into liquid', 'The bag is leaking', 'The sunlight makes new water'],
      hint: 'Is the top of the bag warmer or cooler than the water?',
      right: 'Yes. Water vapour condenses when it meets a cooler surface, just as it does high in the sky to form clouds.',
    }, {
      q: 'Why does the amount of water in the bag stay the same?',
      o: ['The bag is sealed, so the water just goes round and round the cycle', 'Water is made in the bag', 'The Sun adds water'],
      hint: 'Can any water escape from the bag?',
      right: 'Yes. Like the Earth, the bag is a closed system: the same water is recycled again and again.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Water evaporated from the warm water, condensed into droplets on the cool top of the bag and ran back down like rain. This models evaporation, condensation and precipitation.',
      rows: SAMPLES.map((x) => [x.p, x.real.toLowerCase()]),
    }),
  });
})();
