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

  // Splits text into lines of at most `max` characters.
  function wrap(text, max) {
    const lines = [''];
    for (const word of String(text).split(' ')) {
      const last = lines[lines.length - 1];
      if (last && (last + ' ' + word).length > max) lines.push(word);
      else lines[lines.length - 1] = last ? last + ' ' + word : word;
    }
    return lines;
  }

  // The default scene for sorting and model activities: a card for the sample being looked at
  // (its name, a short detail and an optional picture(sample) drawing), and sorting bins below
  // that fill up with the answers to the first question (or tests.binColumn).
  function cardScene(cfg) {
    return (svg, D, st) => {
      const binCol = cfg.tests.binColumn || 0;
      const col = cfg.tests.columns[binCol];
      const bins = cfg.tests.bins === false || typeof col.options === 'function' || col.options.length > 4 ? null : col.options;
      svg.append(s('rect', { x: 0, y: 0, width: 720, height: 440, fill: '#f6f8f9' }));
      const card = s('g', null);
      const binG = s('g', null);
      svg.append(card, binG);
      const binW = bins ? Math.min(200, (680 - (bins.length - 1) * 14) / bins.length) : 0;
      const binX = (k) => 360 - ((bins.length * binW + (bins.length - 1) * 14) / 2) + k * (binW + 14);
      return {
        update() {
          card.replaceChildren();
          const x = st.current;
          const top = bins ? 18 : 40;
          const ht = bins ? 210 : 340;
          card.append(s('rect', { x: 170, y: top, width: 380, height: ht, rx: 14, fill: '#ffffff', stroke: '#c9d1d9', 'stroke-width': 2 }));
          if (!x) {
            card.append(s('text', { x: 360, y: top + ht / 2 + 8, 'text-anchor': 'middle', 'font-size': 18, fill: '#8a96a3' }, cfg.tests.waiting || 'Press the button to begin'));
          } else {
            const g = s('g', { opacity: st.cardIn.toFixed(2), transform: `translate(0 ${((1 - st.cardIn) * 12).toFixed(1)})` });
            const pic = cfg.picture ? cfg.picture(x, s) : null;
            const lines = wrap(x.name, 30);
            const nameY = pic ? top + 30 : top + ht / 2 - (lines.length - 1) * 13 - (x.detail ? 22 : 0);
            lines.forEach((ln, i) => g.append(s('text', { x: 360, y: nameY + i * 26, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#1f2a33' }, ln)));
            if (x.detail) wrap(x.detail, 44).forEach((ln, i) => g.append(s('text', { x: 360, y: (pic ? top + ht - 18 - (wrap(x.detail, 44).length - 1 - i) * 19 : nameY + lines.length * 26 + 10 + i * 19), 'text-anchor': 'middle', 'font-size': 14.5, fill: '#455261' }, ln)));
            if (pic) g.append(s('g', { transform: `translate(360 ${top + (bins ? 112 : 170)})` }, pic));
            card.append(g);
          }
          binG.replaceChildren();
          if (!bins) return;
          bins.forEach((name, k) => {
            const bx = binX(k);
            const items = (st.rows || []).filter((r) => r.cells[binCol] === name);
            binG.append(s('rect', { x: bx, y: 244, width: binW, height: 186, rx: 10, fill: '#ffffff', stroke: '#c9d1d9', 'stroke-width': 1.5, 'stroke-dasharray': '6 4' }));
            wrap(name, Math.floor(binW / 8)).slice(0, 2).forEach((ln, i) => binG.append(s('text', { x: bx + binW / 2, y: 266 + i * 17, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#33404d' }, ln)));
            items.slice(0, 6).forEach((r, i) => {
              const label = r.sample.short || r.name;
              binG.append(s('rect', { x: bx + 8, y: 296 + i * 22, width: binW - 16, height: 19, rx: 9.5, style: 'fill: var(--subject, #357a28)', opacity: 0.14 }),
                s('text', { x: bx + binW / 2, y: 310 + i * 22, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 600, fill: '#1f2a33' }, label.length > binW / 7 ? label.slice(0, Math.floor(binW / 7) - 1) + '…' : label));
            });
          });
        },
      };
    };
  }

  function run(cfg) {
    const st = cfg.state || {};
    const height = cfg.height || 440;
    const T = cfg.tests;
    const rows = T.samples.map((x) => ({ sample: x, name: x.name, cells: T.columns.map(() => null) }));
    st.rows = rows;
    if (!cfg.scene) {
      st.current = null;
      st.cardIn = 0;
    }
    const svg = s('svg', { viewBox: `0 0 720 ${height}`, role: 'group', 'aria-label': cfg.benchLabel });
    const scene = (cfg.scene || cardScene(cfg))(svg, window.Investigation.D, st);
    const status = h('div', { class: 'bench-status', 'aria-live': 'polite' });
    document.getElementById('bench').append(svg, status);
    const draw = () => scene.update(st);

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
              draw();
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
            if (T.run) await T.run(x, api);
            else {
              st.current = x;
              await K.tween(450, (t) => {
                st.cardIn = t;
                draw();
              });
            }
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
