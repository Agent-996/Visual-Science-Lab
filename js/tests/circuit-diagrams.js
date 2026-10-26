/* Building circuits from diagrams (Grade 6, Stage 7: 7Pe.05, 7TWSm.02). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'Circuit 1', detail: 'A cell, a closed switch and a lamp.', parts: { cells: 1, lamps: 1, sw: 'closed' }, on: true },
    { name: 'Circuit 2', detail: 'The same circuit with the switch open.', parts: { cells: 1, lamps: 1, sw: 'open' }, on: false },
    { name: 'Circuit 3', detail: 'A cell and two lamps in one loop.', parts: { cells: 1, lamps: 2 }, on: true },
    { name: 'Circuit 4', detail: 'A cell and a lamp with one wire not connected.', parts: { cells: 1, lamps: 1, gap: true }, on: false },
    { name: 'Circuit 5', detail: 'Two cells and a lamp.', parts: { cells: 2, lamps: 1 }, on: true },
  ];
  // A circuit diagram with standard symbols: cells on the top, lamps on the right, switch or gap on the bottom.
  function picture(x, s) {
    const W = 'stroke-width';
    const p = x.parts;
    const g = s('g', { stroke: '#1f2a33', fill: 'none', [W]: 2 });
    const top = -42;
    const bot = 42;
    const cellX = p.cells === 2 ? [-22, 6] : [-8];
    g.append(s('path', { d: `M-100,${top} L${cellX[0] - 4},${top} M${cellX[cellX.length - 1] + 12},${top} L100,${top} L100,${bot} L-100,${bot} Z`.replace(' Z', ` L-100,${top}`) }));
    for (const cx of cellX) g.append(s('line', { x1: cx, x2: cx, y1: top - 14, y2: top + 14, [W]: 2.5 }), s('line', { x1: cx + 8, x2: cx + 8, y1: top - 7, y2: top + 7, [W]: 4 }));
    if (p.cells === 2) g.append(s('line', { x1: -14, x2: 6, y1: top, y2: top }));
    const lampY = p.lamps === 2 ? [-14, 18] : [0];
    for (const ly of lampY) g.append(s('circle', { cx: 100, cy: ly, r: 11, fill: x.on ? '#ffe680' : '#ffffff' }), s('path', { d: `M92,${ly - 8} L108,${ly + 8} M108,${ly - 8} L92,${ly + 8}` }));
    if (p.sw) {
      g.append(s('rect', { x: -16, y: bot - 4, width: 34, height: 8, fill: '#ffffff', stroke: 'none' }));
      g.append(s('circle', { cx: -14, cy: bot, r: 3, fill: '#1f2a33' }), s('circle', { cx: 16, cy: bot, r: 3, fill: '#1f2a33' }));
      g.append(s('line', { x1: -14, y1: bot, x2: 16, y2: p.sw === 'closed' ? bot : bot - 16 }));
    }
    if (p.gap) g.append(s('rect', { x: -40, y: bot - 4, width: 26, height: 8, fill: '#ffffff', stroke: 'none' }));
    return g;
  }
  Observation.run({
    id: 'g6-buildcircuits',
    guide: '../practical.html#g6-buildcircuits',
    objectives: ['I can build a circuit from a circuit diagram.', 'I can draw a circuit diagram of a circuit I have built, using the correct symbols.'],
    benchLabel: 'A card showing one circuit diagram at a time, drawn with standard symbols for cells, lamps and switches, and two trays: lamp lights and lamp stays off.',
    picture,
    tests: {
      label: 'Circuit',
      title: 'Read each circuit diagram',
      text: 'Look at each circuit diagram. Decide whether the lamp will light if you build it, and why.',
      why: 'Circuit diagrams use standard symbols, so anyone can build exactly the same circuit.',
      task: 'read the diagram',
      button: (x) => `Look at ${x.name}`,
      samples: SAMPLES,
      columns: [{
        label: 'Will the lamp light?',
        q: (x) => `${x.name}: will the lamp light?`,
        task: 'decide whether the lamp lights',
        options: ['Yes', 'No'],
        answer: (x) => (x.on ? 'Yes' : 'No'),
        hint: () => 'Trace the wire with your finger from one side of the cell all the way round. Is there a break?',
      }, {
        label: 'Why?',
        q: (x) => `${x.name}: why?`,
        task: 'explain why',
        options: ['It is a complete loop', 'The loop is broken'],
        answer: (x) => (x.on ? 'It is a complete loop' : 'The loop is broken'),
        hint: () => 'Current can only flow round a complete loop.',
      }],
    },
    questions: [{
      q: 'Which symbol shows a lamp?',
      o: ['A circle with a cross inside', 'A long line and a short line', 'A line with a gap and a hinged line'],
      hint: 'Look at the right-hand side of each diagram.',
      right: 'Yes. A long and a short line is a cell, and a hinged line is a switch.',
    }, {
      q: 'Why do scientists use standard symbols in circuit diagrams?',
      o: ['So anyone, anywhere, can read the diagram and build the same circuit', 'Because they look nice', 'To make circuits work better'],
      hint: 'Think about sharing a circuit with someone in another country.',
      right: 'Yes. Standard symbols mean everyone reads the diagram the same way.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'A lamp only lights when there is a complete loop from one side of the cell to the other. An open switch or a loose wire breaks the loop.',
      rows: rows.map((r) => [r.name, r.cells[0] === 'Yes' ? 'lamp lights' : 'lamp off']),
    }),
  });
})();
