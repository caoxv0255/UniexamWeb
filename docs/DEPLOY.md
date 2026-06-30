# UniExamWeb 部署文档

## 系统要求

### 开发环境
- **操作系统**: Windows 10/11 (64位), macOS 10.15+, Linux (Ubuntu 20.04+)
- **Node.js**: ≥ 18.0.0
- **npm**: ≥ 9.0.0 或 yarn ≥ 1.22.0
- **Git**: ≥ 2.30.0

### 生产环境

| 部署方式 | 最低配置 | 推荐配置 |
|---------|---------|---------|
| **Web 服务器** | 1核1GB RAM | 2核4GB RAM |
| **Docker 容器** | 1核512MB RAM | 1核2GB RAM |
| **Electron 桌面** | 2核4GB RAM | 4核8GB RAM |

### 浏览器支持

| 浏览器 | 最低版本 | 说明 |
|-------|---------|------|
| Chrome | 90+ | 推荐 |
| Edge | 90+ | 推荐 |
| Firefox | 88+ | 支持 |
| Safari | 14+ | 支持 |

---

## 项目结构

```
UniExamWeb/
├── index.html                    # 应用入口
├── package.json                  # 项目依赖与脚本配置
├── vite.config.js                # Vite 构建配置
├── Dockerfile                    # Docker 镜像配置
├── nginx.conf                    # Nginx 服务器配置
├── electron/                     # Electron 桌面应用
│   ├── main.js                   # 主进程
│   └── preload.js                # 预加载脚本
├── assets/
│   ├── css/                      # 样式文件
│   ├── js/                       # 应用逻辑
│   ├── data/                     # 题库数据
│   └── icons/                    # 应用图标
├── docs/                         # 文档
├── tests/                        # 自动化测试
└── dist/                         # 构建输出（自动生成）
```

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

访问: `http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

---

## 部署方式

### 方式一：静态文件部署

**适用场景**: 云存储 (S3, OSS)、CDN、共享主机

```bash
# 构建
npm run build

# 部署 dist/ 目录到任意静态服务器
```

**推荐服务器配置**:

- **Nginx**: 使用 `nginx.conf` 配置
- **Apache**: 配置 `.htaccess` 支持 SPA 路由
- **GitHub Pages**: 确保项目使用 hash 路由 (`/#/`)

### 方式二：Docker 容器部署

**适用场景**: 服务器、云平台、CI/CD

```bash
# 构建并创建镜像
npm run docker:build

# 运行容器
npm run docker:run

# 或手动运行
docker run -d -p 80:80 --name uniexam-web uniexam-web
```

**环境变量**:

| 变量名 | 默认值 | 说明 |
|-------|-------|------|
| PORT | 80 | 服务端口 |
| NODE_ENV | production | 运行环境 |

### 方式三：Electron 桌面应用

**适用场景**: Windows/macOS/Linux 桌面端

```bash
# 开发模式
npm run electron:dev

# 构建 Windows 安装包
npm run electron:build:win

# 构建 macOS 安装包
npm run electron:build:mac

# 构建 Linux 安装包
npm run electron:build:linux
```

**构建产物**:
- Windows: `dist/electron/UniExamWeb Setup.exe`
- macOS: `dist/electron/UniExamWeb.dmg`
- Linux: `dist/electron/UniExamWeb.deb` / `.rpm` / `.AppImage`

### 方式四：PWA 渐进式 Web 应用

**适用场景**: 移动端、离线使用

```bash
# 构建 PWA 版本
npm run build
```

PWA 特性:
- ✅ 离线访问支持
- ✅ 桌面图标安装
- ✅ 推送通知支持
- ✅ 自动更新

---

## CI/CD 集成

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 性能优化

### 代码分割

项目已配置自动代码分割，按模块拆分:

| 模块 | 文件 | 用途 |
|-----|------|------|
| katex | `katex-[hash].js` | LaTeX 公式渲染 |
| app | `app-[hash].js` | 应用入口 |
| store | `store-[hash].js` | 数据存储 |
| modules | `modules-[hash].js` | 功能模块 |
| data | `data-[hash].js` | 题库数据 |
| utils | `utils-[hash].js` | 工具函数 |

### 资源压缩

- JavaScript: Terser 压缩
- CSS: 自动压缩
- 图片: 按需加载
- 字体: Google Fonts 缓存

### 缓存策略

| 文件类型 | 缓存时间 | 策略 |
|---------|---------|------|
| HTML | 不缓存 | 版本检测 |
| JS/CSS | 1年 | 哈希命名 |
| 图片/字体 | 1年 | 哈希命名 |

---

## 数据管理

### 本地存储

应用使用以下本地存储:

| 存储类型 | 用途 | 容量限制 |
|---------|------|---------|
| IndexedDB | 学习进度、题库数据 | 无限制 |
| localStorage | 用户配置、状态 | 5MB |

### 数据备份

通过导航栏 **数据** 菜单:
- ✅ 导出备份 (JSON)
- ✅ 导入备份
- ✅ 清空全部数据

---

## 故障排查

### 常见问题

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 页面白屏 | JavaScript 错误 | 检查浏览器控制台 |
| 公式不渲染 | KaTeX 加载失败 | 检查网络连接 |
| 数据丢失 | IndexedDB 损坏 | 使用数据备份功能 |
| 构建失败 | 依赖缺失 | 删除 `node_modules` 重新安装 |
| Docker 端口冲突 | 80 端口被占用 | 修改端口映射 |

### 日志查看

```bash
# 开发模式日志
npm run dev

# Docker 日志
docker logs uniexam-web

# Electron 日志
# Windows: %APPDATA%\UniExamWeb\logs
# macOS: ~/Library/Logs/UniExamWeb
# Linux: ~/.config/UniExamWeb/logs
```

---

## 安全注意事项

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **CSP**: 配置内容安全策略
3. **XSS**: 已实现输入过滤
4. **敏感数据**: 所有数据仅存储在本地

---

## 版本更新

### 更新步骤

```bash
# 拉取最新代码
git pull origin main

# 安装更新依赖
npm install

# 重新构建
npm run build

# 重启服务/重新部署
```

### 更新策略

- **PWA**: 自动检测更新并提示用户
- **Electron**: 支持自动更新 (需配置)
- **Web**: 用户刷新页面即可获取最新版本