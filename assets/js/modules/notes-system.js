// 模块四：复习总结工具
import { navigate, renderMath, toast, el, $, escapeHtml, debounce, fmtDate, download } from '../utils.js';
import * as store from '../store.js';
import { SUBJECTS, getSubjectData, findType } from './chapter-system.js';

let currentNote = null;
let notesViewMode = 'list'; // list | map

// ===== 笔记主视图 =====
export async function renderNotes() {
  const notes = await store.getNotes();
  if (currentNote && !notes.find((n) => n.id === currentNote.id)) currentNote = null;

  const noteItems = notes.map((n) => {
    const subj = SUBJECTS.find((s) => s.id === n.subjectId);
    const color = subj ? subj.color : '#64748b';
    return `<li class="note-item ${currentNote && currentNote.id === n.id ? 'active' : ''}" data-note="${n.id}">
      <div class="ni-title">${escapeHtml(n.title || '无标题笔记')}</div>
      <div class="ni-meta"><span class="ni-dot" style="background:${color}"></span>${fmtDate(n.updatedAt)}${n.linkedTypeIds && n.linkedTypeIds.length ? ' · 关联 ' + n.linkedTypeIds.length : ''}</div>
    </li>`;
  }).join('');

  return `
  <div class="view active" data-view="notes">
    <div class="breadcrumb"><a data-go="/">首页</a><span class="sep">/</span><span>复习笔记</span></div>
    <div class="page-header"><h2>📝 复习总结</h2>
      <span class="subtitle">富文本笔记 · 公式插入 · 知识框架图</span>
    </div>

    <div class="bank-tabs" style="margin-bottom:20px">
      <span class="bank-tab ${notesViewMode === 'list' ? 'active' : ''}" data-notes-mode="list">📝 笔记列表</span>
      <span class="bank-tab ${notesViewMode === 'map' ? 'active' : ''}" data-notes-mode="map">🌳 知识框架图</span>
    </div>

    <div id="notes-content"></div>
  </div>`;
}

export function bindNotesEvents(root) {
  root.querySelectorAll('[data-notes-mode]').forEach((tab) => {
    tab.addEventListener('click', () => {
      notesViewMode = tab.dataset.notesMode;
      root.querySelectorAll('[data-notes-mode]').forEach((t) => t.classList.toggle('active', t === tab));
      renderNotesContent(root);
    });
  });
  renderNotesContent(root);
}

async function renderNotesContent(root) {
  const content = $('#notes-content', root);
  if (!content) return;
  if (notesViewMode === 'map') {
    content.innerHTML = await renderKnowledgeMap();
    bindMapEvents(content);
    return;
  }
  // list mode
  const notes = await store.getNotes();
  const noteItems = notes.map((n) => {
    const subj = SUBJECTS.find((s) => s.id === n.subjectId);
    const color = subj ? subj.color : '#64748b';
    return `<li class="note-item ${currentNote && currentNote.id === n.id ? 'active' : ''}" data-note="${n.id}">
      <div class="ni-title">${escapeHtml(n.title || '无标题笔记')}</div>
      <div class="ni-meta"><span class="ni-dot" style="background:${color}"></span>${fmtDate(n.updatedAt)}${n.linkedTypeIds && n.linkedTypeIds.length ? ' · 关联 ' + n.linkedTypeIds.length : ''}</div>
    </li>`;
  }).join('');

  const editorHtml = currentNote ? await renderEditor() : `<div class="empty-editor"><div class="icon">📝</div><h3>选择或新建笔记</h3><p>点击左侧笔记查看编辑，或点击「新建笔记」开始记录</p></div>`;

  content.innerHTML = `
    <div class="notes-layout">
      <aside class="note-sidebar">
        <div class="note-sidebar-head">
          <h4>笔记 (${notes.length})</h4>
          <button class="btn sm primary" id="new-note">+ 新建</button>
        </div>
        <ul class="note-list">${noteItems || '<li style="color:var(--text3);font-size:13px;padding:10px">暂无笔记</li>'}</ul>
      </aside>
      <div class="note-main" id="note-main">${editorHtml}</div>
    </div>`;

  // 新建按钮
  const newBtn = $('#new-note', content);
  if (newBtn) newBtn.addEventListener('click', () => {
    currentNote = { id: null, title: '', content: '', subjectId: null, linkedTypeIds: [] };
    renderNotesContent(root);
  });
  // 笔记项点击
  content.querySelectorAll('.note-item[data-note]').forEach((it) => {
    it.addEventListener('click', async () => {
      currentNote = await store.getNote(it.dataset.note);
      renderNotesContent(root);
    });
  });
  // 编辑器事件
  if (currentNote) bindEditorEvents(content, root);
}

