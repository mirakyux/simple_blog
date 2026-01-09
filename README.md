# blog 框架部署指南

这是一个自定义的静态 blog 框架, 使用 React + Vite 构建, 并通过预构建脚本解析 Markdown 内容。

## 本地开发

1. 安装依赖:
   ```bash
   pnpm install
   ```

2. 启动开发服务器:
   ```bash
   pnpm run dev
   ```
   该命令会自动运行 `scripts/generate-posts.ts` 来生成文章索引。

3. 编写文章:
   在 `content/posts` 目录下创建 `.md` 文件即可。

## 配置环境变量

在项目根目录创建 `.env` 文件 (可参考 `.env.example`):

```bash
VITE_SITE_TITLE="我的个人博客"
VITE_SITE_DESCRIPTION="记录技术与生活的点滴"
VITE_SITE_URL="https://your-domain.com"
VITE_AUTHOR_NAME="Your Name"
VITE_AUTHOR_EMAIL="your@email.com"
VITE_LANGUAGE="zh-CN"
VITE_NAV_LINKS='[{"label":"首页","url":"#"},{"label":"关于我","url":"https://example.com"}]'
```

这些变量将用于:
- 首页的标题与描述 (Hero Section)
- Navbar 上的导航链接 (需 JSON 格式)
- RSS 订阅源的生成 (`rss.xml`)
- 文章详情页的作者信息

## 部署到 GitHub Pages

我们推荐使用 GitHub Actions 进行自动构建和部署。

### 1. 创建 GitHub Actions Workflow

在项目根目录创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. 配置仓库设置

1. 进入 GitHub 仓库设置 (Settings) -> Pages。
2. 在 **Build and deployment** 下, 将 **Source** 改为 `GitHub Actions`。

---

## 部署到 Cloudflare Pages

### 1. 连接仓库

1. 登录 Cloudflare 控制台, 进入 **Workers & Pages**。
2. 点击 **Create application** -> **Pages** -> **Connect to Git**。
3. 选择你的仓库。

### 2. 配置构建设置

- **Framework preset**: `Vite` (或者 `None`)
- **Build command**: `pnpm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (或者 `mirakyux.blog` 取决于你的仓库结构)

### 3. 环境变量

确保 Node.js 版本正确 (建议 18+):
- 设置环境变量 `NODE_VERSION` 为 `20`。

---

## 注意事项

- **RSS 订阅**: 每次构建都会在 `public/rss.xml` 生成最新的订阅源。
- **路由**: 本框架使用 `HashRouter` (通过 URL Hash 实现), 这样在静态空间部署时无需配置回退路由 (Fallback) 也能正常访问文章详情页。
