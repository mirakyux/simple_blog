# Git Hook - AI 自动填充 Frontmatter 配置指南

## 🎯 快速开始

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

### 3. 启用 Hook

```bash
# 如果使用 husky
pnpm exec husky install
pnpm exec husky add .husky/pre-commit "sh .husky/pre-commit"
```

或直接使用已有的 `.husky/pre-commit` 文件。

---

## 🚀 使用效果

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
```

### 提交后

文件自动更新：

```markdown
---
title: 我的文章
date: 2026-02-26
description: AI 生成的描述
tags:
  - 标签 1
  - 标签 2
---

# 我的文章
```

---

## 📁 新增文件

| 文件 | 说明 |
|------|------|
| `.husky/pre-commit` | Git pre-commit hook 入口 |
| `.husky/check-frontmatter` | 基础检查脚本 |
| `scripts/auto-frontmatter.js` | AI 自动填充脚本 |
| `docs/GIT_HOOK_FRONTMATTER.md` | 完整文档 |

---

## ⚙️ 配置选项

### 环境变量

在 `.env` 文件中：

```bash
# AI 提供商
VITE_LLM_PROVIDER=gemini  # 或 chatgpt

# Google Gemini
GEMINI_API_KEY=xxx
LLM_MODEL=gemini-1.5-flash

# OpenAI
OPENAI_API_KEY=sk-xxx
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
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

---

## ⚠️ 注意事项

### 1. Node.js 版本

需要 Node.js 18+（支持 ES Modules）

### 2. 文件权限

```bash
chmod +x .husky/pre-commit
chmod +x scripts/auto-frontmatter.js
```

### 3. 跳过 Hook

```bash
git commit --no-verify -m "feat: something"
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

_配置完成时间：2026-02-26_
