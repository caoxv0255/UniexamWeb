// 应用入口：Hash 路由 + 视图切换 + KaTeX 渲染
import { renderMath, hash, navigate, toast, $, $$, el, fmtDay, daysBetween, download } from './utils.js';
import { exportAll, importAll, clearAll, getSetting, setSetting } from './store.js';
import { SUBJECTS, getSubjectData } from './modules/chapter-system.js';
import { renderDashboard, renderSubject, renderTypeDetail, bindChapterEvents } from './modules/chapter-system.js';
import {
  renderDashboard as renderMemoryDashboard,
  renderFlashcard,
  bindFlashcardEvents,
  drawMemoryCharts,
} from './modules/memory-system.js';
import { renderBank, bindBankEvents, setBankView } from './modules/question-index.js';
import { renderNotes, bindNotesEvents } from './modules/notes-system.js';

// 考试日期（最近一科）
const EXAM_DATES = [
  { subject: '微经', date: new Date(new Date().getFullYear(), 6, 2, 9) }, // 7/2 上午
  { subject: '高数二', date: new Date(new Date().getFullYear(), 6, 2, 14) },
  { subject: '线代', date: new Date(new Date().getFullYear(), 6, 2, 9) },
  { subject: '数据结构', date: new Date(new Date().getFullYear(), 6, 2, 14) },
];

function updateCountdown() {
  const now = Date.now();
  const upcoming = EXAM_DATES.filter((e) => e.date.getTime() > now);
  const target = upcoming.length ? upcoming[0] : EXAM_DATES[0];
  const days = Math.max(0, Math.ceil((target.date.getTime() - now) / 86400000));
  const el2 = $('#countdown-num');
  if (el2) el2.textContent = days;
  const wrap = $('#countdown');
  if (wrap) wrap.title = `距 ${target.subject} 考试 ${days} 天`;
}

async function render(view, ...args) {
  const app = $('#app');
  const hook = typeof args[args.length - 1] === 'function' ? args.pop() : null;
  let html = '';
  try {
    html = await view(...args);
  } catch (e) {
    console.error('渲染错误', e);
    html = `<div class="view active"><div class="empty-state"><div class="icon">⚠️</div><h3>渲染出错</h3><p>${e.message}</p></div></div>`;
  }
  app.innerHTML = html;
  bindCommonEvents(app);
  // 绑定章节模块事件（dashboard/subject/type 共用）
  if (typeof bindChapterEvents === 'function') bindChapterEvents(app);
  renderMath(app);
  if (hook) hook(app);
  window.scrollTo(0, 0);
  updateNavActive();
}

function bindCommonEvents(root) {
  // data-go 通用导航
  root.querySelectorAll('[data-go]').forEach((a) => {
    if (a.dataset.bound) return;
    a.dataset.bound = '1';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(a.dataset.go);
    });
  });
  // data-chapter 面包屑章节切换
  root.querySelectorAll('[data-chapter]').forEach((a) => {
    if (a.dataset.bound) return;
    a.dataset.bound = '1';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const subjectView = a.closest('[data-subject]');
      const subjectId = subjectView ? subjectView.dataset.subject : '';
      if (subjectId) navigate('/subject/' + subjectId);
    });
  });
}

async function router() {
  const parts = hash();
  if (parts.length === 0 || parts[0] === '') {
    return render(renderDashboard);
  }
  const [first, second, third] = parts;
  switch (first) {
    case 'subject':
      return render(renderSubject, second);
    case 'type':
      return render(renderTypeDetail, second);
    case 'memory':
      return render(renderMemoryDashboard, (app) => setTimeout(() => drawMemoryCharts(app), 30));
    case 'flashcard':
      return render(renderFlashcard, (app) => bindFlashcardEvents(app));
    case 'bank':
      setBankView('all');
      return render(renderBank, (app) => bindBankEvents(app));
    case 'favorites':
      setBankView('favorites');
      return render(renderBank, (app) => bindBankEvents(app));
    case 'wrong':
      setBankView('wrong');
      return render(renderBank, (app) => bindBankEvents(app));
    case 'notes':
      return render(renderNotes, (app) => bindNotesEvents(app));
    case 'help':
      return render(renderHelp);
    default:
      return render(renderDashboard);
  }
}

// ===== 占位视图（后续模块替换） =====
function placeholder(title, desc, icon = '🚧') {
  return `<div class="view active"><div class="empty-state"><div class="icon">${icon}</div><h3>${title}</h3><p>${desc}</p><p style="margin-top:12px"><button class="btn primary" data-go="/">返回首页</button></p></div></div>`;
}
function renderMemoryPlaceholder() { return placeholder('记忆巩固系统', '仪表盘 · 闪卡复习 · 遗忘曲线 · 热力图', '📊'); }
function renderFlashcardPlaceholder() { return placeholder('闪卡复习', '艾宾浩斯记忆曲线驱动的智能复习', '🔄'); }
function renderBankPlaceholder() { return placeholder('题型索引库', '多维度筛选 · 搜索 · 自测', '🗂'); }
function renderNotesPlaceholder() { return placeholder('复习笔记', '富文本笔记 · 公式插入 · 知识框架图', '📝'); }

