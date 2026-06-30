// 模块一：章节学习系统
import { gaoshu } from '../../data/gaoshu.js';
import { xiandai } from '../../data/xiandai.js';
import { weijing } from '../../data/weijing.js';
import { datastruct } from '../../data/datastruct.js';
import { FORMULAS } from '../../data/formulas.js';
import { QUIZZES } from '../../data/quizzes.js';

import { navigate, renderMath, toast, el, $, escapeHtml } from '../utils.js';
import * as store from '../store.js';

export const SUBJECTS = [gaoshu, xiandai, weijing, datastruct];

export function getSubjectData(id) {
  return SUBJECTS.find((s) => s.id === id);
}

export function findType(typeId) {
  for (const subject of SUBJECTS) {
    for (const chapter of subject.chapters) {
      const t = chapter.questionTypes.find((q) => q.id === typeId);
      if (t) return { subject, chapter, type: t };
    }
  }
  return null;
}

export function findChapter(subjectId, chapterId) {
  const subject = getSubjectData(subjectId);
  if (!subject) return null;
  return subject.chapters.find((c) => c.id === chapterId) || null;
}

// 跨学科关联：返回其他学科中 tags 交集非空的题型
export function getRelatedByTags(tags, excludeSubjectId) {
  if (!tags || !tags.length) return [];
  const result = [];
  for (const subject of SUBJECTS) {
    if (subject.id === excludeSubjectId) continue;
    for (const chapter of subject.chapters) {
      for (const t of chapter.questionTypes) {
        const tTags = t.tags || [];
        if (tTags.some((tag) => tags.includes(tag))) {
          result.push({ subject, chapter, type: t });
        }
      }
    }
  }
  return result;
}

