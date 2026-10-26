/* Making solutions of different concentrations (Grade 7, Stage 8: 8Cp.01, 8TWSc.04). */
(function () {
  'use strict';
  const SHADES = { 'Dark blue': 'rgba(30, 90, 200, 0.92)', 'Medium blue': 'rgba(30, 90, 200, 0.55)', 'Pale blue': 'rgba(30, 90, 200, 0.25)', 'Very pale blue': 'rgba(30, 90, 200, 0.11)' };
  const SAMPLES = [
    { name: 'Tube 1: 10 cm³ stock + 0 cm³ water', short: 'Tube 1', i: 0, shade: 'Dark blue', frac: 'All of it' },
    { name: 'Tube 2: 5 cm³ stock + 5 cm³ water', short: 'Tube 2', i: 1, shade: 'Medium blue', frac: 'Half' },
    { name: 'Tube 3: 2 cm³ stock + 8 cm³ water', short: 'Tube 3', i: 2, shade: 'Pale blue', frac: 'One fifth' },
    { name: 'Tube 4: 1 cm³ stock + 9 cm³ water', short: 'Tube 4', i: 3, shade: 'Very pale blue', frac: 'One tenth' },
  ];
  function picture(x, s) {
    const g = s('g', null, s('rect', { x: -130, y: -80, width: 260, height: 160, fill: '#ffffff' }));
    SAMPLES.forEach((y, k) => {
      const cx = -90 + k * 60;
      g.append(s('path', { d: `M${cx - 16},-60 L${cx - 16},40 A16,16 0 0 0 ${cx + 16},40 L${cx + 16},-60`, fill: 'none', stroke: k === x.i ? '#c0392b' : '#7f97a8', 'stroke-width': k === x.i ? 3 : 2 }),
        s('path', { d: `M${cx - 15},-20 L${cx - 15},40 A15,15 0 0 0 ${cx + 15},40 L${cx + 15},-20 Z`, fill: k <= x.i ? SHADES[y.shade] : 'none' }),
        s('text', { x: cx, y: 76, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#33404d' }, String(k + 1)));
    });
    return g;
  }
  Observation.run({
    id: 'g7-dilution',
    guide: '../practical.html#g7-dilution',
    objectives: ['I can make a dilution series from a stock solution.', 'I can explain concentration as the amount of solute in a volume of solution.'],
    benchLabel: 'Four test tubes of blue copper(II) sulfate solution in front of white card, each with 10 cm³ in total but less stock solution and more water from tube 1 to tube 4.',
    picture,
    tests: {
      label: 'Tube',
      title: 'Make the dilution series',
      text: 'Make each tube up to 10 cm³ with stock solution and water as shown. Compare the colours against a white background.',
      why: 'Every tube has the same total volume, so the only difference is how much solute it contains.',
      task: 'make up the tube',
      button: (x) => `Make ${x.short.toLowerCase()}`,
      samples: SAMPLES,
      bins: false,
      columns: [{
        label: 'Colour',
        q: (x) => `${x.short}: how dark is the solution?`,
        task: 'record the colour',
        options: Object.keys(SHADES),
        swatches: SHADES,
        answer: (x) => x.shade,
        hint: () => 'Compare the circled tube with the others against the white card.',
      }, {
        label: 'Fraction of stock',
        q: (x) => `${x.short}: what fraction of the 10 cm³ is stock solution?`,
        task: 'work out the fraction',
        options: ['All of it', 'Half', 'One fifth', 'One tenth'],
        answer: (x) => x.frac,
        hint: () => 'Divide the volume of stock by the total volume, 10 cm³.',
      }],
    },
    questions: [{
      q: 'Which tube has the most concentrated solution?',
      o: ['Tube 1', 'Tube 4', 'They are all the same'],
      hint: 'Which tube has the most solute in the same volume?',
      right: 'Yes. A concentrated solution has a lot of solute dissolved in a given volume; a dilute solution has less.',
    }],
    summary: (rows) => ({
      title: 'Practical complete',
      summary: 'The more water added, the paler the solution. A dilute solution has less solute dissolved in the same volume; a concentrated solution has more.',
      rows: rows.map((r) => [r.sample.short, `${r.cells[1].toLowerCase()} stock: ${r.cells[0].toLowerCase()}`]),
    }),
  });
})();
