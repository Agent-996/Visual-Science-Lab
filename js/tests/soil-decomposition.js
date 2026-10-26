/* What decomposes in soil? (Grade 6, Stage 7: 7Be.01, 7SIC.05). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;

  const SAMPLES = [
    { name: 'Apple slice', left: 0.08, amount: 'Almost all gone', living: 'Yes', why: 'Yes. Fruit comes from a plant.' },
    { name: 'Leaf', left: 0.3, amount: 'Most has gone', living: 'Yes', why: 'Yes. A leaf is part of a plant.' },
    { name: 'Paper', left: 0.65, amount: 'Some has gone', living: 'Yes', why: 'Yes. Paper is made from wood, which comes from trees.' },
    { name: 'Plastic', left: 1, amount: 'None has gone', living: 'No', why: 'No. Most plastic is made from crude oil.' },
  ];
  const bagX = (i) => 150 + i * 140;
  const GROUND = 190;

  // The material inside a bag, drawn at its starting size around (0, 0).
  function material(name) {
    if (name === 'Apple slice') return s('g', null, s('path', { d: 'M-26,6 Q0,-30 26,6 Q0,18 -26,6 Z', fill: '#f4e7b0', stroke: '#c94c3c', 'stroke-width': 3 }), s('circle', { cx: -4, cy: -2, r: 2, fill: '#5b3a20' }), s('circle', { cx: 5, cy: -2, r: 2, fill: '#5b3a20' }));
    if (name === 'Leaf') return s('g', null, s('path', { d: 'M-28,0 Q0,-22 28,0 Q0,22 -28,0 Z', fill: '#5a9e3a', stroke: '#3b6e22' }), s('line', { x1: -26, x2: 26, y1: 0, y2: 0, stroke: '#3b6e22' }));
    if (name === 'Paper') return s('g', null, s('path', { d: 'M-24,-16 L22,-18 L26,14 L4,17 L-2,12 L-24,16 Z', fill: '#fbfbf7', stroke: '#9aa5b1' }), s('line', { x1: -16, x2: 14, y1: -6, y2: -7, stroke: '#9aa5b1' }), s('line', { x1: -16, x2: 12, y1: 2, y2: 1, stroke: '#9aa5b1' }));
    return s('g', null, s('path', { d: 'M-24,-12 L24,-14 L22,12 L-22,14 Z', fill: '#4aa3df', 'fill-opacity': 0.85, stroke: '#1f6fa8' }), s('text', { x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#ffffff' }, 'PLASTIC'));
  }

  Observation.run({
    id: 'g6-soildecomp',
    guide: '../practical.html#g6-soildecomp',
    objectives: ['I can test which materials are decomposed in soil.', 'I can explain why some materials, like plastic, are not decomposed.'],
    benchLabel: 'A patch of soil seen from the side, with four labelled mesh bags holding an apple slice, a leaf, paper and plastic, and a counter showing the weeks.',
    state: { depth: 0, weeks: 0, up: SAMPLES.map(() => 0), dug: SAMPLES.map(() => false) },
    scene(svg, D, st) {
      svg.append(
        s('rect', { x: 0, y: 0, width: 720, height: GROUND, fill: '#eaf3f8' }),
        s('rect', { x: 0, y: GROUND, width: 720, height: 250, fill: '#6b4a2f' }),
        s('rect', { x: 0, y: GROUND - 6, width: 720, height: 8, fill: '#5c9a3a' }));
      for (let i = 0; i < 60; i++) svg.append(s('circle', { cx: (i * 97) % 720, cy: GROUND + 20 + ((i * 53) % 220), r: 2 + (i % 3), fill: '#5a3d26' }));
      const bags = SAMPLES.map((x, i) => {
        const stuff = material(x.name);
        const g = s('g', null,
          s('rect', { x: -40, y: -30, width: 80, height: 60, rx: 8, fill: 'rgba(255, 255, 255, 0.25)', stroke: '#e6dccb', 'stroke-width': 2, 'stroke-dasharray': '3 3' }),
          stuff,
          s('text', { x: 0, y: -38, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#33404d' }, x.name));
        return { g, stuff, label: g.lastChild };
      });
      const weeks = D.display(590, 24, 110, 'Weeks');
      svg.append(...bags.map((b) => b.g), weeks.g);
      return {
        update() {
          bags.forEach((b, i) => {
            const buried = lerp(GROUND - 70, GROUND + 110, st.depth);
            const y = lerp(buried, GROUND - 70, st.up[i]);
            b.g.setAttribute('transform', `translate(${bagX(i)} ${y})`);
            const underground = y > GROUND - 30;
            b.stuff.setAttribute('visibility', underground ? 'hidden' : 'visible');
            b.label.setAttribute('fill', underground ? '#efe6d6' : '#33404d');
            const left = st.dug[i] ? SAMPLES[i].left : 1;
            b.stuff.setAttribute('transform', `scale(${Math.sqrt(left).toFixed(3)})`);
            b.stuff.style.filter = st.dug[i] && left < 1 ? 'brightness(0.7) saturate(0.6)' : '';
          });
          weeks.set(`${Math.round(st.weeks)}`);
        },
      };
    },
    setup: [{
      title: 'Bury the bags',
      text: 'Put one material in each mesh bag and label it. Bury all the bags in the same patch of soil.',
      why: 'Burying every bag in the same soil means each material meets the same decomposers, temperature and moisture: a fair test.',
      button: 'Bury the four bags',
      done: 'All four bags are buried.',
      async run(api) {
        await tween(900, (t) => {
          api.st.depth = t;
          api.draw();
        });
      },
    }, {
      title: 'Wait three weeks',
      text: 'Leave the bags in the soil for three weeks.',
      why: 'Decomposers such as bacteria and fungi need time to break materials down.',
      button: 'Wait three weeks',
      done: 'Three weeks have passed. Time to dig the bags up.',
      async run(api) {
        await tween(1500, (t, raw) => {
          api.st.weeks = 3 * raw;
          api.draw();
        });
      },
    }],
    tests: {
      label: 'Material',
      title: 'Dig up each bag',
      text: 'Dig up the bags one at a time. Look at how much of each material is left.',
      why: 'The mesh lets soil animals and microorganisms in, but keeps all the pieces together, so you can see how much has gone.',
      task: 'dig up the bag and look inside',
      button: (x) => `Dig up the ${x.name.toLowerCase()} bag`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        const i = SAMPLES.indexOf(x);
        st.dug[i] = true;
        await tween(800, (t) => {
          st.up[i] = t;
          api.draw();
        });
      },
      columns: [{
        label: 'How much is left?',
        q: (x) => `How much of the ${x.name.toLowerCase()} has gone after three weeks?`,
        task: 'record how much is left',
        options: ['Almost all gone', 'Most has gone', 'Some has gone', 'None has gone'],
        answer: (x) => x.amount,
        hint: () => 'Compare the size of the material with how big it was at the start (the plastic shows the starting size).',
      }, {
        label: 'From a living thing?',
        q: (x) => `Did the ${x.name.toLowerCase()} come from a living thing?`,
        task: 'decide whether it came from a living thing',
        options: ['Yes', 'No'],
        answer: (x) => x.living,
        right: (x) => x.why,
        hint: () => 'Think about what the material is made from.',
      }],
    },
    questions: [{
      q: 'Which materials did the decomposers break down?',
      o: ['The ones that came from living things: the apple, the leaf and the paper', 'Only the plastic', 'All four materials, equally'],
      hint: 'Look at both columns of your table together.',
      right: 'Yes. Bacteria and fungi feed on materials that came from living things and break them down. Most plastics are not biodegradable.',
      why: 'Decomposition returns nutrients to the soil, where plants can use them again.',
    }, {
      title: 'Why it matters',
      text: 'Think about what happens to plastic rubbish.',
      q: 'Why is plastic litter a problem for the environment?',
      o: ['Decomposers cannot break it down, so it stays in the environment for a very long time', 'It decomposes too quickly', 'It turns into soil nutrients'],
      hint: 'How much of the plastic had gone after three weeks?',
      right: 'Yes. Plastic is not broken down by decomposers, so it builds up in soil, rivers and the sea.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The apple and the leaf decomposed most, the paper partly and the plastic not at all. Microorganisms break down materials that came from living things, but most plastics are not biodegradable.',
      rows: rows.map((r) => [r.name, r.cells[0]]),
    }),
  });
})();