// 共享：渲染题型详情主体（章节系统与题型库复用）
export function renderTypeBody(type, subjectData) {
  let html = '';
  // 核心知识
  if (type.knowledge) {
    html += `<div class="type-section"><h5>核心知识</h5><div class="knowledge-box">${escapeHtml(type.knowledge).replace(/\n/g, '<br>')}</div></div>`;
  }
  // 概念表
  if (type.conceptsTable && type.conceptsTable.length) {
    html += `<div class="type-section"><h5>概念速查</h5><table class="data-table"><thead><tr><th>项目</th><th>内容</th></tr></thead><tbody>`;
    type.conceptsTable.forEach((r) => {
      html += `<tr><td>${escapeHtml(r.item)}</td><td>${escapeHtml(r.content)}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  }
  // 考法与解法
  if (type.examMethods && type.examMethods.length) {
    html += `<div class="type-section"><h5>考法与解法</h5><table class="data-table"><thead><tr><th>考法</th><th>识别特征</th><th>解法</th></tr></thead><tbody>`;
    type.examMethods.forEach((r) => {
      html += `<tr><td>${escapeHtml(r.pattern || '')}</td><td>${escapeHtml(r.feature || '')}</td><td>${escapeHtml(r.solution || '')}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  }
  // 标准化步骤
  if (type.steps && type.steps.length) {
    html += `<div class="type-section"><h5>标准化步骤</h5><ol class="steps-list">`;
    type.steps.forEach((s) => {
      html += `<li>${escapeHtml(s)}</li>`;
    });
    html += `</ol></div>`;
  }
  // 技巧
  if (type.tips) {
    html += `<div class="type-section"><h5>秒杀技巧</h5><div class="tip-box">${escapeHtml(type.tips).replace(/\n/g, '<br>')}</div></div>`;
  }
  // 易错点
  if (type.pitfalls) {
    html += `<div class="type-section"><h5>易错警示</h5><div class="pitfall-box">${escapeHtml(type.pitfalls).replace(/\n/g, '<br>')}</div></div>`;
  }
  // 相关公式
  if (subjectData && FORMULAS[subjectData.id]) {
    const allRows = FORMULAS[subjectData.id]
      .filter((blk) => blk.rows && blk.rows.length)
      .flatMap((blk) => blk.rows.map((r) => ({ title: blk.title, name: r[0], formula: r[1] })));
    if (allRows.length) {
      const tags = type.tags || [];
      const matched = allRows.filter((r) => {
        const lower = (r.name + r.formula).toLowerCase();
        return tags.some((t) => lower.includes(t.toLowerCase())) ||
          (type.title && lower.includes(type.title.slice(0, 3)));
      });
      const show = matched.length ? matched : allRows.slice(0, 4);
      html += `<div class="type-section"><h5>相关公式</h5><div class="formula-box">`;
      show.forEach((r) => {
        html += `<div><b>${escapeHtml(r.name)}：</b> ${escapeHtml(r.formula)}</div>`;
      });
      html += `</div></div>`;
    }
  }
  // 跨学科关联
  if (type.tags && type.tags.length && subjectData) {
    const related = getRelatedByTags(type.tags, subjectData.id);
    if (related.length) {
      html += `<div class="type-section"><h5>跨学科关联 <span style="font-weight:400;color:var(--text3);font-size:11px">（tags: ${type.tags.map(escapeHtml).join(', ')}）</span></h5><div class="related-box">`;
      html += `<div class="rel-list">`;
      related.slice(0, 12).forEach((r) => {
        html += `<span class="rel-link" data-link-type="${r.type.id}" style="border-left:3px solid ${r.subject.color}">${escapeHtml(r.subject.name)} · ${escapeHtml(r.type.title)}</span>`;
      });
      html += `</div></div></div>`;
    }
  }
  return html;
}

// ===== 首页 dashboard =====
export async function renderDashboard() {
  const [dueCards, favCount, wrongCount, noteCount] = await Promise.all([
    store.getDueCards(Date.now()),
    store.getFavorites(),
    store.getWrongAnswers(),
    store.getNotes(),
  ]);
  const subjectCards = [];
  for (const s of SUBJECTS) {
    const prog = await store.getSubjectProgress(s);
    const total = s.chapters.reduce((sum, c) => sum + c.questionTypes.length, 0);
    subjectCards.push(`
      <div class="subject-card" data-subject="${s.id}" style="--accent:${s.color}">
        <div class="icon">${s.icon}</div>
        <h3>${escapeHtml(s.name)}</h3>
        <div class="meta">${escapeHtml(s.desc)} · 考试 ${escapeHtml(s.examTime || '')}</div>
        <div class="stats">
          <span>题型 <b>${total}</b></span>
          <span>已学 <b>${prog.learned}</b></span>
          <span>进度 <b>${prog.pct}%</b></span>
        </div>
        <div class="progress-bar"><div class="fill" style="width:${prog.pct}%"></div></div>
      </div>`);
  }

  return `
  <div class="view active" data-view="dashboard">
    ${dueCards.length ? `
    <div class="review-banner">
      <div class="rb-icon">🔄</div>
      <div class="rb-text">
        <b>今日待复习 ${dueCards.length} 项</b>
        <div class="sub">基于艾宾浩斯记忆曲线，及时复习巩固长期记忆</div>
      </div>
      <button class="btn primary" data-go="/flashcard">开始复习</button>
    </div>` : ''}
    <h2 style="margin-bottom:16px">📚 学科总览</h2>
    <div class="subject-grid">${subjectCards.join('')}</div>
    <h2 style="margin:24px 0 16px">⚡ 快捷入口</h2>
    <div class="quick-grid">
      <div class="quick-card" data-go="/bank"><div class="qi">🗂</div><div class="qt">题型库</div><div class="qd">${SUBJECTS.reduce((s, x) => s + x.chapters.reduce((a, c) => a + c.questionTypes.length, 0), 0)} 个题型 · 搜索筛选</div></div>
      <div class="quick-card" data-go="/flashcard"><div class="qi">🔄</div><div class="qt">闪卡复习</div><div class="qd">${dueCards.length} 项待复习</div></div>
      <div class="quick-card" data-go="/notes"><div class="qi">📝</div><div class="qt">复习笔记</div><div class="qd">${noteCount.length} 篇笔记</div></div>
      <div class="quick-card" data-go="/favorites"><div class="qi">⭐</div><div class="qt">我的收藏</div><div class="qd">${favCount.length} 个题型</div></div>
      <div class="quick-card" data-go="/wrong"><div class="qi">❌</div><div class="qt">错题本</div><div class="qd">${wrongCount.length} 道错题</div></div>
      <div class="quick-card" data-go="/memory"><div class="qi">📊</div><div class="qt">记忆仪表盘</div><div class="qd">复习曲线 · 热力图</div></div>
    </div>
  </div>`;
}

// ===== 学科章页 =====
export async function renderSubject(subjectId) {
  const subject = getSubjectData(subjectId);
  if (!subject) return `<div class="view active"><div class="empty-state"><div class="icon">🔍</div><h3>未找到该学科</h3></div></div>`;
  const prog = await store.getSubjectProgress(subject);
  const learnedIds = await store.getLearnedIds(subject.id);
  const firstChapter = subject.chapters[0];

  const sidebarItems = subject.chapters.map((c) => {
    const total = c.questionTypes.length;
    const learned = c.questionTypes.filter((q) => learnedIds.has(q.id)).length;
    const p = total ? Math.round((learned / total) * 100) : 0;
    return `<li class="chapter-item" data-chapter="${c.id}">
      <span class="cnt">${total}</span>
      ${escapeHtml(c.name)}
      <div class="mini-prog">已学 <b>${learned}/${total}</b> · ${p}%</div>
    </li>`;
  }).join('');

  const total = subject.chapters.reduce((s, c) => s + c.questionTypes.length, 0);
  const circ = 2 * Math.PI * 26;
  const dash = (prog.pct / 100) * circ;

  const chapterTypesHtml = firstChapter ? firstChapter.questionTypes.map((t) => kpCardHtml(t, subject, learnedIds)).join('') : '';

  return `
  <div class="view active" data-view="subject" data-subject="${subject.id}">
    <div class="breadcrumb">
      <a data-go="/">首页</a><span class="sep">/</span>
      <span>${escapeHtml(subject.name)}</span>
    </div>
    <div class="chapter-layout">
      <aside class="chapter-sidebar">
        <h4>章节导航</h4>
        <ul class="chapter-list">${sidebarItems}</ul>
      </aside>
      <div class="chapter-main" id="chapter-main">
        <div class="chapter-header" style="--accent:${subject.color}">
          <div class="ch-icon">${subject.icon}</div>
          <div class="ch-info">
            <h2>${escapeHtml(subject.name)}</h2>
            <div class="ch-meta">${escapeHtml(subject.desc)} · 考试 ${escapeHtml(subject.examTime || '')}</div>
          </div>
          <div class="ch-stats">
            <span>题型<b>${total}</b></span>
            <span>章节<b>${subject.chapters.length}</b></span>
          </div>
          <div class="progress-ring-wrap">
            <div class="progress-ring">
              <svg width="64" height="64">
                <circle class="bg" cx="32" cy="32" r="26"></circle>
                <circle class="fg" cx="32" cy="32" r="26" stroke-dasharray="${dash} ${circ}"></circle>
              </svg>
            </div>
            <span class="progress-ring-text">${prog.pct}%</span>
          </div>
        </div>
        <div id="chapter-types">${chapterTypesHtml}</div>
      </div>
    </div>
  </div>`;
}

function kpCardHtml(t, subject, learnedIds) {
  const learned = learnedIds.has(t.id);
  return `<div class="kp-card" style="--accent:${subject.color}">
    <div class="kp-card-head" data-type="${t.id}">
      <div class="kp-card-badge">${escapeHtml(t.badge || '')}</div>
      <div class="kp-card-title">
        <h4>${escapeHtml(t.title)}</h4>
        <div class="sub">${escapeHtml(t.chapter || '')} · ${t.difficulty ? `<span class="difficulty-badge ${escapeHtml(t.difficulty)}">${escapeHtml(t.difficulty)}</span>` : ''} ${t.examPattern ? '· ' + escapeHtml(t.examPattern) : ''}</div>
      </div>
      <div class="kp-card-actions">
        <span class="fav-star" data-fav="${t.id}" data-subject="${subject.id}" title="收藏">☆</span>
        <span class="learned-check ${learned ? 'done' : ''}" data-learn="${t.id}" data-subject="${subject.id}" title="标记已学">✓</span>
      </div>
    </div>
  </div>`;
}

// ===== 题型详情 =====
export async function renderTypeDetail(typeId) {
  const found = findType(typeId);
  if (!found) return `<div class="view active"><div class="empty-state"><div class="icon">🔍</div><h3>未找到该题型</h3></div></div>`;
  const { subject, chapter, type } = found;
  const learned = await store.isLearned(typeId);
  const fav = await store.isFavorite(typeId);
  const body = renderTypeBody(type, subject);

  return `
  <div class="view active" data-view="type" data-subject="${subject.id}" style="--accent:${subject.color}">
    <div class="breadcrumb">
      <a data-go="/">首页</a><span class="sep">/</span>
      <a data-go="/subject/${subject.id}">${escapeHtml(subject.name)}</a><span class="sep">/</span>
      <a data-go="/subject/${subject.id}" data-chapter="${chapter.id}">${escapeHtml(chapter.name)}</a><span class="sep">/</span>
      <span>${escapeHtml(type.title)}</span>
    </div>
    <div class="type-card open" style="--accent:${subject.color}">
      <div class="type-header">
        <div class="type-badge">${escapeHtml(type.badge || '')}</div>
        <div class="type-title">
          <h4>${escapeHtml(type.title)}</h4>
          <div class="sub">${escapeHtml(subject.name)} · ${escapeHtml(chapter.name)} ${type.difficulty ? '· <span class="difficulty-badge ' + escapeHtml(type.difficulty) + '">' + escapeHtml(type.difficulty) + '</span>' : ''} ${type.examPattern ? '· ' + escapeHtml(type.examPattern) : ''}</div>
        </div>
      </div>
      <div class="type-body">
        <div style="display:flex;gap:10px;margin:18px 0;flex-wrap:wrap">
          <button class="btn ${learned ? 'green' : ''}" data-learn="${type.id}" data-subject="${subject.id}">${learned ? '✓ 已学习' : '标记已学'}</button>
          <button class="btn ${fav ? 'orange' : ''}" data-fav="${type.id}" data-subject="${subject.id}">${fav ? '★ 已收藏' : '☆ 收藏'}</button>
          <button class="btn" data-go="/flashcard">加入复习</button>
        </div>
        ${body}
      </div>
    </div>
  </div>`;
}

// ===== 事件委托绑定（被 app.js 调用） =====
export function bindChapterEvents(root) {
  // 学科卡片点击
  root.querySelectorAll('[data-subject].subject-card').forEach((c) => {
    c.addEventListener('click', () => navigate('/subject/' + c.dataset.subject));
  });
  // 快捷入口
  root.querySelectorAll('.quick-card[data-go]').forEach((c) => {
    c.addEventListener('click', () => navigate(c.dataset.go));
  });
  // review-banner / data-go 链接
  root.querySelectorAll('[data-go]').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (a.classList.contains('subject-card') || a.classList.contains('quick-card')) return;
      e.preventDefault();
      navigate(a.dataset.go);
    });
  });
  // 章节侧栏切换
  root.querySelectorAll('.chapter-item[data-chapter]').forEach((it) => {
    it.addEventListener('click', () => switchChapter(it.dataset.chapter, root));
  });
  // 题型卡片点击 → 详情
  root.querySelectorAll('.kp-card-head[data-type]').forEach((c) => {
    c.addEventListener('click', (e) => {
      if (e.target.closest('[data-learn]') || e.target.closest('[data-fav]')) return;
      navigate('/type/' + c.dataset.type);
    });
  });
  // 标记已学
  bindLearnToggle(root);
  // 收藏
  bindFavToggle(root);
  // 跨学科关联链接
  root.querySelectorAll('.rel-link[data-link-type]').forEach((l) => {
    l.addEventListener('click', () => navigate('/type/' + l.dataset.linkType));
  });
}

