// 端到端浏览器测试：题库加载、筛选、答题、收藏、错题、公式渲染
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { dirname, resolve, extname, join } from 'path';
import { fileURLToPath } from 'url';
import { launchChrome, CDP, sleep } from './cdp.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = process.env.TEST_PORT || 8765;
const BASE_URL = `http://localhost:${PORT}`;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function startServer() {
  return new Promise((res) => {
    const server = createServer(async (req, res) => {
      try {
        const pathname = decodeURIComponent(new URL(req.url, `http://localhost`).pathname);
        const file = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
        const filePath = resolve(ROOT, file);
        if (!filePath.startsWith(ROOT)) { res.statusCode = 403; res.end(); return; }
        const data = await readFile(filePath);
        const ext = extname(filePath);
        res.setHeader('Content-Type', (MIME[ext] || 'application/octet-stream') + '; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(data);
      } catch {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });
    server.listen(PORT, () => res(server));
  });
}

function assert(cond, msg) {
  if (!cond) throw new Error('断言失败: ' + msg);
}

async function injectErrorCapture(cdp) {
  await cdp.evaluate(`
    window.__testErrors = window.__testErrors || [];
    if (!window.__testErrorsBound) {
      window.__testErrorsBound = true;
      window.addEventListener('error', (e) => window.__testErrors.push(e.message));
      window.addEventListener('unhandledrejection', (e) => window.__testErrors.push('unhandledrejection:' + (e.reason?.message || String(e.reason))));
    }
  `);
}

async function run() {
  const server = await startServer();
  console.log('本地测试服务器已启动:', BASE_URL);

  const { proc, wsUrl } = await launchChrome(9223);
  const cdp = new CDP(wsUrl);
  await cdp.open();
  await cdp.enableDomains();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  try {
    // 1. 访问题库页
    await cdp.navigate(`${BASE_URL}/#/bank`);
    await injectErrorCapture(cdp);
    await cdp.waitFor('.bank-card', 12000);
    await sleep(2000); // 等待 CDN 公式渲染

    const totalCards = await cdp.call(() => document.querySelectorAll('.bank-card').length);
    assert(totalCards > 0, '题库页应显示题目卡片');
    console.log('✅ 题库页加载，题目卡片数:', totalCards);

    const katexStatus = await cdp.call(() => ({ katex: !!window.katex, autoRender: !!window.renderMathInElement }));
    console.log('KaTeX 加载状态:', katexStatus);

    // 展开第一道题目，使题干/答案中的公式进入 DOM 并触发渲染
    await cdp.click('.bank-card .bank-card-head');
    await sleep(600);

    const katexCount = await cdp.call(() => document.querySelectorAll('.katex').length);
    const mathErrorCount = await cdp.call(() => document.querySelectorAll('.math-error').length);
    console.log(`公式渲染检查：katex=${katexCount}, math-error=${mathErrorCount}`);
    assert(katexCount > 0, '页面应存在渲染后的 .katex 节点');
    assert(mathErrorCount === 0, '页面不应存在 .math-error 节点');
    console.log('✅ 公式渲染检查通过');

    // 2. 按题型筛选（填空题）
    await cdp.click('.chip[data-qtype="fill"]');
    await sleep(400);
    const fillCards = await cdp.call(() => document.querySelectorAll('.bank-card').length);
    assert(fillCards > 0 && fillCards < totalCards, '填空题筛选结果应在合理范围内');
    console.log('✅ 填空题筛选结果:', fillCards);

    // 3. 收藏一题
    await cdp.click('.bank-card [data-fav]');
    await sleep(400);
    await cdp.click('.bank-tab[data-view="favorites"]');
    await sleep(400);
    const favCount = await cdp.call(() => document.querySelectorAll('.bank-card').length);
    assert(favCount === 1, '收藏夹应显示 1 道题目');
    console.log('✅ 收藏功能正常');

    // 4. 自测：选择计算题，提交后查看解析并自评低分，验证错题记录
    await cdp.click('.bank-tab[data-view="quiz"]');
    await sleep(300);
    await cdp.click('.chip[data-q-type="calculation"]');
    await sleep(200);
    await cdp.click('[data-quiz-start]');
    await sleep(500);

    await cdp.waitFor('#quiz-answer', 5000);
    await cdp.type('#quiz-answer', '作答示例');
    await cdp.click('#quiz-submit');
    await sleep(500);
    await cdp.waitFor('#quiz-feedback .quiz-explain', 5000);
    // 自评 0 分以触发错题记录
    await cdp.type('#self-score', '0');
    await cdp.click('#quiz-next');
    await sleep(500);
    console.log('✅ 计算题作答、反馈与错题记录流程正常');

    // 5. 自测：选择题点击选项测试
    // 先完成之前的计算题测试（通过点击重新开始按钮回到筛选界面）
    await cdp.click('.bank-tab[data-view="quiz"]');
    await sleep(300);
    
    // 检查是否需要先完成当前测试
    const hasResetBtn = await cdp.call(() => !!document.querySelector('[data-quiz-reset]'));
    if (hasResetBtn) {
      await cdp.click('[data-quiz-reset]');
      await sleep(500);
    }
    
    const afterReset = await cdp.call(() => {
      const chips = document.querySelectorAll('[data-q-type]');
      const active = [];
      chips.forEach(c => { if(c.classList.contains('active')) active.push(c.dataset.qType); });
      return active;
    });
    console.log('Active types after reset:', afterReset);

    // 检查页面上有哪些 chip 元素
    const allChips = await cdp.call(() => {
      const chips = document.querySelectorAll('[data-q-type]');
      const info = [];
      chips.forEach(c => {
        info.push({ type: c.dataset.qType, active: c.classList.contains('active'), text: c.textContent.trim() });
      });
      return info;
    });
    console.log('All type chips:', JSON.stringify(allChips, null, 2));

    await cdp.click('[data-q-type="choice"]');
    await sleep(200);
    
    const afterChoice = await cdp.call(() => {
      const chips = document.querySelectorAll('[data-q-type]');
      const active = [];
      chips.forEach(c => { if(c.classList.contains('active')) active.push(c.dataset.qType); });
      return active;
    });
    console.log('Active types after choosing choice:', afterChoice);

    await cdp.click('[data-quiz-start]');
    await sleep(500);

    const pageContent = await cdp.call(() => document.querySelector('#bank-content')?.innerHTML?.substring(0, 500));
    console.log('Bank content after choice quiz start:', pageContent);
    const optCount = await cdp.call(() => document.querySelectorAll('#quiz-options .quiz-opt').length);
    console.log('Option count:', optCount);

    await cdp.waitFor('#quiz-options .quiz-opt', 5000);
    await cdp.click('#quiz-options .quiz-opt[data-opt="0"]');
    await sleep(500);
    const selectedOpt = await cdp.call(() => {
      const opt = document.querySelector('#quiz-options .quiz-opt[data-opt="0"]');
      return opt ? opt.classList.contains('correct') || opt.classList.contains('wrong') : false;
    });
    assert(selectedOpt, '选择题选项点击后应标记 correct 或 wrong 类');
    console.log('✅ 选择题选项点击功能正常');

    // 进入错题本
    await cdp.navigate(`${BASE_URL}/#/wrong`);
    await sleep(500);
    const wrongCount = await cdp.call(() => document.querySelectorAll('.wrong-item').length);
    assert(wrongCount > 0, '错题本应记录答错的题目');
    console.log('✅ 错题本记录数:', wrongCount);

    // 5. 最终错误检查
    const errors = await cdp.call(() => window.__testErrors || []);
    if (errors.length) {
      console.error('❌ 页面运行时发现错误:', errors);
      throw new Error('页面存在运行时错误');
    }
    console.log('✅ 无运行时错误');

    console.log('\n🎉 端到端测试全部通过');
  } finally {
    try { await cdp.close(); } catch {}
    proc.kill();
    server.close();
  }
}

run().catch((e) => {
  console.error('\n❌ 测试失败:', e.message);
  process.exit(1);
});
