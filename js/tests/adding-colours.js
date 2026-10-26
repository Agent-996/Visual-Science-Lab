/* Adding colours of light (Grade 7, Stage 8: 8Ps.04). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, tween } = K;

  const LIGHT = { red: '#ff2a2a', green: '#2aff2a', blue: '#2a5cff' };
  const SPOT = { red: { x: 330, y: 180 }, green: { x: 410, y: 180 }, blue: { x: 370, y: 250 } };
  const TORCH = { red: 110, green: 200, blue: 290 }; // y of each torch
  const SWATCH = { Yellow: '#ffef3a', Magenta: '#ff3aff', Cyan: '#3affff', White: '#ffffff', Brown: '#7a4a1f', Black: '#16181b' };
  const SAMPLES = [
    { name: 'Red + green', on: ['red', 'green'], colour: 'Yellow', kind: 'Secondary' },
    { name: 'Red + blue', on: ['red', 'blue'], colour: 'Magenta', kind: 'Secondary' },
    { name: 'Green + blue', on: ['green', 'blue'], colour: 'Cyan', kind: 'Secondary' },
    { name: 'Red + green + blue', on: ['red', 'green', 'blue'], colour: 'White', kind: 'Neither: it is white light' },
  ];

  Observation.run({
    id: 'g7-addingcolours',
    guide: '../practical.html#g7-addingcolours',
    objectives: ['I can mix red, green and blue light to make other colours.', 'I can name the primary and secondary colours of light.'],
    benchLabel: 'In a dark room, red, green and blue torches shine onto a white card so that their spots of light overlap.',
    state: { on: [], power: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[110, 'Red, green and blue torches'], [395, 'White card in a dark room']]);
      svg.append(s('rect', { x: 0, y: 0, width: 720, height: 400, fill: '#121417' }));
      const card = s('rect', { x: 230, y: 50, width: 330, height: 320, rx: 4, fill: '#1d2025', stroke: '#3a3f45' });
      const beams = s('g', null);
      const spots = s('g', { style: 'isolation: isolate' });
      const torches = Object.entries(TORCH).map(([c, y]) => s('g', null,
        s('rect', { x: 40, y: y - 14, width: 64, height: 28, rx: 5, fill: '#4a525b', stroke: '#2b333b' }),
        s('rect', { x: 100, y: y - 17, width: 12, height: 34, rx: 3, fill: LIGHT[c], opacity: 0.85 })));
      svg.append(card, beams, spots, ...torches);
      return {
        update() {
          beams.replaceChildren(...st.on.map((c) => s('path', { d: `M112,${TORCH[c] - 12} L${SPOT[c].x},${SPOT[c].y - 80} L${SPOT[c].x},${SPOT[c].y + 80} L112,${TORCH[c] + 12} Z`, fill: LIGHT[c], opacity: (0.08 * st.power).toFixed(3) })));
          spots.replaceChildren(...st.on.map((c) => s('circle', { cx: SPOT[c].x, cy: SPOT[c].y, r: 80, fill: LIGHT[c], opacity: st.power.toFixed(3), style: 'mix-blend-mode: screen' })));
        },
      };
    },
    tests: {
      label: 'Lights shone together',
      title: 'Mix the coloured lights',
      text: 'Shine the torches onto the same part of the white card so the spots overlap. Look at the colour where they overlap.',
      why: 'A dark room means the only light on the card comes from the torches, so you see their colours clearly.',
      task: 'switch on the torches',
      button: (x) => `Shine ${x.name.toLowerCase()}`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        await tween(250, (t) => {
          st.power = 1 - t;
          api.draw();
        });
        st.on = x.on;
        await tween(800, (t) => {
          st.power = t;
          api.draw();
        });
      },
      columns: [{
        label: 'Colour where they overlap',
        q: (x) => `${x.name}: what colour do you see where the lights overlap${x.on.length === 3 ? ' in the middle' : ''}?`,
        task: 'record the colour where the lights overlap',
        options: Object.keys(SWATCH),
        swatches: SWATCH,
        answer: (x) => x.colour,
        hint: () => 'Look at the part of the card where the spots of light overlap, not the single colours around it.',
      }, {
        label: 'Primary or secondary?',
        q: (x) => `Is ${x.colour.toLowerCase()} a primary or a secondary colour of light?`,
        task: 'decide whether it is a primary or secondary colour',
        options: ['Primary', 'Secondary', 'Neither: it is white light'],
        answer: (x) => x.kind,
        hint: () => 'The primary colours of light are red, green and blue. A secondary colour is made by adding two primaries.',
      }],
    },
    questions: [{
      q: 'What are the three primary colours of light?',
      o: ['Red, green and blue', 'Red, yellow and blue', 'Cyan, magenta and yellow'],
      hint: 'Which torches did you use to make every other colour?',
      right: 'Yes. Red, green and blue light can be added together to make every other colour, including white.',
    }, {
      title: 'Light compared with paint',
      text: 'Mixing paints gives a different result.',
      q: 'Why does mixing red and green light make yellow, when mixing red and green paint makes brown?',
      o: ['Coloured lights add together, but paints absorb (take away) colours from white light', 'Light and paint are made of the same particles', 'Paint gives out its own light'],
      hint: 'Did each torch add light to the card, or take it away?',
      right: 'Yes. Each torch adds more light, so the mixture is brighter. Each paint absorbs some colours, so a mixture of paints reflects less light and looks darker.',
      why: 'Phone and TV screens make every colour by mixing tiny red, green and blue lights.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Red + green made yellow, red + blue made magenta and green + blue made cyan. All three primary colours of light together made white.',
      rows: [['Red + green', 'yellow'], ['Red + blue', 'magenta'], ['Green + blue', 'cyan'], ['Red + green + blue', 'white']],
    }),
  });
})();
