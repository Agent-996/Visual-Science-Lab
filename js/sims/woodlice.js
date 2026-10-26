/* Woodlice choice chamber (Grade 6, Stage 7: 7Bp.01, 7TWSp.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, rand, gauss, clamp } = K;

  const C = { x: 360, y: 205, r: 150 }; // the chamber, seen from above
  const N = 10;
  const preferDamp = (t) => 0.5 + 0.42 * (1 - Math.exp(-t / 3));

  // A random spot on one side of the chamber, clear of the divider and the rim.
  function spot(damp) {
    for (;;) {
      const x = C.x + (damp ? -1 : 1) * rand(18, C.r - 16);
      const y = C.y + rand(-C.r + 16, C.r - 16);
      if (Math.hypot(x - C.x, y - C.y) < C.r - 18) return { x, y, a: rand(0, 360) };
    }
  }

  Investigation.run({
    id: 'g6-woodlice',
    guide: '../practical.html#g6-woodlice',
    objectives: ['I can show that living things respond to their surroundings (sensitivity).', 'I can plan a fair test with a choice chamber.'],
    benchLabel: 'A round choice chamber seen from above, damp on the left and dry on the right, with ten woodlice, a sheet of black card and a timer.',
    state: { lice: [], shown: 0, card: 0, minutes: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[C.x, 'Choice chamber seen from above'], [612, 'Timer']]);
      const clipId = 'chamber-clip';
      const chamber = s('g', null,
        s('defs', null, s('clipPath', { id: clipId }, s('circle', { cx: C.x, cy: C.y, r: C.r }))),
        s('g', { 'clip-path': `url(#${clipId})` },
          s('rect', { x: C.x - C.r, y: C.y - C.r, width: C.r, height: C.r * 2, fill: '#bcd8e4' }),
          s('rect', { x: C.x, y: C.y - C.r, width: C.r, height: C.r * 2, fill: '#efe3c8' })),
        s('circle', { cx: C.x, cy: C.y, r: C.r, fill: 'none', stroke: '#8a9aa8', 'stroke-width': 3 }),
        s('line', { x1: C.x, x2: C.x, y1: C.y - C.r, y2: C.y + C.r, stroke: '#8a9aa8', 'stroke-width': 2, 'stroke-dasharray': '5 4' }),
        s('text', { class: 'bench-label', x: C.x - C.r / 2, y: C.y - C.r + 26, 'text-anchor': 'middle' }, 'DAMP'),
        s('text', { class: 'bench-label', x: C.x + C.r / 2, y: C.y - C.r + 26, 'text-anchor': 'middle' }, 'DRY'));
      const lice = s('g', null);
      const louse = () => s('g', null,
        s('ellipse', { rx: 10, ry: 6, fill: '#5b6168', stroke: '#3a3f44' }),
        ...[-5, -1.5, 2, 5.5].map((x) => s('line', { x1: x, x2: x, y1: -5.5, y2: 5.5, stroke: '#3a3f44', 'stroke-width': 0.8 })),
        s('line', { x1: 10, x2: 15, y1: -2, y2: -5, stroke: '#3a3f44', 'stroke-width': 1 }),
        s('line', { x1: 10, x2: 15, y1: 2, y2: 5, stroke: '#3a3f44', 'stroke-width': 1 }));
      const els = Array.from({ length: N }, louse);
      lice.append(...els);
      const card = s('g', null,
        s('circle', { cx: C.x, cy: C.y, r: C.r + 6, fill: '#1e2328' }),
        s('text', { x: C.x, y: C.y + 5, 'text-anchor': 'middle', fill: '#c9d1d9', 'font-size': 15, 'font-weight': 600 }, 'Black card'));
      const timer = D.display(560, 160, 104, 'Timer');
      svg.append(chamber, lice, card, timer.g);
      return {
        update() {
          st.lice.forEach((p, i) => els[i].setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})`));
          lice.setAttribute('opacity', st.shown);
          card.setAttribute('opacity', st.card * 0.92);
          card.setAttribute('visibility', st.card > 0.01 ? 'visible' : 'hidden');
          timer.set(`${st.minutes} min`);
        },
      };
    },
    setup: [{
      title: 'Set up the choice chamber',
      text: 'Put damp paper under one side of the chamber and dry silica gel under the other. Place 10 woodlice in the middle.',
      why: 'Dampness is the only thing that is different between the two sides, so it is a fair test.',
      button: 'Put in the 10 woodlice',
      done: 'The woodlice are in the middle. Now cover the chamber with black card so both sides are equally dark.',
      async run(api) {
        const { st } = api;
        st.lice = Array.from({ length: N }, (_, i) => ({ x: C.x + Math.cos(i * 0.63) * rand(4, 26), y: C.y + Math.sin(i * 0.63) * rand(4, 26), a: rand(0, 360) }));
        await tween(600, (t) => {
          st.shown = t;
          api.draw();
        });
      },
    }],
    measureTitle: 'Count the woodlice on the damp side',
    measureText: 'Leave the chamber covered. Every 2 minutes, lift the card for a moment and count the woodlice on the damp side.',
    measureWhy: 'Covering the chamber keeps both sides equally dark. Counting at regular times shows how the woodlice move as time goes on.',
    measureTask: 'lift the card and count the woodlice on the damp side',
    measureButton: (v) => `Wait until ${v} minutes, then lift the card`,
    async measure(v, rep, api) {
      const { st } = api;
      await tween(400, (t) => {
        st.card = Math.max(st.card, t);
        api.draw();
      });
      // How many choose the damp side this time, keeping those already there where possible.
      const k = clamp(Math.round(N * preferDamp(v) + gauss() * 0.6), 0, N);
      const order = st.lice.map((p, i) => ({ i, damp: p.x < C.x })).sort((a, b) => b.damp - a.damp);
      const from = st.lice.map((p) => ({ ...p }));
      const to = from.map((p) => ({ ...p }));
      order.forEach(({ i, damp }, n) => {
        const wantDamp = n < k;
        if (wantDamp !== damp || Math.random() < 0.5) to[i] = spot(wantDamp);
      });
      const fromMin = st.minutes;
      await tween(1400, (t) => {
        st.lice = from.map((p, i) => ({ x: lerp(p.x, to[i].x, t), y: lerp(p.y, to[i].y, t), a: lerp(p.a, to[i].a, t) }));
        st.minutes = Math.round(lerp(fromMin, v, t));
        api.draw();
      });
      st.lice = to;
      st.minutes = v;
      await tween(400, (t) => {
        st.card = 1 - t;
        api.draw();
      });
      st.card = 0;
      api.draw();
      return to.filter((p) => p.x < C.x).length;
    },
    iv: { label: 'Time', unit: 'min', values: [2, 4, 6, 8, 10] },
    dv: { label: 'Woodlice on the damp side', unit: '', dp: 0, tol: 0, placeholder: 'e.g. 7', readHint: 'Count the woodlice on the damp (blue) side, to the left of the dashed line.' },
    graph: { title: 'Woodlice on the damp side over time', xLabel: 'Time / min', yLabel: 'Woodlice on the damp side', xDomain: [0, 10], yDomain: [0, 10], xStep: 2, yStep: 2 },
    pattern: {
      q: 'What do your results show?',
      o: ['Most woodlice moved to the damp side', 'Most woodlice moved to the dry side', 'The woodlice stayed spread out evenly'],
      hint: 'There are 10 woodlice. How many of them ended up on the damp side?',
      right: 'Yes. Woodlice lose water easily through their bodies, so they move to damp places where they are less likely to dry out. Responding to surroundings like this is called sensitivity.',
      why: 'Woodlice also prefer the dark. To test that, repeat the experiment with both sides dry, but one side light and the other covered.',
    },
    extra: [{
      title: 'Turn your count into a percentage',
      text: 'What percentage of the 10 woodlice were on the damp side after 10 minutes?',
      why: 'A percentage lets you compare results from groups that used different numbers of woodlice.',
      label: 'Percentage on the damp side at 10 minutes',
      short: 'On the damp side at 10 min',
      unit: '%',
      dp: 0,
      placeholder: 'e.g. 80',
      expected: (rows) => rows[rows.length - 1].mean * 10,
      tol: 0.5,
      hint: 'Divide the number on the damp side by 10, then multiply by 100.',
      msg: (v) => `${Math.round(v)}% of the woodlice chose the damp side.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Most of the woodlice moved to the damp side. They respond to their surroundings and move to where they are less likely to dry out.',
      rows: [['On the damp side at 2 minutes', `${rows[0].mean} of 10`], ['On the damp side at 10 minutes', `${rows[rows.length - 1].mean} of 10`]],
    }),
  });
})();
