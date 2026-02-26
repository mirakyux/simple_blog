# Simple Blog - 现代化博客平台 🚀

> 基于 React 19 + Vite + TailwindCSS 4 的轻量级博客系统，支持通过 GitHub API 在线写作和发布

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
- ✏️ **在线编辑** - 通过 GitHub API 直接提交（开发中）

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

访问 `/admin/write`，输入 GitHub Token，直接在浏览器中写作并提交到仓库！

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

# GitHub Token（在线编辑功能需要）
VITE_GITHUB_TOKEN="ghp_xxx"
VITE_GITHUB_REPO="mirakyux/simple_blog"

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
- [ ] 通过 GitHub API 提交
- [ ] 草稿箱功能

### Phase 4 - 完整 CMS ⬜
- [ ] 用户认证系统
- [ ] 文章管理后台
- [ ] 评论系统
- [ ] 媒体库（图片上传）

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
│  浏览器编辑器  │ ──→ │ GitHub API   │ ──→ │  仓库文件   │
│  (Markdown)  │     │  (REST API)  │     │ content/posts│
└─────────────┘     └──────────────┘     └─────────────┘
                            ↓
                     ┌──────────────┐
                     │ GitHub Actions│
                     │  自动构建部署  │
                     └──────────────┘
```

### 实现方案

**前端编辑器：**
- TipTap / Monaco Editor / SimpleMDE
- 实时预览
- 自动保存草稿（localStorage）

**GitHub API 提交：**
```typescript
// src/lib/github.ts
async function commitToGitHub(content: string, filename: string, token: string) {
  const repo = import.meta.env.VITE_GITHUB_REPO // e.g., "mirakyux/simple_blog"
  
  // 1. 获取当前文件的 SHA（如果是更新）
  const currentFile = await fetch(
    `https://api.github.com/repos/${repo}/contents/content/posts/${filename}`,
    { headers: { Authorization: `token ${token}` } }
  )
  
  const sha = currentFile.ok ? (await currentFile.json()).sha : null
  
  // 2. 提交文件
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/content/posts/${filename}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `feat: 发布文章 ${filename}`,
        content: btoa(unescape(encodeURIComponent(content))), // Base64 编码
        sha, // 如果是更新，需要提供 SHA
      }),
    }
  )
  
  return response.ok
}
```

**前端组件：**
```typescript
// src/components/admin/Editor.tsx
export function Editor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [token, setToken] = useState('')
  const [publishing, setPublishing] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const slug = generateSlug(title)
      const mdContent = `---
title: ${title}
date: ${new Date().toISOString()}
tags: []
description: 
---

${content}`
      
      await commitToGitHub(mdContent, `${slug}.md`, token)
      alert('发布成功！GitHub Actions 将自动构建部署')
    } catch (error) {
      alert('发布失败：' + error.message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="editor-container">
      <input
        type="password"
        placeholder="GitHub Token (需要 repo 权限)"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      
      <input
        type="text"
        placeholder="文章标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <MDEditor value={content} onChange={setContent} />
      
      <button onClick={handlePublish} disabled={publishing}>
        {publishing ? '提交中...' : '发布到 GitHub'}
      </button>
    </div>
  )
}
```

---

## 🔐 GitHub Token 权限说明

### 需要的权限

创建 Token 时勾选以下权限：

- ✅ **`repo`** - 完全控制私有仓库（必须）
  - `repo:status`
  - `repo_deployment`
  - `public_repo`
  - `repo:invite`
  - `security_events`

### 创建步骤

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 填写备注（如 "Blog Editor"）
4. 勾选 **`repo`** 权限
5. 点击 **Generate token**
6. **复制并保存 Token**（只显示一次！）

### 安全建议

- ⚠️ **不要将 Token 提交到仓库**
- ✅ 使用环境变量存储
- ✅ 定期轮换 Token
- ✅ 设置 Token 过期时间

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

_Built with ❤️ by mirakyux_
