/* Density of metal and non-metal blocks (Grade 6, Stage 7: 7Cp.05, 7TWSc.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const MASS = { Aluminium: 27.0, Iron: 78.7, Copper: 89.6, Wood: 6.5, Acrylic: 11.8 };
  const LOOK = { Aluminium: '#c9d1d9', Iron: '#7d838a', Copper: '#c46f3c', Wood: '#c89b62', Acrylic: 'rgba(160, 205, 235, 0.8)' };
  Investigation.run({
    id: 'g6-density',
    guide: '../practical.html#g6-density',
    objectives: ['I can measure mass with a balance.', 'I can calculate density = mass ÷ volume.'],
    benchLabel: 'A top-pan balance and a row of 10 cm³ blocks made of different materials.',
    state: { block: null, reading: 0, on: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Top-pan balance'], [560, '10 cm³ blocks']]);
      const blockEl = s('rect', { x: 278, width: 44, height: 44, rx: 3 });
      const display = D.display(250, 340, 100, '');
      const shelf = s('g', null);
      Object.keys(MASS).forEach((m, i) => shelf.append(s('rect', { x: 480 + (i % 3) * 52, y: 340 - Math.floor(i / 3) * 52, width: 40, height: 40, rx: 3, fill: LOOK[m], stroke: '#4a5058' })));
      svg.append(s('rect', { x: 220, y: 330, width: 160, height: 70, rx: 8, fill: '#e9eef2', stroke: '#8a96a3' }), s('rect', { x: 240, y: 318, width: 120, height: 10, rx: 3, fill: '#9aa5b1' }), display.g, shelf, blockEl);
      return {
        update() {
          blockEl.setAttribute('visibility', st.block ? 'visible' : 'hidden');
          if (st.block) {
            blockEl.setAttribute('fill', LOOK[st.block]);
            blockEl.setAttribute('stroke', '#4a5058');
            blockEl.setAttribute('y', 274 - (1 - st.on) * 80);
          }
          display.set(`${st.reading.toFixed(1)} g`);
        },
      };
    },
    measureTitle: 'Weigh each block',
    measureText: 'Every block has a volume of 10 cm³. Put each one on the balance and record its mass.',
    measureWhy: 'All the blocks have the same volume, so the heavier a block, the denser its material.',
    measureTask: 'put the block on the balance and read the mass',
    measureButton: (v) => `Weigh the ${v.toLowerCase()} block`,
    async measure(v, rep, api) {
      const { st } = api;
      st.block = v;
      st.reading = 0;
      await tween(600, (t) => {
        st.on = t;
        api.draw();
      });
      st.reading = MASS[v];
      api.draw();
      return MASS[v];
    },
    iv: { label: 'Material', unit: '', values: Object.keys(MASS), categorical: true },
    dv: { label: 'Mass of a 10 cm³ block', unit: 'g', dp: 1, tol: 0.05, placeholder: 'e.g. 27.0', readHint: 'Copy the reading on the balance, in grams.' },
    graph: { title: 'Mass of each 10 cm³ block', xLabel: 'Material', yLabel: 'Mass / g', yDomain: [0, 100], yStep: 20 },
    pattern: {
      q: 'What do your results show?',
      o: ['The metal blocks were much heavier, so metals are denser than the non-metals', 'All the blocks had about the same mass', 'Wood was the densest'],
      hint: 'All the blocks are the same size. Which were heaviest?',
      right: 'Yes. Most metals have high densities. Most non-metal solids, such as wood and plastic, have low densities.',
    },
    extra: [{
      title: 'Calculate a density',
      text: 'Density = mass ÷ volume. Calculate the density of iron. Every block has a volume of 10 cm³.',
      why: 'Density lets you compare materials even when the pieces are different sizes.',
      label: 'Density of iron',
      short: 'Density of iron',
      unit: 'g/cm³',
      dp: 1,
      placeholder: 'e.g. 2.7',
      expected: (rows) => rows[1].mean / 10,
      tol: 0.1,
      hint: 'Divide the mass of the iron block by 10.',
      msg: (v) => `About ${v.toFixed(1)} g/cm³. Every cm³ of iron has a mass of about ${v.toFixed(1)} g.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Metals had high densities (iron about 7.9 g/cm³, copper about 9.0 g/cm³). Wood and plastic had low densities; wood is less dense than water, so it floats.',
      rows: rows.map((r) => [r.x, `${(r.mean / 10).toFixed(1)} g/cm³`]),
    }),
  });
})();
