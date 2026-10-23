/* Weight and mass with a newtonmeter (Grade 6, Cambridge Stage 7: 7Pf.03, 7TWSc.04, 7TWSa.05).
   The student zeroes a newtonmeter, hangs 100 g masses on it up to 1000 g, reads the weight in
   newtons, plots weight against mass and finds the gravitational field strength. */
(function () {
  'use strict';

  const K = window.LabKit;
  const { h, s, button, fmt, round, rand, near, tween } = K;

  /* ---------- Physics ---------- */

  const G = 9.8; // N/kg
  const LOADS = 10; // 100 g each; the mass hanger counts as the first
  const zeroError = round(rand(0.2, 0.4), 2); // N shown before the newtonmeter is adjusted
  const weightOf = (grams) => (grams / 1000) * G;

  /* ---------- State ---------- */

  const st = {
    setUp: false,
    load: 0,
    pos: zeroError, // what the pointer shows right now, N
    zeroed: false,
    rows: Array.from({ length: LOADS + 1 }, (_, i) => ({ g: i * 100, kg: null, weight: null })),
    awaiting: null,
    gAnswer: null,
    calcs: [],
  };

  /* ---------- Bench drawing ---------- */

  const X = 230; // centre line of the newtonmeter
  const ZERO_Y = 34; // y of the 0 N mark
  const PX = 18; // px per newton
  const yOf = (n) => ZERO_Y + n * PX;

  const el = {};
  const benchLabel = (x, y, text) => s('text', { class: 'bench-label', x, y, 'text-anchor': 'middle' }, text);
  const hit = (x, y, width, height) => s('rect', { class: 'hit', x, y, width, height, rx: 8 });
  const BRASS = { fill: '#c9a447', stroke: '#86691f', 'stroke-width': 1 };

  function slottedMass(x, y) {
    return s('g', null,
      s('rect', { x, y, width: 36, height: 6.5, rx: 1.5, ...BRASS }),
      s('rect', { x: x + 16, y, width: 4, height: 3, fill: '#86691f' }));
  }

  function buildBench() {
    const svg = s('svg', { viewBox: '0 0 720 540', role: 'group', 'aria-label': 'Lab bench: a newtonmeter hanging from a clamp stand, a mass hanger and 100 g slotted masses.' });
    svg.append(
      s('rect', { x: 0, y: 0, width: 720, height: 500, fill: '#f6f8f9' }),
      s('rect', { x: 0, y: 500, width: 720, height: 40, fill: '#ddd4c6' }),
      s('line', { x1: 0, x2: 720, y1: 500.5, y2: 500.5, stroke: '#bdb2a1' }),
      benchLabel(270, 518, 'Clamp stand and newtonmeter'),
      benchLabel(540, 518, 'Mass hanger and 100 g masses'),
      s('rect', { x: 150, y: 488, width: 240, height: 12, rx: 3, fill: '#4f5b66' }),
      s('rect', { x: 356, y: 4, width: 8, height: 486, rx: 2, fill: '#8d99a3' }),
      s('rect', { x: 214, y: 6, width: 146, height: 8, rx: 2, fill: '#6b7782' }),
      s('rect', { x: 348, y: 0, width: 24, height: 20, rx: 3, fill: '#59656f' })
    );

    // Newtonmeter: barrel with a scale, spring and pointer in a slot, hook below
    const scale = s('g', null);
    for (let k = 0; k <= 20; k++) {
      const n = k / 2;
      const y = yOf(n);
      scale.append(s('line', { x1: X + 5, x2: X + (k % 2 ? 9 : 12), y1: y, y2: y, stroke: '#1f2a33', 'stroke-width': k % 2 ? 0.7 : 1.1 }));
      if (k % 2 === 0) scale.append(s('text', { class: 'scale-text', x: X + 14, y: y + 3 }, String(n)));
    }
    el.spring = s('path', { fill: 'none', stroke: '#7d8890', 'stroke-width': 1.4 });
    el.pointer = s('rect', { x: X - 6, width: 12, height: 2.4, fill: '#c0392b' });
    el.hookRod = s('rect', { x: X - 1.5, y: 220, width: 3, fill: '#7d8890' });
    el.hook = s('path', { fill: 'none', stroke: '#59656f', 'stroke-width': 2 });
    el.hangerMasses = s('g', null);
    el.hanger = s('g', null,
      s('circle', { cx: X, cy: 2, r: 3, fill: 'none', stroke: '#59656f', 'stroke-width': 1.6 }),
      s('rect', { x: X - 1.5, y: 5, width: 3, height: 73, fill: '#7d8890' }),
      s('rect', { x: X - 18, y: 78, width: 36, height: 7, rx: 1.5, fill: '#7d8890', stroke: '#59656f' }),
      el.hangerMasses);
    el.meter = s('g', { opacity: 0 },
      s('path', { d: `M${X},14 L${X},20`, stroke: '#59656f', 'stroke-width': 2.5 }),
      s('circle', { cx: X, cy: 17, r: 3.5, fill: 'none', stroke: '#59656f', 'stroke-width': 1.5 }),
      el.hookRod,
      s('rect', { x: X - 12, y: 20, width: 46, height: 200, rx: 5, fill: '#e9eef2', stroke: '#7f97a8', 'stroke-width': 1.5 }),
      s('rect', { x: X - 6, y: 26, width: 12, height: 190, rx: 2, fill: '#fbfcfd', stroke: '#b9c6cf' }),
      el.spring,
      el.pointer,
      scale,
      el.hook,
      el.hanger);

    el.pile = s('g', null);
    el.benchHanger = s('g', null,
      s('rect', { x: 588, y: 425, width: 3, height: 58, fill: '#7d8890' }),
      s('path', { d: 'M589.5,425 L589.5,419 Q595.5,415 589.5,411', fill: 'none', stroke: '#59656f', 'stroke-width': 2 }),
      s('rect', { x: 571.5, y: 483, width: 36, height: 7, rx: 1.5, fill: '#7d8890', stroke: '#59656f' }));
    el.masses = s('g', { 'data-label': '100 g masses' }, el.pile, el.benchHanger, hit(470, 400, 150, 100));

    svg.append(el.meter, el.masses);
    el.status = h('div', { class: 'bench-status', 'aria-live': 'polite' });
    document.getElementById('bench').append(svg, el.status);
  }

  let lastStatus = '';
  function draw() {
    const py = yOf(st.pos);
    el.pointer.setAttribute('y', (py - 1.2).toFixed(2));
    const coils = 12;
    const top = 28;
    const step = (py - 4 - top) / (coils * 2);
    let d = `M${X},${top}`;
    for (let i = 1; i < coils * 2; i++) d += ` L${i % 2 ? X + 4 : X - 4},${(top + step * i).toFixed(1)}`;
    d += ` L${X},${(py - 2).toFixed(1)}`;
    el.spring.setAttribute('d', d);
    const hookY = 230 + st.pos * PX;
    el.hookRod.setAttribute('height', Math.max(0, hookY - 220));
    el.hook.setAttribute('d', `M${X},${hookY} q6,4 0,9 q-5,-3 -2,-6`);
    el.hanger.setAttribute('transform', `translate(0 ${(hookY + 7).toFixed(2)})`);
    el.hanger.setAttribute('visibility', st.load > 0 ? 'visible' : 'hidden');
    el.benchHanger.setAttribute('visibility', st.load > 0 ? 'hidden' : 'visible');

    const onHanger = Math.max(0, st.load - 1);
    if (el.hangerMasses.childElementCount !== onHanger) {
      el.hangerMasses.replaceChildren(...Array.from({ length: onHanger }, (_, i) => slottedMass(X - 18, 71.5 - i * 6.5)));
    }
    const left = LOADS - 1 - onHanger;
    if (el.pile.childElementCount !== left) {
      el.pile.replaceChildren(...Array.from({ length: left }, (_, i) => slottedMass(500, 493.5 - i * 6.5)));
    }
    mag.update(st.setUp ? st.pos : null);

    const status = st.setUp ? `Mass on the newtonmeter: ${st.load * 100} g` : '';
    if (status !== lastStatus) {
      lastStatus = status;
      el.status.replaceChildren(...(status ? [h('span', null, status)] : []));
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
        const amp = (from - target) * Math.exp(-t / 0.35);
        st.pos = target + amp * Math.cos(11 * t);
        draw();
        if (Math.abs(amp) < 0.003) {
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
        h('th', { scope: 'col' }, 'Mass / kg'),
        h('th', { scope: 'col' }, 'Weight / N'))),
      h('tbody', null, st.rows.map((r, i) => h('tr', null,
        h('td', null, String(r.g)),
        h('td', { class: st.awaiting === `kg${i}` ? 'now' : null }, r.kg === null ? '' : fmt(r.kg, 1)),
        h('td', { class: st.awaiting === i ? 'now' : null }, r.weight === null ? '' : fmt(r.weight, 1)))))
    );
    el.calcs.replaceChildren(...(st.calcs.length ? [h('dl', { class: 'calc-list' }, st.calcs.map(([k, v]) => [h('dt', null, k), h('dd', null, v)]))] : []));
  }

  function addCalc(name, text) {
    st.calcs.push([name, text]);
    renderTable();
  }

  let graph = null;
  const points = () => st.rows.map((r, i) => ({ x: r.g / 1000, y: r.weight, i }));
  const gradient = () => K.fitLine(points().filter((p) => p.x > 0), true).m;

  /* ---------- Steps ---------- */

  const mag = new K.Magnifier({ kind: 'ruler', label: 'Close-up of the newtonmeter scale next to the pointer', span: 1.5, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: 10 });

  function readingField(row, done) {
    st.awaiting = row;
    renderTable();
    const f = K.field({
      label: `Weight with ${row * 100} g`,
      unit: 'N',
      placeholder: 'e.g. 2.0',
      say,
      check: (v, attempts) => {
        const actual = st.pos;
        if (near(v, actual, { abs: 0.1 })) return { ok: true, accepted: round(v, 1), value: fmt(v, 1), msg: `Recorded ${fmt(v, 1)} N.` };
        if (attempts >= 3) {
          const answer = round(actual, 1);
          return { ok: true, tone: 'info', accepted: answer, value: fmt(answer, 1), msg: `The reading is ${fmt(answer, 1)} N. Look where the red pointer lines up with the scale.` };
        }
        if (near(v, row * 100, { abs: 1 }) || near(v, row * 0.1, { abs: 0.01 })) return { ok: false, tone: 'warn', msg: 'That is the mass. Read the weight in newtons (N) from the newtonmeter scale.' };
        if (Math.abs(v - actual) <= 0.3) return { ok: false, tone: 'warn', msg: 'Close. Each small division is 0.1 N. Look straight across at the pointer.' };
        return { ok: false, msg: 'Not quite. Find the red pointer in the magnified view and read the scale next to it.' };
      },
      onAccept: (v) => {
        st.rows[row].weight = v;
        st.awaiting = null;
        renderTable();
        done();
      },
    });
    return f;
  }

  const steps = [
    {
      id: 'setup',
      title: 'Hang the newtonmeter from the clamp stand',
      text: 'Clamp the stand firmly to the bench and hang the newtonmeter from the clamp so it hangs straight down.',
      why: 'A newtonmeter measures force, including weight, in newtons (N). It must hang straight down so the spring isn’t rubbing on its case.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          await tween(800, (t) => el.meter.setAttribute('opacity', t.toFixed(3)));
          st.setUp = true;
          draw();
          g.next();
        };
        const btn = button('Hang the newtonmeter', go, { primary: true });
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'zero',
      title: 'Check it reads zero',
      text: 'With nothing hanging on it, the newtonmeter should read 0 N. Look at the magnified scale.',
      why: 'If the pointer isn’t on zero, every reading would be wrong by the same amount. This is called a zero error. Adjusting the newtonmeter first removes it.',
      enter(box, g) {
        g.task(`It reads ${fmt(zeroError, 1)} N with nothing on it. Adjust the zero.`);
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          const from = st.pos;
          await tween(900, (t) => {
            st.pos = from * (1 - t);
            draw();
          });
          st.pos = 0;
          st.zeroed = true;
          st.rows[0].weight = 0;
          draw();
          renderTable();
          say('The newtonmeter now reads 0.0 N. No zero error.', 'good');
          g.next();
        };
        const btn = button('Adjust the zero', go, { primary: true });
        box.append(h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, h('div', { class: 'btn-row' }, btn))));
      },
    },
    {
      id: 'load',
      title: 'Hang masses and read the weight',
      text: 'Hang the 100 g mass hanger on the hook and read the weight. Keep adding 100 g masses up to 1000 g, reading the weight each time.',
      why: 'Changing the mass in equal steps gives evenly spaced results, which makes a clear graph. Wait for the masses to stop bouncing before you read.',
      enter(box, g) {
        const nextLoad = () => {
          box.replaceChildren();
          const n = st.load + 1;
          g.task(`Load ${n} of ${LOADS}: ${n === 1 ? 'hang the 100 g mass hanger on the hook' : 'add another 100 g mass'}.`);
          let busy = false;
          const add = async () => {
            if (busy) return;
            busy = true;
            btn.disabled = true;
            g.hot([]);
            st.load = n;
            g.task(`Load ${n} of ${LOADS}: wait for it to stop bouncing.`);
            await bounceTo(weightOf(n * 100));
            g.task(`Load ${n} of ${LOADS}: read the weight (${n * 100} g hanging).`);
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
          if (K.isAutofill()) btn.focus({ preventScroll: true });
        };
        nextLoad();
      },
    },
    {
      id: 'kg',
      title: 'Change the masses into kilograms',
      text: 'Scientists usually give mass in kilograms. 1 kg = 1000 g, so divide the mass in grams by 1000.',
      why: 'Gravitational field strength is measured in newtons per kilogram (N/kg), so the mass must be in kilograms.',
      enter(box, g) {
        const row = 4;
        st.awaiting = `kg${row}`;
        renderTable();
        const f = K.field({
          label: '400 g in kilograms',
          unit: 'kg',
          placeholder: 'e.g. 0.4',
          say,
          check: (v, attempts) => {
            if (near(v, 0.4, { abs: 0.001 })) return { ok: true, accepted: 0.4, msg: '400 ÷ 1000 = 0.4 kg. The other masses have been changed the same way.' };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: 0.4, value: '0.4', msg: '400 g ÷ 1000 = 0.4 kg. The other masses have been changed the same way.' };
            if (near(v, 400000, { abs: 1 }) || near(v, 4, { abs: 0.001 }) || near(v, 40, { abs: 0.01 })) return { ok: false, tone: 'warn', msg: 'Divide by 1000: there are 1000 g in 1 kg.' };
            return { ok: false, msg: 'Divide the mass in grams by 1000.' };
          },
          onAccept: () => {
            for (const r of st.rows) r.kg = r.g / 1000;
            st.awaiting = null;
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
      title: 'Plot weight against mass',
      text: 'Plot weight (y-axis) against mass in kilograms (x-axis), then draw a line of best fit.',
      why: 'A straight line through the origin shows that weight is directly proportional to mass: double the mass and the weight doubles.',
      enter(box, g) {
        const go = () => {
          graph = new K.Graph({
            title: 'Weight against mass',
            xLabel: 'Mass / kg',
            yLabel: 'Weight / N',
            xDomain: [0, 1],
            yDomain: [0, 10],
            describe: (p) => [`${fmt(p.y, 1)} N`, `${fmt(p.x, 1)} kg`],
          });
          graph.points = points();
          graph.lines = [{ x1: 0, y1: 0, x2: 1, y2: gradient() }];
          el.graphBox.replaceChildren(graph.el);
          graph.render();
          say('Your graph is in the Results panel. The points lie on a straight line through zero.', 'good');
          g.next();
        };
        box.append(h('div', { class: 'btn-row' }, button('Plot the graph', go, { primary: true })));
      },
    },
    {
      id: 'g',
      title: 'Work out weight ÷ mass',
      text: 'Choose one of your results and divide the weight (N) by the mass (kg). This tells you how many newtons each kilogram weighs on Earth.',
      why: 'Weight ÷ mass is the gravitational field strength. On Earth it is about 10 N/kg (9.8 N/kg to be more exact). On the Moon it is only 1.6 N/kg.',
      enter(box, g) {
        const expected = gradient();
        const f = K.field({
          label: 'Weight ÷ mass',
          unit: 'N/kg',
          placeholder: 'e.g. 9.8',
          say,
          check: (v, attempts) => {
            if (near(v, expected, { rel: 0.05 })) return { ok: true, accepted: v, msg: `${fmt(v, 1)} N/kg. On Earth, every kilogram has a weight of about 10 N.` };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: round(expected, 1), value: fmt(expected, 1), msg: `Weight ÷ mass ≈ ${fmt(expected, 1)} N/kg. On Earth, every kilogram has a weight of about 10 N.` };
            if (near(v, expected / 1000, { rel: 0.05 })) return { ok: false, tone: 'warn', msg: 'Use the mass in kilograms, not grams.' };
            if (near(v, 1 / expected, { rel: 0.05 })) return { ok: false, tone: 'warn', msg: 'Divide the weight by the mass, not the other way round.' };
            return { ok: false, msg: 'Pick one row of your table, for example 0.5 kg, and divide its weight in newtons by 0.5.' };
          },
          onAccept: (v) => {
            st.gAnswer = v;
            addCalc('Weight ÷ mass', `${fmt(v, 1)} N/kg`);
            g.next();
          },
        });
        box.append(h('pre', { class: 'formula' }, 'weight (N) = mass (kg) × gravitational field strength (N/kg)'), f.el);
        f.focus();
      },
    },
  ];

  /* ---------- Start ---------- */

  buildBench();
  el.table = document.getElementById('results-table');
  el.calcs = document.getElementById('calc-list');
  el.graphBox = document.getElementById('graph');

  const lab = K.setupLab({
    id: 'g6-newtonmeter',
    guide: '../practical.html#g6-newtonmeter',
    objectives: ['I can measure weight in newtons with a newtonmeter.', 'I can plot a graph of weight against mass.', 'I can use the graph to show that weight = mass × gravitational field strength.'],
    steps,
    items: { masses: el.masses },
  });
  const say = lab.say;
  lab.guide.onFinish = () => {
    lab.finish({
      title: 'Practical complete',
      summary: `Weight is directly proportional to mass. Each kilogram has a weight of about ${fmt(st.gAnswer, 1)} N on Earth. On the Moon the same masses would weigh about one sixth as much, but their mass would not change.`,
      rows: [
        ['Weight of 1 kg', `${fmt(st.rows[LOADS].weight, 1)} N`],
        ['Your weight ÷ mass', `${fmt(st.gAnswer, 1)} N/kg`],
        ['Earth’s value', '9.8 N/kg (about 10 N/kg)'],
        ['Zero error you removed', `${fmt(zeroError, 1)} N`],
      ],
    });
  };

  renderTable();
  draw();
  lab.guide.start();

  // Read-only view of the simulation for automated tests.
  window.__lab = { st, zeroError, weightOf };
})();
