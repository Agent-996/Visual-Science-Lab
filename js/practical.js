/* Visual Science Lab: one practical's page, chosen by the address (practical.html#g6-onion). */
(function () {
  'use strict';

  const V = window.VSL;
  const page = document.getElementById('page');

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') el.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid);
    return el;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const LETTERS = 'ABCDEF';

  function render() {
    const id = decodeURIComponent(location.hash.slice(1));
    const p = V.byId(id);
    window.scrollTo(0, 0);
    if (!p) {
      document.title = 'Practical not found · Visual Science Lab';
      page.replaceChildren(h('div', { class: 'p-head' },
        h('h1', { text: 'Practical not found' }),
        h('p', null, 'This link doesn’t match a practical. ', h('a', { href: 'index.html', text: 'See all practicals' }), '.')));
      return;
    }

    const grade = V.GRADES[p.grade];
    const subject = V.subjectOf(p.unit);
    const S = V.SUBJECTS[subject];
    document.body.dataset.subject = subject;
    document.title = `${p.title} · Visual Science Lab`;
    document.getElementById('back-link').href = `index.html#grade-${p.grade}`;

    const siblings = V.forGrade(p.grade).filter((x) => x.unit === p.unit);
    const idx = siblings.indexOf(p);
    const prev = siblings[idx - 1];
    const next = siblings[idx + 1];

    const sections = [];

    if (p.sim) {
      sections.push(h('section', { class: 'card sim-cta' },
        h('p', null, h('strong', { text: 'Interactive version available. ' }), 'Do this practical step by step on a virtual lab bench, taking your own readings.'),
        h('a', { class: 'btn btn-primary', href: p.sim, text: 'Start the interactive practical' })));
    }

    sections.push(h('section', { class: 'card', id: 'objectives' },
      h('h2', { text: 'Learning objectives' }),
      h('ul', { class: 'objectives' }, p.objectives.map((o) => h('li', { text: o }))),
      h('div', { class: 'codes', 'aria-label': 'Curriculum codes' }, p.codes.map((c) => h('span', { class: 'code' }, h('b', { text: c }), h('span', { text: V.describeCode(c) }))))));

    sections.push(h('section', { class: 'card', id: 'words' },
      h('h2', null, 'Key words ', h('small', { lang: 'zh-Hans', text: '关键词' })),
      h('div', { class: 'words' }, p.words.map(([en, zh]) => h('span', { class: 'word' }, h('b', { text: en }), h('span', { lang: 'zh-Hans', text: zh }))))));

    sections.push(h('div', { class: 'two-col' },
      h('section', { class: 'card', id: 'kit' },
        h('h2', { text: p.type === 'Model' ? 'You will use' : 'Equipment' }),
        h('ul', { class: 'kit-list' }, p.kit.map((k) => h('li', { text: k })))),
      h('section', { class: 'card safety-card', id: 'safety' },
        h('h2', { text: 'Safety' }),
        h('p', { style: 'margin:0', text: p.safety }))));

    const predictions = V.predictions();
    if (p.predict) {
      const opts = shuffle(p.predict.o);
      const note = h('p', { class: 'q-feedback', text: predictions[p.id] ? `Your prediction: ${predictions[p.id]}` : 'Choose an answer. You’ll see if you were right at the end.' });
      const buttons = opts.map((o, i) => h('button', { type: 'button', class: 'option' + (predictions[p.id] === o ? ' chosen' : ''), 'aria-pressed': String(predictions[p.id] === o), onclick: () => {
        V.savePrediction(p.id, o);
        for (const b of buttons) {
          b.classList.toggle('chosen', b === buttons[i]);
          b.setAttribute('aria-pressed', String(b === buttons[i]));
        }
        note.textContent = `Your prediction: ${o}`;
        updateResult();
      } }, h('span', { class: 'letter', text: LETTERS[i] }), h('span', { text: o })));
      sections.push(h('section', { class: 'card', id: 'predict' },
        h('h2', { text: 'Predict' }),
        h('div', { class: 'question' }, h('p', { class: 'q-text', text: p.predict.q }), h('div', { class: 'options' }, buttons), note)));
    }

    sections.push(h('section', { class: 'card', id: 'method' },
      h('h2', { text: p.type === 'Demo' ? 'What your teacher will do' : 'Method' }),
      h('ol', { class: 'method-steps' }, p.method.map((s) => h('li', { text: s })))));

    const resultBox = h('div', { class: 'reveal-box' });
    let revealed = false;
    function updateResult() {
      resultBox.replaceChildren();
      if (!revealed) {
        resultBox.append(h('p', { style: 'margin:0', text: 'Do the practical (or watch it) first, then check your result here.' }),
          h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn', text: 'Show what you should find', onclick: () => { revealed = true; updateResult(); } })));
        return;
      }
      resultBox.append(h('p', { class: 'find-text', text: p.find }));
      const mine = V.predictions()[p.id];
      if (p.predict && mine) {
        const right = mine === p.predict.o[0];
        resultBox.append(h('p', { class: 'q-feedback' }, h('strong', { text: right ? 'Your prediction was right. ' : 'Compare with your prediction. ' }), right ? `You predicted: ${mine}.` : `You predicted: ${mine}. The answer: ${p.predict.o[0]}.`));
      }
    }
    updateResult();
    sections.push(h('section', { class: 'card', id: 'result' }, h('h2', { text: 'What you should find' }), resultBox));

    if (p.conclude) sections.push(concludeSection(p));
    sections.push(checkSection(p));

    sections.push(h('p', { class: 'source-note', text: `Source: ${p.source}. Check every practical against your school’s risk assessments before use.` }));
    sections.push(h('nav', { class: 'p-nav', 'aria-label': 'Other practicals in this unit' },
      prev ? h('a', { class: 'btn', href: `#${prev.id}`, text: `← ${prev.title}` }) : h('span'),
      next ? h('a', { class: 'btn', href: `#${next.id}`, text: `${next.title} →` }) : h('a', { class: 'btn', href: `index.html#grade-${p.grade}`, text: 'All practicals' })));

    page.replaceChildren(
      h('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
        h('a', { href: `index.html#grade-${p.grade}`, text: `${grade.name} · ${grade.stage}` }), '›',
        h('span', { text: `Unit ${p.unit} · ${grade.units[p.unit - 1]}` })),
      h('header', { class: 'p-head' },
        h('div', { class: 'title-row', style: 'display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center' },
          h('h1', { text: p.title }),
          h('span', { class: 'subject-tag' }, `${S.name} `, h('span', { lang: 'zh-Hans', text: S.zh }))),
        h('div', { class: 'p-meta' },
          h('span', { class: 'pill', text: V.TYPES[p.type] }),
          h('span', { class: 'pill', text: `About ${p.mins} min` }),
          p.sim ? h('span', { class: 'pill pill-sim', text: 'Interactive' }) : null,
          V.completed()[p.id] ? h('span', { class: 'pill pill-done', text: '✓ Done' }) : null)),
      h('div', { class: 'p-body' }, sections));
  }

  // Sentences with [right|wrong|wrong] gaps; the first option is the right one.
  function concludeSection(p) {
    const lines = p.conclude.lines.map((line) => {
      const parts = line.split(/(\[[^\]]+\])/);
      return h('p', { class: 'gap-line' }, parts.map((part) => {
        const m = /^\[([^\]]+)\]$/.exec(part);
        if (!m) return part;
        const opts = m[1].split('|');
        const gap = h('span', { class: 'gap' });
        for (const o of shuffle(opts)) {
          gap.append(h('button', { type: 'button', text: o, onclick: (e) => {
            const b = e.currentTarget;
            if (o === opts[0]) {
              b.classList.add('right');
              for (const other of gap.querySelectorAll('button')) {
                other.disabled = true;
                if (other !== b) other.hidden = true;
              }
              checkDone();
            } else {
              b.classList.add('wrong');
              b.disabled = true;
            }
          } }));
        }
        return gap;
      }));
    });
    const why = h('p', { class: 'find-text', hidden: true, text: p.conclude.why });
    function checkDone() {
      const left = [...section.querySelectorAll('.gap')].some((g) => !g.querySelector('.right'));
      why.hidden = left;
    }
    const section = h('section', { class: 'card', id: 'conclude' },
      h('h2', { text: 'Conclude' }),
      h('p', { style: 'margin:0;color:var(--ink-2)', text: 'Choose the right word in each gap.' }),
      lines, why);
    return section;
  }

  // Multiple-choice check; the first option in the data is the right one. Scores count first tries.
  function checkSection(p) {
    let answered = 0;
    let firstTry = 0;
    const total = p.check.length;
    const scoreLine = h('p', { class: 'score-line', hidden: true });
    const questions = p.check.map((q, qi) => {
      const fb = h('p', { class: 'q-feedback', 'aria-live': 'polite' });
      let tries = 0;
      const opts = shuffle(q.o);
      const buttons = opts.map((o, i) => h('button', { type: 'button', class: 'option', onclick: (e) => {
        const b = e.currentTarget;
        tries += 1;
        if (o === q.o[0]) {
          b.classList.add('right');
          for (const x of buttons) x.disabled = true;
          fb.textContent = tries === 1 ? 'Correct.' : 'Correct this time.';
          answered += 1;
          if (tries === 1) firstTry += 1;
          if (answered === total) {
            scoreLine.hidden = false;
            scoreLine.textContent = `You got ${firstTry} out of ${total} right first time.${firstTry === total ? ' Excellent!' : ' Read the result section again and try once more later.'}`;
            V.saveScore(p.id, firstTry, total);
            V.markDone(p.id);
          }
        } else {
          b.classList.add('wrong');
          b.disabled = true;
          fb.textContent = 'Not quite. Try another answer.';
        }
      } }, h('span', { class: 'letter', text: LETTERS[i] }), h('span', { text: o })));
      return h('div', { class: 'question' }, h('p', { class: 'q-text', text: `${qi + 1}. ${q.q}` }), h('div', { class: 'options' }, buttons), fb);
    });
    const prior = V.scores()[p.id];
    return h('section', { class: 'card', id: 'check' },
      h('h2', null, 'Check your understanding', prior ? h('small', { text: `Last score: ${prior.score}/${prior.total}` }) : null),
      questions, scoreLine);
  }

  window.addEventListener('hashchange', render);
  render();
})();
