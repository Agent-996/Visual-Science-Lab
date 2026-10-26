/* Diffusion: ammonia and hydrogen chloride (Grade 7, Stage 8: 8Pf.07). */
(function () {
  'use strict';
  const SEEN = ['A white ring forms inside the tube', 'Nothing happens', 'The tube turns yellow'];
  const WHERE = ['Closer to the hydrogen chloride end', 'Exactly in the middle', 'Closer to the ammonia end'];
  const SAMPLES = [
    { name: 'After a few minutes', short: 'After a few minutes' },
  ];
  const picture = (x, s) => s('g', null,
    s('rect', { x: -150, y: -14, width: 300, height: 28, rx: 14, fill: 'rgba(214, 232, 242, 0.5)', stroke: '#7f97a8', 'stroke-width': 2 }),
    s('rect', { x: -156, y: -16, width: 18, height: 32, rx: 6, fill: '#f6f7f8', stroke: '#9aa5b1' }),
    s('rect', { x: 138, y: -16, width: 18, height: 32, rx: 6, fill: '#f6f7f8', stroke: '#9aa5b1' }),
    s('rect', { x: 50, y: -13, width: 14, height: 26, fill: '#ffffff', stroke: '#c9d1d9' }),
    s('text', { x: -147, y: 40, 'text-anchor': 'middle', 'font-size': 11, fill: '#455261' }, 'ammonia'),
    s('text', { x: 147, y: 40, 'text-anchor': 'middle', 'font-size': 11, fill: '#455261' }, 'hydrogen chloride'));
  Observation.run({
    id: 'g7-diffusiondemo',
    guide: '../practical.html#g7-diffusiondemo',
    objectives: ['I can describe diffusion in liquids and gases.', 'I can explain why lighter particles diffuse faster.'],
    benchLabel: 'A long glass tube with cotton wool soaked in ammonia at one end and in hydrogen chloride at the other.',
    picture,
    tests: {
      label: 'Time',
      title: 'Watch the tube',
      text: 'Your teacher puts the two soaked cotton wool plugs into the ends of the tube at the same time. Watch for a white ring forming.',
      why: 'The two gases react to make a white solid, ammonium chloride, where they meet.',
      task: 'watch the tube',
      button: () => 'Wait a few minutes',
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What you see',
        q: () => 'What do you see?',
        task: 'record what you see',
        options: SEEN,
        answer: () => SEEN[0],
        hint: () => 'Look along the tube.',
      }, {
        label: 'Where',
        q: () => 'Where does the white ring form?',
        task: 'record where it forms',
        options: WHERE,
        answer: () => WHERE[0],
        hint: () => 'Compare the distance from each end.',
      }],
    },
    questions: [{
      q: 'Why does the ring form closer to the hydrogen chloride end?',
      o: ['Ammonia particles are lighter, so they diffuse faster and travel further in the same time', 'Hydrogen chloride particles are faster', 'The tube is tilted'],
      hint: 'Which gas travelled further before they met?',
      right: 'Yes. Lighter particles move faster, so they diffuse more quickly.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'A white ring of ammonium chloride formed closer to the hydrogen chloride end. Ammonia particles are lighter, so they diffused faster and travelled further in the same time.',
      rows: [['White ring', 'closer to the hydrogen chloride end']],
    }),
  });
})();
