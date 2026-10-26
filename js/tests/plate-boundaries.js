/* Plate boundary models (Grade 6, Stage 7: 7ESp.02, 7TWSm.01). */
(function () {
  'use strict';
  const FOLD = 'The layers fold and buckle upwards';
  const JERK = 'They stick, then suddenly jerk past';
  const SAMPLES = [
    { name: 'Push the clay layers together', detail: 'Layers of coloured clay, pushed slowly from both ends.', a: FOLD, real: 'Mountains', kind: 'fold' },
    { name: 'Slide two plates past each other', detail: 'Two pieces of card pressed together and slid in opposite directions.', a: JERK, real: 'Earthquakes', kind: 'slide' },
  ];
  function picture(x, s) {
    const g = s('g', null);
    if (x.kind === 'fold') {
      ['#c9a46a', '#a8763f', '#d9b98a', '#8a6236'].forEach((c, i) => g.append(s('path', { d: `M-140,${30 - i * 14} C-70,${30 - i * 14} -50,${-40 - i * 14} 0,${-40 - i * 14} C50,${-40 - i * 14} 70,${30 - i * 14} 140,${30 - i * 14} L140,${44 - i * 14} C70,${44 - i * 14} 50,${-26 - i * 14} 0,${-26 - i * 14} C-50,${-26 - i * 14} -70,${44 - i * 14} -140,${44 - i * 14} Z`, fill: c, stroke: '#5c3a20', 'stroke-width': 0.8 })));
      g.append(s('path', { d: 'M-170,40 L-146,40 M-154,34 L-146,40 L-154,46 M170,40 L146,40 M154,34 L146,40 L154,46', stroke: '#c0392b', 'stroke-width': 3, fill: 'none' }));
    } else {
      g.append(s('rect', { x: -140, y: -50, width: 280, height: 46, fill: '#c9a46a', stroke: '#8a6236' }), s('rect', { x: -110, y: 4, width: 280, height: 46, fill: '#a8763f', stroke: '#5c3a20' }),
        s('path', { d: 'M-140,0 l20,-4 l18,6 l22,-5 l20,6 l24,-5 l22,6 l18,-5 l24,4 l22,-5', fill: 'none', stroke: '#c0392b', 'stroke-width': 2 }),
        s('path', { d: 'M60,-27 L120,-27 M110,-33 L120,-27 L110,-21 M-40,27 L-100,27 M-90,21 L-100,27 L-90,33', stroke: '#ffffff', 'stroke-width': 3, fill: 'none' }));
    }
    return g;
  }
  Observation.run({
    id: 'g6-plates',
    guide: '../practical.html#g6-plates',
    objectives: ['I can model what happens where tectonic plates push together or slide past.', 'I can link plate movements to mountains and earthquakes.'],
    benchLabel: 'Two models of plate boundaries: layers of clay pushed together from both ends, and two plates of card sliding past each other.',
    picture,
    tests: {
      label: 'Model',
      title: 'Try each plate boundary',
      text: 'Push the layers of clay slowly together. Then slide two card plates past each other while pressing them together.',
      why: 'Tectonic plates move only a few centimetres a year, but over millions of years this builds mountains and causes earthquakes.',
      task: 'try the model',
      button: (x) => x.name,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'What happens?',
        q: (x) => `${x.name}: what happens?`,
        task: 'record what happens',
        options: [FOLD, JERK, 'Nothing happens'],
        answer: (x) => x.a,
        hint: () => 'Look at the shape of the layers, or at how the plates move.',
      }, {
        label: 'In the real world',
        q: (x) => `Where real plates do this, what forms or happens?`,
        task: 'link it to the real world',
        options: ['Mountains', 'Earthquakes', 'Volcanoes'],
        answer: (x) => x.real,
        hint: () => 'Folded rock layers build up into high ground. Plates that stick and jerk shake the ground.',
      }],
    },
    questions: [{
      q: 'Why do earthquakes happen where plates slide past each other?',
      o: ['The plates stick, pressure builds up, then they slip suddenly', 'The plates melt', 'The plates move apart'],
      hint: 'How did the card plates move: smoothly or in jerks?',
      right: 'Yes. Friction makes the plates stick. When the force becomes too big they slip suddenly, shaking the ground.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'When plates push together, rock layers fold up into mountains. When plates slide past each other, they stick and then jerk, causing earthquakes.',
      rows: [['Plates pushing together', 'layers fold: mountains'], ['Plates sliding past', 'stick and jerk: earthquakes']],
    }),
  });
})();
