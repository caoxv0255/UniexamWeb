// 辅助函数（纯函数，无副作用）

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  if (props.class) node.className = props.class;
  if (props.text != null) node.textContent = props.text;
  if (props.html != null) node.innerHTML = props.html;
  if (props.style) Object.assign(node.style, props.style);
  if (props.dataset) Object.assign(node.dataset, props.dataset);
  if (props.attrs) for (const [k, v] of Object.entries(props.attrs)) node.setAttribute(k, v);
  if (props.on) for (const [evt, fn] of Object.entries(props.on)) node.addEventListener(evt, fn);
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

export function debounce(fn, ms = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function throttle(fn, ms = 100) {
  let last = 0, t;
  return (...args) => {
    const now = Date.now();
    const remain = ms - (now - last);
    if (remain <= 0) {
      last = now;
      fn(...args);
    } else {
      clearTimeout(t);
      t = setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, remain);
    }
  };
}

export function fmtDate(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function fmtDay(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

export function todayTs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function addDays(ts, n) {
  return ts + n * 86400000;
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function pct(part, total) {
  if (!total) return 0;
  return clamp(Math.round((part / total) * 100), 0, 100);
}

export function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function stripHtml(s) {
  const tmp = document.createElement('div');
  tmp.innerHTML = s;
  return tmp.textContent || '';
}

export function hash() {
  let h = location.hash.replace(/^#\/?/, '');
  return h ? h.split('/').map(decodeURIComponent) : [];
}

export function navigate(path) {
  location.hash = '#/' + path.replace(/^\//, '');
}

export function renderMath(root = document) {
  if (!root || (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE)) return;
  const doRender = (attempt = 0) => {
    if (!window.renderMathInElement || !window.katex) {
      if (attempt < 10) {
        setTimeout(() => doRender(attempt + 1), 100);
      }
      return;
    }
    try {
      window.renderMathInElement(root, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
        ],
        throwOnError: false,
        errorColor: '#ef4444',
      });
    } catch (e) {
      console.warn('KaTeX auto-render 失败', e);
    }
    manualRenderMath(root);
  };
  doRender();
}

function manualRenderMath(root) {
  if (!window.katex) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent || '';
    if (text.includes('$')) textNodes.push(node);
  }
  textNodes.forEach((node) => {
    const parent = node.parentNode;
    if (!parent) return;
    if (parent.closest && parent.closest('.katex, .katex-mathml, .math-error, .katex-display')) return;
    const raw = node.textContent;
    let changed = false;
    const html = raw
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
        changed = true;
        try {
          return `<span class="katex-display">${window.katex.renderToString(tex, { throwOnError: false, displayMode: true })}</span>`;
        } catch (e) {
          return `<span class="math-error" title="${escapeHtml(e.message)}">$$${escapeHtml(tex)}$$</span>`;
        }
      })
      .replace(/\$([^$\n]+?)\$/g, (_, tex) => {
        changed = true;
        try {
          return window.katex.renderToString(tex, { throwOnError: false, displayMode: false });
        } catch (e) {
          return `<span class="math-error" title="${escapeHtml(e.message)}">$${escapeHtml(tex)}$</span>`;
        }
      });
    if (!changed || html === raw) return;
    const span = document.createElement('span');
    span.innerHTML = html;
    parent.replaceChild(span, node);
  });
}

export function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.log(`[toast:${type}]`, msg);
    return;
  }
  const t = el('div', { class: `toast ${type}`, text: msg });
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity .3s';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

export function download(filename, text, mime = 'application/json') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = el('a', { attrs: { href: url, download: filename } });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
