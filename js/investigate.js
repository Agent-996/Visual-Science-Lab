/* Visual Science Lab: a reusable bench for investigations.
   A practical supplies its scene, the values of the variable it changes, how one measurement
   happens and what to ask afterwards. This file runs the steps, the readings, the results
   table, the graph and the conclusion. See js/sims/*.js for examples. */
(function () {
  'use strict';

  const K = window.LabKit;
  const { h, s, button, fmt, round, near, tween, wait, lerp, clamp } = K;

  /* ---------- Drawing helpers for scenes ---------- */

  const GLASS = { fill: 'rgba(214, 232, 242, 0.35)', stroke: '#7f97a8', 'stroke-width': 1.5 };

  const D = {
    GLASS,

    // Wall, bench and labels along the front of the bench.
    bench(svg, height, labels) {
      const top = height - 40;
      svg.append(
        s('rect', { x: 0, y: 0, width: 720, height: top, fill: '#f6f8f9' }),
        s('rect', { x: 0, y: top, width: 720, height: 40, fill: '#ddd4c6' }),
        s('line', { x1: 0, x2: 720, y1: top + 0.5, y2: top + 0.5, stroke: '#bdb2a1' }),
        ...labels.map(([x, text, line2]) => s('g', null,
          s('text', { class: 'bench-label', x, y: top + 18, 'text-anchor': 'middle' }, text),
          line2 ? s('text', { class: 'bench-label', x, y: top + 32, 'text-anchor': 'middle' }, line2) : null)));
      return top;
    },

    // A beaker standing on y = bottom. setLevel takes 0–1; setColour any CSS colour.
    beaker(cx, bottom, w, ht, colour) {
      const clipId = 'bk' + Math.random().toString(36).slice(2, 8);
      const liquid = s('rect', { x: cx - w / 2, width: w, fill: colour, 'clip-path': `url(#${clipId})` });
      const g = s('g', null,
        s('defs', null, s('clipPath', { id: clipId }, s('rect', { x: cx - w / 2 + 2, y: bottom - ht, width: w - 4, height: ht - 2, rx: 4 }))),
        liquid,
        s('path', { d: `M${cx - w / 2 - 3},${bottom - ht} L${cx - w / 2},${bottom - ht + 4} L${cx - w / 2},${bottom - 4} Q${cx - w / 2},${bottom} ${cx - w / 2 + 4},${bottom} L${cx + w / 2 - 4},${bottom} Q${cx + w / 2},${bottom} ${cx + w / 2},${bottom - 4} L${cx + w / 2},${bottom - ht + 2}`, ...GLASS, fill: 'none' }));
      const api = {
        g,
        setLevel(f) {
          const top = bottom - 2 - (ht - 6) * clamp(f, 0, 1);
          liquid.setAttribute('y', top);
          liquid.setAttribute('height', Math.max(0, bottom - top));
          return api;
        },
        setColour(c) {
          liquid.setAttribute('fill', c);
          return api;
        },
      };
      return api;
    },

    // A thermometer seen from the side, bulb at the bottom. set() takes °C.
    thermometer(x, top, length, min, max) {
      const col = s('rect', { x: x - 1.6, width: 3.2, fill: '#d33a3a' });
      const g = s('g', null,
        s('rect', { x: x - 4, y: top, width: 8, height: length, rx: 4, fill: 'rgba(240, 246, 250, 0.95)', stroke: '#8a9aa8' }),
        col,
        s('circle', { cx: x, cy: top + length + 3, r: 6, fill: '#d33a3a', stroke: '#8a9aa8' }));
      const api = {
        g,
        set(v) {
          const f = clamp((v - min) / (max - min), 0, 1);
          const yTop = top + length - 4 - (length - 10) * f;
          col.setAttribute('y', yTop);
          col.setAttribute('height', top + length + 2 - yTop);
          return api;
        },
      };
      return api;
    },

    // A digital display (balance, stopwatch, ammeter...). set() takes the text to show.
    display(x, y, w, caption) {
      const text = s('text', { x: x + w / 2, y: y + 22, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: '#1f2a1a', 'font-family': 'Source Sans 3, sans-serif' }, '');
      const g = s('g', null,
        s('rect', { x, y, width: w, height: 32, rx: 5, fill: '#39424b' }),
        s('rect', { x: x + 5, y: y + 5, width: w - 10, height: 22, rx: 2, fill: '#c9d7ba' }),
        text,
        caption ? s('text', { class: 'bench-label', x: x + w / 2, y: y - 6, 'text-anchor': 'middle' }, caption) : null);
      return { g, set(t) { text.textContent = t; } };
    },

    // A test tube standing with its rounded bottom on y = bottom. setLevel takes 0–1; setColour any
    // CSS colour; setSolid(f, colour) shows a layer of solid (a precipitate) filling f of the tube.
    tube(cx, bottom, w, ht, colour) {
      const clipId = 'tb' + Math.random().toString(36).slice(2, 8);
      const r = w / 2;
      const outline = `M${cx - r},${bottom - ht} L${cx - r},${bottom - r} A${r},${r} 0 0 0 ${cx + r},${bottom - r} L${cx + r},${bottom - ht}`;
      const liquid = s('rect', { x: cx - r, width: w, fill: colour, 'clip-path': `url(#${clipId})` });
      const solid = s('rect', { x: cx - r, width: w, height: 0, y: bottom, 'clip-path': `url(#${clipId})` });
      const grains = s('line', { x1: cx - r + 2, x2: cx + r - 2, stroke: 'rgba(60, 70, 80, 0.45)', 'stroke-width': 2.5, 'stroke-dasharray': '1.5 2.5', visibility: 'hidden' });
      const g = s('g', null,
        s('defs', null, s('clipPath', { id: clipId }, s('path', { d: `${outline} Z` }))),
        liquid,
        solid,
        grains,
        s('path', { d: outline, ...GLASS, fill: 'none' }),
        s('ellipse', { cx, cy: bottom - ht, rx: r + 2, ry: 2.5, ...GLASS, fill: 'none' }));
      const api = {
        g,
        setLevel(f) {
          const top = bottom - (ht - 6) * clamp(f, 0, 1);
          liquid.setAttribute('y', top);
          liquid.setAttribute('height', Math.max(0, bottom - top));
          return api;
        },
        setColour(c) {
          liquid.setAttribute('fill', c);
          return api;
        },
        setSolid(f, c) {
          const top = bottom - (ht - 6) * clamp(f, 0, 1);
          solid.setAttribute('y', top);
          solid.setAttribute('height', Math.max(0, bottom - top));
          if (c) solid.setAttribute('fill', c);
          grains.setAttribute('y1', top + 1.5);
          grains.setAttribute('y2', top + 1.5);
          grains.setAttribute('visibility', f > 0.01 ? 'visible' : 'hidden');
          return api;
        },
      };
      return api;
    },

    hit: (x, y, width, height) => s('rect', { class: 'hit', x, y, width, height, rx: 8 }),
  };

  /* ---------- The investigation ---------- */

  function run(cfg) {
    const st = cfg.state || {};
    const height = cfg.height || 440;
    const R = cfg.repeats || 1;
    const dp = cfg.dv.dp;
    const unitText = (u) => (u ? ` / ${u}` : '');
    const withUnit = (value, u) => (!u ? String(value) : u === '°' ? `${value}°` : `${value} ${u}`);

    const svg = s('svg', { viewBox: `0 0 720 ${height}`, role: 'group', 'aria-label': cfg.benchLabel });
    const scene = cfg.scene(svg, D, st);
    const status = h('div', { class: 'bench-status', 'aria-live': 'polite' });
    document.getElementById('bench').append(svg, status);
    const mag = cfg.closeUp ? new K.Magnifier(cfg.closeUp) : null;

    function draw() {
      scene.update(st);
      if (mag) mag.update(cfg.closeUp.value(st));
    }

    const rows = cfg.iv.values.map((x) => ({ x, trials: Array(R).fill(null), mean: null }));
    const extras = [];
    let graph = null;
    let awaiting = null;
    const table = document.getElementById('results-table');
    const calcs = document.getElementById('calc-list');
    const showX = (x) => (cfg.iv.format ? cfg.iv.format(x) : String(x));

    function renderTable() {
      table.replaceChildren(
        h('thead', null, h('tr', null,
          h('th', { scope: 'col' }, cfg.iv.label + unitText(cfg.iv.unit)),
          R > 1 ? Array.from({ length: R }, (_, i) => h('th', { scope: 'col' }, `Trial ${i + 1}${unitText(cfg.dv.unit)}`)) : h('th', { scope: 'col' }, cfg.dv.label + unitText(cfg.dv.unit)),
          R > 1 ? h('th', { scope: 'col' }, `Mean${unitText(cfg.dv.unit)}`) : null)),
        h('tbody', null, rows.map((r, i) => h('tr', null,
          h('td', null, showX(r.x)),
          r.trials.map((t, j) => h('td', { class: awaiting && awaiting[0] === i && awaiting[1] === j ? 'now' : null }, t === null ? '' : fmt(t, dp))),
          R > 1 ? h('td', null, r.mean === null ? '' : fmt(r.mean, dp)) : null))));
      calcs.replaceChildren(...(extras.length ? [h('dl', { class: 'calc-list' }, extras.map(([k, v]) => [h('dt', null, k), h('dd', null, v)]))] : []));
      if (graph) {
        graph.points = rows.map((r, i) => ({ x: cfg.iv.categorical ? i : r.x, y: r.mean, i })).filter((p) => p.y !== null);
        if (!cfg.iv.categorical && cfg.graph.curve !== 'none' && graph.points.length > 2) graph.curve = K.smoothCurve(graph.points);
        graph.render();
      }
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
          g.hot([]);
          await step.run(api);
          if (step.done) say(step.done, 'good');
          g.next();
        };
        const btn = button(step.button, go, { primary: true });
        if (step.item) {
          g.hot([step.item]);
          g.on(step.item, go);
        }
        box.append(mag && step.showCloseUp ? h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, h('div', { class: 'btn-row' }, btn))) : h('div', { class: 'btn-row' }, btn));
      },
    }));

    const measureStep = {
      id: 'measure',
      title: cfg.measureTitle,
      text: cfg.measureText,
      why: cfg.measureWhy,
      enter(box, g) {
        if (cfg.graph) {
          // A categorical variable (metals, surfaces...) is drawn as a bar chart.
          graph = new K.Graph(!cfg.iv.categorical ? cfg.graph : {
            describe: (p) => [withUnit(fmt(p.y, dp), cfg.dv.unit), showX(rows[p.i].x)],
            ...cfg.graph,
            categories: cfg.iv.values.map(showX),
          });
          document.getElementById('graph').replaceChildren(graph.el);
          graph.render();
        }
        let i = 0;
        let rep = 0;
        const next = () => {
          box.replaceChildren();
          const v = rows[i].x;
          const where = `${cfg.iv.label} ${withUnit(showX(v), cfg.iv.unit)}${R > 1 ? `, trial ${rep + 1} of ${R}` : ''}`;
          g.task(`${where}: ${cfg.measureTask || 'take the measurement'}.`);
          let busy = false;
          const go = async () => {
            if (busy) return;
            busy = true;
            btn.disabled = true;
            g.hot([]);
            const value = await cfg.measure(v, rep, api);
            awaiting = [i, rep];
            renderTable();
            g.task(`${where}: record the ${cfg.dv.label.toLowerCase()}.`);
            const f = K.field({
              label: `${cfg.dv.label} (${where})`,
              unit: cfg.dv.unit,
              placeholder: cfg.dv.placeholder,
              say,
              check: (x, attempts) => {
                if (near(x, value, { abs: cfg.dv.tol + 1e-9 })) return { ok: true, accepted: round(x, dp), value: fmt(x, dp), msg: `Recorded ${withUnit(fmt(x, dp), cfg.dv.unit)}.` };
                if (attempts >= 3) return { ok: true, tone: 'info', accepted: round(value, dp), value: fmt(value, dp), msg: `The reading is ${withUnit(fmt(value, dp), cfg.dv.unit)}. ${cfg.dv.readHint || ''}` };
                return { ok: false, tone: Math.abs(x - value) <= cfg.dv.tol * 4 ? 'warn' : 'bad', msg: cfg.dv.readHint || 'Not quite. Read it again carefully.' };
              },
              onAccept: (x) => {
                rows[i].trials[rep] = x;
                if (rows[i].trials.every((t) => t !== null)) rows[i].mean = round(rows[i].trials.reduce((a, b) => a + b, 0) / R, dp);
                awaiting = null;
                renderTable();
                rep += 1;
                if (rep >= R) {
                  rep = 0;
                  i += 1;
                }
                if (cfg.afterReading) cfg.afterReading(api);
                if (i < rows.length) next();
                else {
                  say('All your results are recorded.', 'good');
                  g.next();
                }
              },
            });
            box.replaceChildren(mag ? h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, f.el)) : f.el);
            f.focus();
          };
          const btn = button(cfg.measureButton(v, rep), go, { primary: true });
          if (cfg.measureItem) {
            g.hot([cfg.measureItem]);
            g.on(cfg.measureItem, go);
          }
          box.append(mag ? h('div', { class: 'split' }, mag.el, h('div', { class: 'controls' }, h('div', { class: 'btn-row' }, btn))) : h('div', { class: 'btn-row' }, btn));
          if (K.isAutofill()) btn.focus({ preventScroll: true });
        };
        next();
      },
    };

    const patternStep = {
      id: 'pattern',
      title: cfg.pattern.title || 'What do your results show?',
      text: cfg.pattern.text || 'Look at your table and graph, then choose the best conclusion.',
      why: cfg.pattern.why,
      enter(box, g) {
        box.append(K.choice({
          question: cfg.pattern.q,
          options: cfg.pattern.o,
          hint: cfg.pattern.hint,
          right: cfg.pattern.right,
          say,
          onDone: () => setTimeout(() => g.next(), 900 / K.timeScale),
        }));
      },
    };

    const extraSteps = (cfg.extra || []).map((x, n) => ({
      id: 'extra' + n,
      title: x.title,
      text: x.text,
      why: x.why,
      enter(box, g) {
        const expected = x.expected(rows);
        const f = K.field({
          label: x.label,
          unit: x.unit,
          placeholder: x.placeholder,
          say,
          check: (v, attempts) => {
            if (near(v, expected, { abs: x.tol })) return { ok: true, accepted: v, msg: x.msg(v) };
            if (attempts >= 3) return { ok: true, tone: 'info', accepted: round(expected, x.dp ?? 1), value: fmt(expected, x.dp ?? 1), msg: x.msg(expected) };
            return { ok: false, tone: 'warn', msg: x.hint };
          },
          onAccept: (v) => {
            extras.push([x.short || x.label, withUnit(fmt(v, x.dp ?? 1), x.unit)]);
            if (x.mark && graph) graph.set({ marks: [x.mark(v)] });
            renderTable();
            g.next();
          },
        });
        box.append(f.el);
        f.focus();
      },
    }));

    const steps = [...setupSteps, measureStep, patternStep, ...extraSteps];
    const lab = K.setupLab({ id: cfg.id, guide: cfg.guide, objectives: cfg.objectives, steps, items: scene.items || {} });
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

  window.Investigation = { run, D };
})();
