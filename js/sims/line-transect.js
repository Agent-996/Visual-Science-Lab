/* Line transect from shade to open ground (Grade 7, Stage 8: 8Be.01, 8TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const COUNT = { 0: 0, 2: 1, 4: 3, 6: 6, 8: 9, 10: 11 };
  const LUX = { 0: 900, 2: 2500, 4: 6000, 6: 12000, 8: 20000, 10: 26000 };
  const Q = { x: 200, y: 70, w: 240 };
  // Fixed daisy positions inside the quadrat, so a count looks the same each time it is drawn.
  const SPOTS = Array.from({ length: 12 }, (_, i) => [Q.x + 22 + ((i * 67) % 196), Q.y + 22 + ((i * 113) % 196)]);
  Investigation.run({
    id: 'g7-transect',
    guide: '../practical.html#g7-transect',
    objectives: ['I can use a line transect to record how organisms change across an area.', 'I can link changes in organisms to changes in light.'],
    benchLabel: 'A square quadrat placed on grass at points along a tape running from under trees into open ground, with daisies inside it, and a light meter.',
    state: { at: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[320, 'Quadrat on the grass'], [600, 'Light meter']]);
      const grass = s('rect', { x: Q.x, y: Q.y, width: Q.w, height: Q.w, fill: '#8fbf5a' });
      const daisies = s('g', null);
      const meter = D.display(540, 140, 120, 'Light meter');
      const grid = s('g', null);
      for (let i = 1; i < 5; i++) grid.append(s('line', { x1: Q.x + i * 48, x2: Q.x + i * 48, y1: Q.y, y2: Q.y + Q.w, stroke: '#f6f8f9', 'stroke-width': 1 }), s('line', { x1: Q.x, x2: Q.x + Q.w, y1: Q.y + i * 48, y2: Q.y + i * 48, stroke: '#f6f8f9', 'stroke-width': 1 }));
      const label = s('text', { x: 320, y: 340, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(grass, daisies, grid, s('rect', { x: Q.x, y: Q.y, width: Q.w, height: Q.w, fill: 'none', stroke: '#f6f8f9', 'stroke-width': 4 }), label, meter.g);
      return {
        update() {
          grass.setAttribute('fill', st.at === null ? '#8fbf5a' : `rgb(${100 + st.at * 4}, ${140 + st.at * 5}, ${70 + st.at})`);
          daisies.replaceChildren(...SPOTS.slice(0, st.at === null ? 0 : COUNT[st.at]).map(([x, y]) => s('g', null, ...Array.from({ length: 8 }, (_, k) => s('ellipse', { cx: x + Math.cos((k * Math.PI) / 4) * 6, cy: y + Math.sin((k * Math.PI) / 4) * 6, rx: 4, ry: 2, fill: '#ffffff', transform: `rotate(${k * 45} ${x + Math.cos((k * Math.PI) / 4) * 6} ${y + Math.sin((k * Math.PI) / 4) * 6})` })), s('circle', { cx: x, cy: y, r: 3.5, fill: '#f2c230' }))));
          meter.set(st.at === null ? '--' : `${LUX[st.at]} lux`);
          label.textContent = st.at === null ? '' : `${st.at} m along the transect`;
        },
      };
    },
    measureTitle: 'Count the daisies in each quadrat',
    measureText: 'Lay a tape from under the trees out into the open. Every 2 m, place the quadrat beside the tape, count the daisy plants inside it and read the light meter.',
    measureWhy: 'Sampling at regular distances along a line shows how the plants change from the shade to the open.',
    measureTask: 'count the daisies in the quadrat',
    measureButton: (v) => `Put the quadrat at ${v} m`,
    async measure(v, rep, api) {
      const { st } = api;
      await tween(500, () => {});
      st.at = v;
      api.draw();
      return COUNT[v];
    },
    iv: { label: 'Distance along the transect', unit: 'm', values: [0, 2, 4, 6, 8, 10] },
    dv: { label: 'Daisies in the quadrat', unit: '', dp: 0, tol: 0, placeholder: 'e.g. 5', readHint: 'Count each daisy flower (white petals, yellow centre) inside the quadrat.' },
    graph: { title: 'Daisies along the transect, from shade (0 m) to open ground', xLabel: 'Distance along the transect / m', yLabel: 'Daisies per quadrat', xDomain: [0, 10], yDomain: [0, 12], xStep: 2, yStep: 2 },
    pattern: {
      q: 'What do your results show?',
      o: ['There were more daisies further from the trees, where there is more light', 'There were more daisies in the shade', 'The number of daisies was the same everywhere'],
      hint: 'Compare your counts with the light meter readings.',
      right: 'Yes. Daisies need plenty of light, so they grow best out in the open. Other plants, such as ferns and ivy, do better in the shade.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The number of daisies increased gradually along the transect as the light level increased. The plants change across an area as the conditions change.',
      rows: [['0 m (shade)', `${rows[0].mean} daisies`], ['10 m (open)', `${rows[rows.length - 1].mean} daisies`]],
    }),
  });
})();
