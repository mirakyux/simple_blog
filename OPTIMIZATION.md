# 优化建议 - 在线编辑和发布功能

本文档提供从当前 Git 提交模式升级到**在线编辑/发布**系统的完整方案。

## 🎯 目标

让用户可以直接在浏览器中写作、编辑和发布文章，无需通过 Git 提交。

---

## 📁 架构设计

### 当前流程（Git 提交）
```
本地写 Markdown → Git 提交 → CI/CD 构建 → 部署到 Cloudflare
```

### 目标流程（在线编辑）
```
浏览器编辑器 → Workers API → D1 数据库 → 即时发布
                    ↓
                R2 对象存储（图片）
```

---

## 🏗️ 实现方案

### 方案一：混合模式（推荐）⭐

**特点：** 保留现有 Markdown 文件支持，同时增加在线编辑功能

**优点：**
- 向后兼容，已有文章不受影响
- 渐进式迁移，风险低
- 开发者可用 Git，普通用户用在线编辑器

**实现步骤：**

#### 1. 创建数据库表（D1）

```sql
-- 文章表
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT,  -- JSON 数组
  cover_image TEXT,
  status TEXT DEFAULT 'draft',  -- draft | published
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
```

#### 2. Cloudflare Workers API

创建 `worker.ts`：

```typescript
export interface Env {
  DB: D1Database
  R2: R2Bucket
  ADMIN_TOKEN: string
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    
    // CORS 处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }
    
    // 认证中间件
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (request.method !== 'GET' && token !== env.ADMIN_TOKEN) {
      return new Response('Unauthorized', { status: 401 })
    }
    
    // 路由
    if (url.pathname === '/api/posts' && request.method === 'GET') {
      return await getPosts(env)
    }
    
    if (url.pathname === '/api/posts' && request.method === 'POST') {
      return await createPost(request, env)
    }
    
    if (url.pathname.startsWith('/api/posts/') && request.method === 'PUT') {
      const id = url.pathname.split('/').pop()
      return await updatePost(id, request, env)
    }
    
    if (url.pathname.startsWith('/api/posts/') && request.method === 'DELETE') {
      const id = url.pathname.split('/').pop()
      return await deletePost(id, env)
    }
    
    if (url.pathname === '/api/upload' && request.method === 'POST') {
      return await uploadImage(request, env)
    }
    
    return new Response('Not Found', { status: 404 })
  },
}

async function getPosts(env: Env) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM posts 
    WHERE status = 'published' 
    ORDER BY published_at DESC
  `).all()
  
  return Response.json(results)
}

async function createPost(request: Request, env: Env) {
  const { title, content, tags, excerpt, cover_image } = await request.json()
  const slug = generateSlug(title)
  
  await env.DB.prepare(`
    INSERT INTO posts (slug, title, content, tags, excerpt, cover_image, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, 'published', ?)
  `).bind(slug, title, content, JSON.stringify(tags), excerpt, cover_image, new Date())
  
  return Response.json({ success: true, slug })
}

