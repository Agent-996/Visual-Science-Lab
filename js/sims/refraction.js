/* Refraction through a glass block (Grade 7, Stage 8: 8Ps.02, 8TWSa.05). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;

  const N = 1.5; // refractive index of glass
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const refracted = (i) => deg(Math.asin(Math.sin(rad(i)) / N));
  const P = { x: 330, y: 170 }; // where the ray enters the block
  const BLOCK = { x: 230, y: 170, w: 300, h: 150 };

  Investigation.run({
    id: 'g7-refraction',
    guide: '../practical.html#g7-refraction',
    objectives: ['I can trace a ray of light through a glass block.', 'I can describe how light bends towards or away from the normal.'],
    benchLabel: 'Seen from above: a rectangular glass block on paper, a ray box shining a ray into the top surface, and the normal drawn at the point where the ray enters.',
    state: { drawn: false, i: null, r: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[380, 'Glass block on paper, seen from above, with a ray box']]);
      svg.append(s('rect', { x: 140, y: 30, width: 440, height: 350, fill: '#ffffff', stroke: '#d9dee2' }));
      const outline = s('rect', { x: BLOCK.x, y: BLOCK.y, width: BLOCK.w, height: BLOCK.h, fill: 'rgba(190, 225, 240, 0.55)', stroke: '#5f88a3', 'stroke-width': 2 });
      const normal = s('line', { x1: P.x, x2: P.x, y1: 50, y2: 370, stroke: '#33404d', 'stroke-width': 1.2, 'stroke-dasharray': '6 5', opacity: 0 });
      const normalLabel = s('text', { class: 'bench-label', x: P.x + 6, y: 62, opacity: 0 }, 'normal');
      const arcI = s('path', { fill: 'none', stroke: '#c0392b', 'stroke-width': 1.5 });
      const arcR = s('path', { fill: 'none', stroke: '#c0392b', 'stroke-width': 1.5 });
      const rayIn = s('line', { stroke: '#e03131', 'stroke-width': 3, 'stroke-linecap': 'round' });
      const rayBlock = s('line', { stroke: '#e03131', 'stroke-width': 3, 'stroke-linecap': 'round' });
      const rayOut = s('line', { stroke: '#e03131', 'stroke-width': 3, 'stroke-linecap': 'round' });
      const box = s('g', null, s('rect', { x: -46, y: -14, width: 46, height: 28, rx: 4, fill: '#39424b' }), s('rect', { x: -4, y: -4, width: 6, height: 8, fill: '#ffd34d' }));
      svg.append(outline, normal, normalLabel, arcI, arcR, rayIn, rayBlock, rayOut, box);
      return {
        update() {
          normal.setAttribute('opacity', st.drawn ? 1 : 0);
          normalLabel.setAttribute('opacity', st.drawn ? 1 : 0);
          const show = st.i !== null;
          for (const el of [rayIn, rayBlock, rayOut, box, arcI, arcR]) el.setAttribute('visibility', show ? 'visible' : 'hidden');
          if (!show) return;
          const a = rad(st.i);
          const b = rad(st.r);
          const L = 150;
          const sx = P.x - Math.sin(a) * L;
          const sy = P.y - Math.cos(a) * L;
          rayIn.setAttribute('x1', sx); rayIn.setAttribute('y1', sy); rayIn.setAttribute('x2', P.x); rayIn.setAttribute('y2', P.y);
          const ex = P.x + Math.tan(b) * BLOCK.h;
          const ey = BLOCK.y + BLOCK.h;
          rayBlock.setAttribute('x1', P.x); rayBlock.setAttribute('y1', P.y); rayBlock.setAttribute('x2', ex); rayBlock.setAttribute('y2', ey);
          rayOut.setAttribute('x1', ex); rayOut.setAttribute('y1', ey); rayOut.setAttribute('x2', ex + Math.sin(a) * 70); rayOut.setAttribute('y2', ey + Math.cos(a) * 70);
          box.setAttribute('transform', `translate(${sx} ${sy}) rotate(${90 - st.i})`);
          const arc = (r, from, to, below) => {
            const y1 = below ? P.y + r : P.y - r;
            const x2 = P.x + (below ? Math.sin(to) : -Math.sin(to)) * r;
            const y2 = below ? P.y + Math.cos(to) * r : P.y - Math.cos(to) * r;
            return `M${P.x},${y1} A${r},${r} 0 0 ${below ? 0 : 0} ${x2},${y2}`;
          };
          arcI.setAttribute('d', st.i > 0 ? arc(40, 0, a, false) : '');
          arcR.setAttribute('d', st.r > 0 ? arc(50, 0, b, true) : '');
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Protractor scale (degrees)', label: 'Close-up of the protractor where the refracted ray crosses it', span: 12, minor: 1, major: 10, labelEvery: 5, min: 0, max: 90, value: (st) => st.r },
    setup: [{
      title: 'Draw round the block and the normal',
      text: 'Put the glass block on paper, draw round it, then draw a normal: a line at 90° to the surface where the ray will go in.',
      why: 'Angles in optics are always measured from the normal, not from the surface of the block.',
      button: 'Draw the outline and normal',
      done: 'Outline and normal drawn.',
      async run(api) {
        api.st.drawn = true;
        api.draw();
      },
    }],
    measureTitle: 'Measure the angle of refraction',
    measureText: 'Shine the ray into the block at each angle of incidence. Mark the ray inside the block and measure the angle of refraction from the normal with a protractor.',
    measureWhy: 'Changing the angle of incidence in equal steps shows the pattern clearly. Measuring from the normal every time keeps the readings consistent.',
    measureTask: 'shine the ray and measure the angle of refraction',
    measureButton: (v) => `Shine the ray at ${v}°`,
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.i === null ? 0 : st.i;
      await tween(900, (t) => {
        st.i = lerp(from, v, t);
        st.r = refracted(st.i);
        api.draw();
      });
      st.i = v;
      st.r = refracted(v);
      api.draw();
      return st.r;
    },
    iv: { label: 'Angle of incidence', unit: '°', values: [0, 10, 20, 30, 40, 50, 60, 70] },
    dv: { label: 'Angle of refraction', unit: '°', dp: 0, tol: 1, placeholder: 'e.g. 19', readHint: 'Read the protractor where the red ray crosses it, to the nearest degree.' },
    graph: { title: 'Angle of refraction against angle of incidence', xLabel: 'Angle of incidence / °', yLabel: 'Angle of refraction / °', xDomain: [0, 90], yDomain: [0, 50], xStep: 10, yStep: 10 },
    pattern: {
      q: 'What do your results show?',
      o: ['The ray bends towards the normal: the angle of refraction is always smaller than the angle of incidence', 'The angle of refraction is always bigger than the angle of incidence', 'The ray does not bend at all'],
      hint: 'Compare the two angles in each row of your table.',
      right: 'Yes. Light slows down when it enters glass, so it bends towards the normal. At 0° it goes straight through without bending.',
      why: 'Refraction happens because light travels more slowly in glass than in air.',
    },
    extra: [{
      title: 'Use your graph to predict',
      text: 'Continue your curve to predict the angle of refraction for an angle of incidence of 80°.',
      why: 'Using a graph to predict a value outside your results is called extrapolation.',
      label: 'Predicted angle of refraction at 80°',
      short: 'Predicted at 80°',
      unit: '°',
      dp: 0,
      placeholder: 'e.g. 40',
      expected: () => refracted(80),
      tol: 3.5,
      hint: 'Follow the shape of your curve on past 70°. It is getting flatter.',
      msg: (v) => `About ${Math.round(v)}°. The real value is ${Math.round(refracted(80))}°.`,
      mark: (v) => ({ x: 80, y: v, label: 'Prediction', dx: -78, dy: -14 }),
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Light bent towards the normal as it entered the glass, so each angle of refraction was smaller than its angle of incidence. A ray along the normal (0°) did not bend.',
      rows: [['At 30° incidence', `${rows[3].mean}° refraction`], ['At 60° incidence', `${rows[6].mean}° refraction`], ['Along the normal', 'no bending']],
    }),
  });
})();