async function switchChapter(chapterId, root) {
  const view = root.querySelector('[data-view="subject"]');
  if (!view) return;
  const subjectId = view.dataset.subject;
  const subject = getSubjectData(subjectId);
  const chapter = findChapter(subjectId, chapterId);
  if (!chapter) return;
  const learnedIds = await store.getLearnedIds(subjectId);
  root.querySelectorAll('.chapter-item').forEach((it) => {
    it.classList.toggle('active', it.dataset.chapter === chapterId);
  });
  const container = root.querySelector('#chapter-types');
  if (container) {
    container.innerHTML = chapter.questionTypes.map((t) => kpCardHtml(t, subject, learnedIds)).join('');
    bindChapterEvents(container);
    renderMath(container);
  }
}

function bindLearnToggle(root) {
  root.querySelectorAll('[data-learn]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const typeId = btn.dataset.learn;
      const subjectId = btn.dataset.subject;
      const learned = await store.isLearned(typeId);
      if (learned) {
        await store.unmarkLearned(typeId);
        btn.classList.remove('done', 'green');
        btn.classList.add('ghost');
        if (btn.classList.contains('learned-check')) {
          btn.classList.remove('done');
        } else {
          btn.textContent = '标记已学';
          btn.classList.remove('green');
        }
      } else {
        await store.markLearned(typeId, subjectId);
        btn.classList.add('done');
        if (btn.classList.contains('learned-check')) {
          btn.classList.add('done');
        } else {
          btn.textContent = '✓ 已学习';
          btn.classList.add('green');
        }
        toast('已标记为已学习', 'success');
      }
    });
  });
}

function bindFavToggle(root) {
  root.querySelectorAll('[data-fav]').forEach((star) => {
    star.addEventListener('click', async (e) => {
      e.stopPropagation();
      const typeId = star.dataset.fav;
      const subjectId = star.dataset.subject;
      const active = await store.toggleFavorite(typeId, subjectId);
      star.classList.toggle('active', active);
      if (star.classList.contains('fav-star')) {
        star.textContent = active ? '★' : '☆';
      } else {
        star.textContent = active ? '★ 已收藏' : '☆ 收藏';
        star.classList.toggle('orange', active);
      }
      toast(active ? '已收藏' : '已取消收藏', 'success');
    });
    // 初始化星标状态
    store.isFavorite(star.dataset.fav).then((f) => {
      if (f) {
        star.classList.add('active');
        if (star.classList.contains('fav-star')) star.textContent = '★';
      }
    });
  });
}
