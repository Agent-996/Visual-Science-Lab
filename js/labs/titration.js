/* Acid–alkali titration.
   The student fills a burette with 0.100 mol/dm³ hydrochloric acid, pipettes 25.0 cm³ of
   sodium hydroxide of unknown concentration into a conical flask, titrates to the end point
   and works out the concentration of the alkali. */
(function () {
  'use strict';

  const K = window.LabKit;
  const { h, s, button, fmt, round, rand, clamp, lerp, near, tween, wait } = K;

  /* ---------- Chemistry ---------- */

  const ACID_CONC = 0.1; // mol/dm³ HCl in the burette
  const PIPETTE_VOL = 25.0; // cm³ NaOH in the flask
  const DROP = 0.05; // cm³ in one drop from the burette
  const FAST_FLOW = 1.2; // cm³ per second with the tap fully open
  const SLOW_FLOW = 0.1; // cm³ per second when dripping
  const BURETTE_MAX = 50;
  const MIX_SWIRLING = 6; // how quickly added acid mixes in, per second
  const MIX_STILL = 0.35;

  const baseConc = round(rand(0.08, 0.12), 4); // the unknown NaOH concentration, mol/dm³
  const equivalence = (PIPETTE_VOL * baseConc) / ACID_CONC; // cm³ of acid that exactly neutralises it

  // pH of the mixture, including water's own ions so it is smooth through neutral.
  function pHFor(naohVol, acidVol) {
    const volume = (naohVol + acidVol) / 1000;
    if (volume <= 0) return 7;
    const d = (baseConc * naohVol - ACID_CONC * acidVol) / 1000 / volume; // excess OH⁻, mol/dm³
    const root = Math.sqrt(d * d + 4e-14);
    const oh = d >= 0 ? (d + root) / 2 : 2e-14 / (root - d);
    return 14 + Math.log10(oh);
  }

  const WATER = [226, 239, 247, 0.55];
  const PINK = [221, 46, 140, 0.9];
  const YELLOW = [242, 190, 30, 0.88];
  const RED = [212, 44, 40, 0.9];
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const css = (c) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(3)})`;

  const INDICATORS = {
    phenolphthalein: {
      name: 'Phenolphthalein',
      inAlkali: 'pink',
      atEnd: 'colourless',
      bottle: 'rgba(232, 240, 245, 0.95)',
      colour: (pH) => mix(WATER, PINK, 1 / (1 + Math.pow(10, 9.3 - pH))),
      changed: (pH) => pH < 8.2,
    },
    methylOrange: {
      name: 'Methyl orange',
      inAlkali: 'yellow',
      atEnd: 'orange',
      bottle: '#ef9f2a',
      colour: (pH) => mix(YELLOW, RED, 1 / (1 + Math.pow(10, pH - 3.7))),
      changed: (pH) => pH < 4.2,
    },
    universal: { name: 'Universal indicator', bottle: '#4f9d4a' },
  };

  // Volume of acid at which the chosen indicator changes colour.
  function endPointFor(key) {
    const ind = INDICATORS[key];
    let lo = equivalence - 2;
    let hi = equivalence + 2;
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      if (ind.changed(pHFor(PIPETTE_VOL, mid))) hi = mid;
      else lo = mid;
    }
    return hi;
  }

  /* ---------- State ---------- */

  const st = {
    goggles: false,
    funnel: false,
    level: null, // burette reading at the bottom of the meniscus, cm³ (null = empty)
    tipFull: false,
    tap: 'closed',
    swirl: true,
    swirlPhase: 0,
    swirlAmp: 0,
    pending: 0, // acid that has left the burette but not yet formed a drop
    drops: [],
    flask: { naoh: 0, acidMixed: 0, acidUnmixed: 0, indicator: null },
    flaskPos: { x: 210, y: 23 }, // offset from the white tile
    wasteVisible: true,
    waste: 0,
    hclLevel: 1,
    naohLevel: 1,
    pipette: null,
    dropper: null,
    runs: [],
    run: null,
    used: [],
    awaiting: null,
    calcs: [],
  };

  const buretteY = (reading) => 40 + reading * 6;
  const flaskVolume = () => st.flask.naoh + st.flask.acidMixed + st.flask.acidUnmixed;
  const liquidHeight = (v) => (v <= 0.01 ? 0 : clamp(5 + v * 0.44, 0, 40));
  const flaskSurface = () => 476 - liquidHeight(flaskVolume());
  const mixedPH = () => pHFor(st.flask.naoh, st.flask.acidMixed);
  const nearest005 = (x) => Math.round(x * 20) / 20;

  function flaskColour() {
    const ind = INDICATORS[st.flask.indicator];
    if (!ind || !ind.colour || st.flask.naoh <= 0) return WATER;
    return ind.colour(mixedPH());
  }

  // How strongly unmixed acid shows as a patch of end-point colour under the burette tip.
  function patchStrength() {
    const f = st.flask;
    if (!f.indicator || f.acidUnmixed <= 1e-6) return 0;
    const excess = baseConc * f.naoh - ACID_CONC * f.acidMixed;
    if (excess <= 0) return 0;
    return clamp(((ACID_CONC * f.acidUnmixed) / excess) * 2.5, 0, 1);
  }

  /* ---------- Bench drawing ---------- */

  const GLASS = { fill: 'rgba(214, 232, 242, 0.35)', stroke: '#7f97a8', 'stroke-width': 1.5 };
  const ACID_TINT = 'rgba(190, 221, 242, 0.9)';
  const ALKALI_TINT = 'rgba(214, 233, 222, 0.9)';
  const TAP_ANGLE = { closed: 0, slow: 35, fast: 90 };

  const el = {};
  const benchLabel = (x, y, text) => s('text', { class: 'bench-label', x, y, 'text-anchor': 'middle' }, text);
  const hit = (x, y, width, height) => s('rect', { class: 'hit', x, y, width, height, rx: 8 });

  function buildBench() {
    const svg = s('svg', { viewBox: '0 0 720 540', role: 'group', 'aria-label': 'Lab bench: a burette held in a clamp stand above a white tile, beakers of hydrochloric acid and sodium hydroxide, a conical flask, indicator bottles and safety goggles.' });

    svg.append(
      s('rect', { x: 0, y: 0, width: 720, height: 500, fill: '#f6f8f9' }),
      s('rect', { x: 0, y: 500, width: 720, height: 40, fill: '#ddd4c6' }),
      s('line', { x1: 0, x2: 720, y1: 500.5, y2: 500.5, stroke: '#bdb2a1' }),
      benchLabel(40, 518, 'Goggles'),
      benchLabel(120, 518, 'Hydrochloric acid'),
      benchLabel(120, 532, '0.100 mol/dm³'),
      benchLabel(230, 518, 'Sodium hydroxide'),
      benchLabel(230, 532, 'concentration unknown'),
      benchLabel(398, 518, 'Burette and clamp stand'),
      benchLabel(570, 518, 'Conical flask'),
      benchLabel(680, 518, 'Indicators')
    );

    // Clamp stand and white tile
    svg.append(
      s('rect', { x: 296, y: 488, width: 204, height: 12, rx: 3, fill: '#4f5b66' }),
      s('rect', { x: 474, y: 24, width: 8, height: 466, rx: 2, fill: '#8d99a3' }),
      s('rect', { x: 370, y: 69, width: 106, height: 8, rx: 2, fill: '#6b7782' }),
      s('rect', { x: 466, y: 62, width: 24, height: 22, rx: 3, fill: '#59656f' }),
      s('rect', { x: 300, y: 477, width: 120, height: 11, rx: 2, fill: '#ffffff', stroke: '#c9d1d6' })
    );

    // Goggles
    el.goggles = s('g', { 'data-label': 'Safety goggles' },
      s('path', { d: 'M8,486 Q40,468 72,486', fill: 'none', stroke: '#2f3a44', 'stroke-width': 3 }),
      s('rect', { x: 13, y: 478, width: 25, height: 16, rx: 6, fill: 'rgba(170, 210, 235, 0.6)', stroke: '#2f6fb0', 'stroke-width': 2 }),
      s('rect', { x: 42, y: 478, width: 25, height: 16, rx: 6, fill: 'rgba(170, 210, 235, 0.6)', stroke: '#2f6fb0', 'stroke-width': 2 }),
      s('line', { x1: 38, x2: 42, y1: 484, y2: 484, stroke: '#2f6fb0', 'stroke-width': 3 }),
      hit(4, 464, 72, 36));

    // Beakers of acid and alkali
    const beaker = (cx, tint, sticker, labelText) => {
      const liquid = s('rect', { x: cx - 27, width: 54, fill: tint });
      const g = s('g', { 'data-label': labelText },
        liquid,
        s('path', { d: `M${cx - 30},428 L${cx - 28},432 L${cx - 28},496 Q${cx - 28},500 ${cx - 24},500 L${cx + 24},500 Q${cx + 28},500 ${cx + 28},496 L${cx + 28},430`, ...GLASS, fill: 'none' }),
        s('rect', { x: cx - 16, y: 470, width: 32, height: 14, rx: 2, fill: '#fff', stroke: '#c5ced4' }),
        s('text', { x: cx, y: 480.5, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 700, fill: '#33404d', 'font-family': 'Lexend, sans-serif' }, sticker),
        hit(cx - 36, 420, 72, 84));
      return { g, liquid };
    };
    const acid = beaker(120, ACID_TINT, 'HCl', 'Beaker of hydrochloric acid');
    const alkali = beaker(230, ALKALI_TINT, 'NaOH', 'Beaker of sodium hydroxide');
    el.acid = acid.g;
    el.acidLiquid = acid.liquid;
    el.alkali = alkali.g;
    el.alkaliLiquid = alkali.liquid;

    // Indicator bottles
    for (const [key, cx, short] of [['phenolphthalein', 652, 'P'], ['methylOrange', 680, 'MO'], ['universal', 708, 'UI']]) {
      el[key] = s('g', { 'data-label': INDICATORS[key].name + ' bottle' },
        s('ellipse', { cx, cy: 451, rx: 5, ry: 8, fill: '#33373b' }),
        s('rect', { x: cx - 4, y: 458, width: 8, height: 10, fill: '#c9ced2' }),
        s('rect', { x: cx - 11, y: 468, width: 22, height: 32, rx: 4, fill: '#fdfdfd', stroke: '#7f97a8' }),
        s('rect', { x: cx - 9, y: 480, width: 18, height: 18, rx: 2, fill: INDICATORS[key].bottle }),
        s('text', { x: cx, y: 477, 'text-anchor': 'middle', 'font-size': 7, 'font-weight': 700, fill: '#33404d', 'font-family': 'Lexend, sans-serif' }, short),
        hit(cx - 14, 438, 28, 64));
    }

    // Waste beaker on the tile (used while filling the burette tip)
    el.wasteLiquid = s('rect', { x: 337, width: 46, fill: ACID_TINT });
    el.waste = s('g', null,
      el.wasteLiquid,
      s('path', { d: 'M335,436 L335,473 Q335,477 339,477 L381,477 Q385,477 385,473 L385,436', ...GLASS, fill: 'none' }));

    // Conical flask: an outer group moves it, an inner group swirls it
    const clip = s('clipPath', { id: 'flask-inside' }, s('path', { d: 'M347,411 L347,432.5 L307,468 Q301.5,476 310,476 L410,476 Q418.5,476 413,468 L373,432.5 L373,411 Z' }));
    el.flaskLiquid = s('rect', { x: 290, width: 140, 'clip-path': 'url(#flask-inside)' });
    el.patch = s('ellipse', { cx: 360, rx: 15, ry: 5, 'clip-path': 'url(#flask-inside)' });
    el.flaskSwirl = s('g', null,
      el.flaskLiquid,
      el.patch,
      s('path', { d: 'M346,410 L346,432 L306,467 Q299,477 310,477 L410,477 Q421,477 414,467 L374,432 L374,410', ...GLASS }),
      s('rect', { x: 343, y: 406, width: 34, height: 5, rx: 2, fill: 'rgba(214, 232, 242, 0.6)', stroke: '#7f97a8' }));
    el.flask = s('g', { 'data-label': 'Conical flask' }, el.flaskSwirl, hit(294, 400, 132, 80));

    // Burette
    el.buretteLiquid = s('rect', { x: 352.5, width: 15, fill: ACID_TINT });
    el.meniscus = s('path', { fill: 'none', stroke: '#5f88a3', 'stroke-width': 1 });
    el.tipLiquid = s('path', { d: 'M356.5,386 L363.5,386 L360.9,416 L359.1,416 Z', fill: ACID_TINT });
    const scale = s('g', null);
    for (let v = 0; v <= BURETTE_MAX; v++) {
      const y = buretteY(v);
      const len = v % 10 === 0 ? 9 : v % 5 === 0 ? 6 : 3.5;
      scale.append(s('line', { x1: 351, x2: 351 + len, y1: y, y2: y, stroke: '#2d3a45', 'stroke-width': v % 5 === 0 ? 1 : 0.6 }));
      if (v % 10 === 0) scale.append(s('text', { class: 'scale-text', x: 347, y: y + 3, 'text-anchor': 'end' }, String(v)));
    }
    el.tapHandle = s('rect', { x: 334, y: 376, width: 52, height: 6, rx: 3, fill: '#2f6fb0' });
    el.funnel = s('path', { d: 'M334,2 L386,2 L365,22 L365,34 L355,34 L355,22 Z', ...GLASS, fill: 'rgba(214, 232, 242, 0.75)' });
    el.burette = s('g', { 'data-label': 'Top of the burette' },
      el.buretteLiquid,
      el.meniscus,
      s('rect', { x: 351, y: 18, width: 18, height: 354, ...GLASS }),
      scale,
      s('rect', { x: 340, y: 62, width: 40, height: 22, rx: 5, fill: 'none', stroke: '#59656f', 'stroke-width': 4 }),
      hit(326, 0, 68, 126));
    el.tap = s('g', { 'data-label': 'Burette tap' },
      el.tipLiquid,
      s('path', { d: 'M355,386 L365,386 L361.6,418 L358.4,418 Z', ...GLASS }),
      s('rect', { x: 348, y: 372, width: 24, height: 14, rx: 3, fill: '#e9eef2', stroke: '#7f97a8' }),
      el.tapHandle,
      hit(326, 364, 68, 30));

    el.stream = s('line', { x1: 360, x2: 360, y1: 418, stroke: ACID_TINT, 'stroke-width': 2.2, 'stroke-linecap': 'round' });
    el.drops = s('g', null);

    // Pipette with filler (shown while it is in use)
    const pipClip = s('clipPath', { id: 'pipette-inside' },
      s('rect', { x: -1.5, y: 290, width: 3, height: 186 }),
      s('ellipse', { cx: 0, cy: 380, rx: 7, ry: 21 }));
    el.pipetteLiquid = s('rect', { x: -9, width: 18, fill: ALKALI_TINT.replace('0.9', '1'), 'clip-path': 'url(#pipette-inside)' });
    el.pipette = s('g', { visibility: 'hidden' },
      el.pipetteLiquid,
      s('rect', { x: -2, y: 290, width: 4, height: 70, ...GLASS }),
      s('ellipse', { cx: 0, cy: 380, rx: 8, ry: 22, ...GLASS }),
      s('rect', { x: -2, y: 400, width: 4, height: 62, ...GLASS }),
      s('path', { d: 'M-2,462 L2,462 L0.7,476 L-0.7,476 Z', ...GLASS }),
      s('line', { x1: -6, x2: 6, y1: 322, y2: 322, stroke: '#1f2a33', 'stroke-width': 1.2 }),
      s('rect', { x: -8, y: 262, width: 16, height: 30, rx: 6, fill: '#2f6fb0' }));

    // Indicator dropper (shown while adding indicator)
    el.dropper = s('g', { visibility: 'hidden' },
      s('ellipse', { cx: 0, cy: 368, rx: 5, ry: 9, fill: '#33373b' }),
      s('path', { d: 'M-3,376 L3,376 L1,404 L-1,404 Z', ...GLASS }));

    svg.append(
      s('defs', null, clip, pipClip),
      el.goggles, el.acid, el.alkali,
      el.phenolphthalein, el.methylOrange, el.universal,
      el.waste, el.stream, el.flask, el.drops,
      el.funnel, el.burette, el.tap,
      el.pipette, el.dropper
    );

    el.status = h('div', { class: 'bench-status', 'aria-live': 'polite' });
    const bench = document.getElementById('bench');
    bench.append(svg, el.status);
  }

  let lastStatus = '';
  function draw() {
    // Burette
    if (st.level === null) {
      el.buretteLiquid.setAttribute('height', 0);
      el.meniscus.setAttribute('d', '');
    } else {
      const y = buretteY(st.level);
      el.buretteLiquid.setAttribute('y', y);
      el.buretteLiquid.setAttribute('height', Math.max(0, 372 - y));
      el.meniscus.setAttribute('d', `M352.5,${y - 1.4} Q360,${y + 1.8} 367.5,${y - 1.4}`);
    }
    el.tipLiquid.setAttribute('opacity', st.tipFull ? 1 : 0);
    el.tapHandle.setAttribute('transform', `rotate(${TAP_ANGLE[st.tap]} 360 379)`);
    el.funnel.setAttribute('visibility', st.funnel ? 'visible' : 'hidden');

    // Beakers
    el.acidLiquid.setAttribute('y', lerp(484, 452, st.hclLevel));
    el.acidLiquid.setAttribute('height', 499 - lerp(484, 452, st.hclLevel));
    el.alkaliLiquid.setAttribute('y', lerp(484, 452, st.naohLevel));
    el.alkaliLiquid.setAttribute('height', 499 - lerp(484, 452, st.naohLevel));
    el.goggles.setAttribute('visibility', st.goggles ? 'hidden' : 'visible');

    // Waste beaker
    el.waste.setAttribute('visibility', st.wasteVisible ? 'visible' : 'hidden');
    const wasteTop = 476 - clamp(3 + st.waste * 4, 0, 30);
    el.wasteLiquid.setAttribute('y', wasteTop);
    el.wasteLiquid.setAttribute('height', 476 - wasteTop);

    // Flask
    const angle = st.swirlAmp * Math.sin(st.swirlPhase);
    el.flask.setAttribute('transform', `translate(${st.flaskPos.x} ${st.flaskPos.y})`);
    el.flaskSwirl.setAttribute('transform', `rotate(${angle.toFixed(2)} 360 477)`);
    const surface = flaskSurface();
    el.flaskLiquid.setAttribute('y', surface);
    el.flaskLiquid.setAttribute('height', Math.max(0, 480 - surface));
    el.flaskLiquid.setAttribute('fill', css(flaskColour()));
    const patch = patchStrength();
    const ind = INDICATORS[st.flask.indicator];
    el.patch.setAttribute('cy', surface + 4);
    el.patch.setAttribute('fill', ind && ind.colour ? css(ind.colour(2.5)) : 'none');
    el.patch.setAttribute('opacity', patch.toFixed(3));

    // Acid on its way down
    const atTile = st.flaskPos.x === 0 && st.flaskPos.y === 0;
    const landing = atTile && !st.wasteVisible ? surface : st.wasteVisible ? wasteTop : 476;
    const streaming = st.tap === 'fast' && st.level !== null && st.level < BURETTE_MAX;
    el.stream.setAttribute('visibility', streaming ? 'visible' : 'hidden');
    el.stream.setAttribute('y2', landing);
    el.drops.replaceChildren(...st.drops.map((d) => s('circle', { cx: d.x, cy: lerp(d.y0, d.y1, d.t * d.t), r: d.r, fill: d.colour })));

    // Pipette and dropper
    if (st.pipette) {
      el.pipette.setAttribute('visibility', 'visible');
      el.pipette.setAttribute('transform', `translate(${st.pipette.x} ${-st.pipette.lift})`);
      const top = lerp(476, 322, st.pipette.fill);
      el.pipetteLiquid.setAttribute('y', top);
      el.pipetteLiquid.setAttribute('height', Math.max(0, 477 - top));
    } else {
      el.pipette.setAttribute('visibility', 'hidden');
    }
    if (st.dropper) {
      el.dropper.setAttribute('visibility', 'visible');
      el.dropper.setAttribute('transform', `translate(${st.dropper.x} 0)`);
    } else {
      el.dropper.setAttribute('visibility', 'hidden');
    }

    mag.update(st.level === null ? null : st.level);

    const status = (st.goggles ? 'Goggles on' : '') + '|' + (ind && ind.colour ? ind.name : '');
    if (status !== lastStatus) {
      lastStatus = status;
      el.status.replaceChildren(...status.split('|').filter(Boolean).map((t) => h('span', null, t)));
    }
  }

  /* ---------- Simulation loop ---------- */

  function spawnDrop(vol, x = 360, y0 = 418, colour = 'rgba(150, 196, 228, 0.95)', into = 'auto') {
    const atTile = st.flaskPos.x === 0 && st.flaskPos.y === 0 && !st.wasteVisible;
    const target = into === 'auto' ? (atTile ? 'flask' : 'waste') : into;
    const y1 = target === 'flask' ? flaskSurface() + st.flaskPos.y : target === 'waste' ? 470 : flaskSurface() + st.flaskPos.y;
    st.drops.push({ x, y0, y1, t: 0, vol, target, colour, r: vol >= DROP * 0.6 ? 2.6 : 1.8 });
  }

  function deliver(vol, target) {
    if (target === 'flask') st.flask.acidUnmixed += vol;
    else if (target === 'waste') st.waste += vol;
  }

  function setTap(mode) {
    if (mode === st.tap) return;
    if (st.tap === 'slow' && st.pending > 1e-6) {
      spawnDrop(st.pending);
      st.pending = 0;
    }
    st.tap = mode;
    for (const [m, b] of Object.entries(tapButtons)) b.setAttribute('aria-pressed', String(m === mode));
  }

  let tapButtons = {};
  let last = performance.now();

  function update(now) {
    const dt = Math.min(0.05, (now - last) / 1000) * K.timeScale;
    last = now;

    if (st.tap !== 'closed' && st.level !== null && !st.animating) {
      let dv = (st.tap === 'fast' ? FAST_FLOW : SLOW_FLOW) * dt;
      dv = Math.min(dv, BURETTE_MAX - st.level);
      st.level += dv;
      if (st.tap === 'fast') {
        const atTile = st.flaskPos.x === 0 && st.flaskPos.y === 0 && !st.wasteVisible;
        deliver(dv, atTile ? 'flask' : 'waste');
      } else {
        st.pending += dv;
        while (st.pending >= DROP) {
          st.pending -= DROP;
          spawnDrop(DROP);
        }
      }
      if (st.level >= BURETTE_MAX - 1e-9) {
        st.level = BURETTE_MAX;
        setTap('closed');
        say('The burette has run out of acid. Close the tap sooner next time: watch the colour of the flask.', 'bad');
      }
    }

    for (const d of st.drops) d.t += dt / 0.28;
    const landed = st.drops.filter((d) => d.t >= 1);
    if (landed.length) {
      st.drops = st.drops.filter((d) => d.t < 1);
      for (const d of landed) deliver(d.vol, d.target);
    }

    const f = st.flask;
    if (f.acidUnmixed > 0) {
      const rate = st.swirl ? MIX_SWIRLING : MIX_STILL;
      const moved = f.acidUnmixed * (1 - Math.exp(-rate * dt));
      f.acidUnmixed -= moved;
      f.acidMixed += moved;
      if (f.acidUnmixed < 5e-4) {
        f.acidMixed += f.acidUnmixed;
        f.acidUnmixed = 0;
      }
    }

    const busy = st.tap !== 'closed' || st.drops.length > 0 || f.acidUnmixed > 0.002;
    const targetAmp = st.swirl && busy && st.flaskPos.x === 0 ? 3 : 0;
    st.swirlAmp += (targetAmp - st.swirlAmp) * Math.min(1, dt * 4);
    st.swirlPhase += dt * 9;

    if (st.run && st.run.phase === 'titrating') watchEndPoint();
    draw();
    requestAnimationFrame(update);
  }

  function watchEndPoint() {
    const run = st.run;
    const ind = INDICATORS[st.flask.indicator];
    if (patchStrength() > 0.5) run.flashSeen = true;
    if (!run.closeHint && st.tap !== 'closed' && ind.changed(mixedPH())) {
      run.closeHint = true;
      say(`The solution has turned ${ind.atEnd}. Close the tap now.`, 'warn');
    }
    if (!run.swirlHint && !st.swirl && st.tap === 'closed' && st.flask.acidUnmixed > 0.01) {
      run.swirlHint = true;
      say('Swirl the flask to mix in the acid you have added.', 'info');
    }
    const settled = st.tap === 'closed' && st.drops.length === 0 && st.pending < 1e-6 && st.flask.acidUnmixed === 0;
    if (!settled) return;
    if (ind.changed(mixedPH())) {
      run.phase = 'ended';
      run.added = st.level - run.start;
      run.overshoot = run.added - endPointFor(st.flask.indicator);
      say(`End point: the solution has turned ${ind.atEnd}. Now read the burette.`, 'good');
      const next = run.onEnd;
      run.onEnd = null;
      setTimeout(next, 0);
    } else if (run.flashSeen && !run.flashNoted) {
      run.flashNoted = true;
      say(`The colour flashed ${ind.atEnd} and then went back when you swirled. You are close to the end point, so add the acid one drop at a time.`, 'info');
    }
  }

  /* ---------- Equipment actions ---------- */

  async function fillBurette() {
    st.funnel = true;
    draw();
    await wait(250);
    const from = st.level === null ? 54 : st.level;
    const target = -rand(0.8, 1.6);
    const hclFrom = st.hclLevel;
    await tween(1600, (t) => {
      st.level = lerp(from, target, t);
      st.hclLevel = Math.max(0.15, lerp(hclFrom, hclFrom - 0.08, t));
    });
  }

  async function runTip() {
    st.animating = true;
    st.tap = 'fast';
    st.tipFull = true;
    const from = st.level;
    const target = rand(0.05, 0.95);
    const wasteFrom = st.waste;
    await tween(1500, (t) => {
      st.level = lerp(from, target, t);
      st.waste = wasteFrom + (target - from) * t;
    });
    st.tap = 'closed';
    st.animating = false;
  }

  async function pipetteAlkali(quick) {
    const k = quick ? 0.55 : 1;
    st.pipette = { x: 230, fill: 0, lift: 0 };
    const naohFrom = st.naohLevel;
    await tween(1100 * k, (t) => {
      st.pipette.fill = t;
      st.naohLevel = Math.max(0.15, lerp(naohFrom, naohFrom - 0.1, t));
    });
    await tween(1300 * k, (t) => {
      const rise = clamp(t / 0.3, 0, 1);
      const fall = clamp((t - 0.7) / 0.3, 0, 1);
      st.pipette.lift = 75 * (rise - fall);
      st.pipette.x = lerp(230, 570, clamp((t - 0.3) / 0.4, 0, 1));
    });
    await tween(1300 * k, (t) => {
      st.pipette.fill = 1 - t;
      st.flask.naoh = PIPETTE_VOL * t;
    });
    st.flask.naoh = PIPETTE_VOL;
    st.pipette = null;
  }

  async function addIndicator(key, quick) {
    const k = quick ? 0.5 : 1;
    st.dropper = { x: 570 };
    for (let i = 0; i < 3; i++) {
      const drop = { x: 570, y0: 404, y1: flaskSurface() + st.flaskPos.y, t: 0, vol: 0, target: 'none', colour: INDICATORS[key].bottle, r: 2.4 };
      st.drops.push(drop);
      await wait(320 * k);
    }
    await wait(250 * k);
    st.flask.indicator = key;
    st.dropper = null;
  }

  async function moveFlask(to) {
    const from = { ...st.flaskPos };
    const target = to === 'tile' ? { x: 0, y: 0 } : { x: 210, y: 23 };
    if (to === 'tile') st.wasteVisible = false;
    await tween(1100, (t) => {
      st.flaskPos.x = lerp(from.x, target.x, t);
      st.flaskPos.y = lerp(from.y, target.y, t) - Math.sin(t * Math.PI) * 40;
    });
    st.flaskPos = target;
    if (to === 'side') st.wasteVisible = true;
  }

  async function setUpAgain() {
    say('Refilling the burette, rinsing the flask with distilled water, then pipetting 25.0 cm³ of sodium hydroxide and adding indicator.', 'info');
    await moveFlask('side');
    await tween(500, (t) => {
      const keep = 1 - t;
      st.flask.naoh *= keep;
      st.flask.acidMixed *= keep;
    });
    st.flask = { naoh: 0, acidMixed: 0, acidUnmixed: 0, indicator: st.flask.indicator };
    const ind = st.flask.indicator;
    st.flask.indicator = null;
    await fillBurette();
    st.funnel = false;
    await wait(200);
    await runTip();
    await pipetteAlkali(true);
    await addIndicator(ind, true);
    await moveFlask('tile');
  }

  /* ---------- Runs, readings and the results table ---------- */

  function startRun(rough) {
    const accurateCount = st.runs.filter((r) => !r.rough).length;
    st.run = {
      label: rough ? 'Rough' : String(accurateCount + 1),
      rough,
      start: st.level,
      initial: null,
      final: null,
      titre: null,
      overshoot: 0,
      concordant: false,
      phase: 'initial',
    };
    st.runs.push(st.run);
    renderTable();
  }

  function checkReading(v, attempts) {
    const actual = st.level;
    if (near(v, actual, { abs: 0.05 })) {
      return { ok: true, accepted: round(v, 2), value: fmt(v, 2), msg: `Recorded ${fmt(v, 2)} cm³.` };
    }
    if (attempts >= 3) {
      const answer = nearest005(actual);
      return { ok: true, tone: 'info', accepted: answer, value: fmt(answer, 2), msg: `The reading is ${fmt(answer, 2)} cm³. In the magnified view, find the lowest point of the curved meniscus and read the scale level with it.` };
    }
    if (Math.abs(actual - 25) > 2 && near(v, 50 - actual, { abs: 0.4 })) {
      return { ok: false, tone: 'warn', msg: 'A burette scale starts at 0.00 at the top, and the numbers get bigger as you go down.' };
    }
    if (Math.abs(v - actual) <= 0.25) {
      return { ok: false, tone: 'warn', msg: 'Close, but not quite. Each small division is 0.10 cm³. Read level with the bottom of the meniscus.' };
    }
    return { ok: false, msg: 'Not quite. Find the bottom of the curved meniscus in the magnified view and read the scale level with it.' };
  }

  function readingStep(box, which, done) {
    st.run.phase = which;
    st.awaiting = which;
    renderTable();
    const f = K.field({
      label: which === 'initial' ? 'Initial burette reading' : 'Final burette reading',
      unit: 'cm³',
      placeholder: 'e.g. 0.35',
      say,
      check: checkReading,
      onAccept: (v) => {
        st.run[which] = v;
        st.awaiting = null;
        renderTable();
        done();
      },
    });
    box.append(h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, f.el,
      h('p', { class: 'status-line' }, 'Read the bottom of the meniscus. Give 2 decimal places, ending in 0 or 5.'))));
    f.focus();
  }

  function titrationControls(box, onEnd) {
    st.run.phase = 'titrating';
    st.run.onEnd = onEnd;
    tapButtons = {
      fast: button('Open tap fully', () => setTap('fast')),
      slow: button('Drip slowly', () => setTap('slow')),
      closed: button('Close tap', () => setTap('closed')),
    };
    for (const [m, b] of Object.entries(tapButtons)) b.setAttribute('aria-pressed', String(m === st.tap));
    const dropBtn = button('Add one drop', () => {
      if (st.tap !== 'closed') setTap('closed');
      if (st.level >= BURETTE_MAX) return;
      const vol = Math.min(DROP, BURETTE_MAX - st.level);
      st.level += vol;
      spawnDrop(vol);
    });
    const swirl = h('input', { type: 'checkbox', checked: st.swirl, onchange: (e) => { st.swirl = e.target.checked; } });
    box.append(h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' },
      h('div', { class: 'btn-row' }, tapButtons.fast, tapButtons.slow, tapButtons.closed),
      h('div', { class: 'btn-row' }, dropBtn),
      h('label', { class: 'check' }, swirl, 'Swirl the flask while adding acid'),
      h('p', { class: 'status-line' }, 'Tip: you can also click the burette tap on the bench.'))));
  }

  function completeRun() {
    const run = st.run;
    run.titre = round(run.final - run.initial, 2);
    run.phase = 'done';
    if (!run.rough) {
      const set = concordantSet();
      for (const r of st.runs) r.concordant = set.includes(r);
    }
    renderTable();
  }

  // The biggest group of accurate titres that all lie within 0.10 cm³ of each other.
  function concordantSet() {
    const acc = st.runs.filter((r) => !r.rough && r.titre !== null).sort((a, b) => a.titre - b.titre);
    let best = [];
    for (let i = 0; i < acc.length; i++) {
      let j = i;
      while (j + 1 < acc.length && acc[j + 1].titre - acc[i].titre <= 0.1 + 1e-9) j++;
      const group = acc.slice(i, j + 1);
      const range = group[group.length - 1].titre - group[0].titre;
      const bestRange = best.length ? best[best.length - 1].titre - best[0].titre : Infinity;
      if (group.length > best.length || (group.length === best.length && range < bestRange)) best = group;
    }
    return best.length >= 2 ? best : [];
  }

  function renderTable() {
    const runs = st.runs;
    const cols = Math.max(4, runs.length);
    const cells = (fn) => Array.from({ length: cols }, (_, i) => fn(runs[i], i));
    const value = (r, key) => {
      const now = r === st.run && st.awaiting === key;
      const v = r ? r[key] : null;
      const flag = key === 'titre' && r && !r.rough && r.titre !== null && r.overshoot > 0.1;
      return h('td', { class: now ? 'now' : flag ? 'flag' : null, title: flag ? 'Went past the end point' : null }, v === null || v === undefined ? '' : fmt(v, 2));
    };
    el.table.replaceChildren(
      h('thead', null, h('tr', null,
        h('th', { scope: 'col' }, h('span', { class: 'visually-hidden' }, 'Measurement')),
        cells((r, i) => h('th', { scope: 'col' }, i === 0 ? 'Rough' : String(i))))),
      h('tbody', null,
        h('tr', null, h('th', { scope: 'row' }, 'Final reading / cm³'), cells((r) => value(r, 'final'))),
        h('tr', null, h('th', { scope: 'row' }, 'Initial reading / cm³'), cells((r) => value(r, 'initial'))),
        h('tr', null, h('th', { scope: 'row' }, 'Titre / cm³'), cells((r) => value(r, 'titre'))),
        h('tr', null, h('th', { scope: 'row' }, 'Concordant?'), cells((r) => {
          if (!r || r.titre === null) return h('td', null, '');
          if (r.rough) return h('td', { class: 'muted' }, '–');
          return h('td', { class: r.concordant ? 'good' : 'muted' }, r.concordant ? '✓' : '✗');
        })))
    );
    el.calcs.replaceChildren(...(st.calcs.length ? [h('dl', { class: 'calc-list' }, st.calcs.map(([k, v]) => [h('dt', null, k), h('dd', null, v)]))] : []));
  }

  function addCalc(name, text) {
    st.calcs.push([name, text]);
    renderTable();
  }

  /* ---------- Steps ---------- */

  const mag = new K.Magnifier({ kind: 'burette', label: 'Close-up of the burette scale around the meniscus', span: 2.4, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: BURETTE_MAX, liquid: '#cfe5f4' });

  const steps = [
    {
      id: 'goggles',
      title: 'Put on safety goggles',
      text: 'Hydrochloric acid and sodium hydroxide are both irritants. Protect your eyes before you start.',
      why: 'Even dilute acid or alkali can hurt your eyes if it splashes. Goggles stay on for the whole practical.',
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
      id: 'fill',
      title: 'Fill the burette with acid',
      text: 'Use a funnel to pour hydrochloric acid into the burette until it is just above the 0.00 line. Take the funnel out, then let a little acid run through the tap into the waste beaker so the tip is full.',
      why: 'A funnel left in the top can drip acid in later and change your reading. Running some acid through fills the tip and pushes out the air bubble, which would otherwise be counted as acid you added.',
      enter(box, g) {
        const phases = [
          { task: 'Put the funnel in the top of the burette.', label: 'Put the funnel in', item: 'burette', run: async () => { st.funnel = true; await wait(200); } },
          { task: 'Pour hydrochloric acid in until the level is just above the 0.00 line.', label: 'Pour in the acid', item: 'acid', run: fillBurette },
          { task: 'Take the funnel out of the burette.', label: 'Take the funnel out', item: 'burette', run: async () => { st.funnel = false; await wait(200); } },
          { task: 'Open the tap to run a little acid into the waste beaker, so the tip fills up.', label: 'Run acid through the tap', item: 'tap', run: runTip },
        ];
        let i = 0;
        let busy = false;
        const btn = button('', () => doPhase(), { primary: true });
        box.append(h('div', { class: 'btn-row' }, btn));
        const show = () => {
          const p = phases[i];
          g.task(p.task);
          btn.textContent = p.label;
          btn.disabled = false;
          g.handlers = {};
          g.on(p.item, doPhase);
          g.hot([p.item]);
        };
        async function doPhase() {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          await phases[i].run();
          busy = false;
          i += 1;
          if (i < phases.length) show();
          else {
            say('The burette is full and the tip has no air bubble.', 'good');
            g.next();
          }
        }
        show();
      },
    },
    {
      id: 'pipette',
      title: 'Measure 25.0 cm³ of alkali',
      text: 'Use a pipette filler to draw sodium hydroxide up the pipette until the bottom of the meniscus sits on the line. Then let it run into the conical flask.',
      why: 'A pipette delivers one fixed volume very accurately. Never suck liquid up with your mouth: the pipette filler keeps the alkali away from you.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          await pipetteAlkali(false);
          say('25.0 cm³ of sodium hydroxide is in the conical flask.', 'good');
          g.next();
        };
        const btn = button('Use the pipette', go, { primary: true });
        g.hot(['alkali']);
        g.on('alkali', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'indicator',
      title: 'Add a few drops of indicator',
      text: 'Choose an indicator and add 3 drops to the alkali in the flask.',
      why: 'The indicator shows the end point: the moment the acid has exactly neutralised the alkali. Phenolphthalein and methyl orange change colour suddenly, which is what a titration needs.',
      enter(box, g) {
        let busy = false;
        const choose = async (key) => {
          if (busy) return;
          if (key === 'universal') {
            say('Universal indicator changes gradually through lots of colours, so you cannot see one exact end point. Choose an indicator with a single, sharp colour change.', 'warn');
            return;
          }
          busy = true;
          for (const b of box.querySelectorAll('button')) b.disabled = true;
          g.hot([]);
          await addIndicator(key, false);
          const ind = INDICATORS[key];
          say(`The solution is ${ind.inAlkali}, because ${ind.name.toLowerCase()} is ${ind.inAlkali} in alkali. It will turn ${ind.atEnd} at the end point.`, 'good');
          g.next();
        };
        g.hot(['phenolphthalein', 'methylOrange', 'universal']);
        for (const key of ['phenolphthalein', 'methylOrange', 'universal']) g.on(key, () => choose(key));
        box.append(h('div', { class: 'btn-row' },
          button('Phenolphthalein', () => choose('phenolphthalein')),
          button('Methyl orange', () => choose('methylOrange')),
          button('Universal indicator', () => choose('universal'))));
      },
    },
    {
      id: 'tile',
      title: 'Put the flask under the burette',
      text: 'Take away the waste beaker and stand the conical flask on the white tile, under the burette tip.',
      why: 'Against a white tile, even a small colour change is easy to see.',
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          g.hot([]);
          await moveFlask('tile');
          g.next();
        };
        const btn = button('Move the flask', go, { primary: true });
        g.hot(['flask']);
        g.on('flask', go);
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    },
    {
      id: 'initial',
      title: 'Read the burette',
      text: 'With your eye level with the meniscus, read the scale at the bottom of the curve. Give the reading to 2 decimal places, ending in 0 or 5 (for example 0.35).',
      why: 'The scale reads downwards from 0.00 at the top. Each small division is 0.10 cm³, so you can estimate to the nearest 0.05 cm³.',
      enter(box, g) {
        startRun(true);
        readingStep(box, 'initial', () => g.next());
      },
    },
    {
      id: 'rough',
      title: 'Do a rough titration',
      text: 'Open the tap and let the acid run in quickly while swirling the flask. Close the tap as soon as the colour changes and stays changed.',
      why: 'The rough titration tells you roughly how much acid is needed. In the accurate titrations you can then add it quickly at first and slowly near the end point.',
      enter(box, g) {
        g.hot(['tap']);
        g.on('tap', cycleTap);
        titrationControls(box, () => g.next());
      },
    },
    {
      id: 'final',
      title: 'Read the burette again',
      text: 'Take the final reading in the same way. The titre is the final reading minus the initial reading.',
      why: 'The titre is the volume of acid needed to neutralise 25.0 cm³ of the alkali.',
      enter(box, g) {
        readingStep(box, 'final', () => {
          completeRun();
          const rough = st.runs[0];
          say(`Your rough titre is ${fmt(rough.titre, 2)} cm³. In the accurate titrations, add acid quickly until you have added about ${fmt(Math.max(0, rough.titre - 2), 1)} cm³, then go drop by drop.`, 'good');
          g.next();
        });
      },
    },
    {
      id: 'accurate',
      title: 'Do accurate titrations until two agree',
      text: 'Refill and set up again. Run the acid in quickly until you are about 2 cm³ short of your rough titre, then add it one drop at a time, swirling, until one drop makes the colour change. Repeat until two titres are within 0.10 cm³ of each other.',
      why: 'Titres within 0.10 cm³ of each other are concordant: they show your results are repeatable. Going drop by drop near the end point stops you overshooting.',
      enter(box, g) {
        g.on('tap', cycleTap);
        accurateRound(box, g);
      },
    },
    {
      id: 'mean',
      title: 'Work out the mean titre',
      text: 'Add up your concordant titres (the ones with a tick) and divide by how many there are. Leave out the rough titre.',
      why: 'The mean of repeat results reduces the effect of small random errors.',
      enter(box, g) {
        const used = st.used;
        const mean = used.reduce((a, r) => a + r.titre, 0) / used.length;
        const all = st.runs.filter((r) => !r.rough);
        const withRough = st.runs.reduce((a, r) => a + r.titre, 0) / st.runs.length;
        const allMean = all.reduce((a, r) => a + r.titre, 0) / all.length;
        const f = K.field({
          label: 'Mean titre',
          unit: 'cm³',
          placeholder: 'e.g. 24.35',
          say,
          check: (v, attempts) => {
            if (near(v, mean, { abs: 0.011 })) return { ok: true, accepted: v, msg: `Mean titre = ${fmt(v, 2)} cm³.` };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: round(mean, 2), value: fmt(mean, 2), msg: `Mean titre = (${used.map((r) => fmt(r.titre, 2)).join(' + ')}) ÷ ${used.length} = ${fmt(mean, 2)} cm³.` };
            if (near(v, withRough, { abs: 0.011 })) return { ok: false, tone: 'warn', msg: 'Leave out the rough titre: it was only a guide.' };
            if (all.length > used.length && near(v, allMean, { abs: 0.011 })) return { ok: false, tone: 'warn', msg: 'Only use the concordant titres, the ones with a tick.' };
            return { ok: false, msg: `Add the ticked titres together, then divide by ${used.length}.` };
          },
          onAccept: (v) => {
            st.mean = v;
            addCalc('Mean titre', `${fmt(v, 2)} cm³`);
            g.next();
          },
        });
        box.append(f.el);
        f.focus();
      },
    },
    {
      id: 'calculate',
      title: 'Calculate the concentration',
      text: 'Use your mean titre to work out the concentration of the sodium hydroxide, one stage at a time.',
      why: 'HCl and NaOH react in a 1 : 1 ratio, so the number of moles of NaOH in the flask equals the number of moles of HCl you added from the burette.',
      enter(box, g) {
        const stages = [
          {
            label: 'Moles of HCl added',
            unit: 'mol',
            formula: 'moles = concentration (mol/dm³) × volume (dm³)\nvolume in dm³ = volume in cm³ ÷ 1000',
            expected: () => (ACID_CONC * st.mean) / 1000,
            hints: (v, exp) => (near(v, exp * 1000, { rel: 0.02 }) ? 'Convert the volume to dm³ first: divide cm³ by 1000.' : null),
            name: 'Moles of HCl',
          },
          {
            label: 'Moles of NaOH in the flask',
            unit: 'mol',
            formula: 'HCl + NaOH → NaCl + H₂O\n1 mole of HCl reacts with 1 mole of NaOH',
            expected: () => st.molesAcid,
            hints: (v, exp) => (near(v, exp * 2, { rel: 0.02 }) || near(v, exp / 2, { rel: 0.02 }) ? 'Look at the equation again: the ratio is 1 : 1.' : null),
            name: 'Moles of NaOH',
          },
          {
            label: 'Concentration of NaOH',
            unit: 'mol/dm³',
            formula: 'concentration = moles ÷ volume (dm³)\n25.0 cm³ = 0.0250 dm³',
            expected: () => st.molesBase / 0.025,
            hints: (v, exp) => (near(v, exp / 1000, { rel: 0.02 }) ? 'Use the volume in dm³: 25.0 cm³ is 0.0250 dm³.' : null),
            name: 'Concentration of NaOH',
          },
        ];
        let i = 0;
        const runStage = () => {
          const stage = stages[i];
          const exp = stage.expected();
          g.task(`Stage ${i + 1} of 3: ${stage.label.toLowerCase()}.`);
          const f = K.field({
            label: stage.label,
            unit: stage.unit,
            placeholder: i === 2 ? 'e.g. 0.097' : 'e.g. 2.4e-3',
            say,
            check: (v, attempts) => {
              if (near(v, exp, { rel: 0.01 })) return { ok: true, accepted: v, msg: `${stage.label}: ${K.fmtSci(v, 3)} ${stage.unit}.` };
              if (attempts >= 3) return { ok: true, tone: 'info', accepted: exp, value: K.fmtSci(exp, 3), msg: `${stage.label} = ${K.fmtSci(exp, 3)} ${stage.unit}.` };
              return { ok: false, tone: 'warn', msg: stage.hints(v, exp) || 'Not quite. Use the formula shown and check each number.' };
            },
            onAccept: (v) => {
              addCalc(stage.name, `${K.fmtSci(v, 3)} ${stage.unit}`);
              if (i === 0) st.molesAcid = v;
              if (i === 1) st.molesBase = v;
              if (i === 2) st.answer = v;
              i += 1;
              box.replaceChildren();
              if (i < stages.length) runStage();
              else g.next();
            },
          });
          box.append(h('pre', { class: 'formula' }, stage.formula), f.el);
          f.focus();
        };
        runStage();
      },
    },
  ];

  function cycleTap() {
    if (!st.run || st.run.phase !== 'titrating') {
      say('Only open the tap when you are titrating. Follow the current step first.', 'info');
      return;
    }
    setTap(st.tap === 'closed' ? 'slow' : st.tap === 'slow' ? 'fast' : 'closed');
  }

  function accurateRound(box, g) {
    const n = st.runs.filter((r) => !r.rough).length + 1;
    const rough = st.runs[0];
    box.replaceChildren();
    g.task(`Accurate titration ${n}: refill the burette and set up a fresh flask.`);
    g.hot([]);
    let busy = false;
    const setup = button('Refill and set up again', async () => {
      if (busy) return;
      busy = true;
      setup.disabled = true;
      await setUpAgain();
      startRun(false);
      box.replaceChildren();
      g.task(`Accurate titration ${n}: read the burette before you start.`);
      readingStep(box, 'initial', titrate);
    }, { primary: true });
    box.append(h('div', { class: 'btn-row' }, setup));

    function titrate() {
      const target = st.run.initial + rough.titre - 2;
      box.replaceChildren();
      g.task(`Run the acid in quickly until the burette reads about ${fmt(target, 1)} cm³, then add it drop by drop.`);
      g.hot(['tap']);
      titrationControls(box, finalReading);
    }

    function finalReading() {
      box.replaceChildren();
      g.hot([]);
      g.task(`Accurate titration ${n}: take the final reading.`);
      readingStep(box, 'final', () => {
        const run = st.run;
        completeRun();
        const quality = run.overshoot > 0.1
          ? `You went past the end point by about ${fmt(run.overshoot, 2)} cm³ (${Math.max(1, Math.round(run.overshoot / DROP))} drops). Near the end point, add one drop at a time.`
          : 'Well judged: you stopped within a drop of the end point.';
        const set = concordantSet();
        const accurate = st.runs.filter((r) => !r.rough);
        if (set.length >= 2) {
          st.used = set;
          say(`${quality} Titrations ${set.map((r) => r.label).join(' and ')} are concordant (within 0.10 cm³).`, 'good');
          g.next();
        } else if (accurate.length >= 6) {
          const sorted = accurate.slice().sort((a, b) => a.titre - b.titre);
          let pair = [sorted[0], sorted[1]];
          for (let i = 1; i < sorted.length - 1; i++) {
            if (sorted[i + 1].titre - sorted[i].titre < pair[1].titre - pair[0].titre) pair = [sorted[i], sorted[i + 1]];
          }
          st.used = pair;
          for (const r of st.runs) r.concordant = pair.includes(r);
          renderTable();
          say(`${quality} None of your titres agree within 0.10 cm³ yet, so we'll use your two closest (${pair.map((r) => r.label).join(' and ')}). In a real lab you would do another titration.`, 'warn');
          g.next();
        } else {
          say(`${quality} You need two titres within 0.10 cm³ of each other, so do another titration.`, run.overshoot > 0.1 ? 'warn' : 'info');
          accurateRound(box, g);
        }
      });
    }
  }

  /* ---------- Start ---------- */

  buildBench();
  el.table = document.getElementById('results-table');
  el.calcs = document.getElementById('calc-list');

  const items = {
    goggles: el.goggles,
    acid: el.acid,
    alkali: el.alkali,
    burette: el.burette,
    tap: el.tap,
    flask: el.flask,
    phenolphthalein: el.phenolphthalein,
    methylOrange: el.methylOrange,
    universal: el.universal,
  };

  const lab = K.setupLab({ id: 'titration', steps, items });
  const say = lab.say;
  lab.guide.onFinish = () => {
    const error = ((st.answer - baseConc) / baseConc) * 100;
    const verdict = Math.abs(error) <= 1 ? 'Excellent: your answer is within 1% of the true value.'
      : Math.abs(error) <= 3 ? 'Good: your answer is within 3% of the true value.'
        : 'Your answer is more than 3% out. Overshooting the end point is the most common cause.';
    lab.finish({
      title: 'Titration complete',
      summary: verdict,
      rows: [
        ['Your concentration', `${fmt(st.answer, 4)} mol/dm³`],
        ['True concentration', `${fmt(baseConc, 4)} mol/dm³`],
        ['Difference', `${error >= 0 ? '+' : ''}${fmt(error, 1)}%`],
        ['Indicator', INDICATORS[st.flask.indicator].name],
        ['Concordant titres', st.used.map((r) => `${fmt(r.titre, 2)} cm³`).join(', ')],
      ],
    });
  };

  renderTable();
  draw();
  lab.guide.start();
  requestAnimationFrame((now) => {
    last = now;
    update(now);
  });

  // Read-only view of the simulation for automated tests.
  window.__lab = { st, baseConc, equivalence, endPointFor, mixedPH, INDICATORS, setTap };
})();
