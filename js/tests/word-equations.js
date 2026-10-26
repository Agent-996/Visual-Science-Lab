/* Word equations for the reactions you observed (Grade 7, Stage 8: 8Cc.01, 8TWSm.03). */
(function () {
  'use strict';
  const PAT = {
    acid: 'metal + acid → salt + hydrogen',
    oxygen: 'metal + oxygen → metal oxide',
    water: 'metal + water → metal hydroxide + hydrogen',
    displace: 'metal + metal compound → displacement',
  };
  const SAMPLES = [
    { name: 'zinc + hydrochloric acid', products: 'zinc chloride + hydrogen', p: 'acid' },
    { name: 'magnesium + oxygen', products: 'magnesium oxide', p: 'oxygen' },
    { name: 'calcium + water', products: 'calcium hydroxide + hydrogen', p: 'water' },
    { name: 'iron + copper sulfate', products: 'iron sulfate + copper', p: 'displace' },
    { name: 'magnesium + sulfuric acid', products: 'magnesium sulfate + hydrogen', p: 'acid' },
  ];
  Observation.run({
    id: 'g7-wordequations',
    guide: '../practical.html#g7-wordequations',
    objectives: ['I can write word equations for the reactions in this unit.', 'I can identify the reactants and products.'],
    benchLabel: 'A card showing the reactants of one reaction at a time.',
    tests: {
      label: 'Reactants',
      title: 'Complete each word equation',
      text: 'For each pair of reactants, choose the pattern the reaction follows, then the products.',
      why: 'Most reactions in this unit follow a few patterns, so spotting the pattern tells you the products.',
      task: 'read the reactants',
      button: (x) => `Show: ${x.name}`,
      samples: SAMPLES.map((x) => ({ ...x, detail: `${x.name} → ?` })),
      bins: false,
      columns: [{
        label: 'Pattern',
        q: (x) => `${x.name}: which pattern does this reaction follow?`,
        task: 'choose the pattern',
        options: Object.values(PAT),
        answer: (x) => PAT[x.p],
        hint: () => 'Look at the second reactant: is it an acid, oxygen, water or a compound of another metal?',
      }, {
        label: 'Products',
        q: (x) => `${x.name} → ?`,
        task: 'choose the products',
        options: SAMPLES.map((x) => x.products),
        answer: (x) => x.products,
        hint: (x) => `Use the pattern: ${PAT[x.p]}. Keep the name of the metal.`,
      }],
    },
    questions: [{
      q: 'In "zinc + hydrochloric acid → zinc chloride + hydrogen", which are the products?',
      o: ['zinc chloride and hydrogen', 'zinc and hydrochloric acid', 'zinc and hydrogen'],
      hint: 'Products are on the right-hand side of the arrow.',
      right: 'Yes. Reactants are on the left of the arrow and products on the right.',
    }, {
      q: 'Which salt does sulfuric acid make?',
      o: ['A sulfate', 'A chloride', 'A nitrate'],
      hint: 'Look at magnesium + sulfuric acid.',
      right: 'Yes. Sulfuric acid makes sulfates, hydrochloric acid makes chlorides and nitric acid makes nitrates.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Most reactions follow a pattern: metal + acid → salt + hydrogen; metal + oxygen → metal oxide; metal + water → metal hydroxide + hydrogen.',
      rows: rows.map((r) => [r.name, `→ ${r.cells[1]}`]),
    }),
  });
})();
