/* Turning effects: opening a door (Grade 7, Stage 8: 8Pf.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss } = K;

  const HINGE = { x: 100, y: 150 };
  const PX_PER_CM = 8;
  const LENGTH = 66; // cm
  const MOMENT = 0.9; // N m needed to start the door moving
  const forceAt = (cm) => (MOMENT / (cm / 100)) * (1 + gauss() * 0.015);

  Investigation.run({
    id: 'g7-turning',
    guide: '../practical.html#g7-turning',
    objectives: ['I can measure the force needed to open a door at different distances from the hinge.', 'I can explain why long spanners make turning easier.'],
    benchLabel: 'A door seen from above, hinged to a wall on the left, with distances from the hinge marked along it and a newtonmeter hooked on at 90° to the door.',
    state: { at: 60, force: 0, open: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[360, 'A door seen from above, with a newtonmeter hooked on']]);
      svg.append(
        s('rect', { x: 52, y: 40, width: 40, height: 220, fill: '#cfc6b8', stroke: '#a89d8c' }),
        ...Array.from({ length: 11 }, (_, i) => s('line', { x1: 52, x2: 92, y1: 50 + i * 20, y2: 30 + i * 20, stroke: '#a89d8c' })),
        s('line', { x1: HINGE.x, x2: HINGE.x + LENGTH * PX_PER_CM, y1: HINGE.y - 9, y2: HINGE.y - 9, stroke: '#b9c0c7', 'stroke-dasharray': '5 4' }));
      const door = s('g', null);
      const plank = s('rect', { x: HINGE.x, y: HINGE.y - 8, width: LENGTH * PX_PER_CM, height: 16, rx: 2, fill: '#c89b62', stroke: '#8a6236' });
      door.append(plank, s('circle', { cx: HINGE.x, cy: HINGE.y, r: 7, fill: '#6b7682', stroke: '#3a4552' }));
      for (let cm = 10; cm <= 60; cm += 10) {
        const x = HINGE.x + cm * PX_PER_CM;
        door.append(s('line', { x1: x, x2: x, y1: HINGE.y - 8, y2: HINGE.y - 2, stroke: '#4a3520', 'stroke-width': 1 }));
        door.append(s('text', { class: 'scale-text', x, y: HINGE.y - 12, 'text-anchor': 'middle' }, `${cm} cm`));
      }
      // the newtonmeter hangs off the door at 90°, pulled away from it
      const meter = s('g', null);
      const rod = s('rect', { x: -3, y: 284, width: 6, fill: '#9aa5b1' });
      const ring = s('circle', { r: 9, fill: 'none', stroke: '#6b7682', 'stroke-width': 3 });
      const hand = s('path', { d: 'M-16,6 q16,12 32,0 l-2,14 q-14,8 -28,0 z', fill: '#e2b48c', stroke: '#b5835a' });
      const pointer = s('rect', { x: -10, width: 20, height: 3, fill: '#c0392b' });
      meter.append(
        s('path', { d: `M0,${HINGE.y + 8} L0,${HINGE.y + 22}`, stroke: '#6b7682', 'stroke-width': 3, fill: 'none' }),
        rod,
        s('rect', { x: -13, y: HINGE.y + 22, width: 26, height: 112, rx: 5, fill: '#e9eef2', stroke: '#6b7682', 'stroke-width': 1.5 }),
        ...Array.from({ length: 11 }, (_, i) => s('line', { x1: -8, x2: i % 5 ? -2 : 2, y1: HINGE.y + 30 + i * 9.4, y2: HINGE.y + 30 + i * 9.4, stroke: '#33404d', 'stroke-width': 0.8 })),
        pointer,
        ring,
        hand);
      door.append(meter);
      svg.append(door);
      return {
        update() {
          door.setAttribute('transform', `rotate(${st.open.toFixed(2)} ${HINGE.x} ${HINGE.y})`);
          meter.setAttribute('transform', `translate(${HINGE.x + st.at * PX_PER_CM} 0)`);
          const ext = st.force * 7;
          rod.setAttribute('height', 6 + ext);
          ring.setAttribute('cy', 298 + ext);
          hand.setAttribute('transform', `translate(0 ${298 + ext})`);
          pointer.setAttribute('y', HINGE.y + 29 + st.force * 9.4);
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Newtonmeter scale (N)', label: 'Close-up of the newtonmeter scale', span: 2.4, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: 10, value: (st) => (st.force > 0 ? st.force : null) },
    measureTitle: 'Measure the force to open the door',
    measureText: 'Hook the newtonmeter onto the door at each distance from the hinge. Pull at 90° to the door and read the force just as the door starts to open.',
    measureWhy: 'The distance from the hinge is the variable you change. Always pull at 90° to the door, so that all of your force turns the door.',
    measureTask: 'pull the newtonmeter and read the force as the door starts to move',
    measureButton: (v) => `Pull ${v} cm from the hinge`,
    async measure(v, rep, api) {
      const { st } = api;
      const F = forceAt(v);
      const fromOpen = st.open;
      const fromForce = st.force;
      const fromAt = st.at;
      await tween(600, (t) => {
        st.open = lerp(fromOpen, 0, t);
        st.force = lerp(fromForce, 0, t);
        st.at = lerp(fromAt, v, t);
        api.draw();
      });
      st.at = v;
      await tween(1000, (t, raw) => {
        st.force = F * raw;
        api.draw();
      });
      st.force = F;
      await tween(500, (t) => {
        st.open = 7 * t;
        api.draw();
      });
      return F;
    },
    iv: { label: 'Distance from the hinge', unit: 'cm', values: [10, 20, 30, 40, 50, 60] },
    dv: { label: 'Force needed to open', unit: 'N', dp: 1, tol: 0.1, placeholder: 'e.g. 3.0', readHint: 'Read the newtonmeter at the pointer, to the nearest 0.1 N.' },
    graph: { title: 'Force needed against distance from the hinge', xLabel: 'Distance from hinge / cm', yLabel: 'Force needed / N', xDomain: [0, 70], yDomain: [0, 10], xStep: 10, yStep: 2 },
    pattern: {
      q: 'What do your results show?',
      o: ['The further from the hinge, the smaller the force needed', 'The further from the hinge, the bigger the force needed', 'The force is the same wherever you pull'],
      hint: 'Compare the force at 10 cm with the force at 60 cm.',
      right: 'Yes. Pulling further from the hinge gives a bigger turning effect for the same force, so you need less force. That is why door handles are far from the hinges.',
      why: 'The turning effect of a force is called its moment: moment = force × distance from the pivot.',
    },
    extra: [{
      title: 'Calculate the moment',
      text: 'Moment = force × distance from the hinge. Work out the moment for your 30 cm reading. Change 30 cm into metres first: 30 cm = 0.30 m.',
      why: 'If the moment comes out about the same at every distance, the door always needs the same turning effect to open. Doubling the distance halves the force.',
      label: 'Moment at 30 cm (force × 0.30 m)',
      short: 'Moment at 30 cm',
      unit: 'N m',
      dp: 2,
      placeholder: 'e.g. 0.90',
      expected: (rows) => rows[2].mean * 0.3,
      tol: 0.03,
      hint: 'Multiply the force in the 30 cm row by 0.30.',
      msg: (v) => `${v.toFixed(2)} N m. Try another row too: the moment comes out about the same, close to ${MOMENT.toFixed(1)} N m, wherever you pull.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The closer to the hinge, the bigger the force needed, but force × distance (the moment) stayed about the same. A longer spanner or a handle far from the hinge means less force is needed.',
      rows: [['Force at 10 cm', `${rows[0].mean} N`], ['Force at 60 cm', `${rows[rows.length - 1].mean} N`], ['Moment (force × distance)', `about ${MOMENT.toFixed(1)} N m`]],
    }),
  });
})();