async function uploadImage(request: Request, env: Env) {
  const formData = await request.formData()
  const file = formData.get('image') as File
  
  const key = `images/${Date.now()}-${file.name}`
  await env.R2.put(key, file)
  
  const publicUrl = `https://cdn.example.com/${key}`
  return Response.json({ url: publicUrl })
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

#### 3. 前端编辑器组件

创建 `src/components/admin/Editor.tsx`：

```typescript
import { useState } from 'react'
import { MDEditor } from '@uiw/react-md-editor'

interface EditorProps {
  onSave: (data: PostData) => void
}

export function Editor({ onSave }: EditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags }),
      })
      
      if (response.ok) {
        alert('发布成功！')
        onSave({ title, content, tags })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="editor-container">
      <input
        type="text"
        placeholder="文章标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />
      
      <MDEditor value={content} onChange={setContent} />
      
      <input
        type="text"
        placeholder="标签（逗号分隔）"
        value={tags.join(', ')}
        onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
      />
      
      <button onClick={handleSave} disabled={saving}>
        {saving ? '发布中...' : '发布文章'}
      </button>
    </div>
  )
}
```

#### 4. 管理后台页面

创建 `src/pages/admin/Dashboard.tsx`：

```typescript
export function Dashboard() {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])
  
  return (
    <div className="dashboard">
      <h1>文章管理</h1>
      <a href="/admin/write">写文章</a>
      
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <span>{post.title}</span>
            <span>{post.published_at}</span>
            <a href={`/admin/edit/${post.id}`}>编辑</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### 5. 部署 Workers

创建 `wrangler.toml`：

```toml
name = "simple-blog-api"
main = "worker.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "simple-blog-db"
database_id = "YOUR_D1_ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "simple-blog-images"

[vars]
ADMIN_TOKEN = "your-secret-token"
```

部署：
```bash
wrangler deploy
```

---

### 方案二：纯静态 + GitHub API

**特点：** 通过 GitHub API 直接提交到仓库，触发 CI/CD

**优点：**
- 无需后端服务器
- 利用现有 CI/CD 流程
- 完全免费

**缺点：**
- 发布有延迟（需要构建）
- 需要 GitHub OAuth

**实现：**
```typescript
async function commitToGitHub(content: string, filename: string) {
  const response = await fetch(
    `https://api.github.com/repos/mirakyux/simple_blog/contents/content/posts/${filename}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `feat: 发布文章 ${filename}`,
        content: btoa(content),
      }),
    }
  )
  
  return response.ok
}
```

---

## 📋 开发任务清单

### 高优先级（MVP）
- [ ] 创建 D1 数据库和表结构
- [ ] 部署 Workers API（基础 CRUD）
- [ ] 简单的 Markdown 编辑器
- [ ] 文章列表页（读取 D1）
- [ ] 管理员认证（Token）

### 中优先级
- [ ] 图片上传（R2 集成）
- [ ] 富文本编辑器（TipTap）
- [ ] 草稿箱功能
- [ ] 文章搜索
- [ ] 标签管理

### 低优先级
- [ ] 评论系统
- [ ] 多用户支持
- [ ] 文章版本历史
- [ ] 定时发布
- [ ] SEO 优化

---

## 🎨 编辑器推荐

### 1. TipTap（推荐）⭐
- 基于 ProseMirror
- 可扩展性强
- 支持 Markdown 导入导出

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/markdown
```

### 2. Monaco Editor
- VS Code 同款编辑器
- 功能强大
- 体积较大

### 3. React Markdown Editor
- 轻量级
- 简单易用
- 适合快速开发

---

## 📊 数据迁移

### 从 Markdown 文件迁移到 D1

创建迁移脚本 `scripts/migrate-to-d1.ts`：

```typescript
import { glob } from 'glob'
import fs from 'fs'
import matter from 'gray-matter'

async function migrate() {
  const files = await glob('content/posts/*.md')
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const { data, content: body } = matter(content)
    
    await env.DB.prepare(`
      INSERT INTO posts (slug, title, content, tags, excerpt, status, published_at)
      VALUES (?, ?, ?, ?, ?, 'published', ?)
    `).bind(
      file.split('/').pop().replace('.md', ''),
      data.title,
      body,
      JSON.stringify(data.tags || []),
      data.description,
      new Date(data.date)
    )
  }
  
  console.log(`Migrated ${files.length} posts`)
}
```

---

## 🚀 快速开始（开发环境）

### 1. 创建 D1 数据库
```bash
wrangler d1 create simple-blog-db
```

### 2. 执行迁移
```bash
wrangler d1 execute simple-blog-db --file=schema.sql
```

### 3. 本地开发
```bash
# 启动 Workers 本地环境
wrangler dev

# 启动前端
pnpm run dev
```

### 4. 测试 API
```bash
curl -X POST http://localhost:8787/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"title":"Test","content":"Hello"}'
```

---

## 💡 核心原则

1. **渐进式升级** - 保留现有功能，逐步添加新特性
2. **向后兼容** - Markdown 文件继续支持
3. **简单优先** - MVP 先上线，再迭代优化
4. **成本可控** - 优先使用 Cloudflare 免费额度

---

**下一步：** 从 MVP 开始，先实现基础的在线编辑和发布功能！