async function renderEditor() {
  if (!currentNote) return '';
  const subj = currentNote.subjectId ? getSubjectData(currentNote.subjectId) : null;
  const linked = (currentNote.linkedTypeIds || []).map((id) => {
    const f = findType(id);
    return f ? `<span class="link-tag">${f.subject.name} · ${f.type.title}<span class="x" data-unlink="${id}">×</span></span>` : '';
  }).join('');

  return `<div class="note-editor" data-subject="${currentNote.subjectId || ''}">
    <div class="editor-header">
      <input type="text" class="note-title-input" id="note-title" placeholder="笔记标题..." value="${escapeHtml(currentNote.title || '')}">
    </div>
    <div class="editor-toolbar">
      <button class="tool-btn" data-cmd="bold" title="加粗"><b>B</b></button>
      <button class="tool-btn" data-cmd="italic" title="斜体"><i>I</i></button>
      <button class="tool-btn" data-cmd="underline" title="下划线"><u>U</u></button>
      <span class="tool-sep"></span>
      <button class="tool-btn" data-cmd="formatBlock" data-val="h3" title="标题">H</button>
      <button class="tool-btn" data-cmd="insertUnorderedList" title="无序列表">• 列表</button>
      <button class="tool-btn" data-cmd="insertOrderedList" title="有序列表">1. 列表</button>
      <span class="tool-sep"></span>
      <button class="tool-btn formula" data-cmd="formula" title="插入公式">∑ 公式</button>
      <button class="tool-btn template" data-cmd="template" title="插入模板">📋 模板</button>
      <span class="tool-sep"></span>
      <button class="tool-btn" data-cmd="formatBlock" data-val="blockquote" title="引用">❝</button>
      <button class="tool-btn" data-cmd="insertCode" title="代码块">&lt;/&gt;</button>
    </div>
    <div class="editor-area" id="editor-area" contenteditable="true">${currentNote.content || ''}</div>
    <div class="link-selector">
      <div style="font-size:12px;color:var(--text3);margin-bottom:6px">关联知识点：</div>
      <select id="link-subject"><option value="">选择学科</option>${SUBJECTS.map((s) => `<option value="${s.id}" ${currentNote.subjectId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select>
      <select id="link-type"><option value="">选择题型</option></select>
      <button class="btn sm" id="link-add">+ 关联</button>
      <div class="link-tags" id="link-tags">${linked}</div>
    </div>
    <div class="editor-footer">
      <div class="save-status" id="save-status"><span class="dot"></span><span>已保存</span></div>
      <div class="editor-footer-actions">
        <button class="btn sm" data-action="export-md">导出 MD</button>
        <button class="btn sm" data-action="print">打印</button>
        <button class="btn sm" data-action="delete" style="color:var(--red)">删除</button>
      </div>
    </div>
  </div>`;
}

function bindEditorEvents(content, root) {
  const area = $('#editor-area', content);
  const titleInput = $('#note-title', content);
  const saveStatus = $('#save-status', content);
  if (!area) return;

  // 渲染已有公式
  renderMath(area);

  // 工具栏
  content.querySelectorAll('.tool-btn[data-cmd]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd === 'formula') { openFormulaModal(area, content); return; }
      if (cmd === 'template') { insertTemplate(area); return; }
      if (cmd === 'insertCode') {
        document.execCommand('insertHTML', false, '<pre><code>代码</code></pre><p></p>');
        return;
      }
      const val = btn.dataset.val;
      area.focus();
      document.execCommand(cmd, false, val || null);
      renderMath(area);
      queueSave();
    });
  });

  // 标题
  titleInput.addEventListener('input', queueSave);
  // 内容输入
  area.addEventListener('input', () => {
    renderMath(area);
    queueSave();
  });

  // 关联选择
  const linkSubject = $('#link-subject', content);
  const linkType = $('#link-type', content);
  if (linkSubject) {
    linkSubject.addEventListener('change', () => {
      currentNote.subjectId = linkSubject.value || null;
      const subj = getSubjectData(linkSubject.value);
      linkType.innerHTML = '<option value="">选择题型</option>' + (subj ? subj.chapters.flatMap((c) => c.questionTypes.map((t) => `<option value="${t.id}">${c.name} · ${t.title}</option>`)).join('') : '');
      queueSave();
    });
    // 初始化题型下拉
    if (currentNote.subjectId) linkSubject.dispatchEvent(new Event('change'));
  }
  const linkAdd = $('#link-add', content);
  if (linkAdd) linkAdd.addEventListener('click', () => {
    const typeId = linkType.value;
    if (!typeId) { toast('请先选择题型', 'error'); return; }
    if (!currentNote.linkedTypeIds) currentNote.linkedTypeIds = [];
    if (!currentNote.linkedTypeIds.includes(typeId)) {
      currentNote.linkedTypeIds.push(typeId);
      const f = findType(typeId);
      const tags = $('#link-tags', content);
      tags.insertAdjacentHTML('beforeend', `<span class="link-tag">${f.subject.name} · ${f.type.title}<span class="x" data-unlink="${typeId}">×</span></span>`);
      queueSave();
    }
  });
  content.querySelectorAll('.link-tag .x').forEach((x) => {
    x.addEventListener('click', () => {
      const id = x.dataset.unlink;
      currentNote.linkedTypeIds = currentNote.linkedTypeIds.filter((t) => t !== id);
      x.closest('.link-tag').remove();
      queueSave();
    });
  });

  // 底部操作
  content.querySelector('[data-action="export-md"]')?.addEventListener('click', () => exportMarkdown(currentNote));
  content.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());
  content.querySelector('[data-action="delete"]')?.addEventListener('click', async () => {
    if (!currentNote.id) { currentNote = null; renderNotesContent(root); return; }
    if (confirm('确定删除此笔记？')) {
      await store.deleteNote(currentNote.id);
      currentNote = null;
      toast('已删除', 'success');
      renderNotesContent(root);
    }
  });

  let saveTimer = null;
  function queueSave() {
    if (saveStatus) saveStatus.innerHTML = '<span class="dot" style="background:var(--orange)"></span><span>保存中...</span>';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      currentNote.title = titleInput.value;
      currentNote.content = area.innerHTML;
      await store.saveNote(currentNote);
      if (saveStatus) saveStatus.innerHTML = '<span class="dot"></span><span>已保存</span>';
      if (!currentNote.subjectId) currentNote.subjectId = null;
    }, 800);
  }
}

// ===== 公式插入弹窗 =====
function openFormulaModal(area, content) {
  const overlay = el('div', { class: 'formula-modal-overlay' });
  overlay.innerHTML = `
    <div class="formula-modal">
      <h3>插入数学公式</h3>
      <textarea id="formula-input" placeholder="输入 LaTeX 公式，例如：\\frac{a}{b} 或 \\int_a^b f(x)dx"></textarea>
      <div class="formula-preview" id="formula-preview"><span style="color:var(--text3)">实时预览...</span></div>
      <div class="formula-help">
        常用：<code>\\frac{}{}</code> 分数 · <code>\\sqrt{}</code> 根号 · <code>\\sum</code> 求和 · <code>\\int</code> 积分 · <code>\\lim</code> 极限 · <code>\\binom{}{}</code> 矩阵
      </div>
      <div class="formula-modal-actions">
        <button class="btn ghost" id="formula-cancel">取消</button>
        <button class="btn primary" id="formula-insert">插入行内</button>
        <button class="btn primary" id="formula-insert-block">插入块级</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#formula-input');
  const preview = overlay.querySelector('#formula-preview');

  const updatePreview = () => {
    const v = input.value.trim();
    if (!v) { preview.innerHTML = '<span style="color:var(--text3)">实时预览...</span>'; return; }
    preview.innerHTML = '$$' + v + '$$';
    renderMath(preview);
  };
  input.addEventListener('input', updatePreview);
  input.focus();

  overlay.querySelector('#formula-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  const insert = (block) => {
    const v = input.value.trim();
    if (!v) return;
    area.focus();
    const delim = block ? '$$' : '$';
    document.execCommand('insertHTML', false, delim + v + delim + '&nbsp;');
    renderMath(area);
    overlay.remove();
    toast('已插入公式', 'success');
  };
  overlay.querySelector('#formula-insert').addEventListener('click', () => insert(false));
  overlay.querySelector('#formula-insert-block').addEventListener('click', () => insert(true));
}

// ===== 模板 =====
function insertTemplate(area) {
  const templates = [
    { name: '本章题型总结', html: '<h3>本章题型总结</h3><h4>一、核心题型</h4><ol><li>题型1：...</li><li>题型2：...</li></ol><h4>二、解题方法</h4><p>方法要点...</p><h4>三、易错点</h4><ul><li>易错1...</li></ul>' },
    { name: '错题反思', html: '<h3>错题反思</h3><h4>题目</h4><p>题目内容...</p><h4>我的思路</h4><p>...</p><h4>正确解法</h4><p>...</p><h4>错误原因</h4><p>...</p><h4>举一反三</h4><p>...</p>' },
    { name: '知识点梳理', html: '<h3>知识点梳理</h3><h4>定义</h4><p>...</p><h4>性质</h4><ul><li>性质1...</li></ul><h4>公式</h4><p>$$f(x) = ...$$</p><h4>典型应用</h4><p>...</p>' },
  ];
  const overlay = el('div', { class: 'formula-modal-overlay' });
  overlay.innerHTML = `<div class="formula-modal"><h3>选择模板</h3>${templates.map((t, i) => `<button class="btn" data-tpl="${i}" style="display:block;width:100%;text-align:left;margin-bottom:8px">${t.name}</button>`).join('')}<div class="formula-modal-actions"><button class="btn ghost" id="tpl-cancel">取消</button></div></div>`;
  document.body.appendChild(overlay);
  overlay.querySelectorAll('[data-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tpl = templates[parseInt(btn.dataset.tpl, 10)];
      area.focus();
      document.execCommand('insertHTML', false, tpl.html + '<p></p>');
      renderMath(area);
      overlay.remove();
      toast('已插入模板', 'success');
    });
  });
  overlay.querySelector('#tpl-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ===== 导出 Markdown =====
function exportMarkdown(note) {
  let md = `# ${note.title || '无标题笔记'}\n\n`;
  const tmp = el('div', { html: note.content || '' });
  // 简易 HTML → MD
  const walk = (node, depth = 0) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) { md += child.textContent; return; }
      if (child.nodeType !== 1) return;
      const tag = child.tagName.toLowerCase();
      if (tag === 'h3') md += `\n### ${child.textContent}\n\n`;
      else if (tag === 'h4') md += `\n#### ${child.textContent}\n\n`;
      else if (tag === 'p') { walk(child); md += '\n\n'; }
      else if (tag === 'ul') { child.querySelectorAll(':scope > li').forEach((li) => md += `- ${li.textContent}\n`); md += '\n'; }
      else if (tag === 'ol') { let i = 1; child.querySelectorAll(':scope > li').forEach((li) => md += `${i++}. ${li.textContent}\n`); md += '\n'; }
      else if (tag === 'pre') md += `\n\`\`\`\n${child.textContent}\n\`\`\`\n\n`;
      else if (tag === 'blockquote') md += `\n> ${child.textContent}\n\n`;
      else if (tag === 'br') md += '\n';
      else walk(child, depth);
    });
  };
  walk(tmp);
  // 保留 $$ 公式
  md = md.replace(/\$\$/g, '$$');
  download(`${note.title || 'note'}.md`, md, 'text/markdown');
  toast('已导出 Markdown', 'success');
}

