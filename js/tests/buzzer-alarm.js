/* Design challenge: buzzer alarm or steady-hand game (Grade 6, Stage 7: 7Pe.05, 7SIC.02). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'Steady-hand game: the loop touches the wire', short: 'Game: touching', game: true, touch: true },
    { name: 'Steady-hand game: the loop does not touch the wire', short: 'Game: not touching', game: true, touch: false },
    { name: 'Door alarm: the door opens and the foil contacts touch', short: 'Alarm: door open', game: false, touch: true },
    { name: 'Door alarm: the door is closed and the contacts are apart', short: 'Alarm: door closed', game: false, touch: false },
  ];
  function picture(x, s) {
    const g = s('g', null);
    if (x.game) {
      g.append(s('path', { d: 'M-130,10 L-90,-20 L-50,20 L-10,-20 L30,20 L70,-20 L110,10', fill: 'none', stroke: '#b87333', 'stroke-width': 4 }));
      g.append(s('ellipse', { cx: -10, cy: x.touch ? -12 : -38, rx: 16, ry: 9, fill: 'none', stroke: '#6b7682', 'stroke-width': 3 }), s('line', { x1: -10, y1: x.touch ? -3 : -29, x2: -10, y2: 40, stroke: '#6b7682', 'stroke-width': 4 }));
    } else {
      g.append(s('rect', { x: -110, y: -40, width: 14, height: 90, fill: '#c89b62' }), s('rect', { x: -96, y: -40, width: 110, height: 12, fill: '#c89b62', transform: x.touch ? 'rotate(30 -96 -34)' : '' }));
      g.append(s('rect', { x: -20, y: -6, width: 34, height: 8, fill: '#c9d1d9', stroke: '#8a96a3' }), s('rect', { x: -20, y: x.touch ? 2 : 22, width: 34, height: 8, fill: '#c9d1d9', stroke: '#8a96a3' }));
    }
    g.append(s('rect', { x: 92, y: 28, width: 44, height: 30, rx: 6, fill: '#39424b' }), s('text', { x: 114, y: 48, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#ffffff' }, 'buzzer'));
    if (x.touch) g.append(s('path', { d: 'M142,30 q8,12 0,24 M150,24 q12,18 0,36', fill: 'none', stroke: '#c0392b', 'stroke-width': 2.5 }));
    return g;
  }
  Observation.run({
    id: 'g6-alarm',
    guide: '../practical.html#g6-alarm',
    objectives: ['I can design and build a working circuit with a switch for a purpose.', 'I can draw the circuit diagram and evaluate my design.'],
    benchLabel: 'A steady-hand game (a metal loop round a bent wire) and a door alarm (two foil contacts), each connected to a cell and a buzzer.',
    picture,
    tests: {
      label: 'Test',
      title: 'Test your designs',
      text: 'Test the steady-hand game and the door alarm. Each is a circuit with a cell, a buzzer and a homemade switch.',
      why: 'In both designs, two metal parts act as a switch: touching completes the circuit.',
      task: 'try it',
      button: (x) => `Try: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      columns: [{
        label: 'Buzzer sounds?',
        q: (x) => `${x.name}: does the buzzer sound?`,
        task: 'record whether the buzzer sounds',
        options: ['Yes', 'No'],
        answer: (x) => (x.touch ? 'Yes' : 'No'),
        hint: () => 'Are the two metal parts touching?',
      }, {
        label: 'Circuit complete?',
        q: (x) => `${x.name}: is the circuit complete?`,
        task: 'decide whether the circuit is complete',
        options: ['Yes', 'No'],
        answer: (x) => (x.touch ? 'Yes' : 'No'),
        hint: () => 'A buzzer only sounds when current flows round a complete loop.',
      }],
    },
    questions: [{
      q: 'In the steady-hand game, what acts as the switch?',
      o: ['The metal loop and the wire: when they touch, they complete the circuit', 'The buzzer', 'The cell'],
      hint: 'What has to happen for the buzzer to sound?',
      right: 'Yes. The loop and the wire are both metal conductors, so touching them together closes the circuit.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Both designs work by completing a circuit: when two metal parts touch, current flows and the buzzer sounds.',
      rows: [['Metal parts touching', 'buzzer sounds'], ['Metal parts apart', 'silent']],
    }),
  });
})();
