/* Making precipitates (Grade 6, Stage 7: 7Cc.02, 7Cc.03). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;

  const FORMS = { 'A pale blue solid': '#8cc4ec', 'A white solid': '#f4f6f8', 'A green solid': '#6b8e3a', 'No solid forms': null };
  const CLOUD = { 'A pale blue solid': [140, 196, 236, 0.95], 'A white solid': [252, 252, 252, 1] };
  const SAMPLES = [
    { name: 'Copper(II) sulfate + sodium hydroxide', first: [60, 130, 215, 0.6], added: 'Sodium hydroxide', after: [200, 225, 240, 0.5], forms: 'A pale blue solid', made: 'Yes: copper hydroxide' },
    { name: 'Calcium chloride + sodium carbonate', first: [196, 214, 228, 0.6], added: 'Sodium carbonate', after: [190, 208, 224, 0.6], forms: 'A white solid', made: 'Yes: calcium carbonate' },
    { name: 'Copper(II) sulfate + water', first: [60, 130, 215, 0.6], added: 'Water', after: [110, 165, 225, 0.5], forms: 'No solid forms', made: 'No: it is only diluted' },
  ];
  // Blends two [r, g, b, a] colours.
  const mix = (a, b, t) => `rgba(${a.map((v, k) => (k < 3 ? Math.round(lerp(v, b[k], t)) : lerp(v, b[k], t).toFixed(2))).join(', ')})`;
  const tubeX = (i) => 210 + i * 150;

  Observation.run({
    id: 'g6-precipitates',
    guide: '../practical.html#g6-precipitates',
    objectives: ['I can make a precipitate by mixing two solutions.', 'I can write a word equation for the reaction.'],
    benchLabel: 'Three test tubes in a rack and a dropping bottle. Each tube gets 2 cm³ of one solution, then a second solution is added drop by drop.',
    state: { level: SAMPLES.map(() => 0), liquid: SAMPLES.map((x) => mix(x.first, x.first, 0)), solid: SAMPLES.map(() => 0), dropper: null, drop: null, label: '' },
    scene(svg, D, st) {
      D.bench(svg, 440, [[360, 'Test tubes in a rack'], [640, 'Dropping bottle']]);
      const rack = s('g', null,
        s('rect', { x: 140, y: 250, width: 440, height: 16, rx: 3, fill: '#b98a52', stroke: '#8a6236' }),
        s('rect', { x: 140, y: 380, width: 440, height: 12, rx: 3, fill: '#b98a52', stroke: '#8a6236' }),
        s('rect', { x: 146, y: 250, width: 10, height: 142, fill: '#a87a46' }),
        s('rect', { x: 564, y: 250, width: 10, height: 142, fill: '#a87a46' }));
      const tubes = SAMPLES.map((x, i) => D.tube(tubeX(i), 376, 40, 190, mix(x.first, x.first, 0)));
      const nums = SAMPLES.map((x, i) => s('text', { x: tubeX(i), y: 172, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#33404d' }, `Tube ${i + 1}`));
      const bottle = s('g', null,
        s('rect', { x: 620, y: 330, width: 40, height: 62, rx: 5, fill: 'rgba(220, 234, 244, 0.8)', stroke: '#7f97a8' }),
        s('rect', { x: 632, y: 316, width: 16, height: 14, fill: '#39424b' }));
      const bottleLabel = s('text', { x: 640, y: 306, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 600, fill: '#33404d' }, '');
      const pipette = s('g', null,
        s('rect', { x: -5, y: -70, width: 10, height: 56, rx: 2, fill: 'rgba(214, 232, 242, 0.8)', stroke: '#7f97a8' }),
        s('path', { d: 'M-2,-14 L0,-2 L2,-14 Z', fill: 'rgba(214, 232, 242, 0.8)', stroke: '#7f97a8' }),
        s('ellipse', { cx: 0, cy: -80, rx: 9, ry: 13, fill: '#e05a5a' }));
      const drop = s('circle', { r: 3.5, fill: 'rgba(200, 220, 235, 0.9)', stroke: '#7f97a8' });
      svg.append(rack, ...tubes.map((t) => t.g), ...nums, bottle, bottleLabel, pipette, drop);
      return {
        update() {
          tubes.forEach((t, i) => {
            t.setLevel(st.level[i]).setColour(st.liquid[i]);
            t.setSolid(st.solid[i], FORMS[SAMPLES[i].forms] || 'none');
          });
          bottleLabel.textContent = st.label;
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
    tests: {
      label: 'Solutions mixed',
      title: 'Mix the solutions',
      text: 'Pour 2 cm³ of the first solution into a test tube. Add the second solution drop by drop and watch what forms.',
      why: 'Adding the second solution a drop at a time lets you see exactly when something new appears.',
      task: 'mix the two solutions',
      button: (x) => `Mix ${x.name.toLowerCase().replace('(ii)', '(II)')}`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        const i = SAMPLES.indexOf(x);
        st.label = x.added;
        await tween(500, (t) => {
          st.level[i] = 0.3 * t;
          api.draw();
        });
        const from = st.dropper || { x: 640, y: 290 };
        await tween(500, (t) => {
          st.dropper = { x: lerp(from.x, tubeX(i), t), y: lerp(from.y, 150, t) };
          api.draw();
        });
        const cloud = CLOUD[x.forms];
        for (let n = 1; n <= 4; n++) {
          await tween(260, (t, raw) => {
            st.drop = { x: tubeX(i), y: lerp(152, 340, raw * raw) };
            api.draw();
          });
          st.drop = null;
          st.level[i] = 0.3 + n * 0.05;
          // a cloudy solid appears where the drops land
          st.liquid[i] = cloud ? mix(x.first, cloud, n * 0.22) : mix(x.first, x.after, n * 0.25);
          api.draw();
        }
        st.dropper = null;
        if (cloud) {
          // the solid slowly settles to the bottom
          await tween(900, (t) => {
            st.solid[i] = 0.14 * t;
            st.liquid[i] = mix(cloud, x.after, t);
            api.draw();
          });
        } else {
          st.liquid[i] = mix(x.after, x.after, 0);
          api.draw();
        }
      },
      columns: [{
        label: 'What forms?',
        q: (x) => `${x.name}: what do you see?`,
        task: 'record what forms',
        options: Object.keys(FORMS),
        swatches: { 'A pale blue solid': FORMS['A pale blue solid'], 'A white solid': FORMS['A white solid'], 'A green solid': FORMS['A green solid'] },
        answer: (x) => x.forms,
        hint: () => 'Look at the tube. Is there a cloudy solid, and what colour is it? If the liquid only changes shade, no solid has formed.',
      }, {
        label: 'New substance made?',
        q: (x) => `${x.name}: has a new substance been made?`,
        task: 'decide whether a new substance was made',
        options: (x) => (x.made.startsWith('Yes') ? [x.made, 'No: it is only diluted'] : ['Yes: copper hydroxide', x.made]),
        answer: (x) => x.made,
        hint: () => 'A precipitate is a new, insoluble substance. Just adding water does not make anything new.',
      }],
    },
    questions: [{
      title: 'Write the word equation',
      text: 'Use what you know about the first reaction.',
      q: 'Which word equation matches the reaction in tube 1?',
      o: ['copper sulfate + sodium hydroxide → copper hydroxide + sodium sulfate', 'copper sulfate + sodium hydroxide → copper + sodium sulfate + water', 'copper sulfate + water → copper hydroxide'],
      hint: 'The metals swap partners: copper ends up with the hydroxide, and sodium with the sulfate.',
      right: 'Yes. The copper and sodium swap partners. Copper hydroxide is the pale blue precipitate; sodium sulfate stays dissolved.',
    }, {
      q: 'Why does a precipitate appear as a solid in the tube?',
      o: ['It is insoluble, so it does not dissolve in the water', 'It is a gas that has been trapped', 'It is one of the starting solutions that has frozen'],
      hint: 'Think about whether the new substance can dissolve.',
      right: 'Yes. A precipitate is an insoluble solid made when two solutions react. It makes the mixture cloudy, then settles to the bottom.',
      why: 'Making a precipitate is one sign that a chemical reaction has happened.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Copper(II) sulfate and sodium hydroxide made a pale blue precipitate of copper hydroxide. Calcium chloride and sodium carbonate made a white precipitate of calcium carbonate. Adding water made no precipitate.',
      rows: [['Tube 1', 'pale blue precipitate'], ['Tube 2', 'white precipitate'], ['Tube 3', 'no precipitate']],
    }),
  });
})();
