/* Unreactive metals: gold, silver and platinum (Grade 7, Stage 8: 8Cc.06). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'Gold', colour: '#e0b43a', fizz: false },
    { name: 'Silver', colour: '#c9d1d9', fizz: false },
    { name: 'Platinum', colour: '#aeb4ba', fizz: false },
    { name: 'Magnesium (for comparison)', short: 'Magnesium', colour: '#9aa5b1', fizz: true },
  ];
  function picture(x, s) {
    const g = s('g', null, s('path', { d: 'M-24,-70 L-24,50 A24,24 0 0 0 24,50 L24,-70', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), s('path', { d: 'M-23,-20 L-23,50 A23,23 0 0 0 23,50 L23,-20 Z', fill: 'rgba(214, 232, 242, 0.7)' }), s('rect', { x: -10, y: 40, width: 20, height: 10, fill: x.colour, stroke: '#6b7682' }));
    if (x.fizz) for (let i = 0; i < 12; i++) g.append(s('circle', { cx: -10 + (i % 4) * 7, cy: 34 - i * 5, r: 2.5, fill: 'none', stroke: '#5f88a3' }));
    return g;
  }
  Observation.run({
    id: 'g7-inert',
    guide: '../practical.html#g7-inert',
    objectives: ['I can describe how unreactive metals behave with acid.', 'I can link unreactivity to uses such as jewellery and electrical contacts.'],
    benchLabel: 'Test tubes of dilute acid, each with a small piece of a different metal in it.',
    picture,
    tests: {
      label: 'Metal',
      title: 'Add acid to each metal',
      text: 'Your teacher adds dilute acid to each metal. Watch for bubbles or any other change.',
      why: 'Comparing with magnesium shows what a reaction with acid looks like.',
      task: 'watch for bubbles',
      button: (x) => `Watch the ${(x.short || x.name).toLowerCase()}`,
      samples: SAMPLES,
      binColumn: 1,
      columns: [{
        label: 'What you see',
        q: (x) => `${x.short || x.name} in acid: what do you see?`,
        task: 'record what you see',
        options: ['Lots of bubbles', 'No change'],
        answer: (x) => (x.fizz ? 'Lots of bubbles' : 'No change'),
        hint: () => 'Look for bubbles of gas on the metal.',
      }, {
        label: 'Reactivity',
        q: (x) => `So is ${(x.short || x.name).toLowerCase()} reactive or very unreactive?`,
        task: 'decide how reactive it is',
        options: ['Reactive', 'Very unreactive'],
        answer: (x) => (x.fizz ? 'Reactive' : 'Very unreactive'),
        hint: () => 'No bubbles means no reaction.',
      }],
    },
    questions: [{
      q: 'Why are gold and platinum used for jewellery and electrical contacts?',
      o: ['They are very unreactive, so they do not corrode or tarnish', 'They react quickly with air', 'They are the cheapest metals'],
      hint: 'What happened when acid was added to them?',
      right: 'Yes. They stay shiny and keep conducting well for many years because they hardly react.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Gold, silver and platinum showed no reaction with acid, but magnesium fizzed. Unreactive metals are at the bottom of the reactivity series and do not corrode, so they are used for jewellery and electrical contacts.',
      rows: [['Gold, silver, platinum', 'no reaction'], ['Magnesium', 'fizzes']],
    }),
  });
})();
