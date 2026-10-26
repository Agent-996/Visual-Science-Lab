/* Visual Science Lab: a reusable bench for observe-and-test practicals.
   A practical supplies its scene, the samples to test, how one test happens and what to record
   about each sample (chosen from a list). This file runs the steps, the observation questions,
   the results table and the conclusion questions. See js/tests/*.js for examples.
   Needs labkit.js and investigate.js (for the drawing helpers) loaded first. */
(function () {
  'use strict';

  const K = window.LabKit;
  const { h, s, button } = K;
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms / K.timeScale));

  function run(cfg) {
    const st = cfg.state || {};
    const height = cfg.height || 440;
    const T = cfg.tests;
    const svg = s('svg', { viewBox: `0 0 720 ${height}`, role: 'group', 'aria-label': cfg.benchLabel });
    const scene = cfg.scene(svg, window.Investigation.D, st);
    const status = h('div', { class: 'bench-status', 'aria-live': 'polite' });
    document.getElementById('bench').append(svg, status);
    const draw = () => scene.update(st);

    const rows = T.samples.map((x) => ({ sample: x, name: x.name, cells: T.columns.map(() => null) }));
    let awaiting = null;
    const table = document.getElementById('results-table');
    table.classList.add('obs');
    const optionsFor = (col, x) => (typeof col.options === 'function' ? col.options(x) : col.options);

    function renderTable() {
      const cell = (col, v) => (v === null ? '' : [col.swatches && col.swatches[v] ? h('span', { class: 'swatch', style: `background:${col.swatches[v]}`, 'aria-hidden': 'true' }) : null, col.short ? col.short(v) : v]);
      table.replaceChildren(
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, T.label), T.columns.map((c) => h('th', { scope: 'col' }, c.label)))),
        h('tbody', null, rows.map((r, i) => h('tr', null,
          h('td', null, r.name),
          r.cells.map((v, j) => h('td', { class: awaiting && awaiting[0] === i && awaiting[1] === j ? 'now' : null }, cell(T.columns[j], v)))))));
    }

    const setupSteps = (cfg.setup || []).map((step, i) => ({
      id: 'setup' + i,
      title: step.title,
      text: step.text,
      why: step.why,
      enter(box, g) {
        let busy = false;
        const go = async () => {
          if (busy) return;
          busy = true;
          btn.disabled = true;
          await step.run(api);
          if (step.done) say(step.done, 'good');
          g.next();
        };
        const btn = button(step.button, go, { primary: true });
        box.append(h('div', { class: 'btn-row' }, btn));
      },
    }));

    const testStep = {
      id: 'tests',
      title: T.title,
      text: T.text,
      why: T.why,
      enter(box, g) {
        let i = 0;
        const ask = (j) => {
          const x = T.samples[i];
          const col = T.columns[j];
          const answer = col.answer(x);
          awaiting = [i, j];
          renderTable();
          g.task(`${x.name}: ${col.task || 'record what you see'}.`);
          box.replaceChildren(K.choice({
            question: typeof col.q === 'function' ? col.q(x) : col.q,
            options: optionsFor(col, x),
            answer,
            swatches: col.swatches,
            hint: col.hint ? col.hint(x) : 'Not quite. Look at the bench again.',
            right: col.right ? col.right(x) : `Recorded: ${answer}.`,
            say,
            onDone: async () => {
              rows[i].cells[j] = answer;
              awaiting = null;
              renderTable();
              await pause(700);
              if (j + 1 < T.columns.length) return ask(j + 1);
              if (T.after) await T.after(x, api);
              i += 1;
              if (i < T.samples.length) next();
              else {
                say('All your results are recorded.', 'good');
                g.next();
              }
            },
          }));
        };
        const next = () => {
          const x = T.samples[i];
          box.replaceChildren();
          g.task(`${x.name}: ${T.task}.`);
          let busy = false;
          const go = async () => {
            if (busy) return;
            busy = true;
            btn.disabled = true;
            await T.run(x, api);
            ask(0);
          };
          const btn = button(T.button(x), go, { primary: true });
          box.append(h('div', { class: 'btn-row' }, btn));
          if (K.isAutofill()) btn.focus({ preventScroll: true });
        };
        next();
      },
    };

    const questionSteps = cfg.questions.map((q, n) => ({
      id: 'q' + n,
      title: q.title || 'What do your results show?',
      text: q.text || 'Look at your results table, then choose the best answer.',
      why: q.why,
      enter(box, g) {
        box.append(K.choice({ question: q.q, options: q.o, hint: q.hint, right: q.right, say, onDone: () => setTimeout(() => g.next(), 900 / K.timeScale) }));
      },
    }));

    const lab = K.setupLab({ id: cfg.id, guide: cfg.guide, objectives: cfg.objectives, steps: [...setupSteps, testStep, ...questionSteps], items: scene.items || {} });
    const say = lab.say;
    const api = {
      st,
      draw,
      say,
      status(text) {
        status.replaceChildren(...(text ? [h('span', null, text)] : []));
      },
    };
    lab.guide.onFinish = () => lab.finish(cfg.summary(rows));

    renderTable();
    draw();
    lab.guide.start();
    window.__lab = { st, rows, cfg };
  }

  window.Observation = { run };
})();
