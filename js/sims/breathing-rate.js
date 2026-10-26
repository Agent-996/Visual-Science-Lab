/* Breathing rate before and after exercise (Grade 7, Stage 8: 8Bs.03, 8TWSc.07, 8TWSa.02). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss } = K;

  const ST = { breaths: 0, seconds: 0, lift: 0, rest: null, count: null };
  const rateAfter = (t) => Math.max(ST.rest, Math.round(ST.rest + 17 * Math.exp(-t / 1.6) + gauss() * 0.6));
  const clock = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

  // Counts breaths for one minute at the given rate, animating the chest.
  async function countMinute(rate, api) {
    const { st } = api;
    st.breaths = 0;
    st.seconds = 0;
    await tween(2400, (t, raw) => {
      st.breaths = rate * raw;
      st.count = Math.floor(st.breaths + 1e-9);
      st.seconds = 60 * raw;
      api.draw();
    });
    st.breaths = rate;
    st.count = rate;
    st.seconds = 60;
    api.draw();
  }

  Investigation.run({
    id: 'g7-breathingrate',
    guide: '../practical.html#g7-breathingrate',
    objectives: ['I can measure breathing rate and chest expansion.', 'I can explain why breathing rate increases during exercise.'],
    benchLabel: 'A student standing by a step, with a stopwatch and a counter showing the number of breaths counted.',
    state: ST,
    scene(svg, D, st) {
      D.bench(svg, 440, [[230, 'Student and a step'], [530, 'Stopwatch and breath counter']]);
      const step = s('rect', { x: 150, y: 352, width: 70, height: 48, rx: 3, fill: '#c8b89a', stroke: '#9b8a6c' });
      const chest = s('ellipse', { cx: 250, cy: 222, ry: 46, fill: '#4f8fd8', stroke: '#2f6db5', 'stroke-width': 2 });
      const legL = s('path', { fill: 'none', stroke: '#3a4552', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      const legR = s('path', { d: 'M260,262 L262,392', fill: 'none', stroke: '#3a4552', 'stroke-width': 13, 'stroke-linecap': 'round' });
      const body = s('g', null,
        legR,
        legL,
        s('path', { d: 'M226,196 L208,262 M274,196 L292,262', stroke: '#e2b48c', 'stroke-width': 10, 'stroke-linecap': 'round' }),
        chest,
        s('rect', { x: 243, y: 158, width: 14, height: 14, fill: '#e2b48c' }),
        s('circle', { cx: 250, cy: 140, r: 22, fill: '#e2b48c', stroke: '#b5835a' }),
        s('path', { d: 'M229,134 q21,-26 42,0 q-6,-18 -21,-18 q-15,0 -21,18 z', fill: '#3b2a20' }));
      const watch = D.display(460, 120, 140, 'Stopwatch');
      const counter = D.display(460, 230, 140, 'Breaths counted');
      svg.append(step, body, watch.g, counter.g);
      return {
        update() {
          const phase = (1 - Math.cos(2 * Math.PI * st.breaths)) / 2;
          chest.setAttribute('rx', (30 + phase * 5).toFixed(2));
          // step-ups: the left foot goes up onto the step and the body rises
          const up = st.lift;
          legL.setAttribute('d', `M240,262 L${lerp(238, 204, up)},${lerp(330, 312, up)} L${lerp(238, 196, up)},${lerp(392, 344, up)}`);
          body.setAttribute('transform', `translate(0 ${(-up * 10).toFixed(1)})`);
          watch.set(clock(st.seconds));
          counter.set(st.count === null ? '--' : String(st.count));
        },
      };
    },
    setup: [{
      title: 'Measure your resting breathing rate',
      text: 'Sit still for a few minutes, then count your breaths for one minute. One breath in and out counts as one.',
      why: 'You need a resting rate to compare with, so you can tell when your body has recovered after exercise.',
      button: 'Count breaths for one minute',
      async run(api) {
        ST.rest = Math.round(14 + gauss() * 0.8);
        await countMinute(ST.rest, api);
        api.say(`Your resting breathing rate is ${ST.rest} breaths per minute.`, 'good');
      },
    }, {
      title: 'Exercise for 2 minutes',
      text: 'Do gentle step-ups onto a low step for 2 minutes.',
      why: 'Exercise makes your muscles work harder, so they need more energy from respiration.',
      button: 'Start the step-ups',
      done: 'Two minutes of step-ups done. Start counting straight away.',
      async run(api) {
        const { st } = api;
        st.breaths = 0;
        st.count = null;
        await tween(2600, (t, raw) => {
          st.seconds = 120 * raw;
          st.lift = (1 - Math.cos(raw * 2 * Math.PI * 8)) / 2;
          st.breaths = raw * 50;
          api.draw();
        });
        st.lift = 0;
        st.breaths = 0;
        st.seconds = 0;
        api.draw();
      },
    }],
    measureTitle: 'Count your breaths every minute',
    measureText: 'Straight after exercise, count your breaths for one minute. Keep counting minute by minute until your breathing is back to normal.',
    measureWhy: 'Counting for a whole minute every time gives the rate in breaths per minute. Carrying on until your breathing is back to normal shows how long you take to recover.',
    measureTask: 'count your breaths for one minute',
    measureButton: (v) => (v === 0 ? 'Count breaths straight after exercise' : `Count breaths starting at ${v} min`),
    async measure(v, rep, api) {
      const rate = rateAfter(v);
      await countMinute(rate, api);
      return rate;
    },
    iv: { label: 'Time after exercise', unit: 'min', values: [0, 1, 2, 3, 4, 5, 6] },
    dv: { label: 'Breathing rate', unit: 'breaths/min', dp: 0, tol: 0, placeholder: 'e.g. 24', readHint: 'Copy the number of breaths counted in that minute.' },
    graph: { title: 'Breathing rate after exercise', xLabel: 'Time after exercise / min', yLabel: 'Breaths per minute', xDomain: [0, 7], yDomain: [0, 40], xStep: 1, yStep: 10 },
    pattern: {
      q: 'What do your results show?',
      o: ['Breathing rate was highest straight after exercise, then fell back to the resting rate', 'Breathing rate stayed high for the whole time', 'Breathing rate was lowest straight after exercise'],
      hint: 'Compare the first reading with your resting rate, then look at how the readings change.',
      right: 'Yes. During exercise your muscles respire faster, so they need more oxygen and make more carbon dioxide. You breathe faster to bring in oxygen and remove carbon dioxide, then slow down as your body recovers.',
      why: 'Fitter people usually have a lower resting rate and recover more quickly.',
    },
    extra: [{
      title: 'How long did you take to recover?',
      text: 'Use your table. At what time after exercise was your breathing rate first back to within 1 breath of your resting rate?',
      why: 'Recovery time is one way to measure fitness: the fitter you are, the faster you recover.',
      label: 'Recovery time',
      short: 'Recovered after',
      unit: 'min',
      dp: 0,
      placeholder: 'e.g. 4',
      expected: (rows) => (rows.find((r) => r.mean <= ST.rest + 1) || rows[rows.length - 1]).x,
      tol: 0.5,
      hint: 'Find the first row where the breathing rate is no more than 1 above your resting rate.',
      msg: (v) => `About ${Math.round(v)} minutes. Your resting rate was ${ST.rest} breaths per minute.`,
      mark: (v) => ({ x: v, y: ST.rest, label: 'Recovered', dx: 12, dy: -14 }),
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Breathing rate shot up after exercise and then fell back to normal over a few minutes. Exercising muscles respire faster, so they need more oxygen and must get rid of more carbon dioxide.',
      rows: [['Resting rate', `${ST.rest} breaths/min`], ['First minute after exercise', `${rows[0].mean} breaths/min`], ['After 6 minutes', `${rows[rows.length - 1].mean} breaths/min`]],
    }),
  });
})();
