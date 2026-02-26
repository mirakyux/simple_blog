# Git Hook - AI 自动填充 Frontmatter

## 📦 依赖说明

### 必需依赖

**package.json 需要包含：**

```json
{
  "type": "module",
  "scripts": {
    "postinstall": "simple-git-hooks",
    "enhance": "node scripts/auto-frontmatter.js"
  },
  "dependencies": {
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "simple-git-hooks": "^2.11.1",
    "lint-staged": "^15.4.3",
    "@google/generative-ai": "^0.21.0",
    "openai": "^4.83.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md}": ["prettier --write"]
  },
  "simple-git-hooks": {
    "pre-commit": "node scripts/auto-frontmatter.js $(git diff --cached --name-only --diff-filter=ACM | grep -E '\\\\.md$' | grep -E 'content/posts/') && npx lint-staged"
  }
}
```

### 依赖说明

| 包 | 用途 | 类型 |
|---|------|------|
| `gray-matter` | 解析 Markdown Frontmatter | 必需 |
| `simple-git-hooks` | Git hooks 管理 | 必需 |
| `lint-staged` | 提交前代码检查 | 必需 |
| `@google/generative-ai` | Google Gemini AI | 可选（二选一） |
| `openai` | OpenAI API | 可选（二选一） |

### 安装命令

```bash
pnpm install
```

---

## 🎯 功能说明

在 `git commit` 时自动检查并填充 Markdown 文章的 Frontmatter：

1. **自动检测** - 检查暂存的 Markdown 文件
2. **AI 填充** - 使用 AI 生成缺失的字段（title/description/tags）
3. **自动提交** - 更新的文件会自动 add 到 git
4. **日期填充** - 如果没有 date，自动设置为当前时间

**使用工具：** `simple-git-hooks` + `lint-staged`

---

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 AI

```bash
# 推荐：Google Gemini（免费）
echo "GEMINI_API_KEY=xxx" >> .env
echo "VITE_LLM_PROVIDER=gemini" >> .env

# 或：OpenAI
echo "OPENAI_API_KEY=sk-xxx" >> .env
```

### 3. 初始化 Hooks

```bash
npx simple-git-hooks
```

输出：
```
[INFO] Successfully set the pre-commit with command: node scripts/auto-frontmatter.js ...
[INFO] Successfully set all git hooks
```

---

## 📝 使用效果

### 提交前

```markdown
---
---

# 我的文章
```

### 提交时

```bash
git add content/posts/my-article.md
git commit -m "feat: add new article"
```

**Hook 输出：**
```
🤖 Checking frontmatter for: content/posts/my-article.md

📝 content/posts/my-article.md
  🤖 Generating: title, description, tags
  ✓ Updated with AI

✓ Frontmatter updated with AI ✨
💡 Auto-staging updated files...
✓ Files staged

✔ Pre-commit: 1 file(s) staged
```

### 提交后

文件自动更新：

```markdown
---
title: AI 生成的标题
date: 2026-02-26
description: AI 生成的文章描述
tags:
  - React
  - TypeScript
---

# 我的文章
```

---

## ⚙️ 配置说明

### .simple-git-hooks.json

```json
{
  "pre-commit": "node scripts/auto-frontmatter.js $(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.md$' | grep -E 'content/posts/') && npx lint-staged"
}
```

### 环境变量

在 `.env` 文件中：

```bash
# AI 提供商
VITE_LLM_PROVIDER=gemini  # 或 chatgpt

# Google Gemini（推荐）
GEMINI_API_KEY=xxx
LLM_MODEL=gemini-1.5-flash

# OpenAI
OPENAI_API_KEY=sk-xxx
LLM_MODEL=gpt-4o-mini
```

### 获取 API Key

**Google Gemini：**
- 访问：https://makersuite.google.com/app/apikey
- 免费额度：60 次/分钟

**OpenAI：**
- 访问：https://platform.openai.com/api-keys
- 成本：约 $0.0001/次

