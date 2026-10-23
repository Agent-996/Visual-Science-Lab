/* Visual Science Lab: the curriculum structure shared by the lab list and the practical pages.
   Grade 6 = Cambridge Lower Secondary Stage 7, Grade 7 = Stage 8 (framework 0893).
   The practicals themselves live in js/data/grade6.js and js/data/grade7.js. */
(function () {
  'use strict';

  const SUBJECTS = {
    biology: { name: 'Biology', zh: '生物' },
    chemistry: { name: 'Chemistry', zh: '化学' },
    physics: { name: 'Physics', zh: '物理' },
  };

  const GRADES = {
    6: {
      name: 'Grade 6',
      stage: 'Cambridge Stage 7',
      units: ['Cells', 'Materials and their structure', 'Forces and energy', 'Grouping and identifying organisms', 'Properties of materials', 'Earth physics', 'Microorganisms in the environment', 'Changes to materials', 'Electricity'],
    },
    7: {
      name: 'Grade 7',
      stage: 'Cambridge Stage 8',
      units: ['Respiration', 'Properties of materials', 'Forces and energy', 'Ecosystems', 'Materials and their structure', 'Light', 'Diet and growth', 'Chemical reactions', 'Magnetism'],
    },
  };

  // The Learner's Book units cycle Biology → Chemistry → Physics.
  const subjectOf = (unit) => ['biology', 'chemistry', 'physics'][(unit - 1) % 3];

  // What each part of a framework code means, e.g. 7Cp.04 = Stage 7, Chemistry: properties of materials.
  const STRANDS = {
    Bs: 'Biology: structure and function',
    Bp: 'Biology: life processes',
    Be: 'Biology: ecosystems',
    Cm: 'Chemistry: materials and their structure',
    Cp: 'Chemistry: properties of materials',
    Cc: 'Chemistry: changes to materials',
    Pf: 'Physics: forces and energy',
    Ps: 'Physics: light and sound',
    Pe: 'Physics: electricity and magnetism',
    ESp: 'Earth and space: planet Earth',
    ESc: 'Earth and space: cycles on Earth',
    ESs: 'Earth and space: Earth in space',
    TWSm: 'Thinking and working scientifically: models and representations',
    TWSp: 'Thinking and working scientifically: purpose and planning',
    TWSc: 'Thinking and working scientifically: carrying out scientific enquiry',
    TWSa: 'Thinking and working scientifically: analysis, evaluation and conclusions',
    SIC: 'Science in context',
  };

  function describeCode(code) {
    const m = /^(\d)([A-Za-z]+)\.(\d+)$/.exec(code);
    if (!m) return code;
    return `Stage ${m[1]} · ${STRANDS[m[2]] || m[2]}`;
  }

  const TYPES = { Class: 'Class practical', Demo: 'Teacher demo', Model: 'Model' };

  /* ---------- Saved progress (this browser only) ---------- */

  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* Progress is a convenience; everything works without storage. */
    }
  }

  const list = [];

  window.VSL = {
    SUBJECTS,
    GRADES,
    STRANDS,
    TYPES,
    subjectOf,
    describeCode,
    practicals: list,
    add(items) {
      list.push(...items);
    },
    byId(id) {
      return list.find((p) => p.id === id);
    },
    forGrade(grade) {
      return list.filter((p) => p.grade === grade);
    },
    completed: () => load('vsl-completed'),
    markDone(id) {
      const all = load('vsl-completed');
      all[id] = new Date().toISOString();
      save('vsl-completed', all);
    },
    scores: () => load('vsl-scores'),
    saveScore(id, score, total) {
      const all = load('vsl-scores');
      all[id] = { score, total };
      save('vsl-scores', all);
    },
    predictions: () => load('vsl-predictions'),
    savePrediction(id, answer) {
      const all = load('vsl-predictions');
      all[id] = answer;
      save('vsl-predictions', all);
    },
  };
})();
