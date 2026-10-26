/* Fruit decay at different temperatures (Grade 6, Stage 7: 7Be.01, 7TWSc.07). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;
  const DAYS = { 4: 14, 12: 8, 20: 5, 30: 3 };
  Investigation.run({
    id: 'g6-fruitdecay',
    guide: '../practical.html#g6-fruitdecay',
    objectives: ['I can record how fast fruit decays at different temperatures.', 'I can explain decay as the work of microorganisms.'],
    benchLabel: 'A slice of fruit in a sealed bag, kept at a different temperature each time, and a day counter.',
    state: { temp: 4, day: 0, mould: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[300, 'Fruit slice in a sealed bag'], [580, 'Day counter']]);
      const mould = s('g', null);
      const label = s('text', { x: 300, y: 130, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#33404d' }, '');
      const counter = D.display(530, 160, 110, 'Day');
      svg.append(s('rect', { x: 200, y: 150, width: 200, height: 210, rx: 10, fill: 'rgba(214, 232, 242, 0.3)', stroke: '#9aa5b1' }), s('path', { d: 'M230,330 Q300,190 370,330 Z', fill: '#f4e7b0', stroke: '#c94c3c', 'stroke-width': 4 }), mould, label, counter.g);
      return {
        update() {
          mould.replaceChildren(...Array.from({ length: Math.round(st.mould * 14) }, (_, i) => s('circle', { cx: 262 + (i * 37) % 76, cy: 300 - (i * 23) % 50, r: 6 + (i % 3) * 2, fill: i % 2 ? '#7aa860' : '#e9ece4', opacity: 0.9 })));
          label.textContent = `Kept at ${st.temp} °C`;
          counter.set(String(Math.round(st.day)));
        },
      };
    },
    measureTitle: 'Watch for mould',
    measureText: 'Keep a slice of the same fruit in a sealed bag at each temperature. Check it every day and record the day you first see mould.',
    measureWhy: 'Temperature is the variable you change. Use the same fruit, the same size slice and sealed bags, so the test is fair and safe.',
    measureTask: 'check the fruit each day until mould appears',
    measureButton: (v) => `Keep a slice at ${v} °C`,
    async measure(v, rep, api) {
      const { st } = api;
      st.temp = v;
      st.day = 0;
      st.mould = 0;
      const end = DAYS[v];
      await tween(600 + end * 120, (t, raw) => {
        st.day = end * raw;
        st.mould = raw > 0.85 ? (raw - 0.85) / 0.15 : 0;
        api.draw();
      });
      st.day = end;
      st.mould = 1;
      api.draw();
      return end;
    },
    iv: { label: 'Temperature', unit: '°C', values: [4, 12, 20, 30] },
    dv: { label: 'Days until mould appears', unit: 'days', dp: 0, tol: 0, placeholder: 'e.g. 6', readHint: 'Copy the day on the counter when mould first appears.' },
    graph: { title: 'Days until mould appears against temperature', xLabel: 'Temperature / °C', yLabel: 'Days until mould', xDomain: [0, 35], yDomain: [0, 16], xStep: 5, yStep: 2 },
    pattern: {
      q: 'What do your results show?',
      o: ['The warmer it was, the sooner the fruit went mouldy', 'The colder it was, the sooner the fruit went mouldy', 'Temperature made no difference'],
      hint: 'Fewer days means faster decay.',
      right: 'Yes. Bacteria and fungi break the fruit down, and they work faster when it is warm.',
      why: 'This is why we keep food in a fridge: the cold slows down the microorganisms.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Fruit decayed fastest in warm conditions. Bacteria and fungi break it down; they work faster when it is warm and slower when it is cold.',
      rows: rows.map((r) => [`${r.x} °C`, `${r.mean} days`]),
    }),
  });
})();
