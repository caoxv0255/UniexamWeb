// 模块三：题型索引系统（综合题库：选择/填空/计算/证明/画图）
import { navigate, renderMath, toast, $, escapeHtml, debounce, shuffle } from '../utils.js';
import * as store from '../store.js';
import { QUESTIONS } from '../../data/quizzes.js';
import { SUBJECTS } from './chapter-system.js';

const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));
const TYPE_LABELS = {
  choice: '选择题',
  fill: '填空题',
  calculation: '计算题',
  proof: '证明题',
  drawing: '画图题',
};
const TYPE_ICONS = { choice: '🔘', fill: '✏️', calculation: '📐', proof: '📝', drawing: '🎨' };
const DIFF_LABELS = { 1: '简单', 2: '中等', 3: '困难' };
const DIFF_CLASSES = { 1: 'easy', 2: 'medium', 3: 'hard' };

let currentView = 'all';
const currentFilters = {
  subjects: new Set(),
  types: new Set(),
  difficulty: '',
  tag: '',
  search: '',
};
let quizState = null;

function subjectById(id) {
  return SUBJECT_MAP[id] || { name: '综合', color: '#3b82f6', icon: '📚' };
}

function typeLabel(t) { return TYPE_LABELS[t] || t; }
function diffLabel(d) { return DIFF_LABELS[d] || d; }
function diffClass(d) { return DIFF_CLASSES[d] || ''; }

function getAllTags() {
  const set = new Set();
  QUESTIONS.forEach((q) => (q.tags || []).forEach((tag) => set.add(tag)));
  return Array.from(set).sort();
}

function buildQuestionMap() {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
}

export function setBankView(v) { currentView = v; }

// ===== 主视图 =====
export function renderBank() {
  return `
  <div class="view active" data-view="bank">
    <div class="breadcrumb"><a data-go="/">首页</a><span class="sep">/</span><span>题型库</span></div>
    <div class="page-header"><h2>🗂 综合题库</h2><span class="subtitle">${QUESTIONS.length} 道题目 · 五类题型 · 三级难度</span></div>

    <div class="bank-tabs" id="bank-tabs">
      <span class="bank-tab ${currentView === 'all' ? 'active' : ''}" data-view="all">全部</span>
      <span class="bank-tab ${currentView === 'favorites' ? 'active' : ''}" data-view="favorites">⭐ 收藏</span>
      <span class="bank-tab ${currentView === 'wrong' ? 'active' : ''}" data-view="wrong">❌ 错题</span>
      <span class="bank-tab ${currentView === 'quiz' ? 'active' : ''}" data-view="quiz">📝 自测</span>
    </div>

    <div id="bank-content"></div>
  </div>`;
}

export function bindBankEvents(root) {
  root.querySelectorAll('.bank-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      currentView = tab.dataset.view;
      root.querySelectorAll('.bank-tab').forEach((t) => t.classList.toggle('active', t === tab));
      renderBankContent(root);
    });
  });
  renderBankContent(root);
}

async function renderBankContent(root) {
  const content = $('#bank-content', root);
  if (!content) return;
  if (currentView === 'quiz') {
    content.innerHTML = renderQuizMode();
    bindQuizEvents(content);
  } else if (currentView === 'wrong') {
    content.innerHTML = await renderWrongBook();
    bindWrongEvents(content);
  } else if (currentView === 'favorites') {
    content.innerHTML = await renderFavoritesList();
    bindBankCards(content);
  } else {
    content.innerHTML = renderAllView();
    bindFilters(content);
    await updateResults(content);
  }
  renderMath(content);
}

