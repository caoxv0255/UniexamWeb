// Chrome DevTools Protocol 简单封装（Node 24 + headless Chrome）
import { spawn } from 'child_process';
import { resolve } from 'path';
import WebSocket from 'ws';

function findChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  }
  if (process.platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }
  return '/usr/bin/google-chrome';
}

export async function launchChrome(port = 9222) {
  const chromePath = findChromePath();
  const proc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--remote-debugging-port=' + port,
    '--window-size=1280,900',
    'about:blank',
  ], { stdio: 'ignore', detached: false });

  // 等待 DevTools HTTP 服务就绪
  const infoUrl = `http://127.0.0.1:${port}/json/version`;
  let info = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(infoUrl);
      if (res.ok) { info = await res.json(); break; }
    } catch {}
    await sleep(200);
  }
  if (!info) throw new Error('Chrome DevTools 未能启动');

  // 获取 page 调试端点（不能直接用 browser endpoint 发送 Runtime.enable）
  const listUrl = `http://127.0.0.1:${port}/json/list`;
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(listUrl);
      if (res.ok) {
        const pages = await res.json();
        const page = pages.find((p) => p.type === 'page');
        if (page && page.webSocketDebuggerUrl) { wsUrl = page.webSocketDebuggerUrl; break; }
      }
    } catch {}
    await sleep(200);
  }
  if (!wsUrl) throw new Error('未找到 Chrome page 调试端点');
  return { proc, wsUrl };
}

export class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl, { perMessageDeflate: false });
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
    this.closed = false;
    this.ws.on('message', (buf) => this.onMessage(buf));
    this.ws.on('error', (err) => console.error('CDP WebSocket error:', err.message));
  }

  async open() {
    return new Promise((res, rej) => {
      this.ws.once('open', res);
      this.ws.once('error', rej);
      setTimeout(() => rej(new Error('CDP 连接超时')), 10000);
    });
  }

  on(method, fn) {
    if (!this.events.has(method)) this.events.set(method, []);
    this.events.get(method).push(fn);
  }

  onMessage(buf) {
    const msg = JSON.parse(buf.toString());
    if (msg.id != null && this.pending.has(msg.id)) {
      const { resolve, reject } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
    if (msg.method && this.events.has(msg.method)) {
      this.events.get(msg.method).forEach((fn) => fn(msg.params));
    }
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      if (this.closed) return reject(new Error('CDP 已关闭'));
      const id = ++this.id;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP 调用超时: ${method}`));
        }
      }, 15000);
    });
  }

  async enableDomains() {
    await this.send('Runtime.enable');
    await this.send('Page.enable');
    await this.send('DOM.enable');
  }

  async navigate(url) {
    const loaded = new Promise((res) => {
      const handler = () => { this.ws.off ? null : null; res(); };
      const once = () => { res(); };
      this.on('Page.loadEventFired', once);
      setTimeout(() => res(), 5000); // 兜底
    });
    await this.send('Page.navigate', { url });
    await loaded;
    // 等待动态内容（hash 路由）
    await sleep(500);
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression: String(expression),
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || 'evaluate 异常');
    }
    return res.result?.value;
  }

  async call(fn, ...args) {
    const expr = `(${fn.toString()})(${args.map((a) => JSON.stringify(a)).join(',')})`;
    return this.evaluate(expr);
  }

  async waitFor(selector, timeout = 8000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const ok = await this.call((sel) => !!document.querySelector(sel), selector);
      if (ok) return true;
      await sleep(200);
    }
    throw new Error(`waitFor 超时: ${selector}`);
  }

  async click(selector) {
    return this.call((sel) => { const el = document.querySelector(sel); if (el) el.click(); return !!el; }, selector);
  }

  async type(selector, text) {
    return this.call((sel, val) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }, selector, text);
  }

  async screenshot(selector) {
    let clip = null;
    if (selector) {
      const rect = await this.call((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }, selector);
      if (rect && rect.width > 0 && rect.height > 0) clip = { ...rect, scale: 1 };
    }
    const res = await this.send('Page.captureScreenshot', { format: 'png', clip });
    return Buffer.from(res.data, 'base64');
  }

  async close() {
    this.closed = true;
    try { await this.send('Browser.close'); } catch {}
    this.ws.close();
  }
}

export function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }
