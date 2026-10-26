/* Percentage of oxygen in air (Grade 6, Stage 7: 7ESp.03, 7TWSa.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss, clamp } = K;

  const SURFACE = 330; // water level in the trough
  const PX_PER_CM = 12.5; // the air column is 20.0 cm (250 px) long
  const COLUMN = 20;
  const ST = { placed: 0, day: 0, rise: 0, rust: 0, final: 4.0 + gauss() * 0.12 };
  const riseOn = (day) => ST.final * (1 - Math.exp(-day / 1.4));

  Investigation.run({
    id: 'g6-oxygenair',
    guide: '../practical.html#g6-oxygenair',
    objectives: ['I can measure roughly what fraction of air is oxygen.', 'I can evaluate why my result may differ from 21%.'],
    benchLabel: 'A test tube with damp iron wool pushed into the closed end, standing upside down in a trough of water, with a ruler beside it and a day counter.',
    state: ST,
    scene(svg, D, st) {
      D.bench(svg, 440, [[360, 'Tube of air over water,', 'with damp iron wool at the top'], [612, 'Day counter']]);
      const trough = s('g', null,
        s('rect', { x: 210, y: SURFACE, width: 300, height: 68, fill: 'rgba(160, 205, 235, 0.55)' }),
        s('path', { d: `M206,300 L206,398 L514,398 L514,300`, ...D.GLASS, fill: 'none', 'stroke-width': 2.5 }));
      // the tube: closed end at the top, open end under the water
      const tubeG = s('g', null);
      const inside = s('rect', { x: 342, width: 36, fill: 'rgba(160, 205, 235, 0.75)' });
      const wool = s('g', null);
      for (let i = 0; i < 9; i++) {
        const y = 86 + (i % 3) * 8;
        wool.append(s('path', { d: `M${346 + (i % 4) * 2},${y} q8,-7 14,0 t14,0`, fill: 'none', stroke: '#8a9099', 'stroke-width': 2, 'stroke-linecap': 'round' }));
      }
      tubeG.append(
        inside,
        wool,
        s('path', { d: 'M340,370 L340,90 Q340,72 360,72 Q380,72 380,90 L380,370', ...D.GLASS, fill: 'rgba(214, 232, 242, 0.25)', 'stroke-width': 2 }));
      const startMark = s('line', { x1: 334, x2: 386, y1: SURFACE, y2: SURFACE, stroke: '#2b6cb0', 'stroke-width': 2, 'stroke-dasharray': '4 3' });
      // ruler with 0 at the starting water level, reading upwards
      const rule = s('g', null, s('rect', { x: 392, y: SURFACE - COLUMN * PX_PER_CM - 4, width: 22, height: COLUMN * PX_PER_CM + 8, fill: '#f3e6c4', stroke: '#b59a63' }));
      for (let cm = 0; cm <= COLUMN; cm++) {
        const y = SURFACE - cm * PX_PER_CM;
        rule.append(s('line', { x1: 392, x2: 392 + (cm % 5 ? 5 : 9), y1: y, y2: y, stroke: '#2b2418', 'stroke-width': 0.8 }));
        if (cm % 5 === 0) rule.append(s('text', { class: 'scale-text', x: 403, y: y + 3 }, String(cm)));
      }
      const days = D.display(560, 160, 104, 'Days');
      svg.append(trough, rule, tubeG, startMark, days.g);
      return {
        update() {
          tubeG.setAttribute('transform', `translate(0 ${lerp(-70, 0, st.placed)})`);
          startMark.setAttribute('opacity', st.placed >= 1 ? 1 : 0);
          const level = SURFACE - st.rise * PX_PER_CM;
          inside.setAttribute('y', st.placed >= 1 ? level : 370);
          inside.setAttribute('height', st.placed >= 1 ? 370 - level : 0);
          const c = (a, b) => Math.round(lerp(a, b, clamp(st.rust, 0, 1)));
          for (const p of wool.children) p.setAttribute('stroke', `rgb(${c(138, 164)}, ${c(144, 84)}, ${c(153, 38)})`);
          days.set(`Day ${st.day}`);
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Ruler: rise of the water (cm)', label: 'Close-up of the ruler where the water level is inside the tube', span: 3, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: COLUMN, value: (st) => (st.placed >= 1 ? st.rise : null) },
    setup: [{
      title: 'Set up the tube',
      text: 'Push damp iron wool into the closed end of a test tube. Turn the tube upside down in a trough of water and mark the water level.',
      why: 'The iron wool is damp because iron needs both oxygen and water to rust. The tube traps a fixed amount of air.',
      button: 'Push in the iron wool and turn the tube over',
      done: 'The tube is set up. The column of trapped air is 20.0 cm long.',
      async run(api) {
        await tween(900, (t) => {
          api.st.placed = t;
          api.draw();
        });
        api.st.placed = 1;
        api.draw();
      },
    }],
    measureTitle: 'Measure the rise in the water level',
    measureText: 'Leave the tube for a week. Each day, measure how far the water has risen above the starting mark.',
    measureWhy: 'As the iron rusts it uses up the oxygen in the trapped air, so water moves up the tube to take its place.',
    measureTask: 'read how far the water has risen',
    measureButton: (v) => (v === 0 ? 'Read the level at the start' : `Wait until day ${v}`),
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.day;
      if (v > from) {
        await tween(500 + (v - from) * 500, (t, raw) => {
          const d = lerp(from, v, raw);
          st.day = Math.floor(d);
          st.rise = riseOn(d);
          st.rust = d / 4;
          api.draw();
        });
      }
      st.day = v;
      st.rise = riseOn(v);
      api.draw();
      return st.rise;
    },
    iv: { label: 'Day', unit: '', values: [0, 1, 2, 3, 4, 5, 6, 7] },
    dv: { label: 'Rise in water level', unit: 'cm', dp: 1, tol: 0.1, placeholder: 'e.g. 2.6', readHint: 'Read the ruler at the pointer, to the nearest millimetre (0.1 cm).' },
    graph: { title: 'Rise in water level over a week', xLabel: 'Time / days', yLabel: 'Rise in water level / cm', xDomain: [0, 7], yDomain: [0, 5], xStep: 1, yStep: 1 },
    pattern: {
      q: 'What happened to the water level?',
      o: ['It rose quickly at first, then stopped rising after a few days', 'It rose by the same amount every day', 'It rose and then fell back down'],
      hint: 'Look at how much the level rose each day near the start and near the end of the week.',
      right: 'Yes. The iron rusts by reacting with the oxygen in the trapped air. Once the oxygen is used up, the rusting stops and the water stops rising.',
      why: 'The water only takes the place of the oxygen. Nitrogen and the other gases in air are not used up, so they stay in the tube.',
    },
    extra: [{
      title: 'Work out the percentage of oxygen',
      text: 'The air column was 20.0 cm long at the start. Percentage of oxygen = final rise ÷ 20.0 × 100.',
      why: 'The rise in the water shows the volume of oxygen that was used up, as a fraction of the air you started with.',
      label: 'Percentage of oxygen in the air',
      short: 'Oxygen in air',
      unit: '%',
      dp: 0,
      placeholder: 'e.g. 20',
      expected: (rows) => (rows[rows.length - 1].mean / COLUMN) * 100,
      tol: 1.5,
      hint: 'Divide your day 7 rise by 20.0, then multiply by 100.',
      msg: (v) => `About ${Math.round(v)}% of the air was oxygen. The accepted value is 21%. Results are often a little lower because the iron may not use up every bit of the oxygen.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The iron used up the oxygen as it rusted, and the water rose about one fifth of the way up the tube. So about 21% of air is oxygen; most of the rest is nitrogen.',
      rows: [['Air column at the start', '20.0 cm'], ['Rise after 7 days', `${rows[rows.length - 1].mean} cm`], ['Oxygen in air', `${Math.round((rows[rows.length - 1].mean / COLUMN) * 100)}%`]],
    }),
  });
})();
