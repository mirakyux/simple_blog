# 优化建议 - 参考 Flare Stack Blog

本文档提供从当前 Simple Blog 升级到更完善博客系统的路线图。

## 📁 目录结构优化

### 当前结构
```
src/
├── components/
├── data/
├── lib/
├── assets/
├── App.tsx
├── main.tsx
└── index.css
```

### 建议结构 (Feature-based)
```
src/
├── features/
│   ├── posts/
│   │   ├── components/      # 文章专属组件
│   │   ├── hooks/           # 文章相关 Hooks
│   │   ├── utils/           # 文章工具函数
│   │   └── types.ts         # 文章类型定义
│   ├── search/              # 搜索模块
│   ├── ai/                  # AI 功能模块
│   ├── comments/            # 评论模块（未来）
│   └── theme/               # 主题模块（未来）
├── components/
│   ├── ui/                  # 基础 UI 组件
│   ├── layout/              # 布局组件
│   └── common/              # 通用组件
├── lib/
│   ├── utils/               # 工具函数
│   └── constants.ts         # 常量定义
├── hooks/                   # 全局 Hooks
├── styles/                  # 全局样式
├── App.tsx
└── main.tsx
```

## 🎨 技术栈升级建议

### 1. 类型定义优化
创建 `src/features/posts/types.ts`:
```typescript
export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  content: string
  readingTime: number
  cover?: string
}

export interface PostFrontmatter {
  title: string
  date: string
  tags?: string[]
  description?: string
  cover?: string
}
```

### 2. TanStack Router (可选)
如果未来需要更复杂的路由：
```bash
pnpm add @tanstack/react-router
```

### 3. 组件优化
- 将大组件拆分为小组件
- 使用 React Server Components（如部署支持）
- 添加组件文档（Storybook）

## 🔧 功能增强

### 1. 文章目录 (TOC)
在文章详情页添加自动生成目录：
```typescript
// src/features/posts/components/TableOfContents.tsx
export function TableOfContents({ content }: { content: string }) {
  // 解析 markdown 标题生成目录
}
```

### 2. 代码高亮优化
当前使用 react-syntax-highlighter，可以添加：
- 复制按钮
- 语言标签
- 代码折叠
- 主题切换

### 3. 图片优化
- 添加懒加载（已部分实现）
- WebP 格式转换
- 响应式图片
- 图片缩放预览

### 4. SEO 优化
- ✅ sitemap.xml（待确认）
- 优化 meta 标签
- 添加 Open Graph 标签
- 添加 Twitter Cards

### 5. 性能优化
- 图片懒加载
- 代码分割（Code Splitting）
- 预加载关键资源
- 使用 Web Vitals 监控

## ☁️ Cloudflare 集成

### D1 数据库（可选）
如果未来需要评论/搜索功能：

```bash
# 创建 D1 数据库
wrangler d1 create simple-blog-db

# 更新 wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "simple-blog-db"
database_id = "xxx"
```

### KV 缓存
缓存文章列表，提升性能：

```typescript
// src/lib/cache.ts
export async function getCachedPosts() {
  const cached = await env.KV.get('posts:list')
  if (cached) return JSON.parse(cached)
  
  const posts = await getPostsFromMarkdown()
  await env.KV.put('posts:list', JSON.stringify(posts), { expirationTtl: 3600 })
  return posts
}
```

### R2 存储
用于图片管理：

```typescript
// src/features/media/r2.ts
export async function uploadImage(file: File) {
  await env.R2.put(`images/${file.name}`, file)
  return `/images/${file.name}`
}
```

### Workers AI
边缘 AI 推理：

```typescript
// src/features/ai/worker.ts
export async function generateContent(prompt: string) {
  const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: [{ role: 'user', content: prompt }]
  })
  return response.response
}
```

## 📝 立即可以做的优化

### 1. 添加 Prettier
```bash
pnpm add -D prettier eslint-config-prettier
```

创建 `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}
```

### 2. 添加 Husky 预提交检查
```bash
pnpm add -D husky lint-staged
npx husky init
```

更新 `.husky/pre-commit`:
```bash
npx lint-staged
```

更新 `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### 3. 优化构建脚本
更新 `package.json`:
```json
{
  "scripts": {
    "dev": "npm run posts && vite",
    "build": "npm run posts && tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

### 4. 添加 .vscode 配置
创建 `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 5. 添加组件库文档
```bash
pnpm add -D storybook @storybook/react-vite
npx storybook init
```

## 🎯 优先级建议

### 高优先级（立即做）
1. ✅ 优化 README 文档
2. ⬜ 添加 Prettier 格式化
3. ⬜ 优化 TypeScript 类型定义
4. ⬜ 添加 Husky 预提交检查

### 中优先级（近期做）
1. ⬜ 添加文章目录组件
2. ⬜ 优化 SEO（meta 标签）
3. ⬜ 添加图片懒加载
4. ⬜ 代码分割优化

### 低优先级（未来考虑）
1. ⬜ 评论系统
2. ⬜ 主题系统
3. ⬜ D1/R2/KV 集成
4. ⬜ Workers AI

---

## 🔄 合并到 mirakyux.blog

### 方式一：作为子模块
```bash
cd mirakyux.blog
git submodule add https://github.com/mirakyux/simple_blog.git
```

### 方式二：复制内容
```bash
# 克隆两个项目
git clone https://github.com/mirakyux/simple_blog.git
git clone https://github.com/mirakyux/mirakyux.blog.git

# 复制内容
cp -r simple_blog/* mirakyux.blog/

# 提交到 mirakyux.blog
cd mirakyux.blog
git add .
git commit -m "feat: 从 simple_blog 合并优化内容"
git push
```

### 方式三：PR 合并
1. 在 mirakyux.blog 创建新分支
2. 复制 simple_blog 的优化内容
3. 创建 Pull Request
4. 审查后合并

---

**核心原则**: 保持轻量级，按需引入功能，避免过度工程化！
