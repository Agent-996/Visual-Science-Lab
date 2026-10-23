/* Neutralisation drop by drop (Grade 6, Cambridge Stage 7: 7Cc.04, 7TWSa.02).
   The student adds dilute hydrochloric acid to sodium hydroxide 1 cm³ at a time, reads the pH
   from the colour of universal indicator, plots pH against volume and finds the neutral point. */
(function () {
  'use strict';

  const K = window.LabKit;
  const { h, s, button, fmt, round, rand, clamp, lerp, near, tween, wait } = K;

  /* ---------- Chemistry ---------- */

  const ALKALI_VOL = 10; // cm³ of sodium hydroxide in the flask
  const ALKALI_CONC = 0.1; // mol/dm³
  const MAX_ACID = 20; // cm³ added in total
  const neutralAt = round(rand(8, 13), 2); // cm³ of acid that exactly neutralises the alkali (hidden)
  const ACID_CONC = (ALKALI_CONC * ALKALI_VOL) / neutralAt;

  function pHAfter(acidVol) {
    const volume = (ALKALI_VOL + acidVol) / 1000;
    const d = (ALKALI_CONC * ALKALI_VOL - ACID_CONC * acidVol) / 1000 / volume;
    const root = Math.sqrt(d * d + 4e-14);
    const oh = d >= 0 ? (d + root) / 2 : 2e-14 / (root - d);
    return 14 + Math.log10(oh);
  }

  // Universal indicator colour chart, pH 0 to 14.
  const UI = ['#c4161c', '#e3262b', '#ef5b25', '#f7941d', '#fbb817', '#f7e11b', '#c5d82f', '#5fb946', '#1a9c4a', '#14a7b4', '#2268b1', '#2f3f99', '#4b2c8c', '#5e2a84', '#6b2178'];
  const UI_NAMES = ['red', 'red', 'orange-red', 'orange', 'orange-yellow', 'yellow', 'yellow-green', 'green', 'green', 'blue-green', 'blue', 'dark blue', 'indigo', 'purple', 'purple'];
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  function uiColour(pH) {
    const p = clamp(pH, 0, 14);
    const i = Math.min(13, Math.floor(p));
    const a = hex(UI[i]);
    const b = hex(UI[i + 1]);
    const t = p - i;
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * t)).join(',')})`;
  }
  const chartPH = (pH) => clamp(Math.round(pH), 0, 14);

  /* ---------- State ---------- */

  const st = {
    goggles: false,
    alkali: 0, // cm³ in the flask
    indicator: false,
    level: null, // burette reading, cm³
    funnel: false,
    acid: 0, // cm³ added to the flask
    flowing: false,
    shownPH: null, // pH the flask colour currently shows
    rows: [],
    awaiting: false,
    cylinder: 0, // 0..1 fill of the measuring cylinder
    answer: null,
  };

  /* ---------- Bench drawing ---------- */

  const GLASS = { fill: 'rgba(214, 232, 242, 0.35)', stroke: '#7f97a8', 'stroke-width': 1.5 };
  const CLEAR = 'rgba(160, 205, 235, 0.85)';
  const buretteY = (v) => 40 + v * 6;
  const el = {};
  const benchLabel = (x, y, text) => s('text', { class: 'bench-label', x, y, 'text-anchor': 'middle' }, text);
  const hit = (x, y, width, height) => s('rect', { class: 'hit', x, y, width, height, rx: 8 });

  function buildBench() {
    const svg = s('svg', { viewBox: '0 0 720 540', role: 'group', 'aria-label': 'Lab bench: a burette of dilute hydrochloric acid above a conical flask on a white tile, a beaker of sodium hydroxide, a measuring cylinder, universal indicator and safety goggles.' });
    svg.append(
      s('rect', { x: 0, y: 0, width: 720, height: 500, fill: '#f6f8f9' }),
      s('rect', { x: 0, y: 500, width: 720, height: 40, fill: '#ddd4c6' }),
      s('line', { x1: 0, x2: 720, y1: 500.5, y2: 500.5, stroke: '#bdb2a1' }),
      benchLabel(48, 518, 'Goggles'),
      benchLabel(130, 518, 'Sodium hydroxide'),
      benchLabel(130, 532, '(an alkali)'),
      benchLabel(222, 532, 'Measuring cylinder'),
      benchLabel(398, 518, 'Burette of acid, flask and tile'),
      benchLabel(578, 518, 'Hydrochloric acid'),
      benchLabel(578, 532, '(dilute)'),
      benchLabel(668, 518, 'Universal'),
      benchLabel(668, 532, 'indicator'),
      // clamp stand and tile
      s('rect', { x: 296, y: 488, width: 204, height: 12, rx: 3, fill: '#4f5b66' }),
      s('rect', { x: 474, y: 24, width: 8, height: 466, rx: 2, fill: '#8d99a3' }),
      s('rect', { x: 370, y: 69, width: 106, height: 8, rx: 2, fill: '#6b7782' }),
      s('rect', { x: 466, y: 62, width: 24, height: 22, rx: 3, fill: '#59656f' }),
      s('rect', { x: 300, y: 477, width: 120, height: 11, rx: 2, fill: '#ffffff', stroke: '#c9d1d6' })
    );

    el.goggles = s('g', { 'data-label': 'Safety goggles' },
      s('path', { d: 'M12,486 Q48,468 84,486', fill: 'none', stroke: '#2f3a44', 'stroke-width': 3 }),
      s('rect', { x: 18, y: 478, width: 26, height: 16, rx: 6, fill: 'rgba(170, 210, 235, 0.6)', stroke: '#2f6fb0', 'stroke-width': 2 }),
      s('rect', { x: 52, y: 478, width: 26, height: 16, rx: 6, fill: 'rgba(170, 210, 235, 0.6)', stroke: '#2f6fb0', 'stroke-width': 2 }),
      s('line', { x1: 44, x2: 52, y1: 484, y2: 484, stroke: '#2f6fb0', 'stroke-width': 3 }),
      hit(8, 464, 82, 36));

    const beaker = (cx, sticker, label, tint) => {
      const liquid = s('rect', { x: cx - 27, y: 452, width: 54, height: 47, fill: tint });
      return s('g', { 'data-label': label },
        liquid,
        s('path', { d: `M${cx - 30},428 L${cx - 28},432 L${cx - 28},496 Q${cx - 28},500 ${cx - 24},500 L${cx + 24},500 Q${cx + 28},500 ${cx + 28},496 L${cx + 28},430`, ...GLASS, fill: 'none' }),
        s('rect', { x: cx - 18, y: 470, width: 36, height: 14, rx: 2, fill: '#fff', stroke: '#c5ced4' }),
        s('text', { x: cx, y: 480.5, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 700, fill: '#33404d', 'font-family': 'Lexend, sans-serif' }, sticker),
        hit(cx - 36, 420, 72, 84));
    };
    el.alkaliBeaker = beaker(130, 'NaOH', 'Beaker of sodium hydroxide', 'rgba(214, 233, 222, 0.9)');
    el.acidBeaker = beaker(578, 'HCl', 'Beaker of dilute hydrochloric acid', CLEAR);

    // Measuring cylinder (moves to pour)
    el.cylLiquid = s('rect', { x: -9, width: 18, fill: 'rgba(214, 233, 222, 0.95)' });
    const cylMarks = s('g', null);
    for (let i = 1; i <= 9; i++) cylMarks.append(s('line', { x1: -10, x2: i % 5 === 0 ? -2 : -5, y1: 492 - i * 8, y2: 492 - i * 8, stroke: '#2d3a45', 'stroke-width': 0.8 }));
    el.cylinder = s('g', { 'data-label': 'Measuring cylinder' },
      el.cylLiquid,
      s('rect', { x: -11, y: 400, width: 22, height: 94, ...GLASS }),
      s('rect', { x: -17, y: 494, width: 34, height: 6, rx: 2, fill: 'rgba(214, 232, 242, 0.8)', stroke: '#7f97a8' }),
      cylMarks,
      hit(-24, 392, 48, 112));

    // Universal indicator bottle
    el.uiBottle = s('g', { 'data-label': 'Universal indicator bottle' },
      s('ellipse', { cx: 668, cy: 449, rx: 6, ry: 9, fill: '#33373b' }),
      s('rect', { x: 663, y: 457, width: 10, height: 10, fill: '#c9ced2' }),
      s('rect', { x: 652, y: 467, width: 32, height: 33, rx: 4, fill: '#fdfdfd', stroke: '#7f97a8' }),
      s('rect', { x: 655, y: 479, width: 26, height: 18, rx: 2, fill: '#4f9d4a' }),
      s('text', { x: 668, y: 476, 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 700, fill: '#33404d', 'font-family': 'Lexend, sans-serif' }, 'UI'),
      hit(646, 436, 44, 66));
    el.dropper = s('g', { visibility: 'hidden' },
      s('ellipse', { cx: 360, cy: 368, rx: 5, ry: 9, fill: '#33373b' }),
      s('path', { d: 'M357,376 L363,376 L361,404 L359,404 Z', ...GLASS }));

    // Conical flask on the tile
    const clip = s('clipPath', { id: 'flask-inside' }, s('path', { d: 'M347,411 L347,432.5 L307,468 Q301.5,476 310,476 L410,476 Q418.5,476 413,468 L373,432.5 L373,411 Z' }));
    el.flaskLiquid = s('rect', { x: 290, width: 140, 'clip-path': 'url(#flask-inside)' });
    el.flask = s('g', { 'data-label': 'Conical flask' },
      el.flaskLiquid,
      s('path', { d: 'M346,410 L346,432 L306,467 Q299,477 310,477 L410,477 Q421,477 414,467 L374,432 L374,410', ...GLASS }),
      s('rect', { x: 343, y: 406, width: 34, height: 5, rx: 2, fill: 'rgba(214, 232, 242, 0.6)', stroke: '#7f97a8' }),
      hit(294, 400, 132, 80));

    // Burette
    el.buretteLiquid = s('rect', { x: 352.5, width: 15, fill: CLEAR });
    const scale = s('g', null);
    for (let v = 0; v <= 50; v++) {
      const y = buretteY(v);
      const len = v % 10 === 0 ? 9 : v % 5 === 0 ? 6 : 3.5;
      scale.append(s('line', { x1: 351, x2: 351 + len, y1: y, y2: y, stroke: '#2d3a45', 'stroke-width': v % 5 === 0 ? 1 : 0.6 }));
      if (v % 10 === 0) scale.append(s('text', { class: 'scale-text', x: 347, y: y + 3, 'text-anchor': 'end' }, String(v)));
    }
    el.funnel = s('path', { d: 'M334,2 L386,2 L365,22 L365,34 L355,34 L355,22 Z', ...GLASS, fill: 'rgba(214, 232, 242, 0.75)' });
    el.tapHandle = s('rect', { x: 334, y: 376, width: 52, height: 6, rx: 3, fill: '#2f6fb0' });
    el.burette = s('g', { 'data-label': 'Burette' },
      el.buretteLiquid,
      s('rect', { x: 351, y: 18, width: 18, height: 354, ...GLASS }),
      scale,
      s('rect', { x: 340, y: 62, width: 40, height: 22, rx: 5, fill: 'none', stroke: '#59656f', 'stroke-width': 4 }),
      s('path', { d: 'M355,386 L365,386 L361.6,418 L358.4,418 Z', ...GLASS }),
      s('rect', { x: 348, y: 372, width: 24, height: 14, rx: 3, fill: '#e9eef2', stroke: '#7f97a8' }),
      el.tapHandle,
      hit(326, 0, 68, 420));
    el.stream = s('line', { x1: 360, x2: 360, y1: 418, stroke: CLEAR, 'stroke-width': 2.2, 'stroke-linecap': 'round', visibility: 'hidden' });
    el.drops = s('g', null);

    svg.append(s('defs', null, clip), el.goggles, el.alkaliBeaker, el.acidBeaker, el.uiBottle, el.cylinder, el.stream, el.flask, el.drops, el.funnel, el.burette, el.dropper);
    el.status = h('div', { class: 'bench-status', 'aria-live': 'polite' });
    document.getElementById('bench').append(svg, el.status);
  }

  let cylPos = { x: 222, y: 0, tilt: 0 };
  let lastStatus = '';

  function draw() {
    if (st.level === null) el.buretteLiquid.setAttribute('height', 0);
    else {
      const y = buretteY(st.level);
      el.buretteLiquid.setAttribute('y', y);
      el.buretteLiquid.setAttribute('height', Math.max(0, 372 - y));
    }
    el.funnel.setAttribute('visibility', st.funnel ? 'visible' : 'hidden');
    el.tapHandle.setAttribute('transform', `rotate(${st.flowing ? 90 : 0} 360 379)`);
    el.goggles.setAttribute('visibility', st.goggles ? 'hidden' : 'visible');

    const vol = st.alkali + st.acid;
    const height = vol <= 0.01 ? 0 : clamp(6 + vol * 0.9, 0, 40);
    const surface = 476 - height;
    el.flaskLiquid.setAttribute('y', surface);
    el.flaskLiquid.setAttribute('height', height + 4);
    el.flaskLiquid.setAttribute('fill', st.indicator && st.shownPH !== null ? uiColour(st.shownPH) : 'rgba(214, 233, 222, 0.9)');
    el.flaskLiquid.setAttribute('opacity', st.indicator ? 0.88 : 1);
    el.stream.setAttribute('visibility', st.flowing ? 'visible' : 'hidden');
    el.stream.setAttribute('y2', surface);

    const top = 492 - st.cylinder * 80;
    el.cylLiquid.setAttribute('y', top);
    el.cylLiquid.setAttribute('height', Math.max(0, 493 - top));
    el.cylinder.setAttribute('transform', `translate(${cylPos.x} ${cylPos.y}) rotate(${cylPos.tilt} 0 400)`);

    const status = [st.goggles ? 'Goggles on' : '', st.acid > 0 ? `Acid added: ${fmt(st.acid, 0)} cm³` : ''].join('|');
    if (status !== lastStatus) {
      lastStatus = status;
      el.status.replaceChildren(...status.split('|').filter(Boolean).map((t) => h('span', null, t)));
    }
  }

  function dropAnim(colour, x, y0, y1) {
    const d = s('circle', { cx: x, cy: y0, r: 2.6, fill: colour });
    el.drops.append(d);
    return tween(260, (t) => d.setAttribute('cy', lerp(y0, y1, t * t))).then(() => d.remove());
  }

  /* ---------- Equipment actions ---------- */

  async function measureAlkali() {
    await tween(900, (t) => {
      st.cylinder = t;
      draw();
    });
    await tween(900, (t) => {
      cylPos = { x: lerp(222, 336, t), y: -lerp(0, 92, t), tilt: lerp(0, 58, Math.max(0, (t - 0.5) * 2)) };
      draw();
    });
    st.flowing = false;
    await tween(1000, (t) => {
      st.cylinder = 1 - t;
      st.alkali = ALKALI_VOL * t;
      draw();
    });
    await tween(800, (t) => {
      cylPos = { x: lerp(336, 222, t), y: -lerp(92, 0, t), tilt: lerp(58, 0, Math.min(1, t * 2)) };
      draw();
    });
    st.alkali = ALKALI_VOL;
    draw();
  }

  async function addIndicator() {
    el.dropper.setAttribute('visibility', 'visible');
    for (let i = 0; i < 4; i++) await dropAnim('#4f9d4a', 360, 404, 452);
    el.dropper.setAttribute('visibility', 'hidden');
    st.indicator = true;
    const target = pHAfter(0);
    await tween(700, (t) => {
      st.shownPH = lerp(7, target, t);
      draw();
    });
  }

  async function fillBurette() {
    st.funnel = true;
    draw();
    await wait(250);
    const from = st.level === null ? 54 : st.level;
    await tween(1500, (t) => {
      st.level = lerp(from, -1, t);
      draw();
    });
    st.funnel = false;
    await tween(500, (t) => {
      st.level = lerp(-1, 0, t);
      draw();
    });
    st.level = 0;
    draw();
  }

  // Runs exactly 1 cm³ of acid into the flask, then the swirled flask settles to its new colour.
  async function addOneCm3() {
    st.flowing = true;
    const from = st.acid;
    await tween(900, (t) => {
      st.acid = from + t;
      st.level = st.acid;
      draw();
    });
    st.acid = round(from + 1, 6);
    st.level = st.acid;
    st.flowing = false;
    const before = st.shownPH;
    const after = pHAfter(st.acid);
    await tween(500, (t) => {
      st.shownPH = lerp(before, after, t);
      draw();
    });
    st.shownPH = after;
    draw();
  }

  /* ---------- Results table and graph ---------- */

  function renderTable() {
    el.table.replaceChildren(
      h('thead', null, h('tr', null,
        h('th', { scope: 'col' }, 'Acid added / cm³'),
        h('th', { scope: 'col' }, 'pH'),
        h('th', { scope: 'col' }, 'Colour'))),
      h('tbody', null, st.rows.map((r) => h('tr', null,
        h('td', null, fmt(r.vol, 0)),
        h('td', null, String(r.pH)),
        h('td', null, h('span', { style: `display:inline-block;width:2.4em;height:1em;border-radius:4px;vertical-align:middle;background:${UI[r.pH]}`, title: UI_NAMES[r.pH] }))))));
    if (st.awaiting) el.table.querySelector('tbody').append(h('tr', null, h('td', null, fmt(st.acid, 0)), h('td', { class: 'now' }, ''), h('td', null, '')));
    el.calcs.replaceChildren(...(st.answer !== null ? [h('dl', { class: 'calc-list' }, h('dt', null, 'Neutral at about'), h('dd', null, `${fmt(st.answer, 1)} cm³ of acid`))] : []));
    if (graph) {
      graph.points = st.rows.map((r, i) => ({ x: r.vol, y: r.pH, i }));
      graph.curve = st.rows.length > 2 ? K.smoothCurve(graph.points) : null;
      graph.render();
    }
  }

  let graph = null;
  function makeGraph() {
    graph = new K.Graph({
      title: 'pH against volume of acid added',
      xLabel: 'Volume of acid added / cm³',
      yLabel: 'pH',
      xDomain: [0, MAX_ACID],
      yDomain: [0, 14],
      yStep: 2,
      describe: (p) => [`pH ${p.y}`, `${fmt(p.x, 0)} cm³ of acid`],
    });
    graph.lines = [];
    el.graphBox.replaceChildren(graph.el);
    graph.render();
  }

  // The colour chart: the student taps the colour that matches the flask.
  function pHChart(onPick) {
    const correct = chartPH(st.shownPH);
    let tries = 0;
    const buttons = UI.map((c, pH) => h('button', { type: 'button', style: `background:${c}`, 'aria-label': `pH ${pH}, ${UI_NAMES[pH]}`, onclick: () => pick(pH) }, String(pH)));
    function pick(pH, auto) {
      tries += 1;
      if (Math.abs(pH - correct) <= 1 || auto || tries >= 3) {
        const recorded = Math.abs(pH - correct) <= 1 ? pH : correct;
        for (const b of buttons) b.disabled = true;
        buttons[recorded].classList.add('picked');
        say(auto ? `pH ${recorded} recorded (${UI_NAMES[recorded]}).` : recorded === pH ? `pH ${recorded} recorded.` : `The closest colour is pH ${recorded} (${UI_NAMES[recorded]}). Compare the flask with the chart side by side.`, auto || recorded !== pH ? 'info' : 'good');
        onPick(recorded);
      } else {
        say(pH > correct ? 'Not quite. The flask is a colour further towards the acid (red) end.' : 'Not quite. The flask is a colour further towards the alkali (purple) end.', 'warn');
      }
    }
    const fill = h('button', { type: 'button', class: 'btn btn-quiet btn-small', onclick: () => pick(correct, true) }, 'Fill it in for me');
    const box = h('div', { class: 'reading-field' },
      h('span', { style: 'font:600 0.92rem var(--font-display);color:var(--ink-2)' }, 'Tap the colour that matches the flask'),
      h('div', { class: 'uichart', role: 'group', 'aria-label': 'Universal indicator colour chart, pH 0 to 14' }, buttons),
      h('div', { style: 'display:flex;justify-content:space-between;font-size:0.82rem;color:var(--ink-3)' }, h('span', null, '← acid'), h('span', null, 'neutral'), h('span', null, 'alkali →')),
      h('div', null, fill));
    if (K.isAutofill()) setTimeout(() => pick(correct, true), 350 / K.timeScale);
    return box;
  }

  /* ---------- Steps ---------- */

  const steps = [
    {
      id: 'goggles',
      title: 'Put on safety goggles',
      text: 'Sodium hydroxide and hydrochloric acid can hurt your eyes, even when dilute.',
      why: 'Goggles protect your eyes from splashes. Keep them on until everything is cleared away.',
      enter(box, g) {
        const wear = () => {
          st.goggles = true;
          draw();
          say('Goggles on.', 'good');
          g.next();
        };
        g.hot(['goggles']);
        g.on('goggles', wear);
        box.append(h('div', { class: 'btn-row' }, button('Put on goggles', wear, { primary: true })));
      },
    },
    {
      id: 'alkali',
      title: 'Measure 10 cm³ of sodium hydroxide',
      text: 'Use a measuring cylinder to measure 10 cm³ of sodium hydroxide solution and pour it into the conical flask.',
      why: 'Sodium hydroxide is an alkali. A measuring cylinder lets you use the same volume each time you repeat the experiment.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          await measureAlkali();
          say('10 cm³ of sodium hydroxide is in the flask.', 'good');
          g.next();
        };
        const btn = button('Measure and pour', go, { primary: true });
        g.hot(['cylinder', 'alkali']);
        g.on('cylinder', go);
        g.on('alkali', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'indicator',
      title: 'Add universal indicator',
      text: 'Add a few drops of universal indicator to the flask. The colour shows the pH.',
      why: 'Universal indicator changes through many colours, so you can see the pH change gradually as you add acid.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          await addIndicator();
          say('The solution has turned purple: it is a strong alkali.', 'good');
          g.next();
        };
        const btn = button('Add indicator', go, { primary: true });
        g.hot(['uiBottle']);
        g.on('uiBottle', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'burette',
      title: 'Fill the burette with acid',
      text: 'Use a funnel to fill the burette with dilute hydrochloric acid to the 0 line, then take the funnel out.',
      why: 'The burette lets you add the acid in small, measured amounts. The scale reads downwards from 0 at the top.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          await fillBurette();
          say('The burette is full of acid and reads 0 cm³.', 'good');
          g.next();
        };
        const btn = button('Fill the burette', go, { primary: true });
        g.hot(['acid', 'burette']);
        g.on('acid', go);
        g.on('burette', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'start',
      title: 'Record the starting pH',
      text: 'Compare the colour of the flask with the universal indicator chart and record the pH.',
      why: 'The starting pH is your first result. It shows how alkaline the solution is before any acid is added.',
      enter(box, g) {
        st.awaiting = true;
        renderTable();
        box.append(pHChart((pH) => {
          st.rows.push({ vol: 0, pH });
          st.awaiting = false;
          makeGraph();
          renderTable();
          g.next();
        }));
      },
    },
    {
      id: 'add',
      title: 'Add acid 1 cm³ at a time',
      text: 'Open the tap to add 1 cm³ of acid, swirl the flask, then record the pH from the colour. Keep going until you have added 20 cm³.',
      why: 'Adding the acid in small steps lets you see exactly when the solution becomes neutral. Swirling mixes the acid in so the colour is the same all through the flask.',
      enter(box, g) {
        const round1 = () => {
          box.replaceChildren();
          const n = Math.round(st.acid) + 1;
          g.task(`Addition ${n} of ${MAX_ACID}: add 1 cm³ of acid.`);
          let busy = false;
          const add = async () => {
            if (busy) return;
            busy = true;
            btn.disabled = true;
            g.hot([]);
            await addOneCm3();
            st.awaiting = true;
            renderTable();
            g.task(`Addition ${n} of ${MAX_ACID}: ${fmt(st.acid, 0)} cm³ added. Record the pH.`);
            box.replaceChildren(pHChart((pH) => {
              const before = st.rows[st.rows.length - 1].pH;
              st.rows.push({ vol: round(st.acid, 0), pH });
              st.awaiting = false;
              renderTable();
              if (before >= 9 && pH <= 5) {
                say(`The pH jumped from ${before} to ${pH} with just 1 cm³ of acid. The solution passed through neutral (pH 7) during that addition. Near neutral, a tiny amount of acid changes the pH a lot.`, 'info');
              }
              if (st.acid >= MAX_ACID - 1e-6) {
                say(`All ${MAX_ACID} cm³ added. Your graph is in the Results panel.`, 'good');
                g.next();
              } else round1();
            }));
          };
          const btn = button('Add 1 cm³ of acid', add, { primary: true });
          g.hot(['burette']);
          g.on('burette', add);
          box.append(h('div', { class: 'btn-row' }, btn));
          if (K.isAutofill()) btn.focus({ preventScroll: true });
        };
        round1();
      },
    },
    {
      id: 'neutral',
      title: 'Find the neutral point',
      text: 'Look at your table and graph. About how much acid did it take to make the solution neutral (pH 7, green)?',
      why: 'At the neutral point the acid has exactly cancelled out the alkali: acid + alkali → salt + water. After that, extra acid makes the solution acidic.',
      enter(box, g) {
        const f = K.field({
          label: 'Volume of acid at pH 7',
          unit: 'cm³',
          placeholder: 'e.g. 11',
          say,
          check: (v, attempts) => {
            if (near(v, neutralAt, { abs: 1.0 })) return { ok: true, accepted: v, msg: `Yes: the solution was neutral after about ${fmt(v, 1)} cm³ of acid. The pH dropped fastest around this point.` };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: round(neutralAt, 1), value: fmt(neutralAt, 1), msg: `The solution was neutral after about ${fmt(neutralAt, 1)} cm³ of acid, where the graph drops steeply through pH 7.` };
            if (v > MAX_ACID || v < 0) return { ok: false, tone: 'warn', msg: `Read the volume from the x-axis: it is between 0 and ${MAX_ACID} cm³.` };
            return { ok: false, tone: 'warn', msg: 'Find where your graph crosses pH 7 (the green colour), then read down to the volume axis.' };
          },
          onAccept: (v) => {
            st.answer = v;
            graph.set({ marks: [{ x: v, y: 7, label: 'Neutral (pH 7)' }] });
            renderTable();
            g.next();
          },
        });
        box.append(f.el);
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
    id: 'g6-neutral',
    guide: '../practical.html#g6-neutral',
    objectives: ['I can add acid to an alkali in small steps and track the pH with universal indicator.', 'I can plot pH against volume of acid and find the neutral point.', 'I can describe neutralisation: acid + alkali → salt + water.'],
    steps,
    items: { goggles: el.goggles, cylinder: el.cylinder, alkali: el.alkaliBeaker, uiBottle: el.uiBottle, acid: el.acidBeaker, burette: el.burette },
  });
  const say = lab.say;
  lab.guide.onFinish = () => {
    const first = st.rows[0].pH;
    const last = st.rows[st.rows.length - 1].pH;
    lab.finish({
      title: 'Practical complete',
      summary: `The pH fell from ${first} (alkaline) to ${last} (acidic). It passed through pH 7 (neutral) after about ${fmt(st.answer, 1)} cm³ of acid. Hydrochloric acid + sodium hydroxide → sodium chloride + water.`,
      rows: [
        ['Starting pH', String(first)],
        ['Final pH', String(last)],
        ['Neutral point (yours)', `${fmt(st.answer, 1)} cm³`],
        ['Neutral point (simulation)', `${fmt(neutralAt, 1)} cm³`],
      ],
    });
  };

  renderTable();
  draw();
  lab.guide.start();

  // Read-only view of the simulation for automated tests.
  window.__lab = { st, neutralAt, pHAfter, chartPH };
})();
