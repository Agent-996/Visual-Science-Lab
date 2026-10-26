/* Signs of a chemical reaction circus (Grade 6, Stage 7: 7Cc.01, 7TWSc.07). */
(function () {
  'use strict';
  const SIGNS = ['Bubbles of gas', 'A colour change', 'A solid (precipitate) forms', 'It gets hotter', 'Nothing new forms'];
  const SAMPLES = [
    { name: 'Magnesium ribbon in dilute acid', sign: 0, chem: 'Yes' },
    { name: 'Copper sulfate + sodium hydroxide', sign: 2, chem: 'Yes' },
    { name: 'Heating green copper carbonate', sign: 1, chem: 'Yes' },
    { name: 'Iron powder + salt water (hand warmer)', sign: 3, chem: 'Yes' },
    { name: 'Salt dissolving in water', sign: 4, chem: 'No' },
  ];
  function picture(x, s) {
    const liquid = ['rgba(214, 232, 242, 0.8)', 'rgba(20, 20, 20, 0.85)', 'rgba(60, 130, 215, 0.6)', 'rgba(150, 110, 80, 0.7)', 'rgba(214, 232, 242, 0.8)'][x.sign];
    const g = s('g', null,
      s('path', { d: 'M-18,-70 L-18,50 A18,18 0 0 0 18,50 L18,-70', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }),
      s('path', { d: `M-17,${x.sign === 1 ? 30 : -10} L-17,50 A17,17 0 0 0 17,50 L17,${x.sign === 1 ? 30 : -10} Z`, fill: liquid }));
    if (x.sign === 0) for (let i = 0; i < 9; i++) g.append(s('circle', { cx: -8 + (i % 3) * 8, cy: 50 - i * 6, r: 3, fill: 'none', stroke: '#5f88a3' }));
    if (x.sign === 2) g.append(s('path', { d: 'M-17,50 A17,17 0 0 0 17,50 L17,40 L-17,40 Z', fill: '#8cc4ec' }));
    if (x.sign === 1) g.append(s('text', { x: 40, y: 0, 'font-size': 12, fill: '#455261' }, 'was green'));
    if (x.sign === 3) g.append(s('rect', { x: 40, y: -40, width: 8, height: 80, rx: 4, fill: '#ffffff', stroke: '#8a9aa8' }), s('rect', { x: 42, y: -30, width: 4, height: 70, fill: '#d33a3a' }), s('text', { x: 54, y: -24, 'font-size': 12, fill: '#c0392b' }, '45 °C'));
    return g;
  }
  Observation.run({
    id: 'g6-signs',
    guide: '../practical.html#g6-signs',
    objectives: ['I can recognise the signs of a chemical reaction.', 'I can record careful observations at each station.'],
    benchLabel: 'A test tube at each station showing what happens when the reactants are mixed or heated.',
    picture,
    tests: {
      label: 'Station',
      title: 'Visit each station',
      text: 'At each station, mix or heat the reactants as the card says. Look closely for the signs of a chemical reaction.',
      why: 'Chemical reactions make new substances. You cannot see the new substance being made, but you can see signs of it.',
      task: 'carry out the station',
      button: (x) => `Station: ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Main sign',
        q: (x) => `${x.name}: what is the main thing you notice?`,
        task: 'record the main sign',
        options: SIGNS,
        answer: (x) => SIGNS[x.sign],
        hint: () => 'Look for bubbles, a new colour, a cloudy solid or a temperature change.',
      }, {
        label: 'Chemical reaction?',
        q: (x) => `${x.name}: is this a chemical reaction?`,
        task: 'decide whether it is a chemical reaction',
        options: ['Yes', 'No'],
        answer: (x) => x.chem,
        hint: () => 'A chemical reaction makes a new substance. Dissolving does not.',
      }],
    },
    questions: [{
      q: 'Which of these is NOT a sign of a chemical reaction?',
      o: ['A solid dissolving and disappearing', 'Bubbles of a new gas', 'A colour change', 'The mixture getting hotter'],
      hint: 'Look at the station that was not a chemical reaction.',
      right: 'Yes. Dissolving is a physical change: the salt is still there and you can get it back.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Signs of a chemical reaction include bubbles of gas, a colour change, a precipitate forming and a temperature change. Dissolving salt showed none of these: it is a physical change.',
      rows: rows.map((r) => [r.name, r.cells[0].toLowerCase()]),
    }),
  });
})();
