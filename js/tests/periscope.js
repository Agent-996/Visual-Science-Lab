/* Building a periscope (Grade 7, Stage 8: 8Ps.01, 8SIC.02). */
(function () {
  'use strict';
  const DOWN = 'It turns through 90° and goes down the tube';
  const EYE = 'It turns through 90° and goes into your eye';
  const SAMPLES = [
    { name: 'Light reaching the top mirror', short: 'Top mirror', a: DOWN, spot: -58 },
    { name: 'Light reaching the bottom mirror', short: 'Bottom mirror', a: EYE, spot: 58 },
  ];
  function picture(x, s) {
    return s('g', null,
      s('rect', { x: -26, y: -90, width: 52, height: 180, fill: '#e6dccb', stroke: '#8a6236', 'stroke-width': 2 }),
      s('rect', { x: -28, y: -84, width: 4, height: 30, fill: '#ffffff' }),
      s('rect', { x: 24, y: 54, width: 4, height: 30, fill: '#ffffff' }),
      s('line', { x1: -20, y1: -48, x2: 20, y2: -78, stroke: '#5f88a3', 'stroke-width': 5 }),
      s('line', { x1: -20, y1: 54, x2: 20, y2: 84, stroke: '#5f88a3', 'stroke-width': 5 }),
      s('path', { d: 'M-150,-63 L0,-63 L0,69 L130,69', fill: 'none', stroke: '#e03131', 'stroke-width': 2.5 }),
      s('path', { d: 'M-80,-67 l8,4 l-8,4 M-4,0 l4,8 l4,-8 M90,65 l8,4 l-8,4', fill: 'none', stroke: '#e03131', 'stroke-width': 2.5 }),
      s('path', { d: 'M136,60 q14,9 0,18 q-6,-9 0,-18 z', fill: '#e2b48c', stroke: '#b5835a' }),
      s('circle', { cx: 0, cy: x.spot, r: 30, fill: 'none', stroke: '#2563d4', 'stroke-width': 3, 'stroke-dasharray': '5 4' }));
  }
  Observation.run({
    id: 'g7-periscope',
    guide: '../practical.html#g7-periscope',
    objectives: ['I can build a periscope using two plane mirrors.', 'I can draw a ray diagram to show how it works.'],
    benchLabel: 'A periscope: a tall tube with a window at the top on one side and at the bottom on the other, and a mirror at 45° behind each window. A red ray of light shows the path.',
    picture,
    tests: {
      label: 'Mirror',
      title: 'Follow the ray of light',
      text: 'Build the periscope with a mirror at 45° behind each window. Follow the ray of light from the object to your eye, one mirror at a time.',
      why: 'A ray diagram shows exactly where the light goes, so you can explain how the periscope works.',
      task: 'look at the circled mirror',
      button: (x) => `Follow the ray to the ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens to the ray?',
        q: (x) => `${x.name}: what happens to the ray?`,
        task: 'record what happens to the ray',
        options: [DOWN, EYE, 'It goes straight through the mirror'],
        answer: (x) => x.a,
        hint: () => 'Follow the red line through the circled mirror.',
      }, {
        label: 'Mirror angle',
        q: () => 'At what angle is the mirror to the tube?',
        task: 'give the mirror angle',
        options: ['45°', '90°', '30°'],
        answer: () => '45°',
        hint: () => 'The mirror goes diagonally across the tube.',
      }],
    },
    questions: [{
      q: 'Why must both mirrors be at 45°?',
      o: ['The angle of incidence equals the angle of reflection, so a 45° mirror turns the ray through exactly 90°', 'So the mirrors fit in the tube', 'So the light goes through the mirrors'],
      hint: 'Use the law of reflection.',
      right: 'Yes. Light hits the mirror at 45° to the normal and leaves at 45°, turning through 90° in total.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Light reflected off the top mirror down the tube, then off the bottom mirror into your eye. Each 45° mirror turns the ray through 90°.',
      rows: [['Top mirror (45°)', 'turns the light down the tube'], ['Bottom mirror (45°)', 'turns the light into your eye']],
    }),
  });
})();
