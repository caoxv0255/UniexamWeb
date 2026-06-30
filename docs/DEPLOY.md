# 综合在线题库系统部署文档

## 环境要求

- **操作系统**：Windows 10/11、macOS 或 Linux
- **浏览器**：Google Chrome（测试脚本需要 Chrome DevTools Protocol）
- **Node.js**：≥ 18（测试脚本使用 ES Module 与原生 `fetch`）
- **可选**：VS Code + Live Server 插件，或 Python 3，用于启动本地静态服务器

## 项目结构

```
大学学习网站/
├── index.html                 # 应用入口
├── assets/
│   ├── css/                   # 样式文件
│   ├── js/                    # 应用逻辑
│   │   ├── app.js             # 路由与初始化
│   │   ├── utils.js           # 工具函数与公式渲染
│   │   ├── store.js           # IndexedDB 数据层
│   │   └── modules/
│   │       ├── question-index.js  # 题库模块
│   │       ├── chapter-system.js  # 章节学习
│   │       ├── memory-system.js   # 记忆巩固
│   │       └── notes-system.js    # 笔记
│   └── data/
│       └── quizzes.js         # 题库数据（88 道）
├── tests/                     # 自动化测试工程
│   ├── package.json
│   ├── cdp.js                 # Chrome DevTools Protocol 封装
│   ├── validate-latex.js      # LaTeX 公式离线校验
│   ├── e2e.test.js            # 端到端浏览器测试
│   └── visual.test.js         # 视觉回归测试
└── docs/                      # 交付文档
```

## 启动本地服务器

### 方式一：VS Code Live Server（推荐）

1. 在 VS Code 中打开本项目根目录。
2. 安装 **Live Server** 插件。
3. 右键 `index.html` → **Open with Live Server**。
4. 浏览器自动打开 `http://127.0.0.1:5500/`（端口以实际为准）。

### 方式二：Python 内置服务器

```bash
# Python 3
cd 大学学习网站
python -m http.server 8000
```

访问：`http://localhost:8000/`

### 方式三：Node.js 静态服务器

```bash
cd 大学学习网站
npx serve -l 8000
```

## 测试工程准备

```bash
cd tests
npm install
```

依赖包括：
- `katex`：LaTeX 公式语法校验
- `pixelmatch` + `pngjs`：截图像素对比
- `ws`：Chrome DevTools WebSocket 通信
- `tesseract.js`（可选）：图像识别 OCR

## 运行测试

```bash
cd tests

# 1. LaTeX 公式离线校验
npm run validate

# 2. 端到端浏览器测试
npm test

# 3. 视觉回归测试（首次运行会生成基线）
npm run visual
```

## 访问地址

开发/生产预览：`http://localhost:8000/`

主要路由：
- `/#/`：首页学科仪表盘
- `/#/bank`：综合题库
- `/#/favorites`：收藏题目
- `/#/wrong`：错题本
- `/#/flashcard`：闪卡复习
- `/#/memory`：记忆仪表盘
- `/#/notes`：复习笔记
- `/#/help`：帮助引导

## 数据说明

- 所有学习进度、收藏、错题、笔记均保存在浏览器本地 **IndexedDB** 与 **localStorage** 中。
- 顶部导航 **数据 ▾** 提供导出备份、导入备份、清空全部数据功能。
- 首次访问会弹出 4 步引导，完成后不再显示。