// ===== 知识框架图 =====
async function renderKnowledgeMap() {
  const subjectOpts = SUBJECTS.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
  const chapterOpts = SUBJECTS[0].chapters.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');

  return `
    <div class="map-controls">
      <select id="map-subject">${subjectOpts}</select>
      <select id="map-chapter"><option value="">全部章节</option>${chapterOpts}</select>
      <button class="btn sm" id="map-expand-all">全部展开</button>
      <button class="btn sm" id="map-collapse-all">全部折叠</button>
      <button class="btn sm" id="map-export-img">导出图片</button>
      <button class="btn sm" id="map-print">打印</button>
    </div>
    <div class="knowledge-map" id="knowledge-map-content"></div>`;
}

function bindMapEvents(content) {
  const subjectSel = $('#map-subject', content);
  const chapterSel = $('#map-chapter', content);
  renderMap(content, subjectSel.value, chapterSel.value);

  subjectSel.addEventListener('change', () => {
    const subj = getSubjectData(subjectSel.value);
    chapterSel.innerHTML = '<option value="">全部章节</option>' + (subj ? subj.chapters.map((c) => `<option value="${c.id}">${c.name}</option>`).join('') : '');
    renderMap(content, subjectSel.value, '');
  });
  chapterSel.addEventListener('change', () => renderMap(content, subjectSel.value, chapterSel.value));

  content.querySelector('#map-expand-all')?.addEventListener('click', () => {
    content.querySelectorAll('.map-children').forEach((c) => c.classList.remove('collapsed'));
    content.querySelectorAll('.node-toggle').forEach((t) => t.textContent = '▼');
  });
  content.querySelector('#map-collapse-all')?.addEventListener('click', () => {
    content.querySelectorAll('.map-children').forEach((c) => c.classList.add('collapsed'));
    content.querySelectorAll('.node-toggle').forEach((t) => t.textContent = '▶');
  });
  content.querySelector('#map-export-img')?.addEventListener('click', async () => {
    const target = $('#knowledge-map-content', content);
    if (!target || !window.html2canvas) { toast('图片库未加载', 'error'); return; }
    toast('生成中...', 'info');
    try {
      const canvas = await window.html2canvas(target, { backgroundColor: '#0f172a', scale: 2 });
      const url = canvas.toDataURL('image/png');
      const a = el('a', { attrs: { href: url, download: 'knowledge-map.png' } });
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('已导出图片', 'success');
    } catch (e) {
      toast('导出失败：' + e.message, 'error');
    }
  });
  content.querySelector('#map-print')?.addEventListener('click', () => window.print());
}

