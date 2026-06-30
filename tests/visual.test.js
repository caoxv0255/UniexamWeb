// 视觉回归测试：对题库区域截图并进行像素级对比
import { createServer } from 'http';
import { readFile, writeFile, access } from 'fs/promises';
import { dirname, resolve, extname } from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { launchChrome, CDP, sleep } from './cdp.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = process.env.TEST_PORT || 8766;
const BASE_URL = `http://localhost:${PORT}`;
const BASELINE = resolve(__dirname, 'baselines', 'bank-content.png');
const CURRENT = resolve(__dirname, 'diffs', 'bank-content-current.png');
const DIFF = resolve(__dirname, 'diffs', 'bank-content-diff.png');

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

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function run() {
  const server = await startServer();
  const { proc, wsUrl } = await launchChrome(9224);
  const cdp = new CDP(wsUrl);
  await cdp.open();
  await cdp.enableDomains();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  try {
    await cdp.navigate(`${BASE_URL}/#/bank`);
    await cdp.waitFor('.bank-card', 12000);
    await sleep(800);

    const pngBuf = await cdp.screenshot('#bank-content');
    await writeFile(CURRENT, pngBuf);

    if (!(await exists(BASELINE))) {
      await writeFile(BASELINE, pngBuf);
      console.log('✅ 基线不存在，已生成:', BASELINE);
      return;
    }

    const img1 = PNG.sync.read(await readFile(BASELINE));
    const img2 = PNG.sync.read(pngBuf);

    if (img1.width !== img2.width || img1.height !== img2.height) {
      throw new Error(`尺寸不一致：基线 ${img1.width}x${img1.height}，当前 ${img2.width}x${img2.height}`);
    }

    const diff = new PNG({ width: img1.width, height: img1.height });
    const threshold = 0.1; // 颜色阈值
    const diffCount = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold });
    await writeFile(DIFF, PNG.sync.write(diff));

    const totalPixels = img1.width * img1.height;
    const diffPct = (diffCount / totalPixels) * 100;
    const maxAllowedPct = 0.1;

    console.log(`像素差异：${diffCount}/${totalPixels} (${diffPct.toFixed(4)}%)`);
    if (diffPct > maxAllowedPct) {
      throw new Error(`视觉差异超过阈值 ${maxAllowedPct}%：${diffPct.toFixed(4)}%，diff 图：${DIFF}`);
    }
    console.log('✅ 视觉回归通过');
  } finally {
    try { await cdp.close(); } catch {}
    proc.kill();
    server.close();
  }
}

run().catch((e) => {
  console.error('\n❌ 视觉测试失败:', e.message);
  process.exit(1);
});
