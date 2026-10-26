/* Convection currents: a model of the mantle (Grade 6, Stage 7: 7ESp.01, 7TWSm.01). */
(function () {
  'use strict';
  const MOVES = ['It rises', 'It moves sideways across the top', 'It sinks', 'It moves along the bottom back towards the flame'];
  const SAMPLES = [
    { name: 'Water just above the flame', short: 'Above the flame', k: 0, at: [-40, 20] },
    { name: 'Water at the top of the beaker', short: 'At the top', k: 1, at: [0, -50] },
    { name: 'Water on the far side, away from the flame', short: 'Far side', k: 2, at: [45, 0] },
    { name: 'Water along the bottom', short: 'Along the bottom', k: 3, at: [5, 55] },
  ];
  const picture = (x, s) => s('g', null,
    s('path', { d: 'M-80,-80 L-80,75 L80,75 L80,-80', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }),
    s('rect', { x: -79, y: -70, width: 158, height: 144, fill: 'rgba(214, 232, 242, 0.6)' }),
    s('path', { d: 'M-40,55 L-40,-50 Q-40,-60 -30,-60 L40,-60 Q50,-60 50,-50 L50,50 Q50,60 40,60 L-30,60', fill: 'none', stroke: '#8e44ad', 'stroke-width': 4, opacity: 0.55 }),
    s('path', { d: 'M-46,-10 L-40,-22 L-34,-10 M-2,-66 L10,-60 L-2,-54 M44,10 L50,22 L56,10 M10,54 L-2,60 L10,66', fill: 'none', stroke: '#8e44ad', 'stroke-width': 3 }),
    s('path', { d: 'M-54,96 Q-58,80 -40,72 Q-22,80 -26,96 Z', fill: '#3f7de0' }),
    s('circle', { cx: x.at[0], cy: x.at[1], r: 18, fill: 'none', stroke: '#c0392b', 'stroke-width': 3, 'stroke-dasharray': '4 3' }));
  Observation.run({
    id: 'g6-convection',
    guide: '../practical.html#g6-convection',
    objectives: ['I can observe convection currents in water.', 'I can use them to explain how the mantle moves tectonic plates.'],
    benchLabel: 'A beaker of water heated gently under one side, with a purple crystal showing the water moving round in a loop.',
    picture,
    tests: {
      label: 'Place',
      title: 'Follow the purple colour',
      text: 'Your teacher drops a purple crystal at one side of the beaker and heats that side gently. Look at how the coloured water moves in each circled place.',
      why: 'The purple dye shows the path of the water, which you could not otherwise see.',
      task: 'look at the circled water',
      button: (x) => `Look: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'How it moves',
        q: (x) => `${x.short}: how does the purple water move?`,
        task: 'record how it moves',
        options: MOVES,
        answer: (x) => MOVES[x.k],
        hint: () => 'Follow the arrows on the purple loop.',
      }],
    },
    questions: [{
      q: 'Why does the warm water above the flame rise?',
      o: ['It expands and becomes less dense than the cooler water around it', 'The flame pushes it up', 'Warm water is heavier'],
      hint: 'What happens to the particles when water is heated?',
      right: 'Yes. Warm water is less dense, so it rises; it cools at the top, becomes denser and sinks.',
    }, {
      q: 'How does this model explain plate movement?',
      o: ['Hot rock in the mantle moves slowly in the same kind of loop and drags the plates of the crust', 'The plates float on water', 'The Sun heats the plates'],
      hint: 'What does the beaker of water represent?',
      right: 'Yes. Convection currents in the mantle slowly move the tectonic plates.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Warm water rose above the flame, spread across the top, cooled and sank on the other side, making a loop. Hot rock in the mantle moves slowly in the same way and drags the plates of the crust.',
      rows: [['Above the flame', 'rises'], ['Far side', 'sinks']],
    }),
  });
})();