async function renderHelp() {
  const steps = [
    { t: '欢迎使用学习平台', d: '本平台整合高数二、线性代数、微观经济学、数据结构四门学科，提供章节学习、记忆巩固、题型索引、复习总结四大功能。' },
    { t: '章节学习', d: '点击顶部学科标签进入章页，左侧章节导航切换，题型卡片可标记已学和收藏。点击题型查看完整知识、考法、步骤。' },
    { t: '记忆巩固', d: '基于艾宾浩斯记忆曲线，闪卡复习自动调度。评分后系统计算下次复习时间，到期卡片出现在"今日复习"。' },
    { t: '题型索引', d: '题型库支持按学科、难度、标签筛选和搜索，可做自测题，错题自动进入错题本。' },
    { t: '复习总结', d: '富文本笔记支持公式插入，可生成知识框架图并导出打印。所有数据可导出为 JSON 备份。' },
  ];
  let idx = 0;
  const html = `<div class="view active"><div class="breadcrumb"><a data-go="/">首页</a><span class="sep">/</span><span>帮助</span></div>
    <div class="help-card" style="max-width:600px;margin:0 auto" id="help-content">
      <h2 id="help-h">${steps[0].t}</h2>
      <p id="help-p">${steps[0].d}</p>
      <div class="help-progress" id="help-prog">${steps.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('')}</div>
      <div class="help-actions">
        <button class="btn ghost" id="help-prev">上一页</button>
        <button class="btn primary" id="help-next">${idx < steps.length - 1 ? '下一步' : '完成'}</button>
      </div>
    </div></div>`;
  setTimeout(() => {
    const root = $('#app');
    const h = $('#help-h', root), p = $('#help-p', root), prog = $('#help-prog', root);
    const next = $('#help-next', root), prev = $('#help-prev', root);
    function update() {
      h.textContent = steps[idx].t;
      p.textContent = steps[idx].d;
      prog.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      next.textContent = idx < steps.length - 1 ? '下一步' : '完成';
      prev.style.display = idx === 0 ? 'none' : '';
    }
    next.onclick = () => {
      if (idx < steps.length - 1) { idx++; update(); }
      else { setSetting('onboarded', true); navigate('/'); }
    };
    prev.onclick = () => { if (idx > 0) { idx--; update(); } };
  }, 50);
  return html;
}

// ===== 导航 active 状态 =====
function updateNavActive() {
  const parts = hash();
  const current = '/' + parts.join('/');
  $$('.nav-tab').forEach((t) => {
    const route = t.dataset.route;
    let active = false;
    if (route === '/' && (parts.length === 0 || parts[0] === '')) active = true;
    else if (route !== '/' && route !== '#' && current.startsWith(route)) active = true;
    t.classList.toggle('active', active);
  });
}

// ===== 顶部导航交互 =====
function initTopbar() {
  // 汉堡菜单
  const toggle = $('#nav-toggle');
  const tabs = $('#nav-tabs');
  if (toggle) toggle.addEventListener('click', () => tabs.classList.toggle('open'));
  // nav-tab 点击
  $$('.nav-tab').forEach((t) => {
    const route = t.dataset.route;
    if (!route || route === '#') return;
    t.addEventListener('click', (e) => {
      e.preventDefault();
      if (route === '/help') { navigate('/help'); }
      else navigate(route);
      tabs.classList.remove('open');
    });
  });
  // 数据下拉
  const dataTab = $('.nav-data');
  const dropdown = $('#data-dropdown');
  if (dataTab && dropdown) {
    dataTab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    dropdown.querySelector('[data-action="export"]').addEventListener('click', async () => {
      const data = await exportAll();
      const text = JSON.stringify(data, null, 2);
      download(`study-platform-${fmtDay(Date.now())}.json`, text);
      toast('已导出备份文件', 'success');
    });
    const fileInput = $('#import-file');
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await importAll(data);
        toast('导入成功，页面将刷新', 'success');
        setTimeout(() => location.reload(), 800);
      } catch (err) {
        toast('导入失败：' + err.message, 'error');
      }
      fileInput.value = '';
    });
    dropdown.querySelector('[data-action="clear"]').addEventListener('click', async () => {
      if (confirm('确定清空全部数据？此操作不可恢复。建议先导出备份。')) {
        await clearAll();
        toast('已清空全部数据', 'success');
        setTimeout(() => location.reload(), 800);
      }
    });
  }
}

// ===== 首次引导 =====
async function maybeShowOnboarding() {
  const onboarded = getSetting('onboarded', false);
  if (!onboarded) {
    const overlay = $('#help-overlay');
    if (!overlay) return;
    const steps = [
      { t: '欢迎使用四学科学习平台 📚', d: '整合高数二、线性代数、微观经济学、数据结构，提供章节学习、记忆巩固、题型索引、复习总结四大功能。' },
      { t: '章节学习 📖', d: '点击顶部学科标签进入章节，标记已学跟踪进度，题型详情含考法步骤。' },
      { t: '记忆巩固 🔄', d: '艾宾浩斯曲线驱动的闪卡复习，到期自动提醒，评分后智能调度。' },
      { t: '开始学习 🚀', d: '所有数据本地存储，可导出备份。祝学习顺利！' },
    ];
    let idx = 0;
    const title = $('#help-title'), txt = $('#help-text'), prog = $('#help-progress');
    function update() {
      title.textContent = steps[idx].t;
      txt.textContent = steps[idx].d;
      prog.innerHTML = steps.map((_, i) => `<span class="dot ${i === idx ? 'active' : ''}"></span>`).join('');
    }
    update();
    overlay.hidden = false;
    $('#help-next').onclick = () => {
      if (idx < steps.length - 1) { idx++; update(); }
      else { setSetting('onboarded', true); overlay.hidden = true; }
    };
    $('#help-skip').onclick = () => { setSetting('onboarded', true); overlay.hidden = true; };
  }
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  initTopbar();
  updateCountdown();
  maybeShowOnboarding();
  router();
});

window.addEventListener('hashchange', router);
