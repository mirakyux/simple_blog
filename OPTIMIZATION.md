# 优化建议 - GitHub API 在线编辑方案

通过 **GitHub API** 实现在线编辑和发布，无需后端服务器。

## 🎯 方案说明

用户可以直接在浏览器中写作，通过 GitHub Token 直接提交到仓库，触发 CI/CD 自动部署。

**优点：**
- ✅ 无需后端服务器
- ✅ 利用现有 CI/CD 流程
- ✅ 完全免费
- ✅ 数据就在仓库中

**缺点：**
- ⚠️ 发布有延迟（1-3 分钟构建）
- ⚠️ 需要 GitHub Token
- ⚠️ API 有速率限制

## 🏗️ 实现方案

详细代码实现请查看 README.md 中的完整示例。

### 核心文件

1. **src/lib/github.ts** - GitHub API 工具函数
2. **src/components/admin/Editor.tsx** - 在线编辑器组件
3. **路由 /admin/write** - 编辑页面

### GitHub Token 权限

创建 Token 时勾选：
- ✅ **`repo`** - 完全控制私有仓库

## 📋 开发任务

### 高优先级（MVP）
- [ ] 创建 `src/lib/github.ts`
- [ ] 创建编辑器组件
- [ ] 添加路由 `/admin/write`
- [ ] 测试提交功能

### 中优先级
- [ ] 文章列表管理
- [ ] 编辑现有文章
- [ ] 删除文章
- [ ] 图片上传

## 🔐 安全建议

- ⚠️ 不要将 Token 提交到仓库
- ✅ 使用 localStorage 存储（前端）
- ✅ 定期轮换 Token

---

**下一步：** 从 MVP 开始，先实现基础的编辑和提交功能！
