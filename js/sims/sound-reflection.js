/* Reflection of sound from different surfaces (Grade 6, Stage 7: 7Ps.02, 7TWSp.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween, gauss } = K;

  const SPOT = { x: 360, y: 330 }; // where both tubes point on the surface
  const IN = { x: 210, y: 120 }; // top of the speaker tube
  const OUT = { x: 510, y: 120 }; // top of the meter tube
  const QUIET = 38; // background level in the room, dB
  const SURFACES = {
    Metal: { fill: '#b9c2ca', stroke: '#7d8893', level: 76 },
    Wood: { fill: '#b98a52', stroke: '#8a6236', level: 71 },
    Carpet: { fill: '#8f3b3b', stroke: '#6a2828', level: 57 },
    Foam: { fill: '#4b5058', stroke: '#30343a', level: 50 },
  };

  Investigation.run({
    id: 'g6-soundreflect',
    guide: '../practical.html#g6-soundreflect',
    objectives: ['I can compare how well different surfaces reflect sound.', 'I can explain why soft materials absorb sound.'],
    benchLabel: 'Two cardboard tubes pointing down at the same spot on a surface, with a screen between them. A speaker sits at the top of one tube and a sound meter at the top of the other.',
    state: { surface: null, slide: 0, ready: false, waves: [], level: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[IN.x, 'Ticking speaker'], [SPOT.x, 'Surface being tested'], [OUT.x, 'Sound meter']]);
      const tube = (a) => s('g', null,
        s('line', { x1: a.x, y1: a.y, x2: SPOT.x + (a.x < SPOT.x ? -18 : 18), y2: SPOT.y - 22, stroke: '#c9a46a', 'stroke-width': 30, 'stroke-linecap': 'butt' }),
        s('line', { x1: a.x, y1: a.y, x2: SPOT.x + (a.x < SPOT.x ? -18 : 18), y2: SPOT.y - 22, stroke: '#e2c897', 'stroke-width': 18, 'stroke-linecap': 'butt' }));
      const board = s('g', null);
      const screen = s('rect', { x: SPOT.x - 4, y: 110, width: 8, height: 170, fill: '#d9dee2', stroke: '#9aa5b1' });
      const speaker = s('g', null,
        s('rect', { x: IN.x - 26, y: IN.y - 52, width: 52, height: 40, rx: 6, fill: '#39424b' }),
        s('circle', { cx: IN.x, cy: IN.y - 32, r: 12, fill: '#59636d', stroke: '#222930', 'stroke-width': 2 }));
      const meter = D.display(OUT.x - 60, OUT.y - 60, 120, '');
      const waves = s('g', null);
      svg.append(board, tube(IN), tube(OUT), screen, waves, speaker, meter.g);
      return {
        update() {
          board.replaceChildren();
          const look = SURFACES[st.surface];
          if (look) {
            const y = SPOT.y + lerp(70, 0, st.slide);
            board.append(s('rect', { x: 190, y, width: 340, height: 30, rx: 3, fill: look.fill, stroke: look.stroke, 'stroke-width': 1.5 }));
            if (st.surface === 'Wood') for (let i = 0; i < 4; i++) board.append(s('path', { d: `M196,${y + 7 + i * 6} q80,-4 160,0 t160,0`, fill: 'none', stroke: '#8a6236', 'stroke-width': 0.8, opacity: 0.6 }));
            if (st.surface === 'Carpet') for (let x = 196; x < 528; x += 6) board.append(s('line', { x1: x, x2: x + 2, y1: y, y2: y - 4, stroke: '#6a2828', 'stroke-width': 1.5 }));
            if (st.surface === 'Foam') for (let x = 196; x < 528; x += 16) board.append(s('path', { d: `M${x},${y} l8,-9 l8,9`, fill: look.fill, stroke: look.stroke }));
            if (st.surface === 'Metal') board.append(s('rect', { x: 196, y: y + 4, width: 328, height: 5, fill: '#e3e8ec', opacity: 0.8 }));
          }
          screen.setAttribute('visibility', st.ready ? 'visible' : 'hidden');
          waves.replaceChildren(...st.waves.map((w) => s('path', { d: `M${w.x - 8},${w.y - 5} q8,7 16,0`, fill: 'none', stroke: '#2563d4', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: w.o.toFixed(2) })));
          meter.set(st.level === null ? '-- dB' : `${Math.round(st.level)} dB`);
        },
      };
    },
    setup: [{
      title: 'Line up the tubes',
      text: 'Point both tubes at the same spot on the surface, at equal angles. Stand a screen between them, then switch on the ticking speaker.',
      why: 'The screen stops sound travelling straight across from the speaker to the meter, so the meter only picks up sound that has bounced off the surface.',
      button: 'Put in the screen and switch on',
      done: 'The tubes are lined up and the speaker is ticking.',
      async run(api) {
        api.st.ready = true;
        api.st.level = QUIET;
        api.draw();
      },
    }],
    measureTitle: 'Measure the reflected sound',
    measureText: 'Put each surface under the tubes and record the sound level on the meter.',
    measureWhy: 'The surface is the variable you change. Keep the speaker volume, the tubes, the angles and the distance the same, so the test is fair.',
    measureTask: 'put the surface under the tubes and read the sound meter',
    measureButton: (v) => `Test the ${v.toLowerCase()} surface`,
    async measure(v, rep, api) {
      const { st } = api;
      st.surface = v;
      st.slide = 0;
      st.level = QUIET;
      await tween(500, (t) => {
        st.slide = t;
        api.draw();
      });
      const level = Math.round(SURFACES[v].level + gauss() * 0.8);
      const strength = (level - QUIET) / (80 - QUIET);
      // pulses down the speaker tube, then (weaker for soft surfaces) up the meter tube
      await tween(1600, (t, raw) => {
        st.waves = [0, 0.25, 0.5].map((lag) => {
          const p = (raw * 2 + lag) % 1;
          return p < 0.5
            ? { x: lerp(IN.x, SPOT.x, p * 2), y: lerp(IN.y, SPOT.y - 26, p * 2), o: 1 }
            : { x: lerp(SPOT.x, OUT.x, p * 2 - 1), y: lerp(SPOT.y - 26, OUT.y, p * 2 - 1), o: 0.2 + strength * 0.8 };
        });
        st.level = lerp(QUIET, level, Math.min(1, raw * 1.6)) + (raw < 0.9 ? gauss() * 1.5 : 0);
        api.draw();
      });
      st.waves = [];
      st.level = level;
      api.draw();
      return level;
    },
    iv: { label: 'Surface', unit: '', values: ['Metal', 'Wood', 'Carpet', 'Foam'], categorical: true },
    dv: { label: 'Sound level', unit: 'dB', dp: 0, tol: 0, placeholder: 'e.g. 64', readHint: 'Copy the number on the sound meter, in decibels (dB).' },
    graph: { title: 'Reflected sound from each surface', xLabel: 'Surface', yLabel: 'Sound level / dB', yDomain: [0, 80], yStep: 20 },
    pattern: {
      q: 'What do your results show?',
      o: ['Hard, smooth surfaces reflect sound best; soft surfaces absorb it', 'Soft surfaces reflect sound best', 'All the surfaces reflect sound equally well'],
      hint: 'A higher sound level means more sound bounced off the surface into the second tube.',
      right: 'Yes. Metal and wood are hard and smooth, so most of the sound bounces off. Carpet and foam are soft and full of tiny air pockets, which absorb the sound energy.',
      why: 'This is why music studios and cinemas have soft, padded walls: they stop echoes.',
    },
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Hard, smooth surfaces such as metal and wood reflected the most sound. Soft surfaces such as carpet and foam absorbed sound, so they are used to stop echoes.',
      rows: rows.map((r) => [r.x, `${r.mean} dB`]),
    }),
  });
})();
