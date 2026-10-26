/* Crystallising a salt (Grade 7, Stage 8: 8Cc.05). */
(function () {
  'use strict';
  const SEEN = ['A clear blue solution with no crystals', 'A few large crystals', 'Lots of tiny crystals'];
  const SAMPLES = [
    { name: 'The hot saturated solution', seen: 0, kind: 'hot' },
    { name: 'After cooling slowly for a few days', seen: 1, kind: 'slow' },
    { name: 'A second basin cooled quickly in ice', seen: 2, kind: 'fast' },
  ];
  function picture(x, s) {
    const g = s('g', null, s('path', { d: 'M-80,-10 Q0,70 80,-10 Z', fill: 'rgba(60, 130, 215, 0.5)', stroke: '#7f97a8', 'stroke-width': 2 }));
    if (x.kind === 'hot') [-20, 0, 20].forEach((dx) => g.append(s('path', { d: `M${dx},-20 q6,-10 0,-20 q-6,-10 0,-20`, fill: 'none', stroke: '#9fb4c2', 'stroke-width': 2 })));
    if (x.kind === 'slow') [[-30, 10, 16], [10, 18, 20], [38, 6, 12]].forEach(([cx, cy, r]) => g.append(s('path', { d: `M${cx},${cy - r} L${cx + r * 0.9},${cy} L${cx},${cy + r * 0.7} L${cx - r * 0.9},${cy} Z`, fill: '#2a6ad0', stroke: '#1a4a9a' })));
    if (x.kind === 'fast') for (let i = 0; i < 40; i++) g.append(s('rect', { x: -56 + (i * 23) % 112, y: -4 + (i * 7) % 26, width: 4, height: 4, fill: '#2a6ad0', transform: `rotate(45 ${-54 + (i * 23) % 112} ${-2 + (i * 7) % 26})` }));
    return g;
  }
  Observation.run({
    id: 'g7-crystallising',
    guide: '../practical.html#g7-crystallising',
    objectives: ['I can make crystals from a hot saturated solution.', 'I can explain crystallisation using solubility.'],
    benchLabel: 'Evaporating basins of blue copper(II) sulfate solution: hot, after slow cooling, and after fast cooling.',
    picture,
    tests: {
      label: 'Basin',
      title: 'Grow crystals',
      text: 'Dissolve copper(II) sulfate in hot water until no more will dissolve, filter it into evaporating basins and leave them to cool, one slowly and one quickly.',
      why: 'Less solid can stay dissolved in cold water than in hot water, so crystals form as a saturated solution cools.',
      task: 'look in the basin',
      button: (x) => `Look at ${x.name.charAt(0).toLowerCase()}${x.name.slice(1)}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.name}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look at the size and number of crystals.',
      }],
    },
    questions: [{
      q: 'Why do crystals form as the saturated solution cools?',
      o: ['Solubility falls as it cools, so solid comes out of the solution', 'The water freezes', 'New copper sulfate is made'],
      hint: 'Can more or less solid stay dissolved in cold water?',
      right: 'Yes. A saturated solution holds as much solid as it can. As it cools it can hold less, so crystals form.',
    }, {
      q: 'How can you grow bigger crystals?',
      o: ['Let the solution cool slowly', 'Cool it as quickly as possible', 'Stir it while it cools'],
      hint: 'Compare the two cooled basins.',
      right: 'Yes. Slow cooling gives the particles time to join existing crystals, so they grow larger.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'As the hot saturated solution cooled, solubility fell and crystals formed. Slow cooling gave a few large crystals; fast cooling gave lots of tiny ones.',
      rows: [['Hot solution', 'no crystals'], ['Cooled slowly', 'a few large crystals'], ['Cooled quickly', 'lots of tiny crystals']],
    }),
  });
})();
