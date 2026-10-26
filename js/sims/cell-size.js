/* Measuring cell size (Grade 6, Stage 7: 7TWSc.04, 7TWSm.02). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const LEN = { 'Onion cell': 250, 'Pondweed cell': 110, 'Cheek cell': 60 };
  const PX = 0.9; // px per µm in the view
  Investigation.run({
    id: 'g6-cellsize',
    guide: '../practical.html#g6-cellsize',
    objectives: ['I can estimate the size of a cell using the field of view.', 'I can use micrometres (µm) for very small lengths.'],
    benchLabel: 'The view down a microscope of one cell at a time, with a scale in micrometres (µm) lined up along its length.',
    state: { cell: null, show: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[330, 'View down the microscope with a µm scale']]);
      const view = s('g', null);
      svg.append(s('circle', { cx: 330, cy: 200, r: 170, fill: '#1b1f24' }), s('circle', { cx: 330, cy: 200, r: 160, fill: '#f6f2e4' }), view);
      return {
        update() {
          view.replaceChildren();
          const len = LEN[st.cell];
          if (!len) return;
          const x0 = 195;
          const w = len * PX * st.show;
          if (st.cell === 'Cheek cell') view.append(s('ellipse', { cx: x0 + w / 2, cy: 190, rx: w / 2, ry: w * 0.4, fill: '#c4d2f2', stroke: '#5a72b8', 'stroke-width': 2 }), s('circle', { cx: x0 + w / 2, cy: 190, r: 6, fill: '#2f3f8a' }));
          else view.append(s('rect', { x: x0, y: 190 - (st.cell === 'Onion cell' ? 35 : 26), width: w, height: st.cell === 'Onion cell' ? 70 : 52, fill: st.cell === 'Onion cell' ? '#f1dc9c' : '#dcefc7', stroke: st.cell === 'Onion cell' ? '#9c7430' : '#5f8a3a', 'stroke-width': 3 }), s('circle', { cx: x0 + w * 0.4, cy: 190, r: 7, fill: st.cell === 'Onion cell' ? '#7a4f12' : '#3c8a2a' }));
          const scale = s('g', null, s('line', { x1: x0, x2: x0 + 300 * PX, y1: 270, y2: 270, stroke: '#1f2a33', 'stroke-width': 1.5 }));
          for (let um = 0; um <= 300; um += 10) scale.append(s('line', { x1: x0 + um * PX, x2: x0 + um * PX, y1: 270, y2: 270 - (um % 50 ? 5 : 10), stroke: '#1f2a33' }), um % 100 ? null : s('text', { class: 'scale-text', x: x0 + um * PX, y: 284, 'text-anchor': 'middle' }, `${um}`));
          view.append(scale, s('text', { class: 'scale-text', x: x0 + 300 * PX + 8, y: 274 }, 'µm'));
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Scale at the end of the cell (µm)', label: 'Close-up of the micrometre scale at the right-hand end of the cell', span: 40, minor: 5, major: 10, labelEvery: 10, min: 0, max: 300, value: (st) => (st.show >= 1 ? LEN[st.cell] : null) },
    measureTitle: 'Measure each cell',
    measureText: 'Line the scale up with the left-hand end of the cell, then read the scale at the right-hand end.',
    measureWhy: 'Cells are far too small to measure in millimetres, so we use micrometres: 1 mm = 1000 µm.',
    measureTask: 'read the length of the cell',
    measureButton: (v) => `Look at a ${v.toLowerCase()}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.cell = v;
      await tween(500, (t) => {
        st.show = t;
        api.draw();
      });
      st.show = 1;
      api.draw();
      return LEN[v];
    },
    iv: { label: 'Cell', unit: '', values: Object.keys(LEN), categorical: true },
    dv: { label: 'Length of the cell', unit: 'µm', dp: 0, tol: 2.5, placeholder: 'e.g. 150', readHint: 'Read the scale at the right-hand end of the cell. Each small division is 5 µm.' },
    graph: { title: 'Length of each type of cell', xLabel: 'Cell', yLabel: 'Length / µm', yDomain: [0, 300], yStep: 50 },
    pattern: {
      q: 'What do your results show?',
      o: ['All the cells are less than a third of a millimetre long, far too small to see clearly without a microscope', 'All the cells are about 1 cm long', 'The cells are all exactly the same size'],
      hint: '1 mm = 1000 µm. How do your lengths compare with 1 mm?',
      right: 'Yes. Most cells are about 10–100 µm across, and even large onion cells are only about a quarter of a millimetre long.',
    },
    extra: [{
      title: 'How many cells in a millimetre?',
      text: 'How many cheek cells would fit in a row 1 mm (1000 µm) long? Divide 1000 by the length of one cheek cell.',
      why: 'This helps you picture how small cells really are.',
      label: 'Cheek cells in 1 mm',
      short: 'Cheek cells per mm',
      unit: 'cells',
      dp: 0,
      placeholder: 'e.g. 10',
      expected: (rows) => 1000 / rows[2].mean,
      tol: 1,
      hint: 'Divide 1000 by your cheek cell length in µm.',
      msg: (v) => `About ${Math.round(v)} cheek cells would fit across a single millimetre.`,
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The cells were between about 60 µm and 250 µm long: far too small to see without a microscope. 1 mm = 1000 µm.',
      rows: rows.map((r) => [r.x, `${r.mean} µm`]),
    }),
  });
})();
