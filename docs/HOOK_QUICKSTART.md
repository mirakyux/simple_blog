# Git Hook 快速配置

## 📦 依赖说明

**必需依赖：**
```json
{
  "dependencies": {
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "simple-git-hooks": "^2.11.1",
    "lint-staged": "^15.4.3",
    "@google/generative-ai": "^0.21.0",
    "openai": "^4.83.0"
  }
}
```

**安装命令：**
```bash
pnpm install
```

---

## 🚀 3 步完成配置

### 1️⃣ 配置 AI

```bash
# 推荐：Google Gemini（免费）
echo "GEMINI_API_KEY=你的 key" >> .env
echo "VITE_LLM_PROVIDER=gemini" >> .env

# 或：OpenAI
echo "OPENAI_API_KEY=sk-你的 key" >> .env
```

### 2️⃣ 初始化 Hooks

```bash
npx simple-git-hooks
```

### 3️⃣ 正常提交

```bash
git add content/posts/my-article.md
git commit -m "feat: add new article"
```

**完成！** 🎉 Hook 会自动填充 Frontmatter～

---

## 📝 使用效果

**提交前：**
```markdown
---
---

# 文章标题
```

**提交后：**
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

## 🔧 手动使用

```bash
# 检查单个文件
node scripts/auto-frontmatter.js content/posts/my-article.md

# 批量检查
node scripts/auto-frontmatter.js content/posts/*.md
```

---

## ⚠️ 获取 API Key

**Google Gemini：**
1. 访问：https://makersuite.google.com/app/apikey
2. 创建 API Key
3. 复制到 `.env`

**OpenAI：**
1. 访问：https://platform.openai.com/api-keys
2. 创建 API Key
3. 复制到 `.env`

---

## 📚 完整文档

查看 `docs/GIT_HOOK_FRONTMATTER.md` 了解更多详情。

---

_配置时间：2026-02-26_
