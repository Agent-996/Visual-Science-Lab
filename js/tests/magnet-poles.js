/* Attraction and repulsion between poles (Grade 7, Stage 8: 8Pe.01). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;

  const POLE = { N: '#d64545', S: '#3b6fb6', A: '#9aa5b1', B: '#9aa5b1' };
  const C = { x: 280, y: 220 }; // the hanging magnet's centre (where the string holds it)
  const HALF = 90;
  const SAMPLES = [
    { name: 'North pole near north pole', hang: ['S', 'N'], near: 'N', result: 'Repel' },
    { name: 'North pole near south pole', hang: ['S', 'N'], near: 'S', result: 'Attract' },
    { name: 'South pole near south pole', hang: ['N', 'S'], near: 'S', result: 'Repel' },
    { name: 'Unmarked magnet: end A near a north pole', hang: ['B', 'A'], near: 'N', result: 'Repel' },
    { name: 'Unmarked magnet: end B near a north pole', hang: ['A', 'B'], near: 'N', result: 'Attract' },
  ];
  const RESULT = { Attract: 'They attract (pull together)', Repel: 'They repel (push apart)' };

  function magnet(ends) {
    const g = s('g', null);
    const draw = ([l, r]) => {
      g.replaceChildren(
        s('rect', { x: -HALF, y: -17, width: HALF, height: 34, fill: POLE[l], stroke: '#2b333b', 'stroke-width': 1.5 }),
        s('rect', { x: 0, y: -17, width: HALF, height: 34, fill: POLE[r], stroke: '#2b333b', 'stroke-width': 1.5 }),
        s('text', { x: -HALF + 16, y: 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#ffffff' }, l),
        s('text', { x: HALF - 16, y: 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#ffffff' }, r));
    };
    draw(ends);
    return { g, draw };
  }

  Observation.run({
    id: 'g7-poles',
    guide: '../practical.html#g7-poles',
    objectives: ['I can show that like poles repel and unlike poles attract.', 'I can find the poles of an unmarked magnet.'],
    benchLabel: 'Seen from above: a bar magnet hanging from a string so it can turn freely, and a second bar magnet held in the hand and brought up to one end.',
    state: { hang: ['S', 'N'], near: 'N', gap: 160, angle: 0, shift: 0, held: false },
    scene(svg, D, st) {
      D.bench(svg, 440, [[C.x, 'Magnet hanging from a string (seen from above)'], [560, 'Magnet held in the hand']]);
      const hanging = magnet(st.hang);
      const pin = s('circle', { cx: 0, cy: 0, r: 5, fill: '#f6f8f9', stroke: '#2b333b', 'stroke-width': 2 });
      const hangG = s('g', null, hanging.g, pin);
      const held = s('g', null);
      const hand = s('path', { d: 'M150,-20 q24,-6 34,10 l0,22 q-10,14 -34,8 z', fill: '#e2b48c', stroke: '#b5835a' });
      svg.append(hangG, held);
      return {
        update() {
          hanging.draw(st.hang);
          hangG.setAttribute('transform', `translate(${C.x + st.shift} ${C.y}) rotate(${st.angle.toFixed(1)})`);
          held.setAttribute('visibility', st.held ? 'visible' : 'hidden');
          const far = st.near === 'N' ? 'S' : 'N';
          held.replaceChildren(
            s('rect', { x: 0, y: -17, width: HALF, height: 34, fill: POLE[st.near], stroke: '#2b333b', 'stroke-width': 1.5 }),
            s('rect', { x: HALF, y: -17, width: HALF, height: 34, fill: POLE[far], stroke: '#2b333b', 'stroke-width': 1.5 }),
            s('text', { x: 16, y: 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#ffffff' }, st.near),
            s('text', { x: 2 * HALF - 16, y: 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#ffffff' }, far),
            hand);
          held.setAttribute('transform', `translate(${C.x + HALF + st.gap} ${C.y})`);
        },
      };
    },
    tests: {
      label: 'Poles brought together',
      title: 'Bring the poles together',
      text: 'Bring one end of the held magnet slowly up to one end of the hanging magnet. Watch what the hanging magnet does.',
      why: 'The hanging magnet can turn freely, so even a small push or pull from the other magnet makes it move.',
      task: 'bring the held magnet up slowly',
      button: (x) => `Try: ${x.name.charAt(0).toLowerCase()}${x.name.slice(1)}`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        st.held = false;
        await tween(300, (t) => {
          st.angle = lerp(st.angle, 0, t);
          st.shift = lerp(st.shift, 0, t);
          api.draw();
        });
        st.hang = x.hang;
        st.near = x.near;
        st.gap = 160;
        st.angle = 0;
        st.shift = 0;
        st.held = true;
        api.draw();
        await tween(900, (t) => {
          st.gap = lerp(160, 40, t);
          api.draw();
        });
        if (x.result === 'Attract') {
          await tween(400, (t, raw) => {
            st.shift = 40 * raw * raw;
            api.draw();
          });
        } else {
          await tween(700, (t) => {
            st.angle = 38 * t;
            api.draw();
          });
        }
      },
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.name}: what happens?`,
        task: 'record what happens',
        options: [RESULT.Attract, RESULT.Repel],
        short: (v) => v.split(' (')[0],
        answer: (x) => RESULT[x.result],
        hint: () => 'Did the hanging magnet move towards the held magnet, or turn away from it?',
      }],
    },
    questions: [{
      q: 'What do your results for the marked magnets show?',
      o: ['Like poles repel and unlike poles attract', 'Like poles attract and unlike poles repel', 'All poles attract each other'],
      hint: 'Look at the first three rows: which pairs were the same pole, and what happened?',
      right: 'Yes. North–north and south–south repel; north–south attract.',
    }, {
      title: 'Find the poles of the unmarked magnet',
      text: 'Use the last two rows of your table.',
      q: 'End A of the unmarked magnet repelled a north pole. Which pole is end A?',
      o: ['North', 'South', 'You cannot tell from this'],
      hint: 'Only like poles repel.',
      right: 'Yes. Only a north pole repels a north pole, so end A is north and end B is south.',
      why: 'Attraction does not prove something is a magnet: a magnet attracts plain iron too. Only repulsion proves it.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Like poles repelled and unlike poles attracted. End A of the unmarked magnet repelled a north pole, so it is a north pole. Only repulsion proves that something is a magnet.',
      rows: [['North–north', 'repel'], ['North–south', 'attract'], ['South–south', 'repel'], ['Unmarked magnet', 'end A is north']],
    }),
  });
})();
