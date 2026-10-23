/* Cooling curve of stearic acid (Grade 6, Stage 7: 7Cm.06, 7TWSa.05). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, clamp, tween } = K;

  const ROOM = 22;
  const FREEZE = 69.3; // °C
  const COOL = 0.12; // per minute
  const START = 80;
  const t1 = Math.log((START - ROOM) / (FREEZE - ROOM)) / COOL; // minutes until freezing starts
  const t2 = t1 + 4; // freezing takes about 4 minutes
  const tempAt = (t) => (t <= t1 ? ROOM + (START - ROOM) * Math.exp(-COOL * t) : t <= t2 ? FREEZE : ROOM + (FREEZE - ROOM) * Math.exp(-COOL * (t - t2)));
  const solidAt = (t) => clamp((t - t1) / (t2 - t1), 0, 1);
  const mmss = (min) => {
    const sec = Math.round(min * 60);
    return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
  };

  Investigation.run({
    id: 'g6-cooling',
    guide: '../practical.html#g6-cooling',
    objectives: ['I can record the temperature of a cooling liquid as it freezes.', 'I can find the freezing point from the flat part of a cooling curve.'],
    benchLabel: 'Lab bench: a water bath, a boiling tube of stearic acid with a thermometer, a test tube rack and a stopwatch.',
    state: { x: 160, lift: 0, temp: ROOM, solid: 1, time: 0, timing: false },
    scene(svg, D, st) {
      D.bench(svg, 440, [[160, 'Hot water bath', '(about 85 °C)'], [400, 'Stearic acid in', 'a boiling tube'], [590, 'Stopwatch']]);
      const bath = D.beaker(160, 400, 130, 120, 'rgba(255, 196, 160, 0.55)').setLevel(0.8);
      svg.append(bath.g, s('rect', { x: 340, y: 330, width: 120, height: 14, rx: 3, fill: '#b98e5a' }), s('rect', { x: 345, y: 344, width: 8, height: 56, fill: '#a87d4a' }), s('rect', { x: 447, y: 344, width: 8, height: 56, fill: '#a87d4a' }));
      const liquid = s('rect', { x: -10, y: 300, width: 20, height: 70, fill: 'rgba(250, 247, 232, 0.75)' });
      const solid = s('rect', { x: -10, y: 300, width: 20, height: 70, fill: '#f3efe2' });
      const therm = D.thermometer(0, 150, 200, 0, 110);
      const tube = s('g', null,
        s('defs', null, s('clipPath', { id: 'tube-in' }, s('path', { d: 'M-10,200 L-10,360 A10,10 0 0 0 10,360 L10,200 Z' }))),
        s('g', { 'clip-path': 'url(#tube-in)' }, liquid, solid),
        s('path', { d: 'M-11,196 L-11,360 A11,11 0 0 0 11,360 L11,196', ...D.GLASS, fill: 'none' }),
        therm.g);
      const watch = D.display(530, 250, 120, 'Stopwatch');
      svg.append(tube, watch.g);
      return {
        update() {
          tube.setAttribute('transform', `translate(${st.x} ${-st.lift + (st.x < 300 ? 18 : -18)})`);
          therm.set(st.temp);
          solid.setAttribute('opacity', st.solid.toFixed(2));
          watch.set(mmss(st.time));
        },
      };
    },
    closeUp: { kind: 'thermometer', label: 'Close-up of the thermometer', span: 14, minor: 1, major: 10, labelEvery: 5, min: 0, max: 110, value: (st) => st.temp },
    setup: [
      {
        title: 'Melt the stearic acid',
        text: 'Stand the boiling tube of solid stearic acid in a hot water bath until it has all melted and reaches about 80 °C.',
        why: 'Stearic acid is flammable, so it is melted in a water bath, never over a flame.',
        button: 'Heat in the water bath',
        done: 'The stearic acid has melted. It is now a clear liquid at 80 °C.',
        async run(api) {
          const { st } = api;
          await tween(2200, (t) => {
            st.temp = lerp(ROOM, START, t);
            st.solid = 1 - clamp(t * 1.4 - 0.2, 0, 1);
            api.draw();
          });
        },
      },
      {
        title: 'Move the tube and start the stopwatch',
        text: 'Take the tube out of the water bath, stand it in the rack and start the stopwatch straight away.',
        why: 'Starting the stopwatch as soon as the tube leaves the bath means every reading is timed from the same moment.',
        button: 'Move the tube and start timing',
        async run(api) {
          const { st } = api;
          await tween(1100, (t) => {
            st.x = lerp(160, 400, t);
            st.lift = Math.sin(t * Math.PI) * 60;
            api.draw();
          });
          st.time = 0;
          api.draw();
        },
      },
    ],
    measureTitle: 'Record the temperature every minute',
    measureText: 'Read the thermometer at the start, then every minute for 10 minutes as the stearic acid cools and turns solid.',
    measureWhy: 'Taking readings at equal time intervals gives a clear cooling curve. Watch for when the temperature stops falling.',
    measureTask: 'read the thermometer',
    measureButton: (v) => (v === 0 ? 'Read the temperature now' : 'Wait 1 minute'),
    async measure(v, rep, api) {
      const { st } = api;
      const from = st.time;
      if (v > from) {
        await tween(1300, (t) => {
          st.time = lerp(from, v, t);
          st.temp = tempAt(st.time);
          st.solid = solidAt(st.time);
          api.draw();
        });
      }
      st.time = v;
      st.temp = tempAt(v);
      st.solid = solidAt(v);
      api.draw();
      return st.temp;
    },
    iv: { label: 'Time', unit: 'min', values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    dv: { label: 'Temperature', unit: '°C', dp: 0, tol: 1, placeholder: 'e.g. 75', readHint: 'Read the scale level with the top of the red liquid. Each small division is 1 °C.' },
    graph: { title: 'Cooling curve of stearic acid', xLabel: 'Time / min', yLabel: 'Temperature / °C', xDomain: [0, 10], yDomain: [40, 90], yStep: 10 },
    pattern: {
      q: 'What happened to the temperature while the stearic acid was turning solid?',
      o: ['It stayed the same for a few minutes', 'It fell faster than before', 'It went up'],
      hint: 'Look for the flat part of your graph.',
      right: 'Yes. While the liquid freezes, it gives out energy as the particles join together, so the temperature stays the same.',
      why: 'A flat section on a cooling curve shows a change of state. The temperature of that flat part is the freezing point.',
    },
    extra: [{
      title: 'Find the freezing point',
      text: 'Read the temperature of the flat part of your cooling curve.',
      why: 'A pure substance freezes (and melts) at one fixed temperature. For stearic acid it is about 69 °C.',
      label: 'Freezing point of stearic acid',
      short: 'Freezing point',
      unit: '°C',
      dp: 0,
      placeholder: 'e.g. 69',
      expected: () => FREEZE,
      tol: 1.6,
      hint: 'Find the temperature where your graph is flat.',
      msg: (v) => `The freezing point is about ${Math.round(v)} °C.`,
      mark: (v) => ({ x: (t1 + t2) / 2, y: v, label: 'Freezing point', dx: 12, dy: -14 }),
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The temperature fell, stayed at about 69 °C while the stearic acid froze, then fell again. The flat part shows the change of state from liquid to solid.',
      rows: [['Starting temperature', `${rows[0].mean} °C`], ['Temperature after 10 minutes', `${rows[rows.length - 1].mean} °C`], ['Freezing point', 'about 69 °C']],
    }),
  });
})();
