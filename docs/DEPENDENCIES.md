# 依赖配置说明

## 📦 package.json 必需配置

### 1. type 字段

```json
{
  "type": "module"
}
```

**原因：** 脚本使用 ES Modules 语法（`import`）

---

### 2. scripts 字段

```json
{
  "scripts": {
    "postinstall": "simple-git-hooks",
    "enhance": "node scripts/auto-frontmatter.js"
  }
}
```

**说明：**
- `postinstall`: 安装依赖后自动初始化 hooks
- `enhance`: 手动运行 Frontmatter 填充

---

### 3. dependencies

```json
{
  "dependencies": {
    "gray-matter": "^4.0.3"
  }
}
```

**用途：** 解析和生成 Markdown Frontmatter

---

### 4. devDependencies

```json
{
  "devDependencies": {
    "simple-git-hooks": "^2.11.1",
    "lint-staged": "^15.4.3",
    "@google/generative-ai": "^0.21.0",
    "openai": "^4.83.0"
  }
}
```

**用途：**
- `simple-git-hooks`: Git hooks 管理
- `lint-staged`: 提交前代码格式化
- `@google/generative-ai`: Google Gemini AI（可选）
- `openai`: OpenAI API（可选）

---

### 5. lint-staged 配置

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md}": ["prettier --write"]
  }
}
```

**用途：** 定义提交前的代码检查规则

---

### 6. simple-git-hooks 配置

```json
{
  "simple-git-hooks": {
    "pre-commit": "node scripts/auto-frontmatter.js $(git diff --cached --name-only --diff-filter=ACM | grep -E '\\\\.md$' | grep -E 'content/posts/') && npx lint-staged"
  }
}
```

**用途：** 定义 pre-commit hook 命令

---

## 🔧 安装步骤

### 1. 安装依赖

```bash
pnpm install
```

### 2. 验证安装

```bash
# 检查 simple-git-hooks 是否安装
npx simple-git-hooks --version

# 检查 gray-matter 是否安装
node -e "console.log(require('gray-matter').version)"
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

## ⚠️ 常见问题

### 问题 1：缺少 gray-matter

**错误：**
```
Error: Cannot find module 'gray-matter'
```

**解决：**
```bash
pnpm add gray-matter
```

### 问题 2：simple-git-hooks 未安装

**错误：**
```
command not found: simple-git-hooks
```

**解决：**
```bash
pnpm add -D simple-git-hooks
npx simple-git-hooks
```

### 问题 3：AI 模块未安装

**错误：**
```
Error: Cannot find module '@google/generative-ai'
```

**解决：**
```bash
# 使用 Gemini
pnpm add -D @google/generative-ai

# 或使用 OpenAI
pnpm add -D openai
```

---

## 📊 完整示例

参考 `package.json.example` 文件。

---

_最后更新：2026-02-26_
