// 模块二：记忆巩固系统
import { newCard, schedule, RATINGS, RATING_LABELS, isDue, masteryLevel, forecastNextWeek, retentionRate } from '../ebbinghaus.js';
import { navigate, renderMath, toast, el, $, todayTs, fmtDay, fmtDate, addDays, clamp, pct } from '../utils.js';
import * as store from '../store.js';
import { SUBJECTS, findType } from './chapter-system.js';

// ===== 惰性初始化所有题型卡片 =====
export async function ensureCardsInit() {
  const existing = await store.getAllCards();
  const existingIds = new Set(existing.map((c) => c.cardId));
  const toCreate = [];
  for (const subject of SUBJECTS) {
    for (const chapter of subject.chapters) {
      for (const t of chapter.questionTypes) {
        if (!existingIds.has(t.id)) {
          toCreate.push(newCard(t.id, subject.id));
        }
      }
    }
  }
  if (toCreate.length) {
    for (const card of toCreate) await store.putCard(card);
    toast(`已初始化 ${toCreate.length} 张记忆卡片`, 'info');
  }
  return store.getAllCards();
}

// ===== 记忆仪表盘 =====
export async function renderDashboard() {
  await ensureCardsInit();
  const allCards = await store.getAllCards();
  const dueNow = allCards.filter((c) => isDue(c, Date.now()));
  const mastered = allCards.filter((c) => c.repetitions >= 3);
  const newCards = allCards.filter((c) => c.repetitions === 0);
  const total = allCards.length;

  const statCards = [
    { num: dueNow.length, lbl: '今日待复习', icon: '🔄', accent: '#fbbf24' },
    { num: mastered.length, lbl: '已掌握', icon: '✓', accent: '#34d399' },
    { num: newCards.length, lbl: '未学习', icon: '📖', accent: '#60a5fa' },
    { num: total, lbl: '总卡片', icon: '🗂', accent: '#a78bfa' },
  ].map((s) => `<div class="stat-card" style="--accent:${s.accent}"><span class="icon">${s.icon}</span><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>`).join('');

  const masteryRings = SUBJECTS.map((s) => {
    const subjectCards = allCards.filter((c) => c.subjectId === s.id);
    const totalSubject = s.chapters.reduce((sum, c) => sum + c.questionTypes.length, 0);
    const masteredCount = subjectCards.filter((c) => c.repetitions >= 3).length;
    const p = totalSubject ? Math.round((masteredCount / totalSubject) * 100) : 0;
    const circ = 2 * Math.PI * 32;
    const dash = (p / 100) * circ;
    return `<div class="mastery-card">
      <div class="m-ring">
        <svg width="80" height="80"><circle class="bg" cx="40" cy="40" r="32"></circle>
        <circle class="fg" cx="40" cy="40" r="32" stroke="${s.color}" stroke-dasharray="${dash} ${circ}"></circle></svg>
        <span class="m-pct">${p}%</span>
      </div>
      <div class="m-name">${s.name}</div>
    </div>`;
  }).join('');

  const weekForecast = forecastNextWeek(allCards);
  const weekMax = Math.max(1, ...weekForecast);

  return `
  <div class="view active memory-dashboard" data-view="memory">
    <div class="breadcrumb"><a data-go="/">首页</a><span class="sep">/</span><span>记忆仪表盘</span></div>
    <div class="page-header"><h2>📊 记忆巩固仪表盘</h2><span class="subtitle">基于艾宾浩斯记忆曲线 + SM-2 算法</span></div>

    <div class="stat-grid">${statCards}</div>

    <div class="dashboard-actions">
      ${dueNow.length ? `<button class="btn primary" data-go="/flashcard">开始今日复习（${dueNow.length}）</button>` : '<button class="btn" disabled>今日已无待复习</button>'}
      <button class="btn" id="practice-new">新卡学习</button>
    </div>

    <div class="memory-section">
      <h3>遗忘曲线</h3>
      <div class="chart-box"><canvas id="forgetting-curve" width="640" height="220"></canvas></div>
      <div class="chart-legend">
        <div class="item"><span class="swatch" style="background:#3b82f6"></span>记忆保留率 R=e^(-t/S)</div>
        <div class="item"><span class="swatch" style="background:#fbbf24"></span>历史复习点</div>
        <div class="item"><span class="swatch" style="background:#10b981"></span>未来到期分布</div>
      </div>
    </div>

    <div class="memory-section">
      <h3>复习热力图（最近 12 周）</h3>
      <div class="heatmap-wrap"><div class="heatmap" id="heatmap"></div></div>
      <div class="heatmap-labels"><span>12 周前</span><span>今日</span></div>
    </div>

    <div class="memory-section">
      <h3>未来 7 天复习量</h3>
      <div class="chart-box"><canvas id="week-chart" width="640" height="160"></canvas></div>
    </div>

    <div class="memory-section">
      <h3>各学科掌握度</h3>
      <div class="mastery-grid">${masteryRings}</div>
    </div>
  </div>`;
}