function renderMap(content, subjectId, chapterId) {
  const subj = getSubjectData(subjectId);
  const container = $('#knowledge-map-content', content);
  if (!subj || !container) return;
  const chapters = chapterId ? subj.chapters.filter((c) => c.id === chapterId) : subj.chapters;

  let html = `<ul class="map-tree"><li class="map-node subject-level root" style="--accent:${subj.color}">
    <div class="node-content"><span class="node-toggle">▼</span><span class="node-label">${subj.icon} ${subj.name}</span></div>
    <ul class="map-children">`;
  chapters.forEach((c) => {
    html += `<li class="map-node chapter-level" style="--accent:${subj.color}">
      <div class="node-content"><span class="node-toggle">▼</span><span class="node-label">${c.name} <span style="color:var(--text3);font-size:12px">(${c.questionTypes.length})</span></span></div>
      <ul class="map-children">`;
    c.questionTypes.forEach((t) => {
      html += `<li class="map-node" style="--accent:${subj.color}">
        <div class="node-content" data-type="${t.id}">
          <span class="node-toggle">·</span>
          <span class="node-badge">${t.badge || ''}</span>
          <span class="node-label">${t.title}</span>
          ${t.difficulty ? `<span class="difficulty-badge ${t.difficulty}">${t.difficulty}</span>` : ''}
        </div>
      </li>`;
    });
    html += `</ul></li>`;
  });
  html += `</ul></li></ul>`;
  container.innerHTML = html;

  // 折叠交互
  container.querySelectorAll('.node-content').forEach((nc) => {
    nc.addEventListener('click', (e) => {
      const toggle = nc.querySelector('.node-toggle');
      const children = nc.nextElementSibling;
      if (!children || !children.classList.contains('map-children')) {
        // 叶子节点 → 跳转题型详情
        if (nc.dataset.type) { navigate('/type/' + nc.dataset.type); }
        return;
      }
      children.classList.toggle('collapsed');
      if (toggle) toggle.textContent = children.classList.contains('collapsed') ? '▶' : '▼';
    });
  });
}
