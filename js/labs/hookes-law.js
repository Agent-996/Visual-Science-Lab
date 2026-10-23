/* Force and extension of a spring.
   The student hangs 100 g masses on a spring, reads a pointer against a vertical ruler,
   plots force against extension, finds the limit of proportionality and works out the
   spring constant. */
(function () {
  'use strict';

  const K = window.LabKit;
  const { h, s, button, fmt, round, rand, near, tween, wait } = K;

  /* ---------- Physics ---------- */

  const G = 9.8; // N/kg
  const LOADS = 8; // 100 g each, the mass hanger counts as the first
  const springK = round(rand(30, 42), 1); // N/m, hidden
  const fLop = round(rand(4.95, 5.15), 2); // N, limit of proportionality
  const startReading = round(rand(3.0, 5.0), 2); // cm, pointer position with no load

  const weightOf = (grams) => (grams / 1000) * G;

  // Extension in cm. Beyond the limit of proportionality the spring stretches more than F = k·e predicts.
  function extensionCm(force) {
    let e = force / springK;
    if (force > fLop) e += (0.8 * Math.pow(force - fLop, 1.5)) / springK;
    return e * 100;
  }

  const readingFor = (load) => startReading + extensionCm(weightOf(load * 100));

  /* ---------- State ---------- */

  const st = {
    goggles: false,
    setUp: false,
    pointer: false,
    load: 0, // number of 100 g loads on the spring
    pos: startReading, // where the pointer is right now, cm
    rows: Array.from({ length: LOADS + 1 }, (_, i) => ({ mass: i * 100, weight: round(weightOf(i * 100), 2), reading: null, ext: null })),
    awaiting: null,
    lopAnswer: null,
    kAnswer: null,
    calcs: [],
  };

  /* ---------- Bench drawing ---------- */

  const RULER_TOP = 70; // y of the 0 cm mark
  const PX = 7; // px per cm on the bench
  const SPRING_X = 230;
  const yOf = (cm) => RULER_TOP + cm * PX;

  const el = {};
  const benchLabel = (x, y, text) => s('text', { class: 'bench-label', x, y, 'text-anchor': 'middle' }, text);
  const hit = (x, y, width, height) => s('rect', { class: 'hit', x, y, width, height, rx: 8 });
  const BRASS = { fill: '#c9a447', stroke: '#86691f', 'stroke-width': 1 };

  function slottedMass(x, y) {
    return s('g', null,
      s('rect', { x, y, width: 36, height: 6.5, rx: 1.5, ...BRASS }),
      s('rect', { x: x + 16, y, width: 4, height: 3, fill: '#86691f' }));
  }

  function springPath(top, bottom) {
    const lead = 5;
    const coils = 10;
    const w = 11;
    const y0 = top + lead;
    const y1 = bottom - lead;
    const step = (y1 - y0) / (coils * 2);
    let d = `M${SPRING_X},${top} L${SPRING_X},${y0.toFixed(1)}`;
    for (let i = 1; i < coils * 2; i++) d += ` L${i % 2 ? SPRING_X + w : SPRING_X - w},${(y0 + step * i).toFixed(1)}`;
    d += ` L${SPRING_X},${y1.toFixed(1)} L${SPRING_X},${bottom.toFixed(1)}`;
    return d;
  }

  function buildBench() {
    const svg = s('svg', { viewBox: '0 0 720 540', role: 'group', 'aria-label': 'Lab bench: a clamp stand holding a spring and a vertical ruler, a mass hanger with 100 g slotted masses, and safety goggles.' });

    svg.append(
      s('rect', { x: 0, y: 0, width: 720, height: 500, fill: '#f6f8f9' }),
      s('rect', { x: 0, y: 500, width: 720, height: 40, fill: '#ddd4c6' }),
      s('line', { x1: 0, x2: 720, y1: 500.5, y2: 500.5, stroke: '#bdb2a1' }),
      benchLabel(48, 518, 'Goggles'),
      benchLabel(270, 518, 'Clamp stand, spring and ruler'),
      benchLabel(540, 518, 'Mass hanger and 100 g masses'),
      // clamp stand
      s('rect', { x: 150, y: 488, width: 240, height: 12, rx: 3, fill: '#4f5b66' }),
      s('rect', { x: 356, y: 18, width: 8, height: 472, rx: 2, fill: '#8d99a3' }),
      s('rect', { x: 214, y: 40, width: 146, height: 8, rx: 2, fill: '#6b7782' }),
      s('rect', { x: 348, y: 34, width: 24, height: 20, rx: 3, fill: '#59656f' })
    );

    // Goggles
    el.goggles = s('g', { 'data-label': 'Safety goggles' },
      s('path', { d: 'M12,486 Q48,468 84,486', fill: 'none', stroke: '#2f3a44', 'stroke-width': 3 }),
      s('rect', { x: 18, y: 478, width: 26, height: 16, rx: 6, fill: 'rgba(170, 210, 235, 0.6)', stroke: '#2f6fb0', 'stroke-width': 2 }),
      s('rect', { x: 52, y: 478, width: 26, height: 16, rx: 6, fill: 'rgba(170, 210, 235, 0.6)', stroke: '#2f6fb0', 'stroke-width': 2 }),
      s('line', { x1: 44, x2: 52, y1: 484, y2: 484, stroke: '#2f6fb0', 'stroke-width': 3 }),
      hit(8, 464, 82, 36));

    // Ruler on its own clamp
    const ruler = s('g', null,
      s('rect', { x: 280, y: 236, width: 80, height: 6, rx: 2, fill: '#6b7782' }),
      s('rect', { x: 348, y: 230, width: 24, height: 18, rx: 3, fill: '#59656f' }),
      s('rect', { x: 256, y: 62, width: 26, height: 366, rx: 2, fill: '#f3e6c4', stroke: '#b59a63' }));
    for (let cm = 0; cm <= 50; cm++) {
      const y = yOf(cm);
      const len = cm % 10 === 0 ? 11 : cm % 5 === 0 ? 8 : 4;
      ruler.append(s('line', { x1: 256, x2: 256 + len, y1: y, y2: y, stroke: '#2b2418', 'stroke-width': cm % 5 === 0 ? 1 : 0.6 }));
      if (cm % 5 === 0) ruler.append(s('text', { class: 'scale-text', x: 270, y: y + 3 }, String(cm)));
    }

    // Spring, pointer and hanger
    el.spring = s('path', { fill: 'none', stroke: '#5f6d78', 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
    el.pointer = s('g', null,
      s('rect', { x: SPRING_X - 4, y: -3, width: 8, height: 6, rx: 1.5, fill: '#59656f' }),
      s('path', { d: `M${SPRING_X + 4},-1.6 L255,-0.4 L255,0.4 L${SPRING_X + 4},1.6 Z`, fill: '#c0392b' }));
    el.hangerMasses = s('g', null);
    el.hanger = s('g', null,
      s('path', { d: `M${SPRING_X},0 L${SPRING_X},4 Q${SPRING_X + 6},8 ${SPRING_X},12`, fill: 'none', stroke: '#59656f', 'stroke-width': 2 }),
      s('rect', { x: SPRING_X - 1.5, y: 10, width: 3, height: 58, fill: '#7d8890' }),
      s('rect', { x: SPRING_X - 18, y: 68, width: 36, height: 7, rx: 1.5, fill: '#7d8890', stroke: '#59656f' }),
      el.hangerMasses);
    el.rig = s('g', { opacity: 0 },
      s('path', { d: `M${SPRING_X},48 L${SPRING_X},56`, stroke: '#59656f', 'stroke-width': 2.5 }),
      ruler,
      el.spring,
      el.hanger,
      el.pointer);

    // Masses waiting on the bench
    el.pile = s('g', null);
    el.benchHanger = s('g', null,
      s('rect', { x: 588, y: 425, width: 3, height: 58, fill: '#7d8890' }),
      s('path', { d: 'M589.5,425 L589.5,419 Q595.5,415 589.5,411', fill: 'none', stroke: '#59656f', 'stroke-width': 2 }),
      s('rect', { x: 571.5, y: 483, width: 36, height: 7, rx: 1.5, fill: '#7d8890', stroke: '#59656f' }));
    el.masses = s('g', { 'data-label': '100 g masses' }, el.pile, el.benchHanger, hit(470, 400, 150, 100));

    svg.append(el.goggles, el.rig, el.masses);
    el.status = h('div', { class: 'bench-status', 'aria-live': 'polite' });
    document.getElementById('bench').append(svg, el.status);
  }

  let lastStatus = '';
  function draw() {
    const py = yOf(st.pos);
    el.spring.setAttribute('d', springPath(56, py));
    el.pointer.setAttribute('transform', `translate(0 ${py.toFixed(2)})`);
    el.pointer.setAttribute('visibility', st.pointer ? 'visible' : 'hidden');
    el.hanger.setAttribute('transform', `translate(0 ${(py + 2).toFixed(2)})`);
    el.hanger.setAttribute('visibility', st.load > 0 ? 'visible' : 'hidden');
    el.benchHanger.setAttribute('visibility', st.load > 0 ? 'hidden' : 'visible');
    el.goggles.setAttribute('visibility', st.goggles ? 'hidden' : 'visible');

    const onHanger = Math.max(0, st.load - 1);
    if (el.hangerMasses.childElementCount !== onHanger) {
      el.hangerMasses.replaceChildren(...Array.from({ length: onHanger }, (_, i) => slottedMass(SPRING_X - 18, 61.5 - i * 6.5)));
    }
    const left = LOADS - 1 - onHanger;
    if (el.pile.childElementCount !== left) {
      el.pile.replaceChildren(...Array.from({ length: left }, (_, i) => slottedMass(500, 493.5 - i * 6.5)));
    }
    mag.update(st.pointer ? st.pos : null);

    const status = st.goggles ? `Goggles on|Load: ${st.load * 100} g` : '';
    if (status !== lastStatus) {
      lastStatus = status;
      el.status.replaceChildren(...status.split('|').filter(Boolean).map((t) => h('span', null, t)));
    }
  }

  // The spring bounces and settles at its new length.
  function bounceTo(target) {
    const from = st.pos;
    if (K.reduceMotion) {
      st.pos = target;
      draw();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const t0 = performance.now();
      function frame(now) {
        const t = ((now - t0) / 1000) * K.timeScale;
        const amp = (from - target) * Math.exp(-t / 0.4);
        st.pos = target + amp * Math.cos(10 * t);
        draw();
        if (Math.abs(amp) < 0.004) {
          st.pos = target;
          draw();
          resolve();
        } else {
          requestAnimationFrame(frame);
        }
      }
      requestAnimationFrame(frame);
    });
  }

  /* ---------- Results table and graph ---------- */

  function renderTable() {
    el.table.replaceChildren(
      h('thead', null, h('tr', null,
        h('th', { scope: 'col' }, 'Mass / g'),
        h('th', { scope: 'col' }, 'Weight / N'),
        h('th', { scope: 'col' }, 'Pointer reading / cm'),
        h('th', { scope: 'col' }, 'Extension / cm'))),
      h('tbody', null, st.rows.map((r, i) => h('tr', null,
        h('td', null, String(r.mass)),
        h('td', null, fmt(r.weight, 2)),
        h('td', { class: st.awaiting === i ? 'now' : null }, r.reading === null ? '' : fmt(r.reading, 1)),
        h('td', null, r.ext === null ? '' : fmt(r.ext, 1)))))
    );
    el.calcs.replaceChildren(...(st.calcs.length ? [h('dl', { class: 'calc-list' }, st.calcs.map(([k, v]) => [h('dt', null, k), h('dd', null, v)]))] : []));
  }

  function addCalc(name, text) {
    st.calcs.push([name, text]);
    renderTable();
  }

  let graph = null;
  const points = () => st.rows.map((r, i) => ({ x: r.ext, y: r.weight, i }));

  function showGraph() {
    const maxExt = Math.max(...st.rows.map((r) => r.ext));
    graph = new K.Graph({
      title: 'Force against extension',
      xLabel: 'Extension / cm',
      yLabel: 'Force / N',
      xDomain: K.niceDomain(0, maxExt * 1.05),
      yDomain: [0, 8],
      describe: (p) => [`${fmt(p.y, 2)} N, ${fmt(p.x, 1)} cm`, `Load ${st.rows[p.i].mass} g`],
    });
    graph.points = points();
    el.graphBox.replaceChildren(graph.el);
    graph.render();
  }

  // Gradient of the straight part, through the origin, in N/cm.
  function straightGradient() {
    const linear = points().filter((p) => p.y <= st.lopAnswer + 1e-9);
    return K.fitLine(linear, true).m;
  }

  /* ---------- Steps ---------- */

  const mag = new K.Magnifier({ kind: 'ruler', label: 'Close-up of the ruler next to the pointer', span: 3, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: 50 });

  function readingField(row, done) {
    st.awaiting = row;
    renderTable();
    const f = K.field({
      label: row === 0 ? 'Pointer reading with no load' : `Pointer reading with ${row * 100} g`,
      unit: 'cm',
      placeholder: 'e.g. 12.3',
      say,
      check: (v, attempts) => {
        const actual = st.pos;
        if (near(v, actual, { abs: 0.1 })) return { ok: true, accepted: round(v, 1), value: fmt(v, 1), msg: `Recorded ${fmt(v, 1)} cm.` };
        if (attempts >= 3) {
          const answer = round(actual, 1);
          return { ok: true, tone: 'info', accepted: answer, value: fmt(answer, 1), msg: `The reading is ${fmt(answer, 1)} cm. Look where the tip of the red pointer meets the scale in the magnified view.` };
        }
        if (near(v / 10, actual, { abs: 0.1 })) return { ok: false, tone: 'warn', msg: 'Give your reading in centimetres, for example 12.3 (not in millimetres).' };
        if (Math.abs(v - actual) <= 0.3) return { ok: false, tone: 'warn', msg: 'Close. Each small division is 1 mm (0.1 cm). Look straight across at the pointer tip.' };
        return { ok: false, msg: 'Not quite. Find the tip of the red pointer in the magnified view and read the scale next to it.' };
      },
      onAccept: (v) => {
        st.rows[row].reading = v;
        if (row === 0) st.rows[0].ext = 0;
        st.awaiting = null;
        renderTable();
        done();
      },
    });
    return f;
  }

  const steps = [
    {
      id: 'goggles',
      title: 'Put on safety goggles',
      text: 'A stretched spring can snap or flick masses upwards. Protect your eyes, and keep your feet away from under the masses.',
      why: 'If the spring breaks or a mass slips off, it can fly up or fall. Goggles protect your eyes; keeping feet clear protects your toes.',
      enter(box, g) {
        const wear = () => {
          st.goggles = true;
          say('Goggles on. You are ready to start.', 'good');
          g.next();
        };
        g.hot(['goggles']);
        g.on('goggles', wear);
        box.append(h('div', { class: 'btn-row' }, button('Put on goggles', wear, { primary: true })));
      },
    },
    {
      id: 'setup',
      title: 'Set up the spring and ruler',
      text: 'Hang the spring from the clamp. Clamp a ruler next to it so the ruler is vertical, close to the spring and has 0 at the top.',
      why: 'A vertical ruler right next to the spring lets you read the position accurately and reduces parallax error (reading at an angle).',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          await tween(900, (t) => el.rig.setAttribute('opacity', t.toFixed(3)));
          st.setUp = true;
          g.next();
        };
        const btn = button('Set up the equipment', go, { primary: true });
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'pointer',
      title: 'Attach a pointer',
      text: 'Fix a thin pointer to the bottom of the spring so that its tip touches the ruler scale.',
      why: 'A pointer gives a sharp mark to read against the scale, so every reading is taken from the same point on the spring.',
      enter(box, g) {
        const go = () => {
          st.pointer = true;
          g.next();
        };
        box.append(h('div', { class: 'btn-row' }, button('Attach the pointer', go, { primary: true })));
      },
    },
    {
      id: 'start',
      title: 'Read the starting position',
      text: 'With no masses on the spring, read where the pointer tip is on the ruler. Look straight across, with your eye level with the pointer, and give the reading to the nearest 0.1 cm.',
      why: 'This is the position of the unstretched spring. Every extension is measured from here.',
      enter(box, g) {
        const f = readingField(0, () => g.next());
        box.append(h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, f.el,
          h('p', { class: 'status-line' }, 'The ruler is marked in centimetres. Each small division is 1 mm.'))));
        f.focus();
      },
    },
    {
      id: 'load',
      title: 'Add masses and read the pointer',
      text: 'Hang the 100 g mass hanger on the spring, wait until it stops bouncing, then read the pointer. Keep adding 100 g masses one at a time up to 800 g, reading the pointer each time.',
      why: 'Each 100 g adds 0.98 N of weight (W = m × g, with g = 9.8 N/kg). Waiting until the spring is still makes each reading accurate.',
      enter(box, g) {
        const nextLoad = () => {
          box.replaceChildren();
          const n = st.load + 1;
          g.task(`Load ${n} of ${LOADS}: ${n === 1 ? 'hang the 100 g mass hanger on the spring' : 'add another 100 g mass'}.`);
          let busy = false;
          const add = async () => {
            if (busy) return;
            busy = true;
            btn.disabled = true;
            g.hot([]);
            st.load = n;
            g.task(`Load ${n} of ${LOADS}: wait for the spring to stop bouncing.`);
            await bounceTo(readingFor(n));
            g.task(`Load ${n} of ${LOADS}: read the pointer (${n * 100} g on the spring).`);
            const f = readingField(n, () => {
              if (n < LOADS) nextLoad();
              else {
                say(`All ${LOADS} readings recorded.`, 'good');
                g.next();
              }
            });
            box.replaceChildren(h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, f.el)));
            f.focus();
          };
          const btn = button(n === 1 ? 'Hang the mass hanger' : 'Add a 100 g mass', add, { primary: true });
          g.hot(['masses']);
          g.on('masses', add);
          box.append(h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, h('div', { class: 'btn-row' }, btn))));
        };
        nextLoad();
      },
    },
    {
      id: 'extension',
      title: 'Work out the extensions',
      text: 'Extension is how much longer the spring is than at the start: extension = pointer reading − starting reading.',
      why: 'Hooke’s law is about extension, not length. Subtracting the starting reading removes the length the spring had to begin with.',
      enter(box, g) {
        const row = 4;
        const expected = round(st.rows[row].reading - st.rows[0].reading, 1);
        g.task(`Work out the extension with ${st.rows[row].mass} g on the spring.`);
        const f = K.field({
          label: `Extension with ${st.rows[row].mass} g`,
          unit: 'cm',
          placeholder: 'e.g. 9.6',
          say,
          check: (v, attempts) => {
            if (near(v, expected, { abs: 0.051 })) return { ok: true, accepted: expected, msg: `Extension = ${fmt(st.rows[row].reading, 1)} − ${fmt(st.rows[0].reading, 1)} = ${fmt(expected, 1)} cm. The other extensions have been filled in the same way.` };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: expected, value: fmt(expected, 1), msg: `Extension = ${fmt(st.rows[row].reading, 1)} − ${fmt(st.rows[0].reading, 1)} = ${fmt(expected, 1)} cm. The other extensions have been filled in the same way.` };
            if (near(v, st.rows[row].reading, { abs: 0.051 })) return { ok: false, tone: 'warn', msg: 'That is the pointer reading. Subtract the starting reading to get the extension.' };
            return { ok: false, msg: 'Subtract the starting reading (0 g row) from the reading for this load.' };
          },
          onAccept: () => {
            for (const r of st.rows) r.ext = round(r.reading - st.rows[0].reading, 1);
            renderTable();
            g.next();
          },
        });
        box.append(f.el);
        f.focus();
      },
    },
    {
      id: 'plot',
      title: 'Plot force against extension',
      text: 'Plot force (weight) on the y-axis against extension on the x-axis.',
      why: 'If the points lie on a straight line through the origin, the force is directly proportional to the extension.',
      enter(box, g) {
        const go = () => {
          showGraph();
          say('Your graph is in the Results panel. Hover over or tap a point to see its values.', 'good');
          g.next();
        };
        box.append(h('div', { class: 'btn-row' }, button('Plot the points', go, { primary: true })));
      },
    },
    {
      id: 'lop',
      title: 'Find the limit of proportionality',
      text: 'Look at your graph. Up to which force do the points lie on a straight line through the origin?',
      why: 'Up to the limit of proportionality, extension is directly proportional to force (Hooke’s law). Beyond it, the spring stretches more than F = k × e predicts, so the graph curves.',
      enter(box, g) {
        const options = [3.92, 4.9, 5.88, 6.86];
        const correct = Math.max(...st.rows.filter((r) => r.weight <= fLop).map((r) => r.weight));
        const choose = (F) => {
          if (near(F, correct, { abs: 0.001 })) {
            st.lopAnswer = correct;
            const m = straightGradient();
            const xEnd = graph.xDomain[1];
            graph.set({
              lines: [{ x1: 0, y1: 0, x2: xEnd, y2: m * xEnd }],
              points: points().map((p) => ({ ...p, off: p.y > correct + 1e-9 })),
              marks: [{ x: st.rows.find((r) => near(r.weight, correct, { abs: 0.001 })).ext, y: correct, label: 'Limit of proportionality', dx: 12, dy: 22 }],
            });
            addCalc('Limit of proportionality', `about ${fmt(correct, 2)} N`);
            say(`Right. Up to ${fmt(correct, 2)} N the points are on a straight line. After that, the spring stretches more for each extra 100 g, so the graph curves away from the line.`, 'good');
            g.next();
          } else if (F > correct) {
            say(`Look again at ${fmt(F, 2)} N. Compare that point with a straight line through the origin and the first few points: it sits to the right of the line, so the spring has already stretched too much.`, 'warn');
          } else {
            say(`The points above ${fmt(F, 2)} N are still on the straight line. Choose the last point that is on it.`, 'warn');
          }
        };
        box.append(h('div', { class: 'btn-row' }, options.map((F) => button(`${fmt(F, 2)} N`, () => choose(F)))));
      },
    },
    {
      id: 'constant',
      title: 'Calculate the spring constant',
      text: 'Use the straight part of the graph: spring constant k = force ÷ extension. Convert the extension from cm to m first.',
      why: 'The spring constant is the gradient of the straight part of the graph. A stiffer spring has a bigger k: it needs more force to stretch each metre.',
      enter(box, g) {
        const expected = straightGradient() * 100;
        const f = K.field({
          label: 'Spring constant k',
          unit: 'N/m',
          placeholder: 'e.g. 35',
          say,
          check: (v, attempts) => {
            if (near(v, expected, { rel: 0.04 })) return { ok: true, accepted: v, msg: `k = ${fmt(v, 1)} N/m.` };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: expected, value: fmt(expected, 1), msg: `From the gradient of the straight line, k ≈ ${fmt(expected, 1)} N/m.` };
            if (near(v, expected / 100, { rel: 0.05 })) return { ok: false, tone: 'warn', msg: 'Your answer is 100 times too small. Convert the extension to metres (divide cm by 100) before dividing.' };
            if (near(v, 1 / expected, { rel: 0.05 }) || near(v, 100 / expected, { rel: 0.05 })) return { ok: false, tone: 'warn', msg: 'Divide force by extension (k = F ÷ e), not the other way round.' };
            return { ok: false, msg: 'Pick a point on the straight part of the line. Divide its force (N) by its extension in metres.' };
          },
          onAccept: (v) => {
            st.kAnswer = v;
            addCalc('Spring constant', `${fmt(v, 1)} N/m`);
            g.next();
          },
        });
        box.append(h('pre', { class: 'formula' }, 'k = F ÷ e\nextension in m = extension in cm ÷ 100'), f.el);
        f.focus();
      },
    },
  ];

  /* ---------- Start ---------- */

  buildBench();
  el.table = document.getElementById('results-table');
  el.calcs = document.getElementById('calc-list');
  el.graphBox = document.getElementById('graph');

  const lab = K.setupLab({ id: 'hookes-law', steps, items: { goggles: el.goggles, masses: el.masses } });
  const say = lab.say;
  lab.guide.onFinish = () => {
    const error = ((st.kAnswer - springK) / springK) * 100;
    lab.finish({
      title: 'Practical complete',
      summary: Math.abs(error) <= 3
        ? 'Excellent: your spring constant is within 3% of the true value.'
        : Math.abs(error) <= 6
          ? 'Good: your spring constant is within 6% of the true value.'
          : 'Your spring constant is more than 6% out. Check you used points on the straight part only.',
      rows: [
        ['Your spring constant', `${fmt(st.kAnswer, 1)} N/m`],
        ['True spring constant', `${fmt(springK, 1)} N/m`],
        ['Difference', `${error >= 0 ? '+' : ''}${fmt(error, 1)}%`],
        ['Limit of proportionality', `between ${fmt(st.lopAnswer, 2)} N and ${fmt(st.lopAnswer + 0.98, 2)} N`],
      ],
    });
  };

  renderTable();
  draw();
  lab.guide.start();

  // Read-only view of the simulation for automated tests.
  window.__lab = { st, springK, fLop, startReading, readingFor };
})();
