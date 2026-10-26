/* Bioaccumulation model (Grade 7, Stage 8: 8Be.02, 8TWSm.01). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'One plankton', detail: 'Took in a little toxin from the water.', toxin: 1, a: 'The same' },
    { name: 'One small fish', detail: 'Ate the contents of 5 plankton cups.', toxin: 5, a: 'More concentrated' },
    { name: 'One big fish', detail: 'Ate 4 small fish.', toxin: 20, a: 'Even more concentrated' },
  ];
  function picture(x, s) {
    const g = s('g', null);
    if (x.toxin === 1) g.append(s('circle', { r: 26, fill: '#bfe3c5', stroke: '#3b8a4b' }));
    else g.append(s('path', { d: x.toxin === 5 ? 'M-60,0 Q-20,-36 40,0 Q-20,36 -60,0 Z M40,0 L64,-18 L64,18 Z' : 'M-120,0 Q-30,-70 80,0 Q-30,70 -120,0 Z M80,0 L120,-34 L120,34 Z', fill: '#9fc5e8', stroke: '#2f6db5', 'stroke-width': 2 }));
    for (let i = 0; i < x.toxin; i++) {
      const cols = x.toxin === 20 ? 7 : 5;
      const cx = (i % cols) * 14 - ((Math.min(x.toxin, cols) - 1) * 14) / 2 - (x.toxin === 20 ? 20 : 0);
      const cy = Math.floor(i / cols) * 14 - (Math.ceil(x.toxin / cols) - 1) * 7;
      g.append(s('circle', { cx, cy, r: 5, fill: '#c0392b' }));
    }
    return g;
  }
  Observation.run({
    id: 'g7-bioaccumulation',
    guide: '../practical.html#g7-bioaccumulation',
    objectives: ['I can model how a toxin becomes more concentrated up a food chain.', 'I can explain why top predators are most affected.'],
    benchLabel: 'A food chain model: plankton cups with red toxin counters, small fish that each eat several plankton, and a big fish that eats several small fish.',
    picture,
    tests: {
      label: 'Organism',
      title: 'Count the toxin counters',
      text: 'Each plankton takes in one toxin counter. Each small fish eats 5 plankton, and the big fish eats 4 small fish. The toxin is not broken down. Count the counters in one organism at each level.',
      why: 'Counting at each level shows how the toxin builds up as it moves along the food chain.',
      task: 'count the toxin counters',
      button: (x) => `Look inside ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Toxin counters',
        q: (x) => `${x.name}: how many toxin counters are inside it?`,
        task: 'count the counters',
        options: ['1', '5', '20'],
        answer: (x) => String(x.toxin),
        hint: (x) => (x.toxin === 1 ? 'Count the red dots.' : 'Multiply: how many of the level below did it eat, and how many counters did each one have?'),
      }, {
        label: 'Compared with plankton',
        q: (x) => `${x.name}: compared with one plankton, the toxin inside it is…`,
        task: 'compare with the plankton',
        options: ['The same', 'More concentrated', 'Even more concentrated'],
        answer: (x) => x.a,
        hint: () => 'Compare the number of counters with the plankton’s one counter.',
      }],
    },
    questions: [{
      q: 'Why do top predators end up with the highest dose of toxin?',
      o: ['They eat many animals from the level below, and the toxin builds up in their bodies', 'They live in the most polluted water', 'They make the toxin themselves'],
      hint: 'How many plankton’s worth of toxin did the big fish take in?',
      right: 'Yes. The toxin passes up the food chain and becomes more concentrated at each level.',
    }, {
      q: 'Why does the toxin build up instead of being lost?',
      o: ['It is not broken down or excreted, so it stays in the body', 'It is used for energy', 'It turns into food'],
      hint: 'What happened to the counters when an animal was eaten?',
      right: 'Yes. Toxins such as mercury and some pesticides stay in the body, so they accumulate.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'One plankton had 1 toxin counter, one small fish had 5 and the big fish had 20. The toxin is not broken down, so it becomes more concentrated at each level and top predators are most affected.',
      rows: SAMPLES.map((x) => [x.name, `${x.toxin} counter${x.toxin > 1 ? 's' : ''}`]),
    }),
  });
})();
