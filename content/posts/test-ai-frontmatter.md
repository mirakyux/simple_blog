---
# AI 会自动填充缺失的字段
---

# 测试 AI 生成 Frontmatter

这是一篇测试文章，用于演示 AI 自动填充 Frontmatter 的功能。

## 功能说明

1. **跳过已有字段** - 如果你已经填写了 title，AI 不会覆盖
2. **填充缺失字段** - 只生成你缺少的那些字段
3. **自动填充 date** - 如果没有 date，自动设置为当前时间

## 测试方法

### 测试 1：完全空的 Frontmatter

```markdown
---
---

# 文章标题
```

运行 `pnpm run dev` 后，AI 会自动填充：
- title
- description
- tags
- date

### 测试 2：部分字段

```markdown
---
title: 我自己写的标题
---

文章内容
```

AI 只会补充：
- description
- tags
- date（如果没有填写）

### 测试 3：所有字段都有

```markdown
---
title: 完整的文章
date: 2026-01-01 10:00:00
description: 完整的描述
tags:
  - React
---

文章内容
```

AI 不会做任何修改，保持原样。

## 配置 AI

在 `.env` 文件中配置：

```bash
# 选择 AI 提供商
VITE_LLM_PROVIDER=chatgpt  # 或 gemini

# OpenAI
OPENAI_API_KEY=sk-xxx
LLM_MODEL=gpt-4o-mini

# Gemini（推荐，免费额度更多）
GEMINI_API_KEY=xxx
LLM_MODEL=gemini-1.5-flash
```


