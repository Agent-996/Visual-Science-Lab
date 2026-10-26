/* Sodium and potassium in water (Grade 7, Stage 8: 8Cc.03). */
(function () {
  'use strict';
  const SEEN = ['It fizzes and races around on the surface', 'It fizzes violently and bursts into a lilac flame', 'The indicator turns purple', 'Nothing happens'];
  const SAMPLES = [
    { name: 'A tiny piece of sodium dropped into water', short: 'Sodium', seen: 0, kind: 'na' },
    { name: 'A tiny piece of potassium dropped into water', short: 'Potassium', seen: 1, kind: 'k' },
    { name: 'Universal indicator in the water afterwards', short: 'Indicator', seen: 2, kind: 'ind' },
  ];
  function picture(x, s) {
    const g = s('g', null, s('rect', { x: -120, y: -10, width: 240, height: 70, fill: x.kind === 'ind' ? 'rgba(106, 42, 154, 0.55)' : 'rgba(160, 205, 235, 0.55)', stroke: '#7f97a8' }), s('rect', { x: -130, y: 50, width: 260, height: 18, fill: 'none' }));
    if (x.kind !== 'ind') g.append(s('circle', { cx: 10, cy: -10, r: 8, fill: '#d0d4d8', stroke: '#8a96a3' }), s('path', { d: 'M-60,-6 Q-20,-18 2,-10', fill: 'none', stroke: '#9fb4c2', 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
    if (x.kind === 'k') g.append(s('path', { d: 'M0,-14 Q-8,-40 10,-60 Q28,-40 20,-14 Z', fill: '#b48ef0', opacity: 0.9 }));
    return g;
  }
  Observation.run({
    id: 'g7-sodium',
    guide: '../practical.html#g7-sodium',
    objectives: ['I can describe how sodium and potassium react with water.', 'I can use the reactions to place them in the reactivity series.'],
    benchLabel: 'A trough of water behind a safety screen, with a tiny piece of sodium or potassium reacting on the surface.',
    picture,
    tests: {
      label: 'Observation',
      title: 'Watch from behind the screen',
      text: 'Your teacher adds a tiny piece of sodium to water behind a safety screen, then potassium. Watch the metal and the gas. Then look at the indicator.',
      why: 'Comparing how violently metals react shows which is more reactive.',
      task: 'watch closely',
      button: (x) => `Watch: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short}: what do you see?`,
        task: 'record what you see',
        options: SEEN,
        answer: (x) => SEEN[x.seen],
        hint: () => 'Look for a flame, movement or a colour change.',
      }],
    },
    questions: [{
      q: 'Which metal is more reactive?',
      o: ['Potassium', 'Sodium', 'They are equally reactive'],
      hint: 'Which reaction was more violent?',
      right: 'Yes. Potassium reacts even more violently than sodium, so it is higher in the reactivity series.',
    }, {
      q: 'Which word equation shows the sodium reaction?',
      o: ['sodium + water → sodium hydroxide + hydrogen', 'sodium + water → sodium oxide + oxygen', 'sodium + hydrogen → sodium water'],
      hint: 'Metal + water → metal hydroxide + hydrogen.',
      right: 'Yes. Sodium hydroxide is an alkali, so the indicator turns purple.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Sodium fizzed and raced around on the surface. Potassium reacted even more violently, with a lilac flame. Both made hydrogen and an alkaline solution, so potassium is more reactive than sodium.',
      rows: [['Sodium', 'fizzes and races around'], ['Potassium', 'lilac flame: more reactive']],
    }),
  });
})();
