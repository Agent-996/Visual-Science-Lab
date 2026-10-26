/* Displacement reactions (Grade 7, Stage 8: 8Cc.03, 8Cc.01). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;

  const BLUE = [60, 130, 215, 0.6];
  const PALE_GREEN = [170, 210, 150, 0.55];
  const CLEAR = [225, 236, 244, 0.5];
  const METAL = { Iron: '#7d838a', Zinc: '#aab3bb', Copper: '#c46f3c' };
  const SEEN = { yes: 'A pink-brown coating forms and the blue colour fades', no: 'No change' };
  const SAMPLES = [
    { name: 'Iron nail in copper(II) sulfate', metal: 'Iron', from: BLUE, to: PALE_GREEN, reacts: true },
    { name: 'Zinc in copper(II) sulfate', metal: 'Zinc', from: BLUE, to: CLEAR, reacts: true },
    { name: 'Copper in iron(II) sulfate', metal: 'Copper', from: PALE_GREEN, to: PALE_GREEN, reacts: false },
    { name: 'Iron nail in zinc sulfate', metal: 'Iron', from: CLEAR, to: CLEAR, reacts: false },
    { name: 'Copper in zinc sulfate', metal: 'Copper', from: CLEAR, to: CLEAR, reacts: false },
  ];
  const rgba = (a, b, t) => `rgba(${a.map((v, k) => (k < 3 ? Math.round(lerp(v, b[k], t)) : lerp(v, b[k], t).toFixed(2))).join(', ')})`;
  const tubeX = (i) => 140 + i * 110;

  Observation.run({
    id: 'g7-displacement',
    guide: '../practical.html#g7-displacement',
    objectives: ['I can carry out a displacement reaction.', 'I can explain it using the reactivity series.'],
    benchLabel: 'Five test tubes in a rack. Each holds a metal standing in the solution of a different metal compound, and a timer.',
    state: { placed: SAMPLES.map(() => 0), react: SAMPLES.map(() => 0), minutes: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[360, 'Metals in solutions of metal compounds'], [650, 'Timer']]);
      svg.append(s('rect', { x: 90, y: 250, width: 500, height: 14, rx: 3, fill: '#b98a52', stroke: '#8a6236' }), s('rect', { x: 90, y: 380, width: 500, height: 12, rx: 3, fill: '#b98a52', stroke: '#8a6236' }));
      const parts = SAMPLES.map((x, i) => {
        const tube = D.tube(tubeX(i), 376, 38, 200, rgba(x.from, x.from, 0)).setLevel(0.6);
        const metal = s('rect', { x: tubeX(i) - 5, width: 10, height: 170, rx: 2, fill: METAL[x.metal], stroke: '#4a5058', 'stroke-width': 0.8 });
        const coat = s('rect', { x: tubeX(i) - 6, y: 268, width: 12, height: 94, rx: 3, fill: '#b5532a', opacity: 0 });
        const label = s('text', { x: tubeX(i), y: 150, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#33404d' }, String(i + 1));
        return { tube, metal, coat, g: s('g', null, tube.g, metal, coat, label) };
      });
      const timer = D.display(600, 40, 100, 'Timer');
      svg.append(...parts.map((p) => p.g), timer.g);
      return {
        update() {
          parts.forEach((p, i) => {
            const x = SAMPLES[i];
            p.metal.setAttribute('y', lerp(40, 196, st.placed[i]));
            p.metal.setAttribute('visibility', st.placed[i] > 0 ? 'visible' : 'hidden');
            p.coat.setAttribute('opacity', x.reacts ? st.react[i] * 0.9 : 0);
            p.tube.setColour(rgba(x.from, x.to, st.react[i]));
          });
          timer.set(`${Math.round(st.minutes)} min`);
        },
      };
    },
    tests: {
      label: 'Metal and solution',
      title: 'Put each metal in a solution',
      text: 'Clean each metal with sandpaper, put it in its solution and look at it after 10 minutes.',
      why: 'Sandpaper removes the oxide layer on the metal, so the clean metal touches the solution.',
      task: 'put the metal in and wait 10 minutes',
      button: (x) => `Add the ${x.metal.toLowerCase()} and wait 10 minutes`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        const i = SAMPLES.indexOf(x);
        await tween(600, (t) => {
          st.placed[i] = t;
          st.minutes = 0;
          api.draw();
        });
        await tween(1500, (t, raw) => {
          st.react[i] = t;
          st.minutes = 10 * raw;
          api.draw();
        });
      },
      columns: [{
        label: 'What you see',
        q: (x) => `${x.name}: what do you see after 10 minutes?`,
        task: 'record what you see',
        options: [SEEN.yes, SEEN.no, 'Bubbles of gas form'],
        short: (v) => (v === SEEN.yes ? 'Pink-brown coating; colour fades' : v),
        answer: (x) => (x.reacts ? SEEN.yes : SEEN.no),
        hint: () => 'Look at the metal and at the colour of the solution. Have either of them changed?',
      }, {
        label: 'Metal displaced?',
        q: (x) => `${x.name}: did the ${x.metal.toLowerCase()} displace the other metal from its compound?`,
        task: 'decide whether a displacement happened',
        options: ['Yes', 'No'],
        answer: (x) => (x.reacts ? 'Yes' : 'No'),
        right: (x) => (x.reacts ? `Yes. ${x.metal} is more reactive, so it pushed the copper out of the copper(II) sulfate.` : `No. ${x.metal} is less reactive than the metal in the solution, so nothing happened.`),
        hint: () => 'A displacement shows up as a new metal coating and a change in the colour of the solution.',
      }],
    },
    questions: [{
      title: 'Write the word equation',
      text: 'Use your result for tube 1.',
      q: 'Which word equation shows what happened in tube 1?',
      o: ['iron + copper sulfate → iron sulfate + copper', 'copper + iron sulfate → copper sulfate + iron', 'iron + copper sulfate → iron + copper + sulfate'],
      hint: 'The more reactive metal takes the place of the less reactive one in the compound.',
      right: 'Yes. Iron is more reactive than copper, so it takes copper’s place. The copper comes out as the pink-brown coating.',
    }, {
      title: 'Make a reactivity series',
      text: 'Use all five results.',
      q: 'Put zinc, iron and copper in order of reactivity, most reactive first.',
      o: ['Zinc, iron, copper', 'Copper, iron, zinc', 'Iron, zinc, copper'],
      hint: 'Zinc and iron both displaced copper. Did iron displace zinc?',
      right: 'Yes. Zinc and iron both displace copper, but iron cannot displace zinc, so zinc is the most reactive and copper the least.',
      why: 'A more reactive metal displaces a less reactive metal from its compounds.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Iron and zinc displaced copper from copper(II) sulfate, coating themselves in pink-brown copper. Copper displaced nothing, and iron could not displace zinc. Order of reactivity: zinc, iron, copper.',
      rows: rows.map((r) => [r.name, r.cells[1] === 'Yes' ? 'displacement' : 'no reaction']),
    }),
  });
})();
