/* Sound through solids, liquids and gases (Grade 6, Stage 7: 7Ps.01). */
(function () {
  'use strict';
  const K = window.LabKit;
  const { s, lerp, tween } = K;

  const LOUDNESS = ['Very faint', 'Quiet', 'Fairly loud', 'Loud'];
  const SAMPLES = [
    { name: 'Through the air', kind: 'air', bars: 2, loud: 'Quiet', state: 'Gas' },
    { name: 'String telephone, string tight', kind: 'tight', bars: 5, loud: 'Loud', state: 'Solid' },
    { name: 'String telephone, string slack', kind: 'slack', bars: 1, loud: 'Very faint', state: 'Solid' },
    { name: 'Ear on the bench', kind: 'bench', bars: 5, loud: 'Loud', state: 'Solid' },
    { name: 'Through a bag of water', kind: 'water', bars: 4, loud: 'Fairly loud', state: 'Liquid' },
  ];
  const A = { x: 150, y: 220 }; // where the sound starts
  const B = { x: 560, y: 220 }; // the listener's ear
  // Point t (0–1) along the path the sound takes through each material.
  const along = (kind, t) => ({ x: lerp(A.x, B.x, t), y: kind === 'slack' ? A.y + Math.sin(Math.PI * t) * 70 : kind === 'bench' ? 262 : A.y });

  Observation.run({
    id: 'g6-soundmedia',
    guide: '../practical.html#g6-soundmedia',
    objectives: ['I can show that sound travels through solids, liquids and gases.', 'I can compare how well sound travels through each state.'],
    benchLabel: 'A partner makes a sound on the left and a listener’s ear is on the right. Between them is air, a string telephone, a bench top or a bag of water. A meter shows how loud it sounds.',
    state: { kind: 'air', waves: [], level: 0 },
    scene(svg, D, st) {
      D.bench(svg, 440, [[A.x, 'Partner taps or talks'], [B.x, 'Listener'], [650, 'How loud it sounds']]);
      const middle = s('g', null);
      const source = s('g', null,
        s('circle', { cx: A.x - 34, cy: A.y, r: 24, fill: '#e2b48c', stroke: '#b5835a' }),
        s('path', { d: `M${A.x - 26},${A.y + 6} q8,6 14,0`, fill: 'none', stroke: '#8a4b2a', 'stroke-width': 2.5 }));
      const ear = s('g', null,
        s('path', { d: `M${B.x + 10},${A.y - 26} q30,-6 30,24 q0,22 -18,30 q-8,4 -8,-6 q0,-10 10,-16 q8,-6 6,-14 q-2,-12 -20,-10 z`, fill: '#e2b48c', stroke: '#b5835a', 'stroke-width': 2 }));
      const waves = s('g', null);
      const meter = s('g', null);
      const bars = [];
      for (let k = 0; k < 5; k++) {
        const b = s('rect', { x: 606 + k * 18, y: 230 - k * 22, width: 13, height: 40 + k * 22, rx: 2 });
        bars.push(b);
        meter.append(b);
      }
      svg.append(middle, source, ear, waves, meter);
      return {
        update() {
          middle.replaceChildren();
          if (st.kind === 'tight' || st.kind === 'slack') {
            const cup = (x, flip) => s('path', { d: `M${x},${A.y - 16} L${x + flip * 22},${A.y - 22} L${x + flip * 22},${A.y + 22} L${x},${A.y + 16} Z`, fill: '#f4f6f8', stroke: '#8a9aa8', 'stroke-width': 2 });
            middle.append(cup(A.x - 4, 1), cup(B.x + 4, -1),
              s('path', { d: st.kind === 'tight' ? `M${A.x + 18},${A.y} L${B.x - 18},${A.y}` : `M${A.x + 18},${A.y} Q${(A.x + B.x) / 2},${A.y + 140} ${B.x - 18},${A.y}`, fill: 'none', stroke: '#8a6236', 'stroke-width': 2 }));
          } else if (st.kind === 'bench') {
            middle.append(s('rect', { x: A.x - 20, y: 248, width: B.x - A.x + 60, height: 30, rx: 3, fill: '#c89b62', stroke: '#8a6236' }));
          } else if (st.kind === 'water') {
            middle.append(s('rect', { x: A.x + 20, y: 160, width: B.x - A.x - 40, height: 120, rx: 50, fill: 'rgba(100, 170, 225, 0.55)', stroke: '#5f88a3', 'stroke-width': 2 }));
          } else {
            for (let i = 0; i < 26; i++) middle.append(s('circle', { cx: A.x + 20 + ((i * 61) % (B.x - A.x - 40)), cy: 150 + ((i * 37) % 140), r: 2, fill: '#b9c6d2' }));
          }
          waves.replaceChildren(...st.waves.map((w) => s('path', { d: `M${w.x},${w.y - 12} q8,12 0,24`, fill: 'none', stroke: '#2563d4', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: w.o.toFixed(2) })));
          bars.forEach((b, k) => b.setAttribute('fill', k < Math.round(st.level) ? '#2563d4' : '#dfe5ea'));
        },
      };
    },
    tests: {
      label: 'How the sound travels',
      title: 'Listen through each material',
      text: 'Your partner makes the same sound each time. Listen through the air, through a string telephone (tight, then slack), with your ear on the bench and through a bag of water.',
      why: 'Using the same sound and the same distance each time means only the material the sound travels through changes.',
      task: 'make the sound and listen',
      button: (x) => `Listen: ${x.name.charAt(0).toLowerCase()}${x.name.slice(1)}`,
      samples: SAMPLES,
      async run(x, api) {
        const { st } = api;
        st.kind = x.kind;
        st.level = 0;
        api.draw();
        const strength = x.bars / 5;
        await tween(1800, (t, raw) => {
          st.waves = [0, 0.33, 0.66].map((lag) => {
            const p = (raw * 2 + lag) % 1;
            return { ...along(x.kind, p), o: lerp(1, 0.15 + 0.85 * strength, p) };
          });
          st.level = x.bars * Math.min(1, raw * 1.5);
          api.draw();
        });
        st.waves = [];
        st.level = x.bars;
        api.draw();
      },
      columns: [{
        label: 'How loud?',
        q: (x) => `${x.name}: how loud does the sound seem?`,
        task: 'record how loud it sounds',
        options: LOUDNESS,
        answer: (x) => x.loud,
        hint: () => 'Count the bars lit on the meter: 1 bar is very faint, 2 is quiet, 4 is fairly loud and 5 is loud.',
      }, {
        label: 'State of matter',
        q: (x) => `${x.name}: what state of matter did the sound travel through to reach the ear?`,
        task: 'decide which state of matter the sound travelled through',
        options: ['Solid', 'Liquid', 'Gas'],
        answer: (x) => x.state,
        hint: () => 'String, wood and plastic are solids, water is a liquid, and air is a gas.',
      }],
    },
    questions: [{
      q: 'Which states of matter can sound travel through?',
      o: ['Solids, liquids and gases', 'Only gases', 'Only solids and gases'],
      hint: 'Look at the state of matter column. Did you hear something every time?',
      right: 'Yes. Sound travels through all three states, because it is passed on by particles vibrating.',
    }, {
      q: 'Why did sound travel best through the tight string and the bench?',
      o: ['Particles in solids are close together, so they pass on vibrations well', 'Solids have no particles in them', 'Sound travels best when there is nothing in the way'],
      hint: 'Think about how close together the particles are in a solid, a liquid and a gas.',
      right: 'Yes. In a solid the particles are packed closely, so each one quickly passes the vibration on to the next.',
      why: 'The slack string was quiet because it cannot pass on vibrations well. Sound cannot travel through empty space (a vacuum) at all.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'Sound travelled through solids, liquids and gases. It was loudest through the tight string and the bench, because particles in solids are close together and pass on vibrations well. It was quietest through the air.',
      rows: [['Loudest', 'tight string and bench (solids)'], ['Through water (liquid)', 'fairly loud'], ['Through air (gas)', 'quiet']],
    }),
  });
})();
