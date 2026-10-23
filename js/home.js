/* Visual Science Lab: the list of practicals, grouped by grade and unit. */
(function () {
  'use strict';

  const V = window.VSL;
  const state = { grade: 6, subject: 'all', simOnly: false, query: '' };

  try {
    const g = Number(localStorage.getItem('vsl-grade'));
    if (g === 6 || g === 7) state.grade = g;
  } catch (e) {
    /* Remembering the grade is a convenience only. */
  }
  const fromHash = /^#grade-(6|7)$/.exec(location.hash);
  if (fromHash) state.grade = Number(fromHash[1]);

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid);
    return el;
  }

  function matches(p, q) {
    if (!q) return true;
    const hay = [p.title, p.codes.join(' '), (p.words || []).map((w) => w.join(' ')).join(' '), (p.kit || []).join(' ')].join(' ').toLowerCase();
    return q.split(/\s+/).every((word) => hay.includes(word));
  }

  function render() {
    const done = V.completed();
    const grade = V.GRADES[state.grade];
    const q = state.query.trim().toLowerCase();
    const all = V.forGrade(state.grade);
    const shown = all.filter((p) => (state.subject === 'all' || V.subjectOf(p.unit) === state.subject) && (!state.simOnly || p.sim) && matches(p, q));

    const box = document.getElementById('units');
    box.replaceChildren();
    grade.units.forEach((unitName, i) => {
      const unit = i + 1;
      const list = shown.filter((p) => p.unit === unit);
      if (!list.length) return;
      const subject = V.subjectOf(unit);
      const S = V.SUBJECTS[subject];
      box.append(h('section', { class: 'unit', 'data-subject': subject, 'aria-labelledby': `unit-${unit}` },
        h('div', { class: 'unit-head' },
          h('span', { class: 'unit-num', 'aria-hidden': 'true', text: String(unit) }),
          h('h2', { id: `unit-${unit}`, text: `Unit ${unit} · ${unitName}` }),
          h('span', { class: 'subject-tag' }, `${S.name} `, h('span', { lang: 'zh-Hans', text: S.zh })),
          h('span', { class: 'unit-count', text: `${list.length} practical${list.length === 1 ? '' : 's'}` })),
        h('div', { class: 'p-cards' }, list.map((p) => h('a', { class: 'p-card', href: `practical.html#${p.id}` },
          h('span', { class: 'p-title', text: p.title }),
          h('span', { class: 'p-meta' },
            p.sim ? h('span', { class: 'pill pill-sim', text: 'Interactive' }) : null,
            h('span', { class: 'pill', text: V.TYPES[p.type] }),
            h('span', { class: 'pill', text: `${p.mins} min` }),
            done[p.id] ? h('span', { class: 'pill pill-done', text: '✓ Done' }) : null),
          h('span', { class: 'p-codes', text: p.codes.join(' · ') }))))));
    });
    if (!shown.length) {
      box.append(h('p', { class: 'empty-state', text: 'No practicals match. Try a different word or code, or clear the filters.' }));
    }

    const sims = all.filter((p) => p.sim).length;
    const doneCount = all.filter((p) => done[p.id]).length;
    document.getElementById('summary').textContent = shown.length === all.length
      ? `${grade.name} (${grade.stage}): ${all.length} practicals, ${sims} interactive, ${doneCount} done on this device.`
      : `Showing ${shown.length} of ${all.length} ${grade.name} practicals.`;

    for (const b of document.querySelectorAll('#grade-switch button')) b.setAttribute('aria-pressed', String(Number(b.dataset.grade) === state.grade));
    for (const b of document.querySelectorAll('.chip')) b.setAttribute('aria-pressed', String(b.dataset.filter === state.subject));
  }

  document.getElementById('grade-switch').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    state.grade = Number(b.dataset.grade);
    try {
      localStorage.setItem('vsl-grade', String(state.grade));
    } catch (err) {
      /* ignore */
    }
    history.replaceState(null, '', `#grade-${state.grade}`);
    render();
  });
  for (const chip of document.querySelectorAll('.chip')) {
    chip.addEventListener('click', () => {
      state.subject = chip.dataset.filter;
      render();
    });
  }
  document.getElementById('sim-only').addEventListener('change', (e) => {
    state.simOnly = e.target.checked;
    render();
  });
  document.getElementById('search').addEventListener('input', (e) => {
    state.query = e.target.value;
    render();
  });

  render();
})();
