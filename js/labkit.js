/* Visual Science Lab: the shared toolkit every practical is built on.
   It is a plain script with no build step, so the pages work on GitHub Pages
   and when the files are opened straight from a folder. */
(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---------- DOM helpers ---------- */

  function setAttrs(el, attrs) {
    if (!attrs) return;
    for (const key of Object.keys(attrs)) {
      const value = attrs[key];
      if (value === null || value === undefined || value === false) continue;
      if (key === 'text') el.textContent = value;
      else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? '' : String(value));
    }
  }

  function append(el, kids) {
    for (const kid of kids.flat(Infinity)) {
      if (kid === null || kid === undefined || kid === false) continue;
      el.append(kid instanceof Node ? kid : String(kid));
    }
    return el;
  }

  // h('p', {class: 'x'}, 'text', child) builds an HTML element.
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    setAttrs(el, attrs);
    return append(el, kids);
  }

  // s('rect', {x: 1}) builds an SVG element.
  function s(tag, attrs, ...kids) {
    const el = document.createElementNS(SVG_NS, tag);
    setAttrs(el, attrs);
    return append(el, kids);
  }

  function button(label, onClick, opts = {}) {
    const cls = ['btn'];
    if (opts.primary) cls.push('btn-primary');
    if (opts.small) cls.push('btn-small');
    return h('button', { type: 'button', class: cls.join(' '), id: opts.id, disabled: opts.disabled, onclick: onClick }, label);
  }

  /* ---------- Numbers ---------- */

  const rand = (min, max) => min + Math.random() * (max - min);
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const lerp = (a, b, t) => a + (b - a) * t;

  function gauss() {
    let u = 0;
    let v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function round(x, dp = 0) {
    const f = Math.pow(10, dp);
    const r = Math.round(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f;
    return r === 0 ? 0 : r;
  }

  const fmt = (x, dp) => round(x, dp).toFixed(dp);

  // Shows small numbers in standard form, e.g. 2.45 × 10⁻³.
  function fmtSci(x, sf = 3) {
    if (x === 0) return '0';
    const exp = Math.floor(Math.log10(Math.abs(x)));
    if (exp >= -2 && exp < 4) return String(Number(x.toPrecision(sf)));
    const mant = x / Math.pow(10, exp);
    const sup = String(exp).replace(/[-0-9]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);
    return mant.toFixed(sf - 1) + ' × 10' + sup;
  }

  // Reads what a student types: "23.45", "23,45", "2.45e-3", "2.45 x 10^-3", "2.45 × 10⁻³".
  function parseNumber(text) {
    if (typeof text !== 'string') return NaN;
    let t = text.trim().replace(/\s+/g, '').replace(/[−–]/g, '-');
    t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (c) => '0123456789-'['⁰¹²³⁴⁵⁶⁷⁸⁹⁻'.indexOf(c)]);
    if (/^[+-]?\d+,\d+$/.test(t)) t = t.replace(',', '.');
    const m = t.match(/^([+-]?(?:\d+\.?\d*|\.\d+))(?:[x×*]10\^?([+-]?\d+)|e([+-]?\d+))?$/i);
    if (!m) return NaN;
    const exp = m[2] !== undefined ? m[2] : m[3];
    return Number(m[1]) * (exp !== undefined ? Math.pow(10, Number(exp)) : 1);
  }

  function near(value, target, tol = {}) {
    const allowed = Math.max(tol.abs || 0, Math.abs(target) * (tol.rel || 0));
    return Math.abs(value - target) <= allowed + 1e-9;
  }

  /* ---------- Time and animation ---------- */

  const params = new URLSearchParams(location.search);
  // ?speed=10 runs the simulation faster; used for automated testing.
  const timeScale = Math.max(1, Number(params.get('speed')) || 1);
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const coarsePointer = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function tween(ms, onFrame) {
    const duration = reduceMotion ? Math.min(ms, 150) : ms / timeScale;
    return new Promise((resolve) => {
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        onFrame(easeInOut(t), t);
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms / timeScale));

  /* ---------- Feedback line ---------- */

  const TONE_ICON = { info: 'i', good: '✓', warn: '!', bad: '✕' };

  function createFeedback(el) {
    el.hidden = true;
    return function say(message, tone = 'info') {
      el.dataset.tone = tone;
      el.replaceChildren(
        h('span', { class: 'fb-icon', 'aria-hidden': 'true' }, TONE_ICON[tone] || 'i'),
        h('span', { class: 'fb-text' }, message)
      );
      el.hidden = false;
      el.classList.remove('flash');
      void el.offsetWidth;
      el.classList.add('flash');
    };
  }

  /* ---------- Step-by-step guide ---------- */

  class Guide {
    constructor({ steps, card, actions, list, say, items, onFinish }) {
      this.steps = steps;
      this.card = card;
      this.actions = actions;
      this.list = list;
      this.say = say;
      this.items = items || {};
      this.onFinish = onFinish;
      this.index = -1;
      this.done = new Set();
      this.handlers = {};
    }

    get current() {
      return this.steps[this.index];
    }

    start() {
      this.go(0);
    }

    go(i) {
      const hadFocus = this.card.parentElement && this.card.parentElement.contains(document.activeElement);
      this.index = i;
      const step = this.steps[i];
      this.taskEl = h('p', { class: 'step-task', hidden: true });
      this.titleEl = h('h2', { class: 'step-title', tabindex: '-1' }, step.title);
      const pct = Math.round((i / this.steps.length) * 100);
      this.card.replaceChildren(
        h('div', { class: 'step-meta' },
          h('span', { class: 'step-count' }, `Step ${i + 1} of ${this.steps.length}`),
          h('span', { class: 'progress', 'aria-hidden': 'true' }, h('i', { style: `width:${pct}%` }))),
        this.titleEl,
        step.text ? h('p', { class: 'step-text' }, step.text) : null,
        this.taskEl,
        step.why ? h('details', { class: 'why' }, h('summary', null, 'Why do we do this?'), h('p', null, step.why)) : null,
        this.actions
      );
      this.actions.replaceChildren();
      this.handlers = {};
      this.hot([]);
      this.renderList();
      if (step.enter) step.enter(this.actions, this);
      if (hadFocus) this.titleEl.focus({ preventScroll: true });
    }

    next() {
      if (this.index < 0) return;
      this.done.add(this.current.id);
      if (this.index + 1 < this.steps.length) {
        this.go(this.index + 1);
      } else {
        this.index = this.steps.length;
        this.renderList();
        this.hot([]);
        if (this.onFinish) this.onFinish();
      }
    }

    // A short "do this now" line inside the step card.
    task(text) {
      this.taskEl.textContent = text || '';
      this.taskEl.hidden = !text;
    }

    // Outlines the bench equipment the student should click.
    hot(names) {
      for (const [name, el] of Object.entries(this.items)) {
        el.classList.toggle('hot', names.includes(name));
      }
    }

    // What happens when a piece of bench equipment is clicked during this step.
    on(name, handler) {
      this.handlers[name] = handler;
    }

    clickItem(name) {
      const handler = this.handlers[name];
      if (handler) handler();
      else if (this.current) this.say(`That isn't needed right now. Follow step ${this.index + 1}: ${this.current.title}.`, 'info');
    }

    renderList() {
      if (!this.list) return;
      this.list.replaceChildren(
        ...this.steps.map((step, i) =>
          h('li', { class: this.done.has(step.id) ? 'done' : i === this.index ? 'current' : null,
            'aria-current': i === this.index ? 'step' : null }, step.title))
      );
    }
  }

  // Makes an SVG group behave like a button (mouse, touch and keyboard).
  function clickable(el, label, handler) {
    el.classList.add('item');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', label);
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
      }
    });
    return el;
  }

  /* ---------- Reading and answer fields ---------- */

  /* ---------- "Fill it in for me" ----------
     Students can type every reading themselves, or let the lab fill readings in so they
     only press Next step. The choice is remembered in this browser. */

  let autofill = false;
  try {
    autofill = localStorage.getItem('vsl-autofill') === '1';
  } catch (e) {
    /* Without storage the switch simply starts off. */
  }
  const autofillListeners = new Set();
  const liveFields = new Set();

  function setAutofill(on) {
    autofill = on;
    try {
      localStorage.setItem('vsl-autofill', on ? '1' : '0');
    } catch (e) {
      /* ignore */
    }
    if (on) for (const f of liveFields) f.prefill();
    for (const fn of autofillListeners) fn(on);
  }

  let fieldCount = 0;

  // A labelled number box with a Record button. check(value, attempts) returns
  // {ok: true} to accept, or {ok: false, msg} to explain what is wrong.
  // Every check must give the answer when attempts reach 3: that is what
  // "Fill it in for me" uses, by calling check(NaN, Infinity).
  function field({ label, unit, placeholder, check, onAccept, say, button: buttonLabel }) {
    const id = 'f' + ++fieldCount;
    const input = h('input', { id, class: 'num-input', type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false', placeholder });
    const submit = h('button', { type: 'submit', class: 'btn btn-primary' }, buttonLabel || 'Record');
    const fill = h('button', { type: 'button', class: 'btn btn-quiet btn-small' }, 'Fill it in for me');
    const form = h('form', { class: 'reading-field', novalidate: true },
      h('label', { for: id }, label),
      h('div', { class: 'input-row' }, input, unit ? h('span', { class: 'unit' }, unit) : null, submit),
      h('div', null, fill));
    let attempts = 0;

    const answer = () => {
      const r = check(NaN, Infinity);
      return r && r.ok ? r : null;
    };
    const accept = (result, value) => {
      if (result.value !== undefined) input.value = result.value;
      input.disabled = true;
      submit.disabled = true;
      fill.disabled = true;
      liveFields.delete(api);
      if (result.msg) say(result.msg, result.tone || 'good');
      onAccept(result.accepted !== undefined ? result.accepted : value, attempts);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.disabled) return;
      const value = parseNumber(input.value);
      if (!Number.isFinite(value)) {
        say('Type a number, for example 12.35, or press “Fill it in for me”.', 'warn');
        input.focus();
        return;
      }
      attempts += 1;
      const result = check(value, attempts);
      if (result.ok) accept(result, value);
      else {
        say(result.msg || 'Not quite. Check your working and try again.', result.tone || 'bad');
        input.select();
      }
    });
    fill.addEventListener('click', () => {
      const r = answer();
      if (!r || input.disabled) return;
      accept({ ...r, tone: 'info' }, r.accepted);
    });

    const api = {
      el: form,
      input,
      // With the switch on, the right value is already in the box and the button says Next step.
      prefill() {
        if (input.disabled) return;
        const r = answer();
        if (!r) return;
        input.value = r.value !== undefined ? r.value : String(r.accepted);
        submit.textContent = 'Next step';
      },
      focus() {
        if (autofill) submit.focus({ preventScroll: true });
        else if (!coarsePointer) input.focus({ preventScroll: true });
      },
      disable(flag) {
        input.disabled = flag;
        submit.disabled = flag;
        fill.disabled = flag;
      },
    };
    liveFields.add(api);
    if (autofill) api.prefill();
    return api;
  }

  /* ---------- Multiple choice with "Fill it in for me" ---------- */

  function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // options[0] is the right answer; the buttons are shown in a random order.
  function choice({ question, options, say, onDone, hint, right }) {
    const letters = 'ABCDEF';
    let done = false;
    const buttons = shuffled(options).map((o, i) => h('button', { type: 'button', class: 'option', onclick: () => pick(o) },
      h('span', { class: 'letter' }, letters[i]), h('span', null, o)));
    function pick(o, auto) {
      if (done) return;
      const b = buttons.find((x) => x.lastChild.textContent === o);
      if (o === options[0]) {
        done = true;
        b.classList.add('right');
        for (const x of buttons) x.disabled = true;
        fill.disabled = true;
        say(right || 'Correct.', auto ? 'info' : 'good');
        onDone(o);
      } else {
        b.classList.add('wrong');
        b.disabled = true;
        say(hint || 'Not quite. Look at your results again.', 'warn');
      }
    }
    const fill = h('button', { type: 'button', class: 'btn btn-quiet btn-small', onclick: () => pick(options[0], true) }, 'Fill it in for me');
    if (autofill) setTimeout(() => pick(options[0], true), 400 / timeScale);
    return h('div', { class: 'question' }, h('p', { class: 'q-text' }, question), h('div', { class: 'options' }, buttons), h('div', null, fill));
  }

  /* ---------- Magnified scale (burette or ruler) ---------- */

  let clipCount = 0;

  class Magnifier {
    // kind: 'burette' (liquid with a meniscus) or 'ruler' (a pointer).
    constructor({ kind, label, caption, span, minor, major, labelEvery, min, max, liquid }) {
      this.o = { kind, span, minor, major, labelEvery, min, max, liquid: liquid || '#cfe6f5' };
      this.W = 170;
      this.H = 230;
      const clipId = 'mag-clip-' + ++clipCount;
      this.layer = s('g', { 'clip-path': `url(#${clipId})` });
      this.svg = s('svg', { viewBox: `0 0 ${this.W} ${this.H}`, role: 'img', 'aria-label': label },
        s('defs', null, s('clipPath', { id: clipId }, s('rect', { x: 0, y: 0, width: this.W, height: this.H, rx: 10 }))),
        this.layer);
      this.el = h('figure', { class: 'magnifier' }, this.svg, h('figcaption', null, caption || 'Magnified view'));
      this.value = undefined;
    }

    update(value) {
      if (value === this.value) return;
      this.value = value;
      const { kind, span, minor, major, labelEvery, min, max } = this.o;
      const W = this.W;
      const H = this.H;
      const ppu = H / span;
      const centre = value === null ? (min + max) / 2 : value;
      const y = (v) => H / 2 + (v - centre) * ppu;
      const parts = [];
      const majorEvery = Math.round(major / minor);
      const labelStep = Math.round(labelEvery / minor);
      const halfEvery = Math.round(majorEvery / 2);
      const first = Math.ceil((centre - span / 2) / minor);
      const last = Math.floor((centre + span / 2) / minor);

      if (kind === 'burette') {
        const x0 = 46;
        const x1 = 124;
        parts.push(s('rect', { x: x0, y: -10, width: x1 - x0, height: H + 20, fill: '#eef5f9', stroke: '#9fb4c2', 'stroke-width': 2 }));
        if (value !== null) {
          const ym = y(value);
          const lift = 9;
          parts.push(s('path', { d: `M${x0},${ym - lift} Q${(x0 + x1) / 2},${ym + lift} ${x1},${ym - lift} L${x1},${H + 10} L${x0},${H + 10} Z`, fill: this.o.liquid }));
          parts.push(s('path', { d: `M${x0},${ym - lift} Q${(x0 + x1) / 2},${ym + lift} ${x1},${ym - lift}`, fill: 'none', stroke: '#4d7a96', 'stroke-width': 2 }));
        }
        for (let k = first; k <= last; k++) {
          const v = k * minor;
          if (v < min - 1e-9 || v > max + 1e-9) continue;
          const yy = y(v);
          const isMajor = k % majorEvery === 0;
          const isHalf = !isMajor && k % halfEvery === 0;
          const len = isMajor ? 34 : isHalf ? 24 : 14;
          parts.push(s('line', { x1: x0, x2: x0 + len, y1: yy, y2: yy, stroke: '#1f2a33', 'stroke-width': isMajor ? 1.6 : 1 }));
          if (k % labelStep === 0) {
            parts.push(s('text', { x: x0 + len + 5, y: yy + 5, fill: '#1f2a33', 'font-size': 15, 'font-family': 'Source Sans 3, Segoe UI, sans-serif', 'font-weight': 600 }, String(Math.round(v))));
          }
        }
      } else if (kind === 'thermometer') {
        // The scale increases upwards; the red liquid fills up to the reading.
        const yu = (v) => H / 2 - (v - centre) * ppu;
        parts.push(s('rect', { x: 34, y: -10, width: 56, height: H + 20, fill: '#f4f8fb', stroke: '#9fb4c2', 'stroke-width': 2 }));
        if (value !== null) {
          parts.push(s('rect', { x: 54, y: yu(value), width: 16, height: H + 20, fill: '#d33a3a' }));
          parts.push(s('rect', { x: 54, y: yu(value) - 1, width: 16, height: 3, rx: 1.5, fill: '#a52020' }));
        }
        for (let k = first; k <= last; k++) {
          const v = k * minor;
          if (v < min - 1e-9 || v > max + 1e-9) continue;
          const yy = yu(v);
          const isMajor = k % majorEvery === 0;
          const isHalf = !isMajor && k % halfEvery === 0;
          const len = isMajor ? 26 : isHalf ? 18 : 10;
          parts.push(s('line', { x1: 90, x2: 90 + len, y1: yy, y2: yy, stroke: '#1f2a33', 'stroke-width': isMajor ? 1.6 : 1 }));
          if (k % labelStep === 0) {
            parts.push(s('text', { x: 90 + len + 4, y: yy + 5, fill: '#1f2a33', 'font-size': 15, 'font-family': 'Source Sans 3, Segoe UI, sans-serif', 'font-weight': 600 }, String(Math.round(v))));
          }
        }
      } else {
        const x0 = 82;
        const x1 = 162;
        parts.push(s('rect', { x: x0, y: -10, width: x1 - x0, height: H + 20, fill: '#f6edd7', stroke: '#b59a63', 'stroke-width': 2 }));
        for (let k = first; k <= last; k++) {
          const v = k * minor;
          if (v < min - 1e-9 || v > max + 1e-9) continue;
          const yy = y(v);
          const isMajor = k % majorEvery === 0;
          const isHalf = !isMajor && k % halfEvery === 0;
          const len = isMajor ? 30 : isHalf ? 21 : 12;
          parts.push(s('line', { x1: x0, x2: x0 + len, y1: yy, y2: yy, stroke: '#2b2418', 'stroke-width': isMajor ? 1.6 : 1 }));
          if (k % labelStep === 0) {
            parts.push(s('text', { x: x0 + len + 4, y: yy + 5, fill: '#2b2418', 'font-size': 15, 'font-family': 'Source Sans 3, Segoe UI, sans-serif', 'font-weight': 600 }, String(Math.round(v))));
          }
        }
        if (value !== null) {
          const ym = y(value);
          parts.push(s('rect', { x: 0, y: ym - 9, width: 26, height: 18, rx: 3, fill: '#8a959e' }));
          parts.push(s('path', { d: `M24,${ym - 2.5} L${x0 + 1},${ym - 0.6} L${x0 + 1},${ym + 0.6} L24,${ym + 2.5} Z`, fill: '#c0392b' }));
        }
      }
      this.layer.replaceChildren(...parts);
    }
  }

  /* ---------- Graphs ---------- */

  function niceStep(range, count) {
    const raw = range / count;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / p;
    const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return nf * p;
  }

  function niceTicks(min, max, count, fixedStep) {
    const step = fixedStep || niceStep(max - min, count);
    const out = [];
    for (let v = Math.ceil(min / step - 1e-9) * step; v <= max + step * 1e-6; v += step) out.push(round(v, 10));
    return { ticks: out, step };
  }

  // Rounds a data range outwards to tidy axis limits.
  function niceDomain(min, max, count = 6) {
    if (max === min) max = min + 1;
    const step = niceStep(max - min, count);
    return [Math.floor(min / step + 1e-9) * step, Math.ceil(max / step - 1e-9) * step];
  }

  function decimalsFor(step) {
    for (let dp = 0; dp < 6; dp++) if (Math.abs(round(step, dp) - step) < 1e-9) return dp;
    return 6;
  }

  class Graph {
    // With categories, the x axis is a list of names and each point is drawn as a bar (x = index).
    constructor({ title, xLabel, yLabel, xDomain, yDomain, xStep, yStep, describe, categories }) {
      this.W = 440;
      this.H = 320;
      this.m = { t: 16, r: 18, b: 50, l: 58 };
      this.xLabel = xLabel;
      this.yLabel = yLabel;
      this.categories = categories || null;
      this.xDomain = categories ? [-0.5, categories.length - 0.5] : xDomain || [0, 1];
      this.yDomain = yDomain || [0, 1];
      this.xStep = xStep;
      this.yStep = yStep;
      this.describe = describe || ((p) => [`${p.x}`, `${p.y}`]);
      this.points = [];
      this.lines = [];
      this.curve = null;
      this.marks = [];
      this.svg = s('svg', { class: 'graph', viewBox: `0 0 ${this.W} ${this.H}`, role: 'group', 'aria-label': title });
      this.tip = h('div', { class: 'graph-tip', hidden: true });
      this.el = h('figure', { class: 'graph-figure' }, h('figcaption', null, title), h('div', { class: 'graph-wrap' }, this.svg, this.tip));
    }

    sx(x) {
      const [a, b] = this.xDomain;
      return this.m.l + ((x - a) / (b - a)) * (this.W - this.m.l - this.m.r);
    }

    sy(y) {
      const [a, b] = this.yDomain;
      return this.H - this.m.b - ((y - a) / (b - a)) * (this.H - this.m.t - this.m.b);
    }

    set(opts) {
      Object.assign(this, opts);
      this.render();
    }

    render() {
      const { W, H, m } = this;
      const out = [];
      const xt = niceTicks(this.xDomain[0], this.xDomain[1], 6, this.xStep);
      const yt = niceTicks(this.yDomain[0], this.yDomain[1], 6, this.yStep);
      const xdp = decimalsFor(xt.step);
      const ydp = decimalsFor(yt.step);
      if (this.categories) {
        this.categories.forEach((c, i) => out.push(s('text', { class: 'g-tick', x: this.sx(i), y: H - m.b + 17, 'text-anchor': 'middle' }, c)));
      } else {
        for (const x of xt.ticks) {
          const px = this.sx(x);
          out.push(s('line', { class: 'g-grid', x1: px, x2: px, y1: m.t, y2: H - m.b }));
          out.push(s('text', { class: 'g-tick', x: px, y: H - m.b + 17, 'text-anchor': 'middle' }, x.toFixed(xdp)));
        }
      }
      for (const y of yt.ticks) {
        const py = this.sy(y);
        out.push(s('line', { class: 'g-grid', x1: m.l, x2: W - m.r, y1: py, y2: py }));
        out.push(s('text', { class: 'g-tick', x: m.l - 8, y: py + 4, 'text-anchor': 'end' }, y.toFixed(ydp)));
      }
      const yAxisAt = this.xDomain[0] <= 0 && this.xDomain[1] >= 0 ? 0 : this.xDomain[0];
      const xAxisAt = this.yDomain[0] <= 0 && this.yDomain[1] >= 0 ? 0 : this.yDomain[0];
      out.push(s('line', { class: 'g-axis', x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }));
      out.push(s('line', { class: 'g-axis', x1: m.l, x2: m.l, y1: m.t, y2: H - m.b }));
      if (xAxisAt !== this.yDomain[0]) out.push(s('line', { class: 'g-zero', x1: m.l, x2: W - m.r, y1: this.sy(xAxisAt), y2: this.sy(xAxisAt) }));
      if (!this.categories && yAxisAt !== this.xDomain[0]) out.push(s('line', { class: 'g-zero', x1: this.sx(yAxisAt), x2: this.sx(yAxisAt), y1: m.t, y2: H - m.b }));
      out.push(s('text', { class: 'g-label', x: (m.l + W - m.r) / 2, y: H - 10, 'text-anchor': 'middle' }, this.xLabel));
      out.push(s('text', { class: 'g-label', transform: `translate(14 ${(m.t + H - m.b) / 2}) rotate(-90)`, 'text-anchor': 'middle' }, this.yLabel));

      const clipId = 'gclip' + (this.clipId || (this.clipId = ++clipCount));
      out.push(s('defs', null, s('clipPath', { id: clipId }, s('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b }))));
      const plot = s('g', { 'clip-path': `url(#${clipId})` });
      if (this.curve && this.curve.length > 1) {
        const d = this.curve.map((p, i) => `${i ? 'L' : 'M'}${this.sx(p[0]).toFixed(1)},${this.sy(p[1]).toFixed(1)}`).join(' ');
        plot.append(s('path', { class: 'g-curve', d }));
      }
      for (const ln of this.lines) {
        plot.append(s('line', { class: 'g-line', x1: this.sx(ln.x1), y1: this.sy(ln.y1), x2: this.sx(ln.x2), y2: this.sy(ln.y2) }));
      }
      out.push(plot);
      // A ring around a point of interest, labelled to one side (dx, dy) so it clears the line.
      for (const mk of this.marks) {
        const px = this.sx(mk.x);
        const py = this.sy(mk.y);
        out.push(s('circle', { class: 'g-mark', cx: px, cy: py, r: 9 }));
        if (mk.label) out.push(s('text', { class: 'g-mark-text', x: px + (mk.dx ?? 12), y: py + (mk.dy ?? -12), 'text-anchor': mk.anchor || 'start' }, mk.label));
      }
      const base = this.sy(clamp(0, this.yDomain[0], this.yDomain[1]));
      const barW = this.categories ? Math.min(56, (this.sx(1) - this.sx(0)) * 0.6) : 0;
      for (const p of this.points) {
        const px = this.sx(p.x);
        const py = this.sy(p.y);
        const [value, label] = this.describe(p);
        const bar = { x: px - barW / 2, y: Math.min(py, base), width: barW, height: Math.max(1, Math.abs(base - py)) };
        const hit = this.categories
          ? s('rect', { class: 'g-hit', ...bar, tabindex: '0', 'aria-label': `${label}: ${value}` })
          : s('circle', { class: 'g-hit', cx: px, cy: py, r: 12, tabindex: '0', 'aria-label': `${label}: ${value}` });
        const show = () => {
          this.tip.replaceChildren(h('strong', null, value), h('br'), h('span', null, label));
          this.tip.style.left = (px / W) * 100 + '%';
          this.tip.style.top = (py / H) * 100 + '%';
          this.tip.hidden = false;
        };
        const hide = () => { this.tip.hidden = true; };
        hit.addEventListener('pointerenter', show);
        hit.addEventListener('pointerleave', hide);
        hit.addEventListener('focus', show);
        hit.addEventListener('blur', hide);
        out.push(hit, this.categories
          ? s('rect', { class: 'g-bar', ...bar, 'pointer-events': 'none' })
          : s('circle', { class: 'g-point' + (p.off ? ' off' : ''), cx: px, cy: py, r: 5, 'pointer-events': 'none' }));
      }
      this.svg.replaceChildren(...out);
    }
  }

  // Least-squares line. With throughOrigin, fits y = m·x only.
  function fitLine(points, throughOrigin) {
    const n = points.length;
    if (throughOrigin) {
      let sxy = 0;
      let sxx = 0;
      for (const p of points) { sxy += p.x * p.y; sxx += p.x * p.x; }
      return { m: sxx ? sxy / sxx : 0, c: 0 };
    }
    let sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (const p of points) { sx += p.x; sy += p.y; sxy += p.x * p.y; sxx += p.x * p.x; }
    const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    return { m, c: (sy - m * sx) / n };
  }

  // A smooth curve through points (monotone cubic), sampled for drawing.
  function smoothCurve(points, samples = 24) {
    const pts = points.slice().sort((a, b) => a.x - b.x);
    const n = pts.length;
    if (n < 3) return pts.map((p) => [p.x, p.y]);
    const dx = [];
    const slope = [];
    for (let i = 0; i < n - 1; i++) {
      dx.push(pts[i + 1].x - pts[i].x);
      slope.push((pts[i + 1].y - pts[i].y) / dx[i]);
    }
    const tan = [slope[0]];
    for (let i = 1; i < n - 1; i++) tan.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
    tan.push(slope[n - 2]);
    for (let i = 0; i < n - 1; i++) {
      if (slope[i] === 0) { tan[i] = 0; tan[i + 1] = 0; continue; }
      const a = tan[i] / slope[i];
      const b = tan[i + 1] / slope[i];
      const r = a * a + b * b;
      if (r > 9) {
        const t = 3 / Math.sqrt(r);
        tan[i] = t * a * slope[i];
        tan[i + 1] = t * b * slope[i];
      }
    }
    const out = [];
    for (let i = 0; i < n - 1; i++) {
      for (let k = 0; k < samples; k++) {
        const t = k / samples;
        const t2 = t * t;
        const t3 = t2 * t;
        const y = (2 * t3 - 3 * t2 + 1) * pts[i].y + (t3 - 2 * t2 + t) * dx[i] * tan[i] + (-2 * t3 + 3 * t2) * pts[i + 1].y + (t3 - t2) * dx[i] * tan[i + 1];
        out.push([pts[i].x + t * dx[i], y]);
      }
    }
    out.push([pts[n - 1].x, pts[n - 1].y]);
    return out;
  }

  /* ---------- Saved progress ---------- */

  const STORE_KEY = 'vsl-completed';

  function completedLabs() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function markComplete(id) {
    try {
      const all = completedLabs();
      all[id] = new Date().toISOString();
      localStorage.setItem(STORE_KEY, JSON.stringify(all));
    } catch (e) {
      /* Progress is a convenience; the lab works without storage. */
    }
  }

  /* ---------- Page scaffold ---------- */

  // Finds the standard containers on a practical page and wires up the guide.
  function setupLab({ id, steps, items, guide: guideUrl, objectives }) {
    const say = createFeedback(document.getElementById('feedback'));
    const head = document.querySelector('.lab-head');
    if (head) {
      const box = h('input', { type: 'checkbox', checked: autofill, onchange: (e) => setAutofill(e.target.checked) });
      head.append(
        objectives ? h('details', { class: 'lab-objectives' }, h('summary', null, 'Learning objectives'), h('ul', null, objectives.map((o) => h('li', null, o)))) : null,
        h('div', { class: 'lab-tools' },
          h('label', { class: 'switch' }, box, 'Fill in readings for me'),
          guideUrl ? h('a', { href: guideUrl }, 'Practical guide, key words and questions') : null));
    }
    const guide = new Guide({
      steps,
      card: document.getElementById('step-card'),
      actions: h('div', { class: 'actions', id: 'actions' }),
      list: document.getElementById('method-list'),
      say,
      items,
    });
    for (const [name, el] of Object.entries(items || {})) {
      clickable(el, el.dataset.label || name, () => guide.clickItem(name));
    }
    return { guide, say, finish: (content) => finishLab(id, guide, { guideUrl, ...content }) };
  }

  function finishLab(id, guide, { title, summary, rows, guideUrl }) {
    markComplete(id);
    const card = guide.card;
    card.classList.add('finish');
    card.replaceChildren(
      h('h2', { tabindex: '-1' }, title || 'Practical complete'),
      summary ? h('p', { class: 'step-text' }, summary) : null,
      rows ? h('dl', null, rows.map(([k, v]) => [h('dt', null, k), h('dd', null, v)])) : null,
      h('div', { class: 'btn-row' },
        guideUrl ? h('a', { class: 'btn btn-primary', href: guideUrl }, 'Check your understanding') : null,
        h('button', { type: 'button', class: 'btn' + (guideUrl ? '' : ' btn-primary'), onclick: () => location.reload() }, 'Do it again with new values'),
        h('a', { class: 'btn', href: '../index.html' }, 'All practicals'))
    );
    card.querySelector('h2').focus({ preventScroll: true });
  }

  window.LabKit = {
    h, s, button, clickable,
    rand, clamp, lerp, gauss, round, fmt, fmtSci, parseNumber, near,
    tween, wait, timeScale, reduceMotion,
    createFeedback, Guide, field, choice, shuffled, Magnifier,
    isAutofill: () => autofill,
    onAutofill: (fn) => autofillListeners.add(fn),
    Graph, niceDomain, fitLine, smoothCurve,
    completedLabs, markComplete, setupLab,
  };
})();
