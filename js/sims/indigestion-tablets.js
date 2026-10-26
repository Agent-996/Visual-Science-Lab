/* Indigestion tablets: which neutralises the most acid? (Grade 6, Stage 7: 7Cc.04, 7TWSp.04, 7TWSa.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween, lerp } = K;
  const VOL = { 'Tablet A': 18.5, 'Tablet B': 24.0, 'Tablet C': 12.5, 'Tablet D': 30.5 };
  const mix = (t) => `rgb(${Math.round(lerp(40, 60, t))}, ${Math.round(lerp(110, 160, t))}, ${Math.round(lerp(215, 70, t))})`;
  Investigation.run({
    id: 'g6-tablets',
    guide: '../practical.html#g6-tablets',
    objectives: ['I can plan a fair test to compare indigestion tablets.', 'I can explain how antacids neutralise stomach acid.'],
    benchLabel: 'A burette of dilute hydrochloric acid above a conical flask holding a crushed indigestion tablet in water with universal indicator.',
    state: { tablet: null, added: 0, done: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Burette of acid over the tablet in water']]);
      const flaskLiquid = s('path', { d: 'M262,392 L282,340 L318,340 L338,392 Z' });
      const drop = s('circle', { cx: 300, r: 3, fill: 'rgba(214, 232, 242, 0.9)', stroke: '#7f97a8', visibility: 'hidden' });
      const level = s('rect', { x: 293, width: 14, fill: 'rgba(214, 232, 242, 0.9)' });
      const name = s('text', { x: 400, y: 380, 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, '');
      svg.append(s('rect', { x: 292, y: 40, width: 16, height: 220, fill: 'rgba(240, 246, 250, 0.9)', stroke: '#7f97a8' }), level, s('path', { d: 'M296,260 L304,260 L301,290 L299,290 Z', fill: '#7f97a8' }), flaskLiquid, s('path', { d: 'M286,300 L286,330 L256,396 L344,396 L314,330 L314,300', fill: 'none', stroke: '#7f97a8', 'stroke-width': 2 }), drop, name);
      return {
        update() {
          const top = 44 + st.added * 4;
          level.setAttribute('y', top);
          level.setAttribute('height', Math.max(0, 258 - top));
          flaskLiquid.setAttribute('fill', mix(st.done));
          drop.setAttribute('visibility', st.drip ? 'visible' : 'hidden');
          if (st.drip) drop.setAttribute('cy', st.drip);
          name.textContent = st.tablet || '';
        },
      };
    },
    closeUp: { kind: 'burette', caption: 'Burette scale (cm³)', label: 'Close-up of the burette scale at the bottom of the meniscus', span: 4, minor: 0.1, major: 1, labelEvery: 1, min: 0, max: 50, value: (st) => (st.tablet ? st.added : null) },
    measureTitle: 'Neutralise each tablet',
    measureText: 'Crush one tablet into 50 cm³ of water with indicator; it turns blue. Fill the burette to 0.0 cm³ and add acid until the indicator just turns green. Read the burette.',
    measureWhy: 'The tablet is the variable you change. Use one whole tablet, the same water and the same acid each time. The more acid a tablet neutralises, the better it works.',
    measureTask: 'add acid until the indicator turns green, then read the burette',
    measureButton: (v) => `Neutralise ${v.toLowerCase()}`,
    async measure(v, rep, api) {
      const { st } = api;
      st.tablet = v;
      st.added = 0;
      st.done = 0;
      api.draw();
      const end = VOL[v];
      await tween(1600, (t, raw) => {
        st.added = end * raw;
        st.done = raw > 0.85 ? (raw - 0.85) / 0.15 : 0;
        st.drip = 290 + ((raw * 1600) % 200) / 2;
        api.draw();
      });
      st.drip = null;
      st.added = end;
      st.done = 1;
      api.draw();
      return end;
    },
    iv: { label: 'Tablet', unit: '', values: Object.keys(VOL), categorical: true },
    dv: { label: 'Acid neutralised', unit: 'cm³', dp: 1, tol: 0.1, placeholder: 'e.g. 20.5', readHint: 'Read the burette at the bottom of the meniscus, to 0.1 cm³.' },
    graph: { title: 'Volume of acid each tablet neutralised', xLabel: 'Tablet', yLabel: 'Acid neutralised / cm³', yDomain: [0, 35], yStep: 5 },
    pattern: {
      q: 'Which tablet is best at neutralising acid?',
      o: ['Tablet D, because it neutralised the most acid', 'Tablet C, because it needed the least acid', 'They are all the same'],
      hint: 'The more acid a tablet neutralises before the indicator turns green, the more effective it is.',
      right: 'Yes. Tablet D neutralised the most acid, so it would neutralise the most stomach acid.',
      why: 'Antacids contain bases (often carbonates) that react with and neutralise stomach acid.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Tablet D neutralised the most acid before the indicator changed colour. Antacids contain bases that neutralise stomach acid.',
      rows: rows.map((r) => [r.x, `${r.mean} cm³`]),
    }),
  });
})();
