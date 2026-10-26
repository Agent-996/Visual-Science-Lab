/* Indicator spreading on filter paper (Grade 6, Stage 7: 7Cp.03, 7TWSp.05). */
(function () {
  'use strict';
  const COLOURS = { Red: '#d7263d', Orange: '#f07a2a', Yellow: '#f2c230', Green: '#2e9e44', Blue: '#1f6fd1', Purple: '#6a2a9a' };
  const ORDER = Object.keys(COLOURS);
  const SAMPLES = [
    { name: 'The band right next to the acid', short: 'Next to the acid', k: 0, pH: 'pH 1–2' },
    { name: 'The band between the acid and the middle', short: 'Between acid and middle', k: 1, pH: 'pH 3–4' },
    { name: 'The band in the middle', short: 'Middle', k: 3, pH: 'pH 7' },
    { name: 'The band right next to the alkali', short: 'Next to the alkali', k: 5, pH: 'pH 12–14' },
  ];
  function picture(x, s) {
    const g = s('g', null, s('circle', { r: 80, fill: '#ffffff', stroke: '#c9d1d9' }));
    ORDER.forEach((c, i) => g.append(s('rect', { x: -78 + i * 26, y: -40, width: 26, height: 80, fill: COLOURS[c], opacity: 0.85 })));
    g.append(s('text', { x: -110, y: 5, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#33404d' }, 'acid'), s('text', { x: 112, y: 5, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#33404d' }, 'alkali'), s('rect', { x: -78 + x.k * 26, y: -44, width: 26, height: 88, fill: 'none', stroke: '#1f2a33', 'stroke-width': 2.5 }));
    return g;
  }
  Observation.run({
    id: 'g6-indicatorpaper',
    guide: '../practical.html#g6-indicatorpaper',
    objectives: ['I can describe the colour range of universal indicator from acid to alkali.', 'I can link each colour to a pH number.'],
    benchLabel: 'A circle of filter paper soaked in universal indicator, with acid added on the left and alkali on the right, showing bands of colour.',
    picture,
    tests: {
      label: 'Band',
      title: 'Read the colour bands',
      text: 'Your teacher adds acid to one side of the paper and alkali to the other. Watch the colours spread towards each other, then look at each band.',
      why: 'The acid and alkali mix where they meet, so the paper shows every pH in between.',
      task: 'look at the outlined band',
      button: (x) => `Look at: ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Colour',
        q: (x) => `${x.short}: what colour is the band?`,
        task: 'record the colour',
        options: ORDER,
        swatches: COLOURS,
        answer: (x) => ORDER[x.k],
        hint: () => 'Look at the band outlined in black.',
      }, {
        label: 'pH',
        q: () => 'Which pH does this colour show?',
        task: 'match the colour to a pH',
        options: SAMPLES.map((y) => y.pH),
        answer: (x) => x.pH,
        hint: () => 'Red is a strong acid (low pH), green is neutral (pH 7), purple is a strong alkali (high pH).',
      }],
    },
    questions: [{
      q: 'Why is the middle of the paper green?',
      o: ['The acid and alkali neutralise each other there, so it is pH 7', 'No indicator reached the middle', 'Green is the colour of the paper'],
      hint: 'What happens when an acid and an alkali meet?',
      right: 'Yes. Where they meet in the right amounts, they neutralise each other.',
    }],
    summary: () => ({
      title: 'Practical complete',
      summary: 'A rainbow formed: red and orange on the acid side, green in the middle where it is neutral, and blue and purple on the alkali side.',
      rows: [['Acid side', 'red, orange'], ['Middle', 'green (pH 7)'], ['Alkali side', 'blue, purple']],
    }),
  });
})();
