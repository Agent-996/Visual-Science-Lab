/* Crater formation (Grade 7, Stage 8: 8ESs.02, 8TWSp.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss, round } = K;

  const SURFACE = 330; // y of the flour surface
  const PX_PER_CM = 2.4;
  const diameterFor = (h) => round(1.5 * Math.pow(h, 0.3) + gauss() * 0.12, 2); // cm

  Investigation.run({
    id: 'g7-craters',
    guide: '../practical.html#g7-craters',
    objectives: ['I can investigate how drop height affects crater size.', 'I can link craters on the Moon to asteroid impacts.'],
    benchLabel: 'A tray of flour with cocoa on top, a metre rule standing beside it, a marble held above the tray, and a view of the crater from above.',
    height: 440,
    state: { h: 20, marbleY: null, crater: 0, rays: [], view: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[330, 'Tray of flour and cocoa', '(the "Moon’s surface")'], [612, 'Crater seen from above']]);
      const tray = s('g', null,
        s('rect', { x: 170, y: SURFACE, width: 320, height: 60, fill: '#f7f3ea' }),
        s('rect', { x: 170, y: SURFACE, width: 320, height: 5, fill: '#7a4b2a' }),
        s('path', { d: `M160,${SURFACE - 6} L170,${SURFACE - 6} L170,${SURFACE + 60} L490,${SURFACE + 60} L490,${SURFACE - 6} L500,${SURFACE - 6} L500,400 L160,400 Z`, fill: '#a9b4bd' }));
      const dent = s('ellipse', { cx: 330, cy: SURFACE + 2, rx: 0, ry: 0, fill: '#efe6d3', stroke: '#5c3a20', 'stroke-width': 1 });
      const ejecta = s('g', null);
      const rule = s('g', null, s('rect', { x: 520, y: SURFACE - 250, width: 20, height: 250, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let cm = 0; cm <= 100; cm += 5) rule.append(s('line', { x1: 520, x2: 520 + (cm % 10 ? 5 : 9), y1: SURFACE - cm * PX_PER_CM, y2: SURFACE - cm * PX_PER_CM, stroke: '#2b2418', 'stroke-width': 0.8 }));
      for (let cm = 0; cm <= 100; cm += 20) rule.append(s('text', { class: 'scale-text', x: 531, y: SURFACE - cm * PX_PER_CM + 3 }, String(cm)));
      const hand = s('path', { d: 'M-14,-14 q14,-10 28,0 l-4,8 q-10,-6 -20,0 z', fill: '#e2b48c', stroke: '#b5835a' });
      const marble = s('circle', { r: 7, fill: '#3b6fb6', stroke: '#1d3f70', 'stroke-width': 1.5 });
      const marbleG = s('g', null, hand, marble);
      // view from above with a ruler under the crater
      const top = s('g', null,
        s('rect', { x: 560, y: 120, width: 110, height: 110, rx: 8, fill: '#7a4b2a' }));
      const topCrater = s('circle', { cx: 615, cy: 165, r: 0, fill: '#f2ead8', stroke: '#5c3a20' });
      const topRule = s('g', null, s('rect', { x: 562, y: 196, width: 106, height: 16, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let i = 0; i <= 10; i++) topRule.append(s('line', { x1: 565 + i * 10, x2: 565 + i * 10, y1: 196, y2: 202 + (i % 5 ? 0 : 3), stroke: '#2b2418', 'stroke-width': 0.8 }));
      svg.append(tray, dent, ejecta, rule, marbleG, top, topCrater, topRule);
      return {
        update() {
          const y = st.marbleY === null ? SURFACE - st.h * PX_PER_CM - 8 : st.marbleY;
          marbleG.setAttribute('transform', `translate(330 ${y})`);
          hand.setAttribute('visibility', st.marbleY === null ? 'visible' : 'hidden');
          const r = st.crater * 6;
          dent.setAttribute('rx', r);
          dent.setAttribute('ry', r * 0.3);
          ejecta.replaceChildren(...st.rays.map((p) => s('circle', { cx: p.x, cy: p.y, r: 1.6, fill: '#f2ead8' })));
          topCrater.setAttribute('r', st.crater * 5);
          topCrater.setAttribute('cx', 565 + st.crater * 5);
        },
      };
    },
    closeUp: { kind: 'ruler', label: 'Close-up of the ruler across the crater (from one edge)', span: 3, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: 15, value: (st) => (st.crater > 0 ? st.crater : null) },
    measureTitle: 'Drop the marble and measure the crater',
    measureText: 'Hold the marble at each height above the surface, drop it, then measure the diameter of the crater across its widest point. Do each height three times.',
    measureWhy: 'Drop height is the variable you change. Use the same marble and smooth the surface between drops so each test is fair. Repeating each height three times shows how repeatable your results are.',
    measureTask: 'drop the marble and measure the crater',
    measureButton: (v, rep) => `Drop from ${v} cm${rep ? ` (trial ${rep + 1})` : ''}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.crater = 0;
      st.rays = [];
      st.h = v;
      st.marbleY = null;
      api.draw();
      await tween(400, () => api.draw());
      const startY = SURFACE - v * PX_PER_CM - 8;
      st.marbleY = startY;
      await tween(500 + v * 4, (t, raw) => {
        st.marbleY = lerp(startY, SURFACE - 2, raw * raw);
        api.draw();
      });
      const d = diameterFor(v);
      const rays = Array.from({ length: 24 }, () => ({ a: Math.random() * Math.PI, len: 10 + Math.random() * d * 9, side: Math.random() > 0.5 ? 1 : -1 }));
      await tween(500, (t) => {
        st.crater = d * t;
        st.rays = rays.map((r) => ({ x: 330 + Math.cos(r.a) * r.len * t * r.side, y: SURFACE - Math.sin(r.a) * r.len * 0.3 * t }));
        api.draw();
      });
      st.crater = d;
      st.marbleY = SURFACE + 2;
      api.draw();
      return d;
    },
    afterReading(api) {
      api.say('Smooth the surface and sprinkle more cocoa before the next drop.', 'info');
    },
    repeats: 3,
    iv: { label: 'Drop height', unit: 'cm', values: [20, 40, 60, 80, 100] },
    dv: { label: 'Crater diameter', unit: 'cm', dp: 1, tol: 0.1, placeholder: 'e.g. 3.8', readHint: 'Read the ruler at the far edge of the crater, to the nearest millimetre (0.1 cm).' },
    graph: { title: 'Crater diameter against drop height', xLabel: 'Drop height / cm', yLabel: 'Mean crater diameter / cm', xDomain: [0, 100], yDomain: [0, 8], yStep: 1 },
    pattern: {
      q: 'What do your results show?',
      o: ['The higher the drop, the wider the crater', 'The higher the drop, the narrower the crater', 'The drop height makes no difference'],
      hint: 'Look at the mean diameters as the height increases.',
      right: 'Yes. A marble dropped from higher up is moving faster when it lands, so it has more energy to push the surface aside.',
      why: 'Asteroids hit the Moon very fast. With no atmosphere to slow them down, they make large craters that stay for millions of years.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Higher drops made wider craters because the marble was moving faster when it hit. The Moon is covered in craters because it has no atmosphere to slow down or burn up rocks from space.',
      rows: [['Mean diameter from 20 cm', `${rows[0].mean} cm`], ['Mean diameter from 100 cm', `${rows[4].mean} cm`], ['Trials at each height', '3']],
    }),
  });
})();
