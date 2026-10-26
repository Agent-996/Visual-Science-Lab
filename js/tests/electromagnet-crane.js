/* Electric bell and scrap-metal crane models (Grade 7, Stage 8: 8Pe.02, 8SIC.02). */
(function () {
  'use strict';
  const LIFT = 'The steel scraps stick to it and are lifted';
  const NONE = 'Nothing is picked up';
  const DROP = 'The steel scraps drop off';
  const SAMPLES = [
    { name: 'Switch on and lower onto steel scraps', short: 'Steel, switched on', a: LIFT, on: 'On', load: 'steel' },
    { name: 'Switch on and lower onto aluminium cans', short: 'Aluminium, switched on', a: NONE, on: 'On', load: 'none' },
    { name: 'Swing over the skip and switch off', short: 'Over the skip, switched off', a: DROP, on: 'Off', load: 'drop' },
  ];
  function picture(x, s) {
    const g = s('g', null,
      s('path', { d: 'M-150,80 L-150,-80 L80,-80', stroke: '#e0a526', 'stroke-width': 8, fill: 'none' }),
      s('line', { x1: 40, y1: -80, x2: 40, y2: -24, stroke: '#4a525b', 'stroke-width': 2 }),
      s('rect', { x: 18, y: -24, width: 44, height: 24, rx: 4, fill: '#5d6874' }),
      s('path', { d: 'M22,-18 L58,-18 M22,-12 L58,-12 M22,-6 L58,-6', stroke: '#b87333', 'stroke-width': 2 }));
    if (x.on === 'On') g.append(s('text', { x: 40, y: -32, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#2e9e44' }, 'ON'));
    const scrap = (cx, cy, c) => s('path', { d: `M${cx - 10},${cy} l8,-6 l12,2 l4,8 l-10,6 l-12,-2 z`, fill: c, stroke: '#3a3f44' });
    if (x.load === 'steel') for (let i = 0; i < 4; i++) g.append(scrap(28 + (i % 2) * 18, 8 + Math.floor(i / 2) * 12, '#7d838a'));
    else if (x.load === 'drop') { g.append(s('rect', { x: 10, y: 50, width: 70, height: 34, fill: '#2f6db5' })); for (let i = 0; i < 4; i++) g.append(scrap(24 + i * 14, 46 - (i % 2) * 8, '#7d838a')); }
    else for (let i = 0; i < 3; i++) g.append(s('rect', { x: 14 + i * 20, y: 62, width: 14, height: 22, rx: 3, fill: '#d9dee2', stroke: '#8a96a3' }));
    return g;
  }
  Observation.run({
    id: 'g7-crane',
    guide: '../practical.html#g7-crane',
    objectives: ['I can build a model that uses an electromagnet.', 'I can explain how electromagnets are used in bells and cranes.'],
    benchLabel: 'A model crane with an electromagnet on the end of its arm, lifting steel scraps, aluminium cans and dropping scraps into a skip.',
    picture,
    tests: {
      label: 'Test',
      title: 'Work the crane',
      text: 'Lower the electromagnet onto different scrap, switch it on and off, and watch what happens.',
      why: 'An electromagnet is only magnetic while current flows through its coil.',
      task: 'work the crane',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.name}: what happens?`,
        task: 'record what happens',
        options: [LIFT, NONE, DROP],
        answer: (x) => x.a,
        hint: () => 'Iron and steel are magnetic; aluminium is not. An electromagnet only works while it is switched on.',
      }, {
        label: 'Electromagnet',
        q: (x) => `${x.name}: is the electromagnet magnetic?`,
        task: 'decide whether it is magnetic',
        options: ['On', 'Off'],
        answer: (x) => x.on,
        right: (x) => (x.on === 'On' ? 'Yes. Current is flowing, so the electromagnet is magnetic.' : 'Yes. With no current, it stops being magnetic.'),
        hint: () => 'Is the switch on or off?',
      }],
    },
    questions: [{
      q: 'Why do scrap-yard cranes use an electromagnet instead of a permanent magnet?',
      o: ['It can be switched off to drop the load', 'It is cheaper', 'It picks up aluminium too'],
      hint: 'How did the crane drop the scraps into the skip?',
      right: 'Yes. Switching off the current turns the magnet off, so the load drops exactly where you want it.',
    }, {
      q: 'In an electric bell, why does the hammer keep hitting the bell?',
      o: ['The electromagnet pulls the hammer, which breaks the circuit, so it springs back and the cycle repeats', 'The hammer is a permanent magnet', 'Someone presses it many times'],
      hint: 'What happens to the circuit when the hammer moves?',
      right: 'Yes. Each time the hammer moves, it breaks and then remakes the circuit, switching the electromagnet off and on very quickly.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The electromagnet lifted steel only while it was switched on, ignored aluminium, and dropped the steel when switched off. This is how scrap-yard cranes and electric bells work.',
      rows: [['Steel, switched on', 'lifted'], ['Aluminium', 'not picked up'], ['Switched off', 'steel drops']],
    }),
  });
})();