// ===== 闪卡复习 =====
let flashcardQueue = [];
let flashcardIdx = 0;

export async function renderFlashcard() {
  await ensureCardsInit();
  const allCards = await store.getAllCards();
  flashcardQueue = allCards.filter((c) => isDue(c, Date.now())).sort((a, b) => a.dueDate - b.dueDate);
  flashcardIdx = 0;
  if (!flashcardQueue.length) {
    return `<div class="view active">
      <div class="breadcrumb"><a data-go="/">首页</a><span class="sep">/</span><span>闪卡复习</span></div>
      <div class="complete-screen">
        <div class="icon">🎉</div>
        <h2>今日复习已完成！</h2>
        <p>所有到期卡片已复习完毕，记忆正在巩固中。</p>
        <button class="btn primary" data-go="/memory">返回仪表盘</button>
      </div>
    </div>`;
  }
  return renderCurrentCard();
}

function renderCurrentCard() {
  const card = flashcardQueue[flashcardIdx];
  const found = findType(card.cardId);
  if (!found) return `<div class="view active"><div class="empty-state"><div class="icon">⚠️</div><h3>卡片数据缺失</h3></div></div>`;
  const { subject, chapter, type } = found;
  const mastery = masteryLevel(card);
  const stepsHtml = (type.steps || []).slice(0, 3).map((s, i) =>
    `<div class="step"><span class="step-num">${i + 1}</span><span>${s}</span></div>`).join('');
  const knowledge = (type.knowledge || '').slice(0, 500);

  return `
  <div class="view active" data-view="flashcard" data-subject="${subject.id}" style="--accent:${subject.color}">
    <div class="breadcrumb"><a data-go="/">首页</a><span class="sep">/</span><a data-go="/memory">记忆</a><span class="sep">/</span><span>闪卡复习</span></div>
    <div class="flashcard-wrap">
      <div class="flashcard" id="fc-card">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <div class="flashcard-tag"><span class="badge">${type.badge || ''}</span>${subject.name} · ${chapter.name}</div>
            <div class="flashcard-q">${type.title}</div>
            <div style="font-size:13px;color:var(--text3)">点击卡片查看答案 · <span style="color:${mastery.color}">${mastery.label}</span>（已复习 ${card.repetitions} 次）</div>
          </div>
          <div class="flashcard-back">
            <div class="flashcard-tag"><span class="badge">${type.badge || ''}</span>${type.title}</div>
            ${knowledge ? `<div class="flashcard-knowledge">${escapeHtmlSafe(knowledge)}</div>` : ''}
            ${stepsHtml ? `<div class="flashcard-steps">${stepsHtml}</div>` : ''}
            ${type.tips ? `<div class="tip-box" style="margin-top:12px">${escapeHtmlSafe(type.tips)}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="fc-counter">${flashcardIdx + 1} / ${flashcardQueue.length}</div>
      <div class="flashcard-controls" id="fc-controls" style="display:none">
        <button class="fc-btn again" data-rate="again">${RATING_LABELS.again}</button>
        <button class="fc-btn hard" data-rate="hard">${RATING_LABELS.hard}</button>
        <button class="fc-btn good" data-rate="good">${RATING_LABELS.good}</button>
        <button class="fc-btn easy" data-rate="easy">${RATING_LABELS.easy}</button>
      </div>
      <div class="fc-hint" id="fc-hint">点击卡片翻转 · 翻开后评分</div>
    </div>
  </div>`;
}

function escapeHtmlSafe(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

// 闪卡交互绑定（由 app.js 在渲染后调用）
export function bindFlashcardEvents(root) {
  const card = $('#fc-card', root);
  if (!card) return;
  const controls = $('#fc-controls', root);
  const hint = $('#fc-hint', root);
  let flipped = false;

  card.addEventListener('click', () => {
    flipped = !flipped;
    card.classList.toggle('flipped', flipped);
    if (flipped) {
      controls.style.display = 'flex';
      hint.textContent = '根据记忆清晰度评分，系统自动调度下次复习';
      renderMath(card.querySelector('.flashcard-back'));
    } else {
      controls.style.display = 'none';
    }
  });

  controls.querySelectorAll('[data-rate]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const rating = btn.dataset.rate;
      const currentCard = flashcardQueue[flashcardIdx];
      if (!currentCard) return;
      const updated = schedule(currentCard, rating);
      await store.putCard(updated);
      flashcardIdx++;
      if (flashcardIdx >= flashcardQueue.length) {
        // 完成
        navigate('/flashcard');
        toast(`完成 ${flashcardQueue.length} 张卡片复习！`, 'success');
      } else {
        // 重新渲染下一张
        const app = $('#app');
        app.innerHTML = await renderCurrentCard();
        bindFlashcardEvents(app);
        bindCommonNav(app);
        renderMath(app);
        window.scrollTo(0, 0);
      }
    });
  });
}

function bindCommonNav(root) {
  root.querySelectorAll('[data-go]').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); navigate(a.dataset.go); });
  });
}

// ===== Canvas 图表绘制（由 app.js 在渲染后调用） =====
export function drawMemoryCharts(root) {
  drawForgettingCurve($('#forgetting-curve', root));
  drawWeekChart($('#week-chart', root));
  drawHeatmap($('#heatmap', root));
}

async function drawForgettingCurve(canvas) {
  if (!canvas) return;
  const cards = await store.getAllCards();
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const padL = 40, padR = 20, padT = 20, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const maxDays = 30;

  // 轴
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, H - padB);
  ctx.lineTo(W - padR, H - padB);
  ctx.stroke();

  // 网格 + Y 轴标签
  ctx.fillStyle = '#64748b';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    const val = 100 - i * 25;
    ctx.fillText(val + '%', padL - 6, y + 4);
    ctx.strokeStyle = 'rgba(51,65,85,.3)';
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
  }

  // X 轴标签
  ctx.textAlign = 'center';
  for (let d = 0; d <= maxDays; d += 5) {
    const x = padL + (plotW * d) / maxDays;
    ctx.fillText(d + '天', x, H - padB + 16);
  }

  // 平均间隔 S
  const reviewed = cards.filter((c) => c.lastReview > 0 && c.interval > 0);
  const avgInterval = reviewed.length
    ? reviewed.reduce((s, c) => s + c.interval, 0) / reviewed.length
    : 1;

  // 曲线 R = e^(-t/S)
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let d = 0; d <= maxDays; d += 0.5) {
    const r = retentionRate(d, avgInterval);
    const x = padL + (plotW * d) / maxDays;
    const y = padT + plotH * (1 - r);
    if (d === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 历史复习点散点
  ctx.fillStyle = '#fbbf24';
  const now = Date.now();
  for (const c of reviewed) {
    if (!c.history) continue;
    for (const h of c.history) {
      const daysAgo = (now - h.date) / 86400000;
      if (daysAgo > maxDays) continue;
      const x = padL + (plotW * daysAgo) / maxDays;
      const r = retentionRate(daysAgo, avgInterval);
      const y = padT + plotH * (1 - r);
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 未来到期分布（绿色柱）
  const forecast = forecastNextWeek(cards);
  ctx.fillStyle = 'rgba(16,185,129,.5)';
  for (let d = 0; d < 7; d++) {
    const x = padL + (plotW * d) / maxDays;
    const w = (plotW / maxDays) * 0.8;
    const barH = (forecast[d] / Math.max(1, ...forecast)) * plotH * 0.3;
    ctx.fillRect(x, H - padB - barH, w, barH);
  }
}

async function drawWeekChart(canvas) {
  if (!canvas) return;
  const cards = await store.getAllCards();
  const forecast = forecastNextWeek(cards);
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const padL = 30, padR = 10, padT = 10, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const maxV = Math.max(1, ...forecast);
  const days = ['今天', '+1', '+2', '+3', '+4', '+5', '+6'];
  const barW = plotW / 7 * 0.6;
  forecast.forEach((v, i) => {
    const x = padL + (plotW * (i + 0.5)) / 7 - barW / 2;
    const h = (v / maxV) * plotH;
    const y = padT + plotH - h;
    ctx.fillStyle = i === 0 ? '#fbbf24' : '#3b82f6';
    ctx.fillRect(x, y, barW, h);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(days[i], x + barW / 2, H - padB + 16);
    if (v > 0) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(v, x + barW / 2, y - 6);
    }
  });
}

async function drawHeatmap(container) {
  if (!container) return;
  const cards = await store.getAllCards();
  const dayMap = {};
  for (const c of cards) {
    if (!c.history) continue;
    for (const h of c.history) {
      const day = fmtDay(h.date);
      dayMap[day] = (dayMap[day] || 0) + 1;
    }
  }
  const weeks = 12;
  const today = todayTs();
  const cells = [];
  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const ts = today - (w * 7 + (6 - d)) * 86400000;
      const day = fmtDay(ts);
      const count = dayMap[day] || 0;
      let level = 0;
      if (count >= 8) level = 4;
      else if (count >= 4) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;
      cells.push(`<div class="cell" data-level="${level}" title="${day}: ${count} 次"></div>`);
    }
  }
  container.innerHTML = cells.join('');
}
