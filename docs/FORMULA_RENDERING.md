# 公式渲染解决方案及实施说明

## 1. 问题背景

题库系统包含大量数学、经济学、数据结构公式（如定积分、矩阵、需求函数、时间复杂度等）。早期实现中，公式由 KaTeX 自动渲染，但存在以下问题：

- 动态注入的题目内容（如点击展开题目详情、筛选结果）出现时，KaTeX `auto-render` 尚未加载完成，导致公式漏渲染。
- 公式语法错误无法直观定位。
- 部分自定义文本节点中的 `$...$` 未被 `renderMathInElement` 处理。

## 2. 技术选型

采用 [KaTeX](https://katex.org/) 作为公式渲染引擎，原因：

- 体积小、渲染速度快
- 支持纯前端无服务器依赖
- 提供 `renderMathInElement` 自动识别定界符
- 提供 `katex.renderToString` 用于手动兜底和离线校验

CDN 引入（见 `index.html`）：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
```

## 3. 当前修复方案

修复代码位于 `assets/js/utils.js` 中的 `renderMath` 函数。

### 3.1 轮询等待 KaTeX 加载

`katex.min.js` 与 `auto-render.min.js` 均为 `defer` 加载，动态内容可能在库就绪前渲染。`renderMath` 内部轮询最多 10 次（每次 100ms），等待 `window.renderMathInElement` 与 `window.katex` 可用：

```js
const doRender = (attempt = 0) => {
  if (!window.renderMathInElement || !window.katex) {
    if (attempt < 10) setTimeout(() => doRender(attempt + 1), 100);
    return;
  }
  // ...
};
```

### 3.2 手动兜底渲染

`manualRenderMath` 遍历指定根节点下的所有文本节点，对仍未被处理的 `$...$` / `$$...$$` 手动调用 `katex.renderToString`：

```js
function manualRenderMath(root) {
  if (!window.katex) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  // 收集含 $ 的文本节点并渲染...
}
```

兜底逻辑会跳过已被 `.katex`、`.katex-mathml`、`.math-error`、`.katex-display` 包裹的节点，避免重复渲染。

### 3.3 错误标记

当公式语法错误时，渲染失败的内容会被替换为带 `title` 提示的 `.math-error` 元素，便于快速定位：

```js
return `<span class="math-error" title="${escapeHtml(e.message)}">$${escapeHtml(tex)}$</span>`;
```

对应样式在 `assets/css/base.css`：

```css
.math-error {
  color: var(--red);
  border-bottom: 2px wavy var(--red);
  cursor: help;
}
```

## 4. 支持的定界符

| 定界符 | 模式 | 示例 |
|--------|------|------|
| `$...$` | 行内公式 | `$\int_0^1 x dx$` |
| `$$...$$` | 块级公式 | `$$\sum_{i=1}^n i = \frac{n(n+1)}{2}$$` |
| `\(...\)` | 行内公式（LaTeX 标准） | `\(\alpha + \beta\)` |
| `\[...\]` | 块级公式（LaTeX 标准） | `\[\begin{bmatrix}1&2\\3&4\end{bmatrix}\]` |

## 5. 常见公式写法与排坑

### 5.1 积分与微分

```latex
\int_{-a}^{a} \sqrt{a^2-x^2}\,dx
\frac{d}{dx}\int_0^x f(t)dt
```

注意微分 `dx` 前使用 `\,` 产生细小空格。

### 5.2 矩阵

```latex
\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}
```

### 5.3 分段函数

```latex
f(x) = \begin{cases} x, & x \ge 0 \\ -x, & x < 0 \end{cases}
```

### 5.4 经济学公式

```latex
MR = a - 2bQ \quad \text{（垄断边际收益）}
\frac{MU_x}{P_x} = \frac{MU_y}{P_y}
```

### 5.5 转义注意

在 JavaScript 字符串中，反斜杠需要双重转义：

```js
// JS 字符串中的 LaTeX
const tex = "\\int_0^1 x \\,dx";
```

## 6. 离线校验

测试脚本 `tests/validate-latex.js` 会遍历 `QUESTIONS` 中所有含公式的字段：

- `description`
- `answer`
- `answerDetail`
- `explain`
- `opts`（选择题选项）
- `rubric`（评分标准）

对提取出的每个公式块调用 `katex.renderToString(..., { throwOnError: true })`，任何语法错误都会输出题号、字段和错误信息。

运行命令：

```bash
cd tests
npm run validate
```

## 7. 浏览器端验证

端到端测试 `tests/e2e.test.js` 会打开题库页并检查：

- 页面存在 `.katex` 节点（公式已渲染）
- 页面不存在 `.math-error` 节点（无语法错误导致的渲染失败）

运行命令：

```bash
cd tests
npm test
```

## 8. 扩展：图像识别（可选）

`tests/package.json` 已将 `tesseract.js` 列为可选依赖。如需对公式截图进行 OCR 识别并与原始 LaTeX 源比对，可在 `tests/` 下新增脚本调用 Tesseract，读取截图中的文本并检查关键符号（如 `∫`、`Σ`、`α`）是否出现。本阶段以像素级 diff 为主，OCR 作为预留扩展点。
