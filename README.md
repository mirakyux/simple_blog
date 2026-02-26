# Simple Blog - 现代化博客平台 🚀

> 基于 React 19 + Vite + TailwindCSS 4 的轻量级博客系统，支持在线编辑和即时发布

[在线演示](https://blog.mirakyux.com) · [部署指南](#部署到-cloudflare-pages) · [功能路线](#-功能路线)

---

## ✨ 核心特性

- ⚡ **快速构建** - Vite 驱动的极速开发体验
- 📝 **Markdown 支持** - 原生 Markdown 写作，自动解析
- 🎨 **TailwindCSS 4** - 现代化原子化 CSS
- 🤖 **AI 增强** - 集成 Gemini/OpenAI，支持 AI 辅助写作
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔄 **自动部署** - GitHub Actions + Cloudflare Pages CI/CD
- 📰 **RSS 订阅** - 自动生成 RSS Feed
- 🔍 **全文搜索** - Fuse.js 本地搜索
- ✏️ **在线编辑** - 浏览器直接写作和发布（开发中）

---

## 🏗️ 项目结构

```
simple_blog/
├── content/posts/          # Markdown 文章内容
├── public/                 # 静态资源
├── scripts/
│   ├── generate-posts.ts   # 文章索引生成脚本
│   └── enhance-post.ts     # AI 增强脚本
├── src/
│   ├── components/         # React 组件
│   ├── data/              # 数据层（文章解析）
│   ├── lib/               # 工具函数
│   ├── assets/            # 资源文件
│   ├── App.tsx            # 主应用入口
│   ├── main.tsx           # React 入口
│   └── index.css          # 全局样式
├── .github/workflows/      # GitHub Actions
├── .env.example           # 环境变量模板
└── vite.config.ts         # Vite 配置
```

---

## 🚀 快速开始

### 本地开发

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器（自动构建文章索引）
pnpm run dev

# 3. 访问 http://localhost:5173
```

### 编写文章

**方式一：本地 Markdown 文件**

在 `content/posts` 目录下创建 `.md` 文件：

```markdown
---
title: 我的第一篇文章
date: 2026-02-26
tags: [React, TypeScript]
description: 这是一篇文章的描述
---

这里是文章内容...
```

**方式二：在线编辑器（开发中）**

访问 `/admin/write` 直接在浏览器中写作和发布！

### AI 增强文章

```bash
pnpm run enhance <post-file>
```

---

## ⚙️ 配置

创建 `.env` 文件（参考 `.env.example`）：

```bash
# 站点信息
VITE_SITE_TITLE="我的个人博客"
VITE_SITE_DESCRIPTION="记录技术与生活的点滴"
VITE_SITE_URL="https://blog.mirakyux.com"

# 作者信息
VITE_AUTHOR_NAME="Your Name"
VITE_AUTHOR_EMAIL="your@email.com"

# AI 配置（可选）
OPENAI_API_KEY="sk-xxx"
GEMINI_API_KEY="xxx"

# 其他配置
VITE_LANGUAGE="zh-CN"
VITE_NAV_LINKS='[{"label":"首页","url":"/"},{"label":"关于","url":"/about"}]'
```

---

## 📦 部署到 Cloudflare Pages

### 方式一：Git 直连（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 点击 **Connect to Git**，选择 `mirakyux/simple_blog`
4. 配置构建设置：
   - **Framework preset**: `Vite`
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist`
   - **Node version**: `20`

5. 添加环境变量（从 `.env.example` 复制）
6. 点击 **Save and Deploy** 🎉

### 方式二：Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist --project-name=simple-blog
```

---

## 🛣️ 功能路线

### Phase 1 - 基础功能 ✅
- [x] Markdown 文章解析
- [x] 响应式设计
- [x] RSS 订阅
- [x] 全文搜索（Fuse.js）

### Phase 2 - 技术栈升级 ✅
- [x] React 19
- [x] TailwindCSS 4
- [x] AI 辅助写作（Gemini/OpenAI）

### Phase 3 - 在线编辑器 🔄
- [ ] 浏览器端 Markdown 编辑器
- [ ] 实时预览
- [ ] 草稿箱功能
- [ ] 一键发布到 Cloudflare D1

### Phase 4 - 完整 CMS ⬜
- [ ] 用户认证系统
- [ ] 文章管理后台
- [ ] 评论系统
- [ ] 媒体库（图片上传）
- [ ] 主题切换

### Phase 5 - Cloudflare 集成 ⬜
- [ ] D1 数据库（文章存储）
- [ ] KV 缓存（提升性能）
- [ ] R2 对象存储（图片管理）
- [ ] Workers AI（边缘 AI）

---

## 🔧 技术栈详情

### 核心
- **React 19** - 最新版本，性能优化
- **Vite 7** - 极速构建工具
- **TailwindCSS 4** - 原子化 CSS
- **TypeScript 5.9** - 类型安全

### UI 组件
- **Radix UI** - 无头组件库
- **Lucide React** - 图标库
- **Framer Motion** - 动画库
- **Shadcn** - 组件模板

### Markdown
- **React Markdown** - Markdown 渲染
- **Remark GFM** - GitHub 风格 Markdown
- **Rehype Highlight** - 代码高亮
- **KaTeX** - 数学公式

### 工具
- **Fuse.js** - 模糊搜索
- **Gray Matter** - Frontmatter 解析
- **RSS** - 订阅源生成

---

## 💡 在线编辑功能设计

### 架构思路

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  浏览器编辑器  │ ──→ │ Cloudflare   │ ──→ │   D1 数据库  │
│  (Markdown)  │     │  Workers API │     │  (文章存储)  │
└─────────────┘     └──────────────┘     └─────────────┘
                            ↓
                     ┌──────────────┐
                     │  R2 对象存储  │
                     │  (图片上传)  │
                     └──────────────┘
```

### 实现方案

**前端编辑器：**
- TipTap / Monaco Editor
- 实时预览
- 自动保存草稿

**后端 API（Cloudflare Workers）：**
```typescript
// POST /api/posts
export async function POST(req: Request, env: Env) {
  const { title, content, tags } = await req.json()
  
  // 保存到 D1
  await env.DB.prepare(`
    INSERT INTO posts (title, content, tags, published_at)
    VALUES (?, ?, ?, ?)
  `).bind(title, content, JSON.stringify(tags), new Date())
  
  return new Response('Published!')
}
```

**数据库表结构：**
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

_Built with ❤️ by mirakyux_