// ===== 全部视图：筛选 + 结果 =====
function renderAllView() {
  const allTags = getAllTags();
  const subjectChips = SUBJECTS.map((s) =>
    `<span class="chip ${currentFilters.subjects.has(s.id) ? 'active' : ''}" data-subject="${s.id}"><span class="dot" style="background:${s.color}"></span>${s.name}</span>`
  ).join('');
  const typeChips = Object.entries(TYPE_LABELS).map(([k, v]) =>
    `<span class="chip qtype-chip ${currentFilters.types.has(k) ? 'active' : ''}" data-qtype="${k}">${TYPE_ICONS[k]} ${v}</span>`
  ).join('');
  const diffChips = [1, 2, 3].map((d) =>
    `<span class="chip diff-chip ${currentFilters.difficulty === String(d) ? 'active' : ''}" data-diff="${d}">${diffLabel(d)}</span>`
  ).join('');
  const tagChips = allTags.slice(0, 24).map((t) =>
    `<span class="chip ${currentFilters.tag === t ? 'active' : ''}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`
  ).join('');

  return `
    <div class="bank-toolbar">
      <div class="toolbar-row">
        <div class="search-box"><input type="text" id="bank-search" placeholder="搜索题干、知识点、标签..." value="${escapeHtml(currentFilters.search)}"></div>
      </div>
      <div class="filter-chips">${subjectChips}</div>
      <div class="filter-chips">${typeChips}</div>
      <div class="filter-chips">${diffChips}</div>
      <div class="filter-chips">${tagChips}</div>
    </div>
    <div class="result-count" id="result-count"></div>
    <div class="bank-grid" id="bank-grid"></div>`;
}

function bindFilters(root) {
  const search = $('#bank-search', root);
  if (search) {
    search.addEventListener('input', debounce(() => {
      currentFilters.search = search.value.trim();
      updateResults(root);
    }, 200));
  }
  root.querySelectorAll('.chip[data-subject]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.subject;
      if (currentFilters.subjects.has(id)) currentFilters.subjects.delete(id);
      else currentFilters.subjects.add(id);
      chip.classList.toggle('active');
      updateResults(root);
    });
  });
  root.querySelectorAll('.chip[data-qtype]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const t = chip.dataset.qtype;
      if (currentFilters.types.has(t)) currentFilters.types.delete(t);
      else currentFilters.types.add(t);
      chip.classList.toggle('active');
      updateResults(root);
    });
  });
  root.querySelectorAll('.chip[data-diff]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const d = chip.dataset.diff;
      currentFilters.difficulty = currentFilters.difficulty === d ? '' : d;
      root.querySelectorAll('.chip[data-diff]').forEach((c) => c.classList.toggle('active', c.dataset.diff === currentFilters.difficulty));
      updateResults(root);
    });
  });
  root.querySelectorAll('.chip[data-tag]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const t = chip.dataset.tag;
      currentFilters.tag = currentFilters.tag === t ? '' : t;
      root.querySelectorAll('.chip[data-tag]').forEach((c) => c.classList.toggle('active', c.dataset.tag === currentFilters.tag));
      updateResults(root);
    });
  });
}

function applyFilters(list) {
  return list.filter((q) => {
    if (currentFilters.subjects.size && !currentFilters.subjects.has(q.subject)) return false;
    if (currentFilters.types.size && !currentFilters.types.has(q.type)) return false;
    if (currentFilters.difficulty && String(q.difficulty) !== currentFilters.difficulty) return false;
    if (currentFilters.tag && !(q.tags || []).includes(currentFilters.tag)) return false;
    if (currentFilters.search) {
      const s = currentFilters.search.toLowerCase();
      const hay = `${q.title} ${q.description || ''} ${(q.tags || []).join(' ')} ${q.answer || ''} ${q.explain || ''}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
}

async function updateResults(root) {
  const grid = $('#bank-grid', root);
  const countEl = $('#result-count', root);
  if (!grid) return;
  const filtered = applyFilters(QUESTIONS);
  if (countEl) countEl.innerHTML = `找到 <b>${filtered.length}</b> 道题目`;
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><h3>未找到匹配题目</h3><p>试试调整筛选条件</p></div>`;
    return;
  }
  const favs = await store.getFavoriteQuestions();
  const favIds = new Set(favs.map((f) => f.questionId));
  grid.innerHTML = filtered.map((q) => bankCardHtml(q, favIds)).join('');
  bindBankCards(grid);
  renderMath(grid);
}

function bankCardHtml(q, favIds) {
  const subject = subjectById(q.subject);
  const fav = favIds.has(q.id);
  const tags = (q.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
  return `<div class="bank-card" data-qid="${q.id}" style="--accent:${subject.color}">
    <div class="bank-card-head">
      <div class="bank-card-badge">${TYPE_ICONS[q.type] || 'Q'}</div>
      <div class="bank-card-title">
        <h4>${escapeHtml(q.title)}</h4>
        <div class="sub">
          <span style="color:${subject.color}">${subject.name}</span>
          <span>·</span><span class="qtype-label">${typeLabel(q.type)}</span>
          <span class="difficulty-badge ${diffClass(q.difficulty)}">${diffLabel(q.difficulty)}</span>
          ${tags}
        </div>
      </div>
      <div class="bank-card-actions">
        <span class="fav-star ${fav ? 'active' : ''}" data-fav="${q.id}" data-subject="${q.subject}" title="收藏">${fav ? '★' : '☆'}</span>
        <span class="type-toggle">▾</span>
      </div>
    </div>
    <div class="type-body" style="display:none"></div>
  </div>`;
}

function bindBankCards(root) {
  root.querySelectorAll('.bank-card-head').forEach((head) => {
    head.addEventListener('click', async (e) => {
      if (e.target.closest('[data-fav]')) return;
      const card = head.closest('.bank-card');
      const qid = card.dataset.qid;
      const body = card.querySelector('.type-body');
      if (card.classList.contains('open')) {
        card.classList.remove('open');
        body.style.display = 'none';
        return;
      }
      card.classList.add('open');
      body.style.display = 'block';
      if (!body.dataset.loaded) {
        const q = buildQuestionMap()[qid];
        if (q) {
          body.innerHTML = questionDetailHtml(q);
          body.dataset.loaded = '1';
          renderMath(body);
        }
      }
    });
  });
  root.querySelectorAll('[data-fav]').forEach((star) => {
    star.addEventListener('click', async (e) => {
      e.stopPropagation();
      const qid = star.dataset.fav;
      const subjectId = star.dataset.subject;
      const active = await store.toggleFavoriteQuestion(qid, subjectId);
      star.classList.toggle('active', active);
      star.textContent = active ? '★' : '☆';
      toast(active ? '已收藏' : '已取消收藏', 'success');
    });
  });
}

function questionDetailHtml(q) {
  const subject = subjectById(q.subject);
  const rubricRows = (q.rubric || []).map((r) =>
    `<tr><td>${escapeHtml(r.item)}</td><td>${r.score} 分</td></tr>`
  ).join('');
  let optsHtml = '';
  if (q.type === 'choice' && q.opts) {
    optsHtml = `<div class="q-detail-section"><h5>选项</h5><div class="quiz-options read-only">${q.opts.map((opt, i) => `<div class="quiz-opt"><span class="opt-letter">${String.fromCharCode(65 + i)}</span><span>${opt}</span></div>`).join('')}</div></div>`;
  }
  return `
    <div class="q-detail-section"><h5>题干</h5><div class="knowledge-box">${q.description || ''}</div></div>
    ${optsHtml}
    <div class="q-detail-section"><h5>参考答案</h5><div class="formula-box">${q.answer || ''}</div></div>
    ${q.answerDetail ? `<div class="q-detail-section"><h5>解析</h5><div class="knowledge-box">${q.answerDetail}</div></div>` : ''}
    ${q.rubric ? `<div class="q-detail-section"><h5>评分标准</h5><table class="data-table rubric-table"><thead><tr><th>评分项</th><th>分值</th></tr></thead><tbody>${rubricRows}</tbody></table></div>` : ''}
    ${q.explain ? `<div class="q-detail-section"><h5>说明</h5><div class="tip-box">${q.explain}</div></div>` : ''}
    <div class="q-detail-actions"><button class="btn primary sm" data-go="/bank" onclick="this.closest('.bank-card').querySelector('.bank-card-head').click()">收起</button></div>
  `;
}

// ===== 收藏视图 =====
async function renderFavoritesList() {
  const favs = await store.getFavoriteQuestions();
  if (!favs.length) {
    return `<div class="empty-state"><div class="icon">⭐</div><h3>还没有收藏题目</h3><p>点击题目卡片上的 ☆ 星标即可收藏</p></div>`;
  }
  const qmap = buildQuestionMap();
  const favIds = new Set(favs.map((f) => f.questionId));
  const items = favs.map((f) => {
    const q = qmap[f.questionId];
    if (!q) return '';
    return bankCardHtml(q, favIds);
  }).join('');
  return `<div class="result-count">已收藏 <b>${favs.length}</b> 道题目</div><div class="bank-grid">${items}</div>`;
}

// ===== 错题本视图 =====
async function renderWrongBook() {
  const wrongs = await store.getWrongQuestions(null, null, false);
  if (!wrongs.length) {
    return `<div class="empty-state"><div class="icon">❌</div><h3>错题本为空</h3><p>做自测题答错后会自动收录于此</p><button class="btn primary" onclick="document.querySelector('.bank-tab[data-view=quiz]').click()">去做自测</button></div>`;
  }
  const qmap = buildQuestionMap();
  const items = wrongs.map((w) => {
    const q = qmap[w.questionId];
    if (!q) return '';
    const subject = subjectById(q.subject);
    return `<div class="wrong-item" data-wid="${w.id}" style="--accent:${subject.color}">
      <div class="wi-meta"><span class="difficulty-badge ${diffClass(q.difficulty)}">${diffLabel(q.difficulty)}</span> <span>${subject.name}</span> · <span>${typeLabel(q.type)}</span></div>
      <div class="wi-q">${q.description || q.title}</div>
      <div class="wi-ans">你的作答：<span class="my">${escapeHtml(w.userAnswer)}</span> · 得分：<span class="my">${w.userScore}/${w.maxScore}</span></div>
      ${q.answerDetail ? `<div class="quiz-explain"><b>参考：</b>${q.answerDetail}</div>` : ''}
      <div class="wi-actions">
        <button class="btn sm green" data-wrong-review="${w.id}">已攻克</button>
        <button class="btn sm" data-wrong-del="${w.id}">删除</button>
      </div>
    </div>`;
  }).join('');
  return `<div class="result-count">共 <b>${wrongs.length}</b> 道未攻克错题</div>${items}`;
}

function bindWrongEvents(root) {
  root.querySelectorAll('[data-wrong-review]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await store.markWrongQuestionReviewed(btn.dataset.wrongReview);
      toast('已标记为攻克', 'success');
      btn.closest('.wrong-item').style.opacity = '.5';
      btn.disabled = true;
    });
  });
  root.querySelectorAll('[data-wrong-del]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await store.deleteWrongQuestion(btn.dataset.wrongDel);
      btn.closest('.wrong-item').remove();
      toast('已删除', 'success');
    });
  });
}

