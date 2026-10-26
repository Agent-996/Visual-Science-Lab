/* Vitamin C in fruit juices (Grade 7, Stage 8: 8Bp.01, 8TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, lerp } = K;
  const DROPS = { 'Fresh orange': 6, 'Carton orange': 11, Lemon: 8, Apple: 25, 'Boiled orange': 18 };
  Investigation.run({
    id: 'g7-vitaminc',
    guide: '../practical.html#g7-vitaminc',
    objectives: ['I can compare the vitamin C content of juices using DCPIP.', 'I can count drops accurately and compare results.'],
    benchLabel: 'A test tube of 1 cm³ of blue DCPIP solution, a dropping pipette of fruit juice, and a counter of drops added.',
    state: { juice: null, drops: 0, fade: 0, drop: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Test tube of blue DCPIP'], [580, 'Drops added']]);
      const tube = D.tube(300, 390, 40, 190, 'rgba(40, 90, 210, 0.75)').setLevel(0.25);
      const counter = D.display(530, 160, 110, 'Drops');
      const pipette = s('g', null, s('rect', { x: 295, y: 100, width: 10, height: 70, rx: 2, fill: 'rgba(240, 200, 110, 0.6)', stroke: '#7f97a8' }), s('ellipse', { cx: 300, cy: 92, rx: 9, ry: 13, fill: '#e05a5a' }));
      const drip = s('circle', { cx: 300, r: 3.5, fill: '#f0c060' });
      const name = s('text', { x: 300, y: 70, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(tube.g, pipette, drip, counter.g, name);
      return {
        update() {
          tube.setColour(`rgba(${Math.round(lerp(40, 245, st.fade))}, ${Math.round(lerp(90, 235, st.fade))}, ${Math.round(lerp(210, 200, st.fade))}, 0.75)`).setLevel(0.25 + st.drops * 0.006);
          counter.set(String(st.drops));
          drip.setAttribute('visibility', st.drop ? 'visible' : 'hidden');
          if (st.drop) drip.setAttribute('cy', st.drop);
          name.textContent = st.juice || '';
        },
      };
    },
    measureTitle: 'Count the drops for each juice',
    measureText: 'Put 1 cm³ of blue DCPIP in a clean test tube. Add the juice one drop at a time, shaking gently, until the blue colour just disappears. Count the drops.',
    measureWhy: 'Vitamin C makes DCPIP lose its colour. The fewer drops needed, the more vitamin C the juice contains.',
    measureTask: 'add drops until the blue disappears, then read the counter',
    measureButton: (v) => `Test the ${v.toLowerCase()} juice`,
    async measure(v, rep, api) {
      const { st } = api;
      st.juice = v;
      st.drops = 0;
      st.fade = 0;
      const n = DROPS[v];
      for (let i = 1; i <= n; i++) {
        await tween(Math.max(60, 600 / n), (t, raw) => {
          st.drop = lerp(172, 300, raw);
          api.draw();
        });
        st.drops = i;
        st.fade = i === n ? 1 : (i / n) * 0.55;
        api.draw();
      }
      st.drop = null;
      api.draw();
      return n;
    },
    iv: { label: 'Juice', unit: '', values: Object.keys(DROPS), categorical: true },
    dv: { label: 'Drops to remove the blue', unit: 'drops', dp: 0, tol: 0, placeholder: 'e.g. 9', readHint: 'Copy the number of drops on the counter.' },
    graph: { title: 'Drops of juice needed to decolourise 1 cm³ of DCPIP', xLabel: 'Juice', yLabel: 'Drops', yDomain: [0, 30], yStep: 5 },
    pattern: {
      q: 'Which juice contains the most vitamin C?',
      o: ['Fresh orange, because it needed the fewest drops', 'Apple, because it needed the most drops', 'They all contain the same amount'],
      hint: 'Fewer drops means more vitamin C in each drop.',
      right: 'Yes. Fresh orange decolourised the DCPIP in the fewest drops, so it has the most vitamin C.',
      why: 'Boiled and older juice needs more drops, because vitamin C is destroyed by heat and over time.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Juices high in vitamin C, such as fresh orange, decolourised the DCPIP in fewer drops. Boiled or older juice needed more drops, because vitamin C is destroyed by heat and over time.',
      rows: rows.map((r) => [r.x, `${r.mean} drops`]),
    }),
  });
})();
