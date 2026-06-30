# UniExamWeb - 考研四科冲刺复习平台

> 基于认知神经科学原理设计的考研复习平台，整合高等数学II、线性代数、微观经济学、数据结构四门学科，提供章节学习、记忆巩固、题型索引、复习总结四大核心功能。

## 📚 项目概述

### 核心功能

| 功能模块 | 描述 | 技术特点 |
|---------|------|---------|
| **章节学习** | 按学科章节浏览题型卡片，标记已学和收藏 | 渐进式展开、进度追踪、跨学科关联 |
| **闪卡复习** | 基于艾宾浩斯记忆曲线的间隔重复系统 | 主动回忆、难度分级、遗忘曲线调度 |
| **自测练习** | 选择题、填空题等多种题型自测 | 即时反馈、错题记录、正确率统计 |
| **复习笔记** | 富文本笔记 + 知识框架图 | 公式插入、导出打印、知识图谱 |
| **记忆仪表盘** | 复习曲线、热力图、统计分析 | Canvas 可视化、学习数据分析 |
| **7天冲刺计划** | 科学安排的复习日程 | 按遗忘曲线设计、每日任务清单 |
| **公式速查** | 四科必背公式汇总 | 学科切换、快速检索 |

### 覆盖学科

- 🧮 **高等数学 II**：定积分、微分方程、多元微分、二重积分、级数
- 📐 **线性代数**：行列式、矩阵、方程组、特征值、二次型
- 📈 **微观经济学**：消费者理论、生产者理论、市场结构、福利分析
- 🌳 **数据结构**：线性表、树、图、排序、查找、算法设计

### 技术栈

- **前端**：原生 HTML5 + CSS3 + JavaScript (ES6+)
- **数据存储**：IndexedDB（本地持久化）+ localStorage（状态管理）
- **公式渲染**：KaTeX（客户端 LaTeX 渲染）
- **测试**：Chrome DevTools Protocol（端到端测试）

## 🚀 快速开始

### 环境要求

- **操作系统**：Windows 10/11、macOS 或 Linux
- **浏览器**：Chrome ≥ 100、Firefox ≥ 95、Safari ≥ 15、Edge ≥ 100
- **Node.js**：≥ 18（用于运行测试脚本）

### 本地启动

#### 方式一：VS Code Live Server（推荐）

1. 在 VS Code 中打开项目根目录
2. 安装 **Live Server** 插件
3. 右键 `index.html` → **Open with Live Server**
4. 浏览器自动打开 `http://127.0.0.1:5500/`

#### 方式二：Python 内置服务器

```bash
# Python 3
cd "大学学习网站"
python -m http.server 8000
```

然后访问 `http://localhost:8000/`

#### 方式三：Node.js 服务器

```bash
cd "大学学习网站"
npx http-server -p 8000
```

### 考研冲刺复习中心

项目还包含一个独立的冲刺复习中心页面：

```bash
# 启动后访问
http://localhost:8000/考研冲刺复习中心.html
```

## 📖 使用指南

### 章节学习

1. 点击顶部学科标签（高数二、线代、微经、数据结构）
2. 在左侧章节导航中选择章节
3. 点击题型卡片展开查看详细内容
4. 使用"标记已学"和"收藏"按钮管理学习进度

### 闪卡复习

1. 点击"🔄 闪卡"进入闪卡模式
2. 选择学科或全部学科混合
3. 点击卡片翻转查看答案
4. 根据回忆程度点击评分按钮（不会/困难/记得）
5. 系统会按遗忘曲线安排下次复习时间

### 自测练习

1. 点击"✏️ 自测练习"进入自测模式
2. 选择学科或全部学科混合
3. 点击选项作答，系统即时反馈对错
4. 查看解析和正确率统计

### 复习笔记

1. 点击"📝 笔记"进入笔记系统
2. 创建新笔记或查看现有笔记
3. 使用工具栏插入公式和格式化文本
4. 生成知识框架图并导出

### 公式速查

1. 点击"📐 公式速查"进入公式页面
2. 使用顶部按钮切换学科
3. 浏览公式表，点击查看详情

## 🧪 测试

### 运行端到端测试

```bash
cd tests
npm install
npm test
```

测试内容包括：
- 题库页面加载验证
- LaTeX 公式渲染检查
- 选择题选项点击功能
- 收藏功能测试
- 计算题作答流程
- 错题记录验证

### LaTeX 公式校验

```bash
cd tests
npm run validate
```

## 📁 项目结构

```
大学学习网站/
├── index.html                    # 主应用入口
├── 考研冲刺复习中心.html          # 独立冲刺复习页面
├── assets/
│   ├── css/                      # 样式文件
│   │   ├── base.css              # 基础样式
│   │   ├── chapters.css          # 章节学习样式
│   │   ├── memory.css            # 记忆仪表盘样式
│   │   ├── notes.css             # 笔记系统样式
│   │   └── question-bank.css     # 题库样式
│   ├── js/                       # 应用逻辑
│   │   ├── app.js                # 路由与初始化
│   │   ├── utils.js              # 工具函数与公式渲染
│   │   ├── store.js              # IndexedDB 数据层
│   │   ├── ebbinghaus.js         # 艾宾浩斯遗忘曲线
│   │   └── modules/
│   │       ├── chapter-system.js # 章节学习模块
│   │       ├── memory-system.js  # 记忆巩固模块
│   │       ├── notes-system.js   # 笔记模块
│   │       └── question-index.js # 题库模块
│   └── data/                     # 学科数据
│       ├── gaoshu.js             # 高等数学II
│       ├── xiandai.js            # 线性代数
│       ├── weijing.js            # 微观经济学
│       ├── datastruct.js         # 数据结构
│       ├── formulas.js           # 公式数据
│       └── quizzes.js            # 自测题数据
├── tests/                        # 测试工程
│   ├── e2e.test.js               # 端到端测试
│   ├── visual.test.js            # 视觉回归测试
│   ├── validate-latex.js         # LaTeX 校验
│   └── cdp.js                    # Chrome DevTools Protocol
└── docs/                         # 文档
    ├── VERIFICATION_REPORT.md    # 验证报告
    ├── DEPLOY.md                 # 部署文档
    └── FORMULA_RENDERING.md      # 公式渲染说明
```

## 🤝 贡献指南

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

| 类型 | 说明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修复 Bug |
| `docs` | 文档更新 |
| `style` | 样式调整 |
| `refactor` | 代码重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具更新 |

### 开发流程

1. Fork 仓库
2. 创建功能分支：`git checkout -b feat/feature-name`
3. 提交代码：`git commit -m "feat: 描述功能"`
4. 推送到远程：`git push origin feat/feature-name`
5. 创建 Pull Request

### 代码风格

- 使用 2 空格缩进
- 使用单引号而非双引号
- 变量命名使用 camelCase
- 函数命名使用 camelCase
- 常量命名使用 UPPER_CASE

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- **KaTeX**：用于数学公式渲染
- **艾宾浩斯记忆曲线**：用于闪卡复习调度
- **Chrome DevTools Protocol**：用于端到端测试

---

**祝学习顺利！🎯**

如有问题或建议，欢迎提交 Issue 或 Pull Request。