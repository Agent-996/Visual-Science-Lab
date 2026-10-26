/* Making an electromagnet (Grade 7, Stage 8: 8Pe.02). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: '20 turns of wire, switch on', short: '20 turns, on', clips: '5', mag: 'Yes', turns: 20, on: true },
    { name: '20 turns of wire, switch off', short: '20 turns, off', clips: '0', mag: 'No', turns: 20, on: false },
    { name: '40 turns of wire, switch on', short: '40 turns, on', clips: '11', mag: 'Yes', turns: 40, on: true },
  ];
  function picture(x, s) {
    const g = s('g', null, s('rect', { x: -10, y: -80, width: 20, height: 120, fill: '#7d838a' }), s('path', { d: 'M-10,40 L0,56 L10,40 Z', fill: '#7d838a' }));
    const n = x.turns === 40 ? 16 : 8;
    for (let i = 0; i < n; i++) g.append(s('ellipse', { cx: 0, cy: -70 + i * (100 / n), rx: 14, ry: 3, fill: 'none', stroke: '#b87333', 'stroke-width': 2 }));
    const clips = Number(x.clips);
    for (let i = 0; i < clips; i++) g.append(s('rect', { x: -12 + (i % 3) * 8, y: 56 + Math.floor(i / 3) * 12, width: 8, height: 14, rx: 3, fill: 'none', stroke: '#6b7682', 'stroke-width': 2 }));
    if (!x.on) for (let i = 0; i < 6; i++) g.append(s('rect', { x: -40 + i * 14, y: 90, width: 8, height: 14, rx: 3, fill: 'none', stroke: '#6b7682', 'stroke-width': 2, transform: `rotate(70 ${-36 + i * 14} 97)` }));
    g.append(s('text', { x: 60, y: -60, 'font-size': 13, 'font-weight': 700, fill: x.on ? '#2e9e44' : '#8a96a3' }, x.on ? 'switch ON' : 'switch OFF'));
    return g;
  }
  Observation.run({
    id: 'g7-makeelectromagnet',
    guide: '../practical.html#g7-makeelectromagnet',
    objectives: ['I can make an electromagnet by wrapping a coil round an iron nail.', 'I can show that it is only magnetic while current flows.'],
    benchLabel: 'An iron nail with a coil of insulated wire wrapped round it, connected to a cell and a switch, held over a pile of paperclips.',
    picture,
    tests: {
      label: 'Coil and switch',
      title: 'Test the electromagnet',
      text: 'Wrap 20 turns of wire round the nail and connect it to a cell and a switch. Count the paperclips it picks up. Then switch off. Then try 40 turns.',
      why: 'Counting paperclips gives a simple measure of how strong the electromagnet is.',
      task: 'lower the nail into the paperclips',
      button: (x) => x.short.replace(/^./, (c) => c.toUpperCase()),
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Paperclips held',
        q: (x) => `${x.short}: how many paperclips does the nail hold?`,
        task: 'count the paperclips',
        options: ['0', '5', '11'],
        answer: (x) => x.clips,
        hint: () => 'Count the paperclips hanging from the tip of the nail.',
      }, {
        label: 'Magnetic?',
        q: (x) => `${x.short}: is the nail magnetic?`,
        task: 'decide whether it is magnetic',
        options: ['Yes', 'No'],
        answer: (x) => x.mag,
        hint: () => 'Is current flowing through the coil?',
      }],
    },
    questions: [{
      q: 'What happened when the switch was turned off?',
      o: ['The paperclips dropped, because the nail is only magnetic while current flows', 'The paperclips stayed stuck on', 'The nail became more magnetic'],
      hint: 'Look at the 20 turns, off row.',
      right: 'Yes. That is what makes electromagnets useful: you can switch them on and off.',
    }, {
      q: 'How can you make an electromagnet stronger?',
      o: ['Use more turns of wire (or a bigger current)', 'Use fewer turns of wire', 'Use a plastic core'],
      hint: 'Compare 20 turns with 40 turns.',
      right: 'Yes. More turns, a bigger current or an iron core all make an electromagnet stronger.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'The nail picked up paperclips only while current flowed, and dropped them when switched off. Doubling the turns of wire made it pick up about twice as many.',
      rows: [['20 turns, on', '5 paperclips'], ['Switched off', '0 paperclips'], ['40 turns, on', '11 paperclips']],
    }),
  });
})();
