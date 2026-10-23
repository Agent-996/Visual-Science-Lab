/* Current at different points in a series circuit (Grade 6, Stage 7: 7Pe.03, 7TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, round, rand, tween } = K;

  const current = round(rand(0.18, 0.32), 2); // A, the same all the way round
  // Where the ammeter goes: a point in the wire, and the gap it is connected into.
  const POINTS = {
    A: { x: 230, y: 110, label: 'A: between the cell and lamp 1' },
    B: { x: 385, y: 110, label: 'B: between the two lamps' },
    C: { x: 560, y: 225, label: 'C: after lamp 2' },
    D: { x: 360, y: 340, label: 'D: on the way back to the cell' },
  };

  Investigation.run({
    id: 'g6-seriescurrent',
    guide: '../practical.html#g6-seriescurrent',
    objectives: ['I can measure current with an ammeter connected in series.', 'I can show that current is the same everywhere in a series circuit.'],
    benchLabel: 'A series circuit on a board: a cell, a switch, two lamps and an ammeter that can be moved to points A, B, C and D.',
    state: { built: false, on: false, at: null, ax: 640, ay: 330, reading: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[360, 'Series circuit: cell, switch, two lamps and an ammeter']]);
      svg.append(s('rect', { x: 110, y: 60, width: 500, height: 320, rx: 14, fill: '#efe9df', stroke: '#d6cbb9' }));
      const wires = s('path', { d: 'M170,225 L170,110 L560,110 L560,340 L170,340 L170,245', fill: 'none', stroke: '#b5651d', 'stroke-width': 4, 'stroke-linejoin': 'round', opacity: 0 });
      const glow = (cx) => s('circle', { cx, cy: 110, r: 26, fill: 'rgba(255, 214, 92, 0.55)', opacity: 0 });
      const lampGlow = [glow(310), glow(460)];
      const lamp = (cx) => s('g', null,
        s('circle', { cx, cy: 110, r: 16, fill: '#fffdf2', stroke: '#33404d', 'stroke-width': 2.5 }),
        s('path', { d: `M${cx - 11},${99} L${cx + 11},${121} M${cx + 11},${99} L${cx - 11},${121}`, stroke: '#33404d', 'stroke-width': 2.5 }));
      const cell = s('g', null,
        s('rect', { x: 150, y: 222, width: 40, height: 30, fill: '#efe9df' }),
        s('line', { x1: 150, x2: 190, y1: 228, y2: 228, stroke: '#33404d', 'stroke-width': 3 }),
        s('line', { x1: 160, x2: 180, y1: 240, y2: 240, stroke: '#33404d', 'stroke-width': 6 }),
        s('text', { x: 200, y: 232, 'font-size': 13, 'font-weight': 700, fill: '#33404d', 'font-family': 'Lexend, sans-serif' }, '+'),
        s('text', { class: 'bench-label', x: 120, y: 280 }, 'Cell'));
      const switchArm = s('line', { x1: 250, y1: 340, x2: 290, y2: 322, stroke: '#33404d', 'stroke-width': 3, 'stroke-linecap': 'round' });
      const sw = s('g', null, s('rect', { x: 242, y: 330, width: 58, height: 20, fill: '#efe9df' }), s('circle', { cx: 250, cy: 340, r: 4, fill: '#33404d' }), s('circle', { cx: 292, cy: 340, r: 4, fill: '#33404d' }), switchArm,
        s('text', { class: 'bench-label', x: 271, y: 372, 'text-anchor': 'middle' }, 'Switch'));
      const markers = Object.entries(POINTS).map(([k, p]) => s('text', { x: p.x, y: p.y + (p.y === 110 ? -26 : p.x === 560 ? 5 : 30), dx: p.x === 560 ? 28 : 0, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#5b4bc8', 'font-family': 'Lexend, sans-serif' }, k));
      const reading = s('text', { x: 0, y: 6, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#1f2a1a', 'font-family': 'Source Sans 3, sans-serif' }, '');
      const meter = s('g', null,
        s('circle', { cx: 0, cy: 0, r: 30, fill: '#39424b' }),
        s('rect', { x: -24, y: -10, width: 48, height: 22, rx: 3, fill: '#c9d7ba' }),
        reading,
        s('text', { x: 0, y: -15, 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 700, fill: '#fff', 'font-family': 'Lexend, sans-serif' }, 'AMMETER'));
      const lamps = s('g', null, lamp(310), lamp(460), s('text', { class: 'bench-label', x: 310, y: 150, 'text-anchor': 'middle' }, 'Lamp 1'), s('text', { class: 'bench-label', x: 460, y: 150, 'text-anchor': 'middle' }, 'Lamp 2'));
      const parts = s('g', { opacity: 0 }, cell, sw, lamps, ...markers);
      svg.append(wires, ...lampGlow, parts, meter);
      return {
        update() {
          wires.setAttribute('opacity', st.built ? 1 : 0.15);
          parts.setAttribute('opacity', st.built ? 1 : 0.15);
          switchArm.setAttribute('x2', st.on ? 292 : 288);
          switchArm.setAttribute('y2', st.on ? 340 : 318);
          for (const gl of lampGlow) gl.setAttribute('opacity', st.on ? 1 : 0);
          meter.setAttribute('transform', `translate(${st.ax} ${st.ay})`);
          reading.textContent = st.reading === null ? '' : `${st.reading.toFixed(2)} A`;
        },
      };
    },
    setup: [
      {
        title: 'Build the circuit',
        text: 'Connect a cell, a switch and two lamps in one loop. This is a series circuit: there is only one path for the current.',
        why: 'An ammeter must be connected in series, in the loop itself, so that all the current flows through it.',
        button: 'Connect the circuit',
        done: 'The circuit is built. The switch is open, so no current flows yet.',
        async run(api) {
          api.st.built = true;
          api.draw();
        },
      },
      {
        title: 'Close the switch',
        text: 'Close the switch and check that both lamps light.',
        why: 'Both lamps light because the current flows through each of them in turn.',
        button: 'Close the switch',
        done: 'Both lamps are lit.',
        async run(api) {
          api.st.on = true;
          api.draw();
        },
      },
    ],
    measureTitle: 'Measure the current at four points',
    measureText: 'Open the switch, connect the ammeter into the circuit at point A, close the switch and read the current. Repeat at B, C and D.',
    measureWhy: 'Measuring at different points shows whether current is used up as it goes round the circuit.',
    measureTask: 'connect the ammeter here and read the current',
    measureButton: (v) => `Connect the ammeter at ${v}`,
    async measure(v, rep, api) {
      const { st } = api;
      const p = POINTS[v];
      st.on = false;
      st.reading = null;
      api.draw();
      const from = { x: st.ax, y: st.ay };
      await tween(900, (t) => {
        st.ax = lerp(from.x, p.x, t);
        st.ay = lerp(from.y, p.y, t) - Math.sin(t * Math.PI) * 30;
        api.draw();
      });
      st.on = true;
      st.reading = current;
      api.draw();
      api.status(`Ammeter at ${p.label}`);
      return current;
    },
    iv: { label: 'Ammeter position', unit: '', values: ['A', 'B', 'C', 'D'], categorical: true },
    dv: { label: 'Current', unit: 'A', dp: 2, tol: 0.005, placeholder: 'e.g. 0.25', readHint: 'Copy the number on the ammeter display. Current is measured in amps (A).' },
    pattern: {
      q: 'What do your results show?',
      o: ['The current is the same at every point in a series circuit', 'The current gets smaller after each lamp', 'The current is biggest next to the cell'],
      hint: 'Compare the four readings in your table.',
      right: 'Yes. Current is not used up by the lamps. The same current flows all the way round a series circuit.',
      why: 'Current is the flow of charge. In a series circuit there is only one path, so the same charge passes every point each second.',
    },
    summary: () => ({
      title: 'Practical complete',
      summary: `The ammeter read ${current.toFixed(2)} A at every point. In a series circuit the current is the same everywhere: the lamps transfer energy, but they do not use up current.`,
      rows: [['Current at A, B, C and D', `${current.toFixed(2)} A`], ['Unit of current', 'ampere (A)'], ['How the ammeter is connected', 'in series']],
    }),
  });
})();