---

## 🔧 手动使用

### 检查单个文件

```bash
node scripts/auto-frontmatter.js content/posts/my-article.md
```

### 批量检查

```bash
node scripts/auto-frontmatter.js content/posts/*.md
```

### 重新初始化 Hooks

```bash
npx simple-git-hooks
```

---

## 📊 工作流程

### 场景 1：完全空的 Frontmatter

**输入：**
```markdown
---
---

# 文章标题
```

**Hook 自动填充：**
```markdown
---
title: AI 生成的标题
date: 2026-02-26
description: AI 生成的文章描述
tags:
  - React
  - TypeScript
---

# 文章标题
```

---

### 场景 2：部分字段

**输入：**
```markdown
---
title: 自定义标题
---

文章内容
```

**Hook 自动补充：**
```markdown
---
title: 自定义标题
date: 2026-02-26
description: AI 生成的描述
tags:
  - React
  - TypeScript
---

文章内容
```

---

### 场景 3：所有字段都有

**输入：**
```markdown
---
title: 完整的文章
date: 2026-02-26
description: 完整的描述
tags:
  - React
---

文章内容
```

**Hook 输出：**
```
📝 content/posts/my-article.md
  ✓ Complete

✓ All frontmatter is complete!
```

---

### 场景 4：没有配置 AI

**Hook 输出：**
```
⚠️  No AI configured (set OPENAI_API_KEY or GEMINI_API_KEY)
   Will only add missing date field

📝 content/posts/my-article.md
  ❌ Missing: title, description, tags
  💡 Configure AI or fill manually
```

---

## 📁 相关文件

| 文件 | 说明 |
|------|------|
| `.simple-git-hooks.json` | Git hooks 配置 |
| `scripts/auto-frontmatter.js` | AI 自动填充脚本 |
| `scripts/ai-utils.ts` | AI 工具函数 |
| `docs/GIT_HOOK_FRONTMATTER.md` | 完整文档 |

---

## ⚠️ 注意事项

### 1. Node.js 版本

需要 Node.js 18+（支持 ES Modules）

### 2. 文件权限

```bash
chmod +x scripts/auto-frontmatter.js
```

### 3. 跳过 Hook

```bash
git commit --no-verify -m "feat: something"
```

### 4. 修改配置后

如果修改了 `.simple-git-hooks.json`，需要重新运行：

```bash
npx simple-git-hooks
```

---

## 💡 最佳实践

### 1. 半自动模式（推荐）

自己写 title，AI 补充其他：

```markdown
---
title: 我的标题
---

文章内容...
```

### 2. 本地测试

先运行 `pnpm run dev` 测试，确认无误再提交。

### 3. 批量更新

```bash
git add content/posts/*.md
git commit -m "chore: update frontmatter"
```

---

## 🐛 故障排除

### 问题 1：Hook 没有执行

**检查：**
```bash
# 确认 simple-git-hooks 已安装
cat package.json | grep simple-git-hooks

# 确认 hooks 已设置
ls -la .git/hooks/pre-commit
```

**解决：**
```bash
npx simple-git-hooks
```

### 问题 2：AI 没有反应

**检查：**
```bash
# 确认配置了 API Key
cat .env | grep API_KEY

# 测试网络
curl https://api.openai.com/v1
```

### 问题 3：文件没有被自动 add

**解决：**
```bash
# 手动 add 并提交
git add content/posts/*.md
git commit -m "feat: update articles"
```

---

## 🎯 总结

**启用 AI 后：**
- ✅ 自动填充 title/description/tags
- ✅ 自动添加 date
- ✅ 自动 add 到 git
- ✅ 一次提交完成

**不启用 AI：**
- ⚠️ 只添加 date
- ⚠️ 其他字段手动填写
- ⚠️ 会提示警告

**推荐配置 AI，享受自动化！** 🚀

---

_最后更新：2026-02-26_
