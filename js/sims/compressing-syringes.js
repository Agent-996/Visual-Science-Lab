/* Compressing air, water and sand in syringes (Grade 6, Stage 7: 7Cm.06, 7TWSa.03). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;
  const X0 = 180; // sealed end of the barrel
  const PX = 6; // px per cm³
  const FILL = { Air: 'rgba(214, 232, 242, 0.5)', Water: 'rgba(80, 150, 215, 0.6)', Sand: '#d9bf86' };
  const FINAL = { Air: 24, Water: 50, Sand: 47 };
  Investigation.run({
    id: 'g6-syringes',
    guide: '../practical.html#g6-syringes',
    objectives: ['I can test which states of matter can be compressed.', 'I can use the particle model to explain why gases compress but solids and liquids do not.'],
    benchLabel: 'A sealed syringe with a scale in cm³, filled with air, water or sand, and a hand pushing the plunger.',
    state: { material: null, vol: 50 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[330, 'Sealed syringe with a cm³ scale']]);
      const contents = s('rect', { x: X0, y: 202, height: 36 });
      const plunger = s('g', null);
      const scale = s('g', null);
      for (let v = 0; v <= 50; v += 5) scale.append(s('line', { x1: X0 + v * PX, x2: X0 + v * PX, y1: 196, y2: 188 + (v % 10 ? 4 : 0), stroke: '#33404d' }), v % 10 ? null : s('text', { class: 'scale-text', x: X0 + v * PX, y: 184, 'text-anchor': 'middle' }, String(v)));
      const name = s('text', { x: 330, y: 300, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(contents, s('rect', { x: X0 - 16, y: 206, width: 16, height: 28, rx: 4, fill: '#39424b' }), s('rect', { x: X0, y: 200, width: 320, height: 40, fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), scale, plunger, name);
      return {
        update() {
          contents.setAttribute('width', st.vol * PX);
          contents.setAttribute('fill', FILL[st.material] || 'none');
          const px = X0 + st.vol * PX;
          plunger.replaceChildren(s('rect', { x: px, y: 202, width: 8, height: 36, fill: '#4a525b' }), s('rect', { x: px + 8, y: 214, width: 140, height: 12, fill: '#9aa5b1' }), s('rect', { x: px + 148, y: 196, width: 10, height: 48, rx: 3, fill: '#4a525b' }), s('path', { d: `M${px + 162},206 q24,-8 34,8 l0,14 q-10,12 -34,6 z`, fill: '#e2b48c', stroke: '#b5835a' }));
          name.textContent = st.material ? `Filled with ${st.material.toLowerCase()}` : '';
        },
      };
    },
    closeUp: { kind: 'ruler', caption: 'Syringe scale (cm³)', label: 'Close-up of the syringe scale at the plunger', span: 8, minor: 1, major: 5, labelEvery: 5, min: 0, max: 50, value: (st) => (st.material ? st.vol : null) },
    measureTitle: 'Push each plunger',
    measureText: 'Fill the syringe to 50 cm³, seal the end and push the plunger as hard as you safely can. Read the volume.',
    measureWhy: 'The material is the variable you change. Start at the same volume and push with the same force each time.',
    measureTask: 'push the plunger and read the volume',
    measureButton: (v) => `Push the syringe of ${v.toLowerCase()}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.material = v;
      st.vol = 50;
      api.draw();
      await tween(1100, (t) => {
        st.vol = lerp(50, FINAL[v], t);
        api.draw();
      });
      st.vol = FINAL[v];
      api.draw();
      return FINAL[v];
    },
    afterReading(api) {
      api.say('Let go: the plunger springs back for air, but not for water.', 'info');
    },
    iv: { label: 'Material', unit: '', values: ['Air', 'Water', 'Sand'], categorical: true },
    dv: { label: 'Volume when pushed', unit: 'cm³', dp: 0, tol: 0.5, placeholder: 'e.g. 30', readHint: 'Read the scale at the front of the plunger, to the nearest 1 cm³.' },
    graph: { title: 'Volume when pushed (started at 50 cm³)', xLabel: 'Material', yLabel: 'Volume / cm³', yDomain: [0, 50], yStep: 10 },
    pattern: {
      q: 'What do your results show?',
      o: ['Air squashed a lot, water did not squash at all and sand only a little', 'All three squashed the same amount', 'Water squashed the most'],
      hint: 'Every syringe started at 50 cm³. Which volume changed most?',
      right: 'Yes. Gas particles have big spaces between them, so they can be pushed closer. Particles in liquids and solids are already touching. The sand only squashed a little because of the air between the grains.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Only the air compressed noticeably. Gas particles have large spaces between them; in liquids and solids the particles are already touching.',
      rows: rows.map((r) => [r.x, `50 → ${r.mean} cm³`]),
    }),
  });
})();
