/* Pure metals compared with alloys: scratch test (Grade 6, Stage 7: 7Cp.06, 7Cp.07). */
(function () {
  'use strict';
  const SAMPLES = [
    { name: 'Copper', colour: '#c46f3c', deep: true, kind: 'Pure metal' },
    { name: 'Brass (copper and zinc)', short: 'Brass', colour: '#d4b04a', deep: false, kind: 'Alloy' },
    { name: 'Iron', colour: '#7d838a', deep: true, kind: 'Pure metal' },
    { name: 'Steel (iron and carbon)', short: 'Steel', colour: '#a9b2ba', deep: false, kind: 'Alloy' },
  ];
  const picture = (x, s) => s('g', null,
    s('rect', { x: -110, y: -20, width: 220, height: 40, rx: 4, fill: x.colour, stroke: '#4a5058' }),
    s('path', { d: 'M-90,2 Q0,-4 90,2', fill: 'none', stroke: '#2b2418', 'stroke-width': x.deep ? 4 : 1, 'stroke-linecap': 'round', opacity: x.deep ? 0.8 : 0.5 }));
  Observation.run({
    id: 'g6-alloys',
    guide: '../practical.html#g6-alloys',
    objectives: ['I can compare the hardness of pure metals and alloys.', 'I can give examples of alloys and their uses.'],
    benchLabel: 'A strip of each metal with a scratch made by pressing a steel nail across it with the same force, and two trays: pure metals and alloys.',
    picture,
    tests: {
      label: 'Metal',
      title: 'Scratch each metal',
      text: 'Press the nail across each strip with the same force. Look at how deep the scratch is.',
      why: 'A harder metal scratches less. Using the same force each time makes it a fair test.',
      task: 'scratch the strip',
      button: (x) => `Scratch the ${(x.short || x.name).toLowerCase()}`,
      samples: SAMPLES,
      binColumn: 1,
      columns: [{
        label: 'Scratch',
        q: (x) => `${x.short || x.name}: how deep is the scratch?`,
        task: 'record the scratch',
        options: ['Deep scratch', 'Shallow scratch'],
        answer: (x) => (x.deep ? 'Deep scratch' : 'Shallow scratch'),
        hint: () => 'Compare the line across the strip with the other strips.',
      }, {
        label: 'Pure metal or alloy?',
        q: (x) => `Is ${(x.short || x.name).toLowerCase()} a pure metal or an alloy?`,
        task: 'sort it',
        options: ['Pure metal', 'Alloy'],
        answer: (x) => x.kind,
        hint: () => 'An alloy is a mixture of a metal with other elements.',
      }],
    },
    questions: [{
      q: 'What do your results show?',
      o: ['Alloys are harder than the pure metals they are made from', 'Pure metals are harder than alloys', 'All the metals are equally hard'],
      hint: 'Compare copper with brass, and iron with steel.',
      right: 'Yes. Brass scratched less than copper, and steel less than iron.',
    }, {
      q: 'Why is steel used for bridges instead of pure iron?',
      o: ['Steel is harder and stronger', 'Steel is softer', 'Steel is a pure metal'],
      hint: 'What did the scratch test show about steel?',
      right: 'Yes. Alloys are often chosen because they are harder and stronger than pure metals.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'Brass scratched less than copper, and steel less than iron. Alloys are usually harder than the pure metals they are made from.',
      rows: rows.map((r) => [r.sample.short || r.name, `${r.cells[0].toLowerCase()} (${r.cells[1].toLowerCase()})`]),
    }),
  });
})();
