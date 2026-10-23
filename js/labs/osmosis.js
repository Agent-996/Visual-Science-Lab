/* Osmosis in potato.
   The student cuts six potato cylinders, weighs them, leaves them in sucrose solutions of
   different concentrations, reweighs them and uses the percentage change in mass to estimate
   the concentration of the solution inside the potato cells. */
(function () {
  'use strict';

  const K = window.LabKit;
  const { h, s, button, fmt, round, rand, gauss, lerp, near, tween, wait } = K;

  /* ---------- Biology ---------- */

  const CONCS = [0, 0.2, 0.4, 0.6, 0.8, 1.0]; // mol/dm³ sucrose
  const isotonic = round(rand(0.24, 0.36), 3); // concentration of the potato cell sap, hidden

  // Percentage change in mass after 24 hours. Water moves in below the isotonic point, out above it.
  const percentChange = (c) => 30 * Math.tanh((isotonic - c) / 0.45) + gauss() * 0.7;

  /* ---------- State ---------- */

  const st = {
    cylinders: CONCS.map((c, i) => {
      const m0 = round(rand(2.4, 2.9), 2);
      return { c, i, m0, m1: round(m0 * (1 + percentChange(c) / 100), 2), x: 0, y: 0, len: 32, scale: 1, shown: false, lift: 0 };
    }),
    balance: null,
    hours: 0,
    rows: CONCS.map((c) => ({ c, start: null, final: null, pct: null })),
    awaiting: null,
    calcs: [],
    answer: null,
  };

  const tileX = (i) => 112 + i * 22;
  const tubeX = (i) => 296 + i * 46;
  const PAN = { x: 662, y: 462 };
  const TOWEL = { x: 585, y: 487 };

  for (const cyl of st.cylinders) {
    cyl.x = tileX(cyl.i);
    cyl.y = 486;
  }

  /* ---------- Bench drawing ---------- */

  const el = {};
  const benchLabel = (x, y, text) => s('text', { class: 'bench-label', x, y, 'text-anchor': 'middle' }, text);
  const hit = (x, y, width, height) => s('rect', { class: 'hit', x, y, width, height, rx: 8 });

  function buildBench() {
    const svg = s('svg', { viewBox: '0 220 720 320', role: 'group', 'aria-label': 'Lab bench: a potato on a white tile with a cork borer, a rack of six boiling tubes of sucrose solution, paper towel, a digital balance and a clock.' });

    svg.append(
      s('rect', { x: 0, y: 220, width: 720, height: 280, fill: '#f6f8f9' }),
      s('rect', { x: 0, y: 500, width: 720, height: 40, fill: '#ddd4c6' }),
      s('line', { x1: 0, x2: 720, y1: 500.5, y2: 500.5, stroke: '#bdb2a1' }),
      benchLabel(130, 518, 'Potato, cork borer and tile'),
      benchLabel(410, 518, 'Sucrose solutions (mol/dm³)'),
      benchLabel(586, 518, 'Paper towel'),
      benchLabel(662, 532, 'Balance')
    );

    // Tile, potato and cork borer
    el.potato = s('g', { 'data-label': 'Potato' },
      s('rect', { x: 16, y: 486, width: 238, height: 14, rx: 2, fill: '#ffffff', stroke: '#c9d1d6' }),
      s('ellipse', { cx: 58, cy: 470, rx: 40, ry: 17, fill: '#c9a165', stroke: '#9a7643' }),
      s('circle', { cx: 44, cy: 464, r: 1.6, fill: '#9a7643' }),
      s('circle', { cx: 70, cy: 474, r: 1.4, fill: '#9a7643' }),
      s('circle', { cx: 80, cy: 462, r: 1.2, fill: '#9a7643' }),
      hit(12, 446, 94, 44));
    el.borer = s('g', null,
      s('rect', { x: 14, y: 394, width: 22, height: 6, rx: 2, fill: '#59656f' }),
      s('rect', { x: 21, y: 400, width: 8, height: 50, fill: '#b8c0c6', stroke: '#7d8890' }));

    // Rack of boiling tubes
    const rack = s('g', null,
      s('rect', { x: 270, y: 404, width: 282, height: 9, rx: 2, fill: '#b98e5a' }),
      s('rect', { x: 270, y: 404, width: 8, height: 84, fill: '#a87d4a' }),
      s('rect', { x: 544, y: 404, width: 8, height: 84, fill: '#a87d4a' }));
    el.tubes = [];
    for (let i = 0; i < 6; i++) {
      const x = tubeX(i);
      rack.append(
        s('path', { d: `M${x - 10},382 L${x - 10},466 A10,10 0 0 0 ${x + 10},466 L${x + 10},382 Z`, fill: 'rgba(196, 223, 240, 0.75)' }),
        s('path', { d: `M${x - 10},334 L${x - 10},466 A10,10 0 0 0 ${x + 10},466 L${x + 10},334`, fill: 'none', stroke: '#7f97a8', 'stroke-width': 1.5 }),
        s('rect', { x: x - 13, y: 342, width: 26, height: 13, rx: 2, fill: '#fff', stroke: '#c5ced4' }),
        s('text', { x, y: 351.5, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 700, fill: '#33404d', 'font-family': 'Lexend, sans-serif' }, fmt(CONCS[i], 1)));
    }
    rack.append(s('rect', { x: 266, y: 486, width: 290, height: 14, rx: 2, fill: '#a87d4a' }));
    el.rack = s('g', { 'data-label': 'Boiling tubes' }, rack, hit(262, 326, 298, 176));

    // Paper towel and balance
    el.towel = s('g', null,
      s('rect', { x: 562, y: 488, width: 46, height: 12, rx: 1, fill: '#ffffff', stroke: '#b9c7d2' }),
      s('line', { x1: 562, x2: 608, y1: 494, y2: 494, stroke: '#d5e1ea' }));
    el.display = s('text', { x: 662, y: 491, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#1f2a1a', 'font-family': 'Source Sans 3, sans-serif' }, '0.00 g');
    el.balance = s('g', { 'data-label': 'Digital balance' },
      s('rect', { x: 614, y: 470, width: 96, height: 30, rx: 4, fill: '#39424b' }),
      s('rect', { x: 630, y: 476, width: 64, height: 19, rx: 2, fill: '#c9d7ba' }),
      el.display,
      s('rect', { x: 659, y: 465, width: 6, height: 5, fill: '#59656f' }),
      s('rect', { x: 634, y: 461, width: 56, height: 4, rx: 2, fill: '#b8c0c6', stroke: '#7d8890' }),
      hit(608, 452, 108, 50));

    // Clock for the 24 hour wait
    const CX = 662;
    const CY = 290;
    el.hourHand = s('line', { x1: CX, y1: CY, x2: CX, y2: CY - 15, stroke: '#1f2a33', 'stroke-width': 3, 'stroke-linecap': 'round' });
    el.minuteHand = s('line', { x1: CX, y1: CY, x2: CX, y2: CY - 22, stroke: '#1f2a33', 'stroke-width': 2, 'stroke-linecap': 'round' });
    el.clockText = s('text', { x: CX, y: CY + 46, 'text-anchor': 'middle', class: 'bench-label' }, 'Time: 0 hours');
    const clock = s('g', null, s('circle', { cx: CX, cy: CY, r: 28, fill: '#fff', stroke: '#59656f', 'stroke-width': 3 }));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      clock.append(s('line', { x1: CX + Math.sin(a) * 22, y1: CY - Math.cos(a) * 22, x2: CX + Math.sin(a) * 25, y2: CY - Math.cos(a) * 25, stroke: '#59656f', 'stroke-width': i % 3 === 0 ? 2 : 1 }));
    }
    clock.append(el.hourHand, el.minuteHand, s('circle', { cx: CX, cy: CY, r: 2.5, fill: '#1f2a33' }), el.clockText);

    // Potato cylinders
    el.cylinders = s('g', { 'data-label': 'Potato cylinders' }, hit(100, 440, 156, 50));
    el.cyl = st.cylinders.map(() => {
      const body = s('rect', { x: -4.5, width: 9, rx: 3.5, fill: '#efe1b4', stroke: '#c2a867' });
      const g = s('g', { visibility: 'hidden' }, body);
      return { g, body };
    });
    el.cylLayer = s('g', null, ...el.cyl.map((c) => c.g));
    el.scalpel = s('g', { visibility: 'hidden' },
      s('rect', { x: -38, y: -2, width: 26, height: 5, rx: 2, fill: '#2f6fb0' }),
      s('path', { d: 'M-12,-2 L10,-1 L-12,3 Z', fill: '#c3cbd1', stroke: '#7d8890', 'stroke-width': 0.6 }));

    svg.append(el.borer, el.potato, el.rack, el.towel, el.balance, clock, el.cylinders, el.cylLayer, el.scalpel);
    document.getElementById('bench').append(svg);
  }

  function draw() {
    st.cylinders.forEach((cyl, i) => {
      const { g, body } = el.cyl[i];
      const len = cyl.len * cyl.scale;
      g.setAttribute('visibility', cyl.shown ? 'visible' : 'hidden');
      g.setAttribute('transform', `translate(${cyl.x.toFixed(1)} ${(cyl.y - cyl.lift).toFixed(1)})`);
      body.setAttribute('y', -len);
      body.setAttribute('height', len);
      body.setAttribute('width', 9 * Math.cbrt(cyl.scale));
      body.setAttribute('x', -4.5 * Math.cbrt(cyl.scale));
    });
    el.display.textContent = `${fmt(st.balance === null ? 0 : st.balance, 2)} g`;
    const minutes = st.hours * 60;
    el.minuteHand.setAttribute('transform', `rotate(${(minutes / 60) * 360} 662 290)`);
    el.hourHand.setAttribute('transform', `rotate(${(minutes / 720) * 360} 662 290)`);
    el.clockText.textContent = `Time: ${Math.round(st.hours)} hours`;
  }

  // Moves a cylinder along an arc to (x, y).
  async function moveCylinder(cyl, x, y, ms = 700, height = 60) {
    const from = { x: cyl.x, y: cyl.y };
    await tween(ms, (t) => {
      cyl.x = lerp(from.x, x, t);
      cyl.y = lerp(from.y, y, t);
      cyl.lift = Math.sin(t * Math.PI) * height;
      draw();
    });
    cyl.lift = 0;
    draw();
  }

  /* ---------- Results table and graph ---------- */

  function renderTable() {
    el.table.replaceChildren(
      h('thead', null, h('tr', null,
        h('th', { scope: 'col' }, 'Sucrose / mol/dm³'),
        h('th', { scope: 'col' }, 'Starting mass / g'),
        h('th', { scope: 'col' }, 'Final mass / g'),
        h('th', { scope: 'col' }, 'Change in mass / %'))),
      h('tbody', null, st.rows.map((r, i) => h('tr', null,
        h('td', null, fmt(r.c, 1)),
        h('td', { class: st.awaiting && st.awaiting.row === i && st.awaiting.key === 'start' ? 'now' : null }, r.start === null ? '' : fmt(r.start, 2)),
        h('td', { class: st.awaiting && st.awaiting.row === i && st.awaiting.key === 'final' ? 'now' : null }, r.final === null ? '' : fmt(r.final, 2)),
        h('td', { class: st.awaiting && st.awaiting.row === i && st.awaiting.key === 'pct' ? 'now' : null }, r.pct === null ? '' : (r.pct > 0 ? '+' : '') + fmt(r.pct, 1)))))
    );
    el.calcs.replaceChildren(...(st.calcs.length ? [h('dl', { class: 'calc-list' }, st.calcs.map(([k, v]) => [h('dt', null, k), h('dd', null, v)]))] : []));
  }

  const pctFor = (r) => ((r.final - r.start) / r.start) * 100;

  let graph = null;
  const points = () => st.rows.map((r, i) => ({ x: r.c, y: r.pct, i }));

  // Where the curve crosses 0%: straight-line interpolation between the points either side.
  function crossing() {
    const p = points();
    for (let i = 0; i < p.length - 1; i++) {
      if (p[i].y === 0) return p[i].x;
      if ((p[i].y > 0 && p[i + 1].y <= 0) || (p[i].y < 0 && p[i + 1].y >= 0)) {
        return p[i].x + ((0 - p[i].y) * (p[i + 1].x - p[i].x)) / (p[i + 1].y - p[i].y);
      }
    }
    return null;
  }

  function showGraph() {
    const ys = st.rows.map((r) => r.pct);
    graph = new K.Graph({
      title: 'Percentage change in mass against concentration',
      xLabel: 'Concentration of sucrose / mol/dm³',
      yLabel: 'Change in mass / %',
      xDomain: [0, 1],
      yDomain: K.niceDomain(Math.min(0, ...ys) * 1.1, Math.max(0, ...ys) * 1.1),
      describe: (p) => [`${p.y > 0 ? '+' : ''}${fmt(p.y, 1)}%`, `${fmt(p.x, 1)} mol/dm³`],
    });
    graph.points = points();
    graph.curve = K.smoothCurve(points());
    el.graphBox.replaceChildren(graph.el);
    graph.render();
  }

  /* ---------- Weighing ---------- */

  function massField(row, key, done) {
    st.awaiting = { row, key };
    renderTable();
    const actual = st.balance;
    const f = K.field({
      label: `${key === 'start' ? 'Starting' : 'Final'} mass of the ${fmt(CONCS[row], 1)} mol/dm³ cylinder`,
      unit: 'g',
      placeholder: 'e.g. 2.56',
      say,
      check: (v, attempts) => {
        if (near(v, actual, { abs: 0.005 })) return { ok: true, accepted: actual, value: fmt(actual, 2), msg: `Recorded ${fmt(actual, 2)} g.` };
        if (attempts >= 3) return { ok: true, tone: 'info', accepted: actual, value: fmt(actual, 2), msg: `The balance shows ${fmt(actual, 2)} g. Copy all the digits shown on the display.` };
        return { ok: false, msg: 'Check the balance display again and copy exactly what it shows, to 2 decimal places.' };
      },
      onAccept: (v) => {
        st.rows[row][key] = v;
        st.awaiting = null;
        renderTable();
        done();
      },
    });
    return f;
  }

  // Weighs the cylinders one by one. For the final masses each is taken out and blotted first.
  function weighLoop(box, g, key, onDone) {
    let i = 0;
    let quick = false;
    const fetch = async (cyl) => {
      if (key === 'final') {
        await moveCylinder(cyl, TOWEL.x, TOWEL.y, quick ? 300 : 650, 80);
        await tween(quick ? 150 : 450, (t) => {
          cyl.x = TOWEL.x + Math.sin(t * Math.PI * 4) * 4;
          draw();
        });
      }
      await moveCylinder(cyl, PAN.x, PAN.y, quick ? 300 : 650, 50);
      st.balance = cyl[key === 'start' ? 'm0' : 'm1'];
      draw();
    };
    const putBack = async (cyl) => {
      st.balance = null;
      await moveCylinder(cyl, tileX(cyl.i), 486, quick ? 250 : 600, 50);
    };
    const one = () => {
      const cyl = st.cylinders[i];
      box.replaceChildren();
      g.task(`Cylinder ${i + 1} of 6 (${fmt(cyl.c, 1)} mol/dm³): ${key === 'start' ? 'blot it and put it on the balance' : 'take it out, blot it and put it on the balance'}.`);
      let busy = false;
      const weigh = async () => {
        if (busy) return;
        busy = true;
        btn.disabled = true;
        g.hot([]);
        await fetch(cyl);
        g.task(`Cylinder ${i + 1} of 6: record the mass shown on the balance.`);
        const f = massField(i, key, async () => {
          await putBack(cyl);
          i += 1;
          if (i < 6) one();
          else onDone();
        });
        box.replaceChildren(f.el);
        if (i >= 2) box.append(h('div', { class: 'btn-row' }, button('Weigh and record the rest for me', recordRest, { small: true })));
        f.focus();
      };
      const btn = button(key === 'start' ? 'Weigh the next cylinder' : 'Take out, blot and weigh', weigh, { primary: true });
      g.hot(['balance']);
      g.on('balance', weigh);
      g.on('cylinders', weigh);
      box.append(h('div', { class: 'btn-row' }, btn));
    };
    // After a few by hand, the rest can be weighed and recorded automatically.
    const recordRest = async () => {
      quick = true;
      box.replaceChildren();
      g.task('Weighing and recording the remaining cylinders.');
      st.rows[i][key] = st.balance;
      st.awaiting = null;
      renderTable();
      await putBack(st.cylinders[i]);
      for (i += 1; i < 6; i++) {
        const cyl = st.cylinders[i];
        await fetch(cyl);
        st.rows[i][key] = st.balance;
        renderTable();
        await wait(250);
        await putBack(cyl);
      }
      onDone();
    };
    one();
  }

  /* ---------- Steps ---------- */

  const steps = [
    {
      id: 'cut',
      title: 'Cut six potato cylinders',
      text: 'Push the cork borer down through the potato onto the tile to cut six cylinders. Always push down, away from your hand.',
      why: 'Using the same cork borer means every cylinder has the same diameter.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          for (const cyl of st.cylinders) {
            await tween(260, (t) => el.borer.setAttribute('transform', `translate(${t * 30} ${Math.sin(t * Math.PI) * 30})`));
            cyl.shown = true;
            draw();
          }
          el.borer.removeAttribute('transform');
          say('Six potato cylinders cut.', 'good');
          g.next();
        };
        const btn = button('Use the cork borer', go, { primary: true });
        g.hot(['potato']);
        g.on('potato', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'trim',
      title: 'Trim each cylinder to 3.0 cm',
      text: 'Line each cylinder up against a ruler and cut it to 3.0 cm with a scalpel. Remove any potato skin. Cut downwards onto the tile.',
      why: 'Cylinders of the same length and diameter have the same surface area, so each one has the same chance to gain or lose water. That makes it a fair test.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          el.scalpel.setAttribute('visibility', 'visible');
          for (const cyl of st.cylinders) {
            await tween(300, (t) => {
              el.scalpel.setAttribute('transform', `translate(${cyl.x} ${lerp(440, 486 - 26, t)})`);
              if (t > 0.8) cyl.len = 26;
              draw();
            });
          }
          el.scalpel.setAttribute('visibility', 'hidden');
          say('All six cylinders are 3.0 cm long.', 'good');
          g.next();
        };
        const btn = button('Trim to 3.0 cm', go, { primary: true });
        g.hot(['cylinders']);
        g.on('cylinders', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'weigh-start',
      title: 'Weigh each cylinder',
      text: 'Blot each cylinder gently with paper towel, put it on the balance and record its starting mass to 2 decimal places.',
      why: 'The cylinders will not have exactly the same mass, so you need each one’s own starting mass to work out its percentage change.',
      enter(box, g) {
        weighLoop(box, g, 'start', () => {
          say('All six starting masses recorded.', 'good');
          g.next();
        });
      },
    },
    {
      id: 'tubes',
      title: 'Put the cylinders in the solutions',
      text: 'Put one cylinder in each boiling tube. The tubes hold 10 cm³ of sucrose solution: 0.0, 0.2, 0.4, 0.6, 0.8 and 1.0 mol/dm³.',
      why: 'The concentration of the sucrose solution is the only thing you change (the independent variable). Keeping track of which cylinder goes in which tube lets you match each final mass to its starting mass.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          for (const cyl of st.cylinders) await moveCylinder(cyl, tubeX(cyl.i), 466, 600, 140);
          say('Each cylinder is in its own tube of solution.', 'good');
          g.next();
        };
        const btn = button('Put the cylinders in the tubes', go, { primary: true });
        g.hot(['rack']);
        g.on('rack', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'wait',
      title: 'Leave them for 24 hours',
      text: 'Leave the tubes at room temperature for 24 hours.',
      why: 'Osmosis is slow. A long time lets water move in or out of the potato cells until the change in mass is big enough to measure accurately.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          await tween(2600, (t) => {
            st.hours = 24 * t;
            for (const cyl of st.cylinders) cyl.scale = 1 + ((cyl.m1 - cyl.m0) / cyl.m0) * t;
            draw();
          });
          say('24 hours later. Some cylinders look bigger and firmer; others look smaller and floppy.', 'info');
          g.next();
        };
        const btn = button('Leave for 24 hours', go, { primary: true });
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'weigh-final',
      title: 'Blot and reweigh each cylinder',
      text: 'Take each cylinder out, blot it gently with paper towel in the same way each time, and record its final mass.',
      why: 'Blotting removes solution stuck to the outside, which would add to the mass. Blotting every cylinder the same way keeps the test fair.',
      enter(box, g) {
        weighLoop(box, g, 'final', () => {
          say('All six final masses recorded.', 'good');
          g.next();
        });
      },
    },
    {
      id: 'percent',
      title: 'Calculate the percentage change in mass',
      text: 'Percentage change = (final mass − starting mass) ÷ starting mass × 100. A loss of mass gives a negative answer.',
      why: 'The cylinders started with different masses, so a percentage change compares them fairly.',
      enter(box, g) {
        const order = [0, 5];
        let k = 0;
        const ask = () => {
          const row = order[k];
          const r = st.rows[row];
          const exp = pctFor(r);
          st.awaiting = { row, key: 'pct' };
          renderTable();
          g.task(`Work out the percentage change for the ${fmt(r.c, 1)} mol/dm³ cylinder.`);
          const f = K.field({
            label: `Change in mass, ${fmt(r.c, 1)} mol/dm³`,
            unit: '%',
            placeholder: k === 0 ? 'e.g. 12.5' : 'e.g. -20.3',
            say,
            check: (v, attempts) => {
              if (near(v, exp, { abs: 0.15 })) return { ok: true, accepted: v, msg: `(${fmt(r.final, 2)} − ${fmt(r.start, 2)}) ÷ ${fmt(r.start, 2)} × 100 = ${exp > 0 ? '+' : ''}${fmt(exp, 1)}%.` };
              if (attempts >= 3) return { ok: true, tone: 'info', accepted: exp, value: fmt(exp, 1), msg: `(${fmt(r.final, 2)} − ${fmt(r.start, 2)}) ÷ ${fmt(r.start, 2)} × 100 = ${exp > 0 ? '+' : ''}${fmt(exp, 1)}%.` };
              if (near(v, -exp, { abs: 0.15 })) return { ok: false, tone: 'warn', msg: `Check the sign. The mass went ${exp > 0 ? 'up, so the change is positive' : 'down, so the change is negative'}.` };
              if (near(v, exp / 100, { abs: 0.002 })) return { ok: false, tone: 'warn', msg: 'Multiply by 100 to turn the fraction into a percentage.' };
              if (near(v, ((r.final - r.start) / r.final) * 100, { abs: 0.15 })) return { ok: false, tone: 'warn', msg: 'Divide by the starting mass, not the final mass.' };
              if (near(v, r.final - r.start, { abs: 0.006 })) return { ok: false, tone: 'warn', msg: 'That is the change in grams. Now divide it by the starting mass and multiply by 100.' };
              return { ok: false, msg: 'Not quite. Subtract the starting mass from the final mass, divide by the starting mass, then multiply by 100.' };
            },
            onAccept: () => {
              r.pct = round(exp, 1);
              st.awaiting = null;
              k += 1;
              box.replaceChildren();
              if (k < order.length) ask();
              else {
                for (const row of st.rows) row.pct = round(pctFor(row), 1);
                renderTable();
                say('The other percentage changes have been worked out the same way.', 'good');
                g.next();
              }
            },
          });
          box.append(h('pre', { class: 'formula' }, '% change = (final − start) ÷ start × 100'), f.el);
          f.focus();
        };
        ask();
      },
    },
    {
      id: 'plot',
      title: 'Plot your results',
      text: 'Plot percentage change in mass (y-axis) against concentration of sucrose (x-axis), then draw a smooth curve of best fit.',
      why: 'The graph shows the pattern: the cylinders gain mass in dilute solutions and lose mass in concentrated ones.',
      enter(box, g) {
        const go = () => {
          showGraph();
          say('Your graph is in the Results panel. Hover over or tap a point to see its values.', 'good');
          g.next();
        };
        box.append(h('div', { class: 'btn-row' }, button('Plot the graph', go, { primary: true })));
      },
    },
    {
      id: 'crossing',
      title: 'Find where the curve crosses 0%',
      text: 'Read the concentration where your curve crosses the 0% line. At this concentration the potato neither gains nor loses mass.',
      why: 'Where there is no change in mass there is no net movement of water by osmosis. The solution outside then has the same concentration as the solution inside the potato cells.',
      enter(box, g) {
        const exp = crossing();
        const f = K.field({
          label: 'Concentration where the change is 0%',
          unit: 'mol/dm³',
          placeholder: 'e.g. 0.30',
          say,
          check: (v, attempts) => {
            if (near(v, exp, { abs: 0.05 })) return { ok: true, accepted: v, msg: `Good. The curve crosses 0% at about ${fmt(v, 2)} mol/dm³.` };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: round(exp, 2), value: fmt(exp, 2), msg: `The curve crosses 0% at about ${fmt(exp, 2)} mol/dm³.` };
            if (v > 1 || v < 0) return { ok: false, tone: 'warn', msg: 'Read the value from the x-axis: it is between 0 and 1.0 mol/dm³.' };
            return { ok: false, tone: 'warn', msg: 'Find where the curve meets the 0% line, then read straight down to the concentration axis.' };
          },
          onAccept: (v) => {
            st.answer = v;
            graph.set({ marks: [{ x: v, y: 0, label: `${fmt(v, 2)} mol/dm³` }] });
            addCalc('No change in mass at', `${fmt(v, 2)} mol/dm³`);
            g.next();
          },
        });
        box.append(f.el);
        f.focus();
      },
    },
  ];

  function addCalc(name, text) {
    st.calcs.push([name, text]);
    renderTable();
  }

  /* ---------- Start ---------- */

  buildBench();
  el.table = document.getElementById('results-table');
  el.calcs = document.getElementById('calc-list');
  el.graphBox = document.getElementById('graph');

  const lab = K.setupLab({ id: 'osmosis', steps, items: { potato: el.potato, cylinders: el.cylinders, rack: el.rack, balance: el.balance } });
  const say = lab.say;
  lab.guide.onFinish = () => {
    const gain = st.rows.reduce((a, b) => (b.pct > a.pct ? b : a));
    const loss = st.rows.reduce((a, b) => (b.pct < a.pct ? b : a));
    lab.finish({
      title: 'Practical complete',
      summary: `The potato cells contain a solution equivalent to about ${fmt(st.answer, 2)} mol/dm³ sucrose. In weaker solutions water moved into the cells by osmosis and the cylinders gained mass. In stronger solutions water moved out and they lost mass.`,
      rows: [
        ['Your estimate', `${fmt(st.answer, 2)} mol/dm³`],
        ['Value used in this simulation', `${fmt(isotonic, 2)} mol/dm³`],
        ['Biggest gain', `+${fmt(gain.pct, 1)}% in ${fmt(gain.c, 1)} mol/dm³`],
        ['Biggest loss', `${fmt(loss.pct, 1)}% in ${fmt(loss.c, 1)} mol/dm³`],
      ],
    });
  };

  renderTable();
  draw();
  lab.guide.start();

  // Read-only view of the simulation for automated tests.
  window.__lab = { st, isotonic, crossing };
})();
