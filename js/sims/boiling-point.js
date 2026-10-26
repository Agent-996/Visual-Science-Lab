/* Purity and boiling point (Grade 7, Stage 8: 8Cm.04, 8TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss, rand } = K;

  const ROOM = 22;
  // Dissolved salt raises the boiling point of water by about 0.18 °C per gram in 100 cm³.
  const boilingPoint = (g) => 100 + 0.176 * g + gauss() * (g ? 0.06 : 0.03);
  const SAMPLE = 102.0; // boiling point of the "unknown" sample in the last step

  Investigation.run({
    id: 'g7-purity',
    guide: '../practical.html#g7-purity',
    objectives: ['I can compare the boiling points of pure water and salty water.', 'I can use boiling point to judge whether a substance is pure.'],
    benchLabel: 'A beaker of water on a tripod and gauze over a Bunsen burner, with a thermometer clamped in the water and a pot of salt beside it.',
    state: { temp: ROOM, flame: false, salt: 0, grains: 0, bubbles: [] },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Beaker of water on a tripod'], [548, 'Salt']]);
      const tripod = s('path', { d: 'M236,398 L252,298 M364,398 L348,298 M300,398 L300,298', stroke: '#5d6874', 'stroke-width': 5 });
      const gauze = s('rect', { x: 226, y: 292, width: 148, height: 7, fill: '#9aa5b1', stroke: '#6b7682' });
      const burner = s('g', null,
        s('rect', { x: 291, y: 340, width: 18, height: 52, fill: '#9aa5b1', stroke: '#6b7682' }),
        s('rect', { x: 276, y: 390, width: 48, height: 10, rx: 2, fill: '#6b7682' }));
      const flame = s('g', null,
        s('path', { d: 'M290,340 Q286,318 300,298 Q314,318 310,340 Z', fill: '#7fb2ff', opacity: 0.75 }),
        s('path', { d: 'M295,340 Q294,326 300,312 Q306,326 305,340 Z', fill: '#3f7de0', opacity: 0.85 }));
      const beaker = D.beaker(300, 291, 130, 130, 'rgba(160, 205, 235, 0.55)').setLevel(0.7);
      const bubbles = s('g', null);
      const grains = s('g', null);
      const therm = D.thermometer(318, 70, 196, 0, 110);
      const clamp = s('g', null,
        s('rect', { x: 448, y: 60, width: 8, height: 338, fill: '#7a8794' }),
        s('rect', { x: 424, y: 392, width: 56, height: 8, fill: '#5d6874' }),
        s('rect', { x: 318, y: 92, width: 134, height: 7, fill: '#7a8794' }));
      const pot = s('g', null,
        s('rect', { x: 520, y: 350, width: 56, height: 42, rx: 6, fill: '#f6f7f8', stroke: '#9aa5b1' }),
        s('text', { x: 548, y: 376, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#33404d' }, 'NaCl'));
      const saltLabel = s('text', { class: 'bench-label', x: 548, y: 336, 'text-anchor': 'middle' }, '');
      svg.append(clamp, tripod, burner, flame, gauze, beaker.g, bubbles, grains, therm.g, pot, saltLabel);
      return {
        update() {
          flame.setAttribute('visibility', st.flame ? 'visible' : 'hidden');
          therm.set(st.temp);
          bubbles.replaceChildren(...st.bubbles.map((b) => s('circle', { cx: b.x, cy: b.y, r: b.r, fill: 'rgba(255, 255, 255, 0.75)', stroke: 'rgba(90, 130, 160, 0.7)' })));
          grains.replaceChildren(...(st.grains > 0 && st.grains < 1 ? Array.from({ length: 14 }, (_, i) => s('rect', { x: 290 + (i % 5) * 5, y: 150 + st.grains * 90 + (i % 3) * 6, width: 2.5, height: 2.5, fill: '#ffffff', stroke: '#8a9aa8', 'stroke-width': 0.5 })) : []));
          saltLabel.textContent = `${st.salt} g added`;
        },
      };
    },
    closeUp: { kind: 'thermometer', caption: 'Thermometer (°C)', label: 'Close-up of the thermometer', span: 8, minor: 0.5, major: 1, labelEvery: 1, min: 0, max: 110, value: (st) => st.temp },
    measureTitle: 'Measure each boiling point',
    measureText: 'Use 100 cm³ of fresh water each time. Dissolve the salt, heat the water until it boils, and record the temperature once it stops rising.',
    measureWhy: 'The mass of salt is the variable you change. Using the same volume of water, and reading the thermometer only when the temperature is steady, keeps the test fair.',
    measureTask: 'dissolve the salt, heat to boiling and read the steady temperature',
    measureButton: (v) => (v === 0 ? 'Heat pure water until it boils' : `Dissolve ${v} g of salt and heat until it boils`),
    async measure(v, rep, api) {
      const { st } = api;
      st.flame = false;
      st.temp = ROOM;
      st.bubbles = [];
      st.salt = v;
      api.draw();
      if (v > 0) {
        await tween(600, (t, raw) => {
          st.grains = raw;
          api.draw();
        });
        st.grains = 0;
      }
      const bp = boilingPoint(v);
      st.flame = true;
      let bubbles = [];
      await tween(2600, (t, raw) => {
        // heats quickly at first, then levels off at the boiling point
        st.temp = bp - (bp - ROOM) * Math.exp(-raw * 6);
        if (raw > 0.55) {
          bubbles = bubbles.map((b) => ({ ...b, y: b.y - 3 })).filter((b) => b.y > 205);
          if (Math.random() < 0.6) bubbles.push({ x: rand(250, 350), y: 284, r: rand(2, 5) });
        }
        st.bubbles = bubbles;
        api.draw();
      });
      st.temp = bp;
      api.draw();
      return bp;
    },
    afterReading(api) {
      api.st.flame = false;
      api.st.bubbles = [];
      api.draw();
    },
    iv: { label: 'Salt dissolved in 100 cm³', unit: 'g', values: [0, 5, 10, 15, 20, 25] },
    dv: { label: 'Boiling point', unit: '°C', dp: 1, tol: 0.3, placeholder: 'e.g. 101.5', readHint: 'Read the thermometer at the top of the red liquid, to the nearest half degree.' },
    graph: { title: 'Boiling point against mass of salt dissolved', xLabel: 'Salt dissolved in 100 cm³ of water / g', yLabel: 'Boiling point / °C', xDomain: [0, 25], yDomain: [99, 105], xStep: 5, yStep: 1 },
    pattern: {
      q: 'What do your results show?',
      o: ['The more salt dissolved, the higher the boiling point', 'The more salt dissolved, the lower the boiling point', 'Salt makes no difference to the boiling point'],
      hint: 'Compare the boiling point of pure water with the boiling point when 25 g of salt was dissolved.',
      right: 'Yes. Pure water boils at 100 °C. Dissolved salt is an impurity: it raises the boiling point, and more salt raises it further.',
      why: 'A pure substance boils at one fixed temperature. If a liquid boils at a different temperature, it is not pure.',
    },
    extra: [{
      title: 'Is this water pure?',
      text: `A sample of water from a salty lake boils at ${SAMPLE.toFixed(1)} °C. Use your graph to estimate how much salt is dissolved in each 100 cm³ of it.`,
      why: 'Reading across from a boiling point to your line is how you can use a graph to identify how impure a sample is.',
      label: 'Salt in each 100 cm³ of lake water',
      short: 'Salt in the lake water',
      unit: 'g',
      dp: 0,
      placeholder: 'e.g. 8',
      expected: (rows) => {
        const { m, c } = K.fitLine(rows.map((r) => ({ x: r.x, y: r.mean })));
        return (SAMPLE - c) / m;
      },
      tol: 1.6,
      hint: `Find ${SAMPLE.toFixed(1)} °C on the boiling point axis, go across to your line, then read down to the mass of salt.`,
      msg: (v) => `About ${Math.round(v)} g in each 100 cm³. It is not pure water, because pure water boils at exactly 100 °C.`,
      mark: (v) => ({ x: v, y: SAMPLE, label: 'Lake water', dx: 12, dy: -12 }),
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Pure water boiled at 100 °C. Dissolving salt raised the boiling point, and more salt raised it more. A substance with a fixed boiling point is pure; impurities change it.',
      rows: [['Pure water', `${rows[0].mean} °C`], ['With 25 g of salt', `${rows[rows.length - 1].mean} °C`]],
    }),
  });
})();
