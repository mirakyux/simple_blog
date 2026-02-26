# AI Frontmatter 智能更新

## 🤖 功能特性

### 1. 智能填充缺失字段

AI 会检查 Frontmatter，**只填充缺失的字段**，不会覆盖已有内容。

**示例：**

```markdown
<!-- 输入 -->
---
title: 我自己写的标题
---

文章内容...
```

```markdown
<!-- AI 输出 -->
---
title: 我自己写的标题          # ✅ 保留已有
description: AI 生成的描述      # ✨ 新增
tags:                          # ✨ 新增
  - tag1
  - tag2
---

文章内容...
```

---



---

### 3. 支持双 AI 提供商

**OpenAI (ChatGPT)**
```bash
VITE_LLM_PROVIDER=chatgpt
OPENAI_API_KEY=sk-xxx
LLM_MODEL=gpt-4o-mini
```

**Google Gemini（推荐）**
```bash
VITE_LLM_PROVIDER=gemini
GEMINI_API_KEY=xxx
LLM_MODEL=gemini-1.5-flash
```

---

## 🚀 使用方式

### 方式一：自动触发（推荐）

运行开发或构建命令时自动处理：

```bash
pnpm run dev
# 或
pnpm run build
```

**处理流程：**
1. 扫描 `content/posts/*.md`
2. 检查每个文件的 Frontmatter
3. 识别缺失字段
4. 调用 AI 生成缺失内容
5. 更新文件（如果有变化）

---

### 方式二：手动触发

为特定文章运行增强：

```bash
pnpm run enhance content/posts/your-article.md
```

---

## 📝 测试场景

### 场景 1：完全空的 Frontmatter

**输入：**
```markdown
---
---

# 文章标题
```

**输出：**
```markdown
---
title: 文章标题
date: 2026-02-26 15:30:00
description: AI 生成的文章描述
tags:
  - 标签 1
  - 标签 2
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

**输出：**
```markdown
---
title: 自定义标题          # ✅ 保留
date: 2026-02-26 15:30:00
description: AI 生成的描述  # ✨ 新增
tags:                      # ✨ 新增
  - React
  - TypeScript
---

文章内容
```

---

**输入：**
```markdown
---
title: 完整的文章
date: 2026-02-26 15:30:00
description: 完整的描述
tags:
  - React
---

文章内容
```

**输出：**
```markdown
---
title: 完整的文章
date: 2026-02-26 15:30:00
description: 完整的描述
tags:
  - React
# ✅ 所有字段都有，AI 不干预
---

文章内容
```

---

## ⚙️ 配置说明

### 环境变量

在 `.env` 文件中配置：

```bash
# AI 提供商选择
VITE_LLM_PROVIDER=chatgpt  # 或 gemini

# OpenAI 配置
OPENAI_API_KEY=sk-xxx
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1  # 可选，自定义 API 地址

# Gemini 配置
GEMINI_API_KEY=xxx
LLM_MODEL=gemini-1.5-flash
```

### 推荐配置

**使用 Gemini（免费额度更多）：**
```bash
VITE_LLM_PROVIDER=gemini
GEMINI_API_KEY=xxx
LLM_MODEL=gemini-1.5-flash
```

**使用 OpenAI：**
```bash
VITE_LLM_PROVIDER=chatgpt
OPENAI_API_KEY=sk-xxx
LLM_MODEL=gpt-4o-mini  # 便宜且快速
```

---

## 🔧 开发命令

```bash
# 开发（自动处理 Frontmatter）
pnpm run dev

# 构建（自动处理 Frontmatter）
pnpm run build

# 手动增强指定文章
pnpm run enhance content/posts/your-article.md
```

---

## ⚠️ 注意事项

### 1. API Key 配置

- 没有配置 API Key 时，AI 功能会跳过
- 错误会记录在控制台，不会中断构建

### 2. 网络要求

- 需要能访问 OpenAI 或 Gemini API
- 国内可能需要代理

### 3. 成本控制

**Gemini：**
- 免费额度：每分钟 60 次请求
- 推荐用于开发环境

**OpenAI：**
- GPT-4o-mini 很便宜
- 每次生成约 $0.0001-0.0002
- 适合生产环境

### 4. 内容质量

- AI 生成的内容建议检查一遍
- 特别是 tags，可能不够准确
- description 可能需要微调

---

## 💡 最佳实践

### 1. 半自动模式（推荐）

自己写 title 和 date，让 AI 补充 description 和 tags：

```markdown
---
title: 我的文章标题
date: 2026-02-26
---

文章内容...
```

这样 AI 生成的内容更符合你的预期。

### 2. 批量更新

修改 `.env` 配置后，运行：

```bash
pnpm run build
```

会自动更新所有文章的 Frontmatter。

### 3. 版本控制

建议将 AI 生成的内容提交到 Git：

```bash
git add content/posts/*.md
git commit -m "chore: AI-generated frontmatter"
```

---

## 🐛 故障排除

### 问题 1：AI 没有反应

**检查：**
```bash
# 1. 确认配置了 API Key
cat .env | grep API_KEY

# 2. 检查网络
curl https://api.openai.com/v1

# 3. 查看控制台日志
pnpm run dev
```

### 问题 2：生成的内容不准确

**解决：**
- 手动调整 Frontmatter
- 提供更详细的内容上下文
- 尝试更换 AI 模型



---

_最后更新：2026-02-26_