// ===== 自测模式 =====
function renderQuizMode() {
  if (!quizState || quizState.done) {
    const subjectChips = SUBJECTS.map((s) =>
      `<span class="chip ${quizState?.subjects?.has(s.id) ? 'active' : ''}" data-q-subject="${s.id}"><span class="dot" style="background:${s.color}"></span>${s.name}</span>`
    ).join('');
    const typeChips = Object.entries(TYPE_LABELS).map(([k, v]) =>
      `<span class="chip qtype-chip ${quizState?.types?.has(k) ? 'active' : ''}" data-q-type="${k}">${TYPE_ICONS[k]} ${v}</span>`
    ).join('');
    const diffChips = [1, 2, 3].map((d) =>
      `<span class="chip diff-chip ${quizState?.difficulty === String(d) ? 'active' : ''}" data-q-diff="${d}">${diffLabel(d)}</span>`
    ).join('');
    return `<div class="quiz-start" style="text-align:center;padding:30px">
      <h3 style="margin-bottom:16px">📝 自测练习</h3>
      <p style="color:var(--text2);margin-bottom:20px">选择题、填空题自动判分；计算、证明、画图题提交后对照评分标准自评</p>
      <div style="margin-bottom:12px"><b style="color:var(--text3);font-size:13px">学科（可多选）</b></div>
      <div class="filter-chips" style="justify-content:center;margin-bottom:20px">${subjectChips}</div>
      <div style="margin-bottom:12px"><b style="color:var(--text3);font-size:13px">题型（可多选）</b></div>
      <div class="filter-chips" style="justify-content:center;margin-bottom:20px">${typeChips}</div>
      <div style="margin-bottom:12px"><b style="color:var(--text3);font-size:13px">难度</b></div>
      <div class="filter-chips" style="justify-content:center;margin-bottom:24px">${diffChips}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn primary" data-quiz-start>开始自测</button>
        <button class="btn" data-quiz-reset>重置条件</button>
      </div>
      <p style="color:var(--text3);font-size:13px;margin-top:16px">共 ${QUESTIONS.length} 道题</p>
    </div>`;
  }

  const q = quizState.pool[quizState.idx];
  if (!q) return '<div class="empty-state">无题目</div>';
  const subject = subjectById(q.subject);
  const progress = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
    <div style="font-size:13px;color:var(--text3)">第 ${quizState.idx + 1} / ${quizState.pool.length} 题 · ${subject.name}</div>
    <div style="display:flex;gap:10px;align-items:center">
      <div style="font-size:13px;color:var(--text2)">已答对 <b style="color:var(--green2)">${quizState.correct}</b> · 答错 <b style="color:#fca5a5">${quizState.wrong}</b></div>
      <button class="btn sm" data-quiz-reset>重新开始</button>
    </div>
  </div>`;

  return `${progress}<div class="quiz-block" style="--accent:${subject.color}" data-qid="${q.id}" data-subject="${q.subject}" data-type="${q.type}" data-difficulty="${q.difficulty}">
    <div class="q-tag">${subject.name} · ${typeLabel(q.type)} · <span class="difficulty-badge ${diffClass(q.difficulty)}">${diffLabel(q.difficulty)}</span></div>
    <div class="q-text">${q.description || q.title}</div>
    ${renderQuizInput(q)}
    <div id="quiz-feedback"></div>
  </div>`;
}

function renderQuizInput(q) {
  if (q.type === 'choice' && q.opts) {
    return `<div class="quiz-options" id="quiz-options">
      ${q.opts.map((opt, i) => `<div class="quiz-opt" data-opt="${i}"><span class="opt-letter">${String.fromCharCode(65 + i)}</span><span>${opt}</span></div>`).join('')}
    </div>`;
  }
  if (q.type === 'fill') {
    return `<div class="answer-row"><input type="text" class="answer-input" id="quiz-answer" placeholder="请输入答案..." autocomplete="off"></div>
      <div style="margin-top:12px"><button class="btn primary" id="quiz-submit">提交答案</button></div>`;
  }
  if (q.type === 'drawing') {
    return `<div class="drawing-area"><canvas class="drawing-canvas" id="quiz-canvas" width="600" height="260"></canvas>
      <div class="drawing-tools"><button class="btn sm" id="quiz-clear">清空画布</button></div></div>
      <div style="margin-top:12px"><button class="btn primary" id="quiz-submit">提交并查看参考</button></div>`;
  }
  // calculation / proof
  return `<textarea class="answer-textarea" id="quiz-answer" rows="5" placeholder="请在此输入作答过程..."></textarea>
    <div style="margin-top:12px"><button class="btn primary" id="quiz-submit">提交并查看解析</button></div>`;
}

function bindQuizEvents(root) {
  // 开始/重置
  const startBtn = $('[data-quiz-start]', root);
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const subjects = new Set(Array.from(root.querySelectorAll('[data-q-subject].active')).map((c) => c.dataset.qSubject));
      const types = new Set(Array.from(root.querySelectorAll('[data-q-type].active')).map((c) => c.dataset.qType));
      const diffEl = root.querySelector('[data-q-diff].active');
      const difficulty = diffEl ? diffEl.dataset.qDiff : '';
      let pool = QUESTIONS.filter((q) => {
        if (subjects.size && !subjects.has(q.subject)) return false;
        if (types.size && !types.has(q.type)) return false;
        if (difficulty && String(q.difficulty) !== difficulty) return false;
        return true;
      });
      if (!pool.length) { toast('当前条件下没有题目，请调整筛选', 'error'); return; }
      pool = shuffle(pool).slice(0, Math.min(10, pool.length));
      quizState = { pool, idx: 0, correct: 0, wrong: 0, subjects, types, difficulty, done: false };
      refreshQuiz(root);
    });
  }
  const resetBtn = $('[data-quiz-reset]', root);
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      quizState = null;
      renderBankContent(root.closest('[data-view="bank"]') || root);
    });
  }

  // 条件 chip 切换
  root.querySelectorAll('[data-q-subject]').forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });
  root.querySelectorAll('[data-q-type]').forEach((chip) => {
    chip.addEventListener('click', () => {
      root.querySelectorAll('[data-q-type]').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
  root.querySelectorAll('[data-q-diff]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.qDiff;
      root.querySelectorAll('[data-q-diff]').forEach((c) => c.classList.toggle('active', c.dataset.qDiff === val && !c.classList.contains('active')));
    });
  });

  // 选择题
  root.querySelectorAll('#quiz-options .quiz-opt[data-opt]').forEach((opt) => {
    opt.addEventListener('click', async () => {
      if (opt.closest('#quiz-options').dataset.answered) return;
      const q = quizState.pool[quizState.idx];
      const choice = parseInt(opt.dataset.opt, 10);
      const correctIdx = choiceAnswerIndex(q.answer);
      const isCorrect = choice === correctIdx;
      opt.closest('#quiz-options').dataset.answered = '1';
      root.querySelectorAll('#quiz-options .quiz-opt[data-opt]').forEach((el, i) => {
        if (i === correctIdx) {
          el.classList.add('correct');
        } else if (i === choice) {
          el.classList.add('wrong');
        }
      });
      await finishQuestion(root, q, isCorrect ? q.rubric?.reduce((s, r) => s + r.score, 0) || 10 : 0, q.rubric?.reduce((s, r) => s + r.score, 0) || 10, String.fromCharCode(65 + choice), q.answer);
    });
  });

  // 提交（填空、计算、证明、画图）
  const submitBtn = $('#quiz-submit', root);
  if (submitBtn && !submitBtn.dataset.bound) {
    submitBtn.dataset.bound = '1';
    submitBtn.addEventListener('click', () => handleQuizSubmit(root));
  }

  // 画布
  const canvas = $('#quiz-canvas', root);
  if (canvas) bindDrawingCanvas(canvas);
  const clearBtn = $('#quiz-clear', root);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function choiceAnswerIndex(answerText) {
  if (!answerText) return -1;
  const m = answerText.match(/^[A-E]/);
  if (m) return m[0].charCodeAt(0) - 65;
  return -1;
}

function normalizeAnswer(s) {
  return String(s).toLowerCase().replace(/\s+/g, '').replace(/\\/g, '').replace(/\$/g, '').trim();
}

async function handleQuizSubmit(root) {
  const q = quizState.pool[quizState.idx];
  if (q.type === 'fill') {
    const input = $('#quiz-answer', root);
    const raw = input ? input.value.trim() : '';
    const accepted = q.acceptedAnswers && q.acceptedAnswers.length
      ? q.acceptedAnswers
      : [q.answer];
    const normInput = normalizeAnswer(raw);
    const isCorrect = accepted.some((a) => normalizeAnswer(a) === normInput || normalizeAnswer(a).includes(normInput));
    const maxScore = q.rubric?.reduce((s, r) => s + r.score, 0) || 10;
    await finishQuestion(root, q, isCorrect ? maxScore : 0, maxScore, raw, q.answer);
    return;
  }
  // 主观题：展示解析 + 自评
  const input = $('#quiz-answer', root);
  const userText = input ? input.value.trim() : '';
  const maxScore = q.rubric?.reduce((s, r) => s + r.score, 0) || 10;
  showSubjectiveFeedback(root, q, userText, maxScore);
}

function showSubjectiveFeedback(root, q, userText, maxScore) {
  const feedback = $('#quiz-feedback', root);
  const rubricRows = (q.rubric || []).map((r) =>
    `<tr><td>${escapeHtml(r.item)}</td><td>${r.score} 分</td></tr>`
  ).join('');
  feedback.innerHTML = `
    <div class="quiz-explain"><b>参考解析：</b>${q.answerDetail || q.answer}</div>
    ${q.rubric ? `<table class="data-table rubric-table" style="margin-top:10px"><thead><tr><th>评分项</th><th>分值</th></tr></thead><tbody>${rubricRows}</tbody></table>` : ''}
    <div class="self-score-row" style="margin-top:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <label>自评得分：</label>
      <input type="number" class="answer-input" id="self-score" min="0" max="${maxScore}" value="${maxScore}" style="width:80px">
      <span>/ ${maxScore}</span>
      <button class="btn primary" id="quiz-next">下一题 →</button>
    </div>
  `;
  const next = $('#quiz-next', root);
  if (next) {
    next.addEventListener('click', async () => {
      const scoreInput = $('#self-score', root);
      const score = Math.max(0, Math.min(maxScore, parseInt(scoreInput ? scoreInput.value : '0', 10) || 0));
      await finishQuestion(root, q, score, maxScore, userText, q.answer);
    });
  }
  renderMath(feedback);
}

async function finishQuestion(root, q, userScore, maxScore, userAnswer, correctAnswer) {
  await store.recordAttempt(q.id, q.subject, q.type, q.difficulty, userScore, maxScore, userAnswer);
  if (userScore < maxScore) {
    await store.addWrongQuestion(q.id, q.subject, q.type, q.difficulty, userScore, maxScore, userAnswer, correctAnswer);
    quizState.wrong++;
    toast(`答错了，已加入错题本（${userScore}/${maxScore}）`, 'error');
  } else {
    quizState.correct++;
    toast('回答正确！', 'success');
  }
  // 显示下一题按钮（若还没有）
  const feedback = $('#quiz-feedback', root);
  if (feedback && !$('#quiz-next', feedback)) {
    feedback.innerHTML += `<div style="margin-top:14px"><button class="btn primary" id="quiz-next">${quizState.idx + 1 >= quizState.pool.length ? '查看结果' : '下一题 →'}</button></div>`;
    const next = $('#quiz-next', feedback);
    if (next) next.addEventListener('click', () => advanceQuiz(root));
  } else {
    const existing = $('#quiz-next', root);
    if (existing) existing.addEventListener('click', () => advanceQuiz(root));
  }
}

function advanceQuiz(root) {
  quizState.idx++;
  if (quizState.idx >= quizState.pool.length) {
    quizState.done = true;
    showQuizResult(root);
  } else {
    refreshQuiz(root);
  }
}

function refreshQuiz(root) {
  const content = $('#bank-content', root.closest('[data-view="bank"]') || root) || root;
  content.innerHTML = renderQuizMode();
  bindQuizEvents(content);
  renderMath(content);
}

function showQuizResult(root) {
  const content = $('#bank-content', root.closest('[data-view="bank"]') || root) || root;
  const total = quizState.pool.length;
  const score = quizState.correct;
  const pct = total ? Math.round((score / total) * 100) : 0;
  let level = '继续加油！';
  if (pct >= 90) level = '太棒了！🏆';
  else if (pct >= 70) level = '掌握不错！👍';
  else if (pct >= 50) level = '还需巩固';
  content.innerHTML = `
    <div class="quiz-result">
      <div style="font-size:48px;margin-bottom:8px">${pct >= 70 ? '🎉' : '📚'}</div>
      <div class="score">${score}/${total}</div>
      <div class="total">全对题数 ${score} · ${level}</div>
      <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn primary" data-quiz-restart>再做一次</button>
        <button class="btn" data-go="/wrong">查看错题</button>
        <button class="btn" data-go="/bank">返回题型库</button>
      </div>
    </div>`;
  content.querySelector('[data-quiz-restart]')?.addEventListener('click', () => { quizState = null; refreshQuiz(content); });
  content.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); navigate(a.dataset.go); }));
}

function bindDrawingCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  let drawing = false;
  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });
  const stop = () => { drawing = false; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointerleave', stop);
}
