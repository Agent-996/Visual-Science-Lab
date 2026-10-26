/* Particle model of a chemical reaction (Grade 6, Stage 7: 7Cc.03, 7TWSm.01). */
(function () {
  'use strict';
  const MG = '#9aa5b1';
  const O = '#d64545';
  const SAMPLES = [
    { name: 'Before: the reactants', detail: '2 magnesium atoms and 1 oxygen molecule (O₂).', after: false },
    { name: 'After: the product', detail: '2 particles of magnesium oxide (MgO).', after: true },
  ];
  const ball = (s, x, y, c, label) => s('g', null, s('circle', { cx: x, cy: y, r: label === 'Mg' ? 20 : 14, fill: c, stroke: '#2b333b', 'stroke-width': 1.5 }), s('text', { x, y: y + 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#ffffff' }, label));
  Observation.run({
    id: 'g6-reactionmodel',
    guide: '../practical.html#g6-reactionmodel',
    objectives: ['I can use molecular models to show atoms rearranging in a reaction.', 'I can show that atoms are not created or destroyed.'],
    benchLabel: 'A card showing ball-and-stick models of magnesium and oxygen before the reaction, and of magnesium oxide after it.',
    picture: (x, s) => (x.after
      ? s('g', null, ball(s, -86, 0, MG, 'Mg'), ball(s, -52, 0, O, 'O'), ball(s, 52, 0, MG, 'Mg'), ball(s, 86, 0, O, 'O'))
      : s('g', null, ball(s, -110, 0, MG, 'Mg'), ball(s, -50, 0, MG, 'Mg'), s('text', { x: -2, y: 7, 'text-anchor': 'middle', 'font-size': 22, fill: '#33404d' }, '+'), ball(s, 50, 0, O, 'O'), ball(s, 78, 0, O, 'O'))),
    tests: {
      label: 'Model',
      title: 'Count the atoms',
      text: 'Build the reactants, magnesium and oxygen. Then break the models apart and rebuild them as the product, magnesium oxide. Count each type of atom both times.',
      why: 'Counting the atoms before and after shows what happens to them in a reaction.',
      task: 'look at the model',
      button: (x) => (x.after ? 'Rebuild the atoms as magnesium oxide' : 'Build the reactants'),
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Magnesium atoms',
        q: (x) => `${x.name}: how many magnesium (Mg) atoms are there?`,
        task: 'count the magnesium atoms',
        options: ['1', '2', '3', '4'],
        answer: () => '2',
        hint: () => 'Count the grey balls labelled Mg.',
      }, {
        label: 'Oxygen atoms',
        q: (x) => `${x.name}: how many oxygen (O) atoms are there?`,
        task: 'count the oxygen atoms',
        options: ['1', '2', '3', '4'],
        answer: () => '2',
        hint: () => 'Count the red balls labelled O. An oxygen molecule has two atoms.',
      }],
    },
    questions: [{
      q: 'What happened to the atoms in the reaction?',
      o: ['They were rearranged into a new substance; none were made or destroyed', 'Some atoms were destroyed', 'New atoms were made'],
      hint: 'Compare your counts before and after.',
      right: 'Yes. The same atoms are there before and after, just joined in a different way.',
    }, {
      q: 'What happens to the total mass in this reaction?',
      o: ['It stays the same', 'It goes down', 'It goes up'],
      hint: 'If the atoms are all still there, what about their mass?',
      right: 'Yes. Because no atoms are lost or gained, the total mass stays the same. Word equation: magnesium + oxygen → magnesium oxide.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Magnesium + oxygen → magnesium oxide. There were 2 magnesium atoms and 2 oxygen atoms before and after: atoms are rearranged, not made or destroyed, so the mass stays the same.',
      rows: [['Before', '2 Mg atoms, 2 O atoms'], ['After', '2 Mg atoms, 2 O atoms']],
    }),
  });
})();
