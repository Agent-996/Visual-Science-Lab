/* Universal indicator rainbow (Grade 6, Stage 7: 7Cp.03, 7TWSa.05). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;

  const COLOURS = { Red: '#d7263d', Orange: '#f07a2a', Yellow: '#f2c230', Green: '#2e9e44', Blue: '#1f6fd1', Purple: '#6a2a9a' };
  const SAMPLES = [
    { name: 'pH 1', pH: 1, colour: 'Red', shade: '#d7263d' },
    { name: 'pH 3', pH: 3, colour: 'Orange', shade: '#f07a2a' },
    { name: 'pH 5', pH: 5, colour: 'Yellow', shade: '#f2c230' },
    { name: 'pH 7', pH: 7, colour: 'Green', shade: '#2e9e44' },
    { name: 'pH 9', pH: 9, colour: 'Blue', shade: '#1f6fd1' },
    { name: 'pH 11', pH: 11, colour: 'Purple', shade: '#4b3aa8' },
    { name: 'pH 13', pH: 13, colour: 'Purple', shade: '#6a2a9a' },
  ];
  const wellX = (i) => 150 + i * 70;
  const WELL_Y = 240;

  Observation.run({
    id: 'g6-rainbow',
    guide: '../practical.html#g6-rainbow',
    objectives: ['I can make a full pH colour range using universal indicator.', 'I can present results as a labelled colour chart.'],
    benchLabel: 'A white spotting tile with a row of seven wells, each holding a solution from pH 1 to pH 13, and a dropper of universal indicator.',
    state: { filled: 0, mix: SAMPLES.map(() => 0), dropper: null, drop: null },
    scene(svg, D, st) {
      D.bench(svg, 440, [[360, 'Spotting tile: solutions from pH 1 to pH 13'], [640, 'Universal indicator']]);
      const tile = s('rect', { x: 105, y: 190, width: 510, height: 110, rx: 14, fill: '#ffffff', stroke: '#c9d1d9', 'stroke-width': 2 });
      const wells = SAMPLES.map((x, i) => {
        const liquid = s('circle', { cx: wellX(i), cy: WELL_Y, r: 21, fill: 'rgba(214, 232, 242, 0.9)' });
        const colour = s('circle', { cx: wellX(i), cy: WELL_Y, fill: x.shade });
        return { liquid, colour, g: s('g', null,
          s('circle', { cx: wellX(i), cy: WELL_Y, r: 25, fill: '#f1f4f6', stroke: '#c9d1d9', 'stroke-width': 1.5 }),
          liquid,
          colour,
          s('text', { x: wellX(i), y: WELL_Y + 46, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600, fill: '#33404d' }, x.name)) };
      });
      const bottle = s('g', null,
        s('rect', { x: 620, y: 340, width: 40, height: 52, rx: 5, fill: '#2e9e44', 'fill-opacity': 0.75, stroke: '#7f97a8' }),
        s('rect', { x: 632, y: 326, width: 16, height: 14, fill: '#39424b' }));
      const pipette = s('g', null,
        s('rect', { x: -5, y: -70, width: 10, height: 56, rx: 2, fill: 'rgba(214, 232, 242, 0.8)', stroke: '#7f97a8' }),
        s('path', { d: 'M-2,-14 L0,-2 L2,-14 Z', fill: 'rgba(214, 232, 242, 0.8)', stroke: '#7f97a8' }),
        s('rect', { x: -4, y: -40, width: 8, height: 24, fill: '#2e9e44', 'fill-opacity': 0.7 }),
        s('ellipse', { cx: 0, cy: -80, rx: 9, ry: 13, fill: '#e05a5a' }));
      const drop = s('circle', { r: 4, fill: '#2e9e44' });
      svg.append(tile, ...wells.map((w) => w.g), bottle, pipette, drop);
      return {
        update() {
          wells.forEach((w, i) => {
            w.liquid.setAttribute('opacity', st.filled);
            w.colour.setAttribute('r', (21 * Math.min(1, st.mix[i] * 1.3)).toFixed(1));
            w.colour.setAttribute('opacity', st.mix[i] > 0 ? 0.92 : 0);
          });
          pipette.setAttribute('visibility', st.dropper ? 'visible' : 'hidden');
          if (st.dropper) pipette.setAttribute('transform', `translate(${st.dropper.x} ${st.dropper.y})`);
          drop.setAttribute('visibility', st.drop ? 'visible' : 'hidden');
          if (st.drop) {
            drop.setAttribute('cx', st.drop.x);
            drop.setAttribute('cy', st.drop.y);
          }
        },
      };
    },
    setup: [{
      title: 'Fill the spotting tile',
      text: 'Put one drop of each solution into a well of the spotting tile, in order from pH 1 to pH 13.',
      why: 'Keeping the solutions in order of pH makes it easy to see the pattern of colours when you add the indicator.',
      button: 'Fill the wells in order of pH',
      done: 'Each well holds a different solution. They all look colourless.',
      async run(api) {
        await tween(700, (t) => {
          api.st.filled = t;
          api.draw();
        });
      },
    }],
    tests: {
      label: 'Solution',
      title: 'Add universal indicator to each well',
      text: 'Add one drop of universal indicator to each well in turn. Record the colour, then decide whether the solution is an acid, neutral or an alkali.',
      why: 'Universal indicator changes to a different colour for each pH, so the colour tells you how acidic or alkaline the solution is.',
      task: 'add one drop of universal indicator',
      button: (x) => `Add indicator to the ${x.name} solution`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        const i = SAMPLES.indexOf(x);
        const from = st.dropper || { x: 640, y: 300 };
        await tween(500, (t) => {
          st.dropper = { x: lerp(from.x, wellX(i), t), y: lerp(from.y, 160, t) };
          api.draw();
        });
        await tween(300, (t, raw) => {
          st.drop = { x: wellX(i), y: lerp(162, WELL_Y, raw * raw) };
          api.draw();
        });
        st.drop = null;
        await tween(600, (t) => {
          st.mix[i] = t;
          api.draw();
        });
      },
      columns: [{
        label: 'Colour',
        q: (x) => `What colour does the indicator turn in the ${x.name} solution?`,
        task: 'record the colour',
        options: Object.keys(COLOURS),
        swatches: COLOURS,
        answer: (x) => x.colour,
        hint: () => 'Look closely at the colour in the well, then choose the nearest colour.',
      }, {
        label: 'Acid, neutral or alkali?',
        q: (x) => `Is the ${x.name} solution an acid, neutral or an alkali?`,
        task: 'decide whether it is an acid, neutral or an alkali',
        options: ['Acid', 'Neutral', 'Alkali'],
        answer: (x) => (x.pH < 7 ? 'Acid' : x.pH === 7 ? 'Neutral' : 'Alkali'),
        hint: () => 'Acids have a pH below 7, neutral solutions are pH 7 and alkalis are above 7.',
      }],
    },
    questions: [{
      q: 'What happens to the colour as the pH goes up from 1 to 13?',
      o: ['It goes through the rainbow: red, orange, yellow, green, blue, then purple', 'It stays the same colour', 'It goes from purple to red'],
      hint: 'Read down the colour column of your table from pH 1 to pH 13.',
      right: 'Yes. Strong acids turn universal indicator red, neutral solutions turn it green and strong alkalis turn it purple.',
    }, {
      title: 'Use your colour chart',
      text: 'Use your results to identify a new solution.',
      q: 'A solution turns universal indicator orange. What is it?',
      o: ['A weak acid', 'A strong acid', 'A neutral solution', 'A weak alkali'],
      hint: 'Find orange on your chart. Which pH was it, and how far is that from 7?',
      right: 'Yes. Orange is about pH 3–4: an acid, but not a strong one. The further the pH is from 7, the stronger the acid or alkali.',
      why: 'Universal indicator shows how strong an acid or alkali is, not just whether it is one.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Universal indicator made a rainbow: red for strong acids, through orange and yellow, green at pH 7, then blue and purple for alkalis. The further from 7, the stronger the acid or alkali.',
      rows: rows.map((r) => [r.name, `${r.cells[0]} (${r.cells[1].toLowerCase()})`]),
    }),
  });
})();
