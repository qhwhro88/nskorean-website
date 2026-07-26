# NSKOREAN 快速开始指南

欢迎使用 NSKOREAN！本指南将帮助您快速了解项目并开始使用。

## 📦 项目概览

NSKOREAN 是一个完整的 AI 工具导航和资讯平台，包含：

- 🛠️ **AI 工具导航** - 展示各类 AI 工具和服务
- 📰 **深度资讯** - 发布 AI 相关的深度文章
- 💬 **用户评论系统** - 完整的评论、评分、互动功能
- 📊 **高级分析** - 实时数据统计和热度排行

## 🚀 快速部署

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/nskorean-website.git
cd nskorean-website

# 2. 启动本地服务器
python3 -m http.server 8888

# 3. 打开浏览器
# 访问 http://localhost:8888
```

### 部署到 Cloudflare Pages

**方式一：自动部署（推荐）**

1. 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)
2. 进入 Pages → 创建项目 → 连接到 Git
3. 选择 `nskorean-website` 仓库
4. 配置：
   - **Build command**: （留空）
   - **Build output directory**: `.`
5. 点击 "保存并部署"

**方式二：手动部署**

```bash
# 使用 Wrangler CLI
npm install -g wrangler
wrangler pages deploy . --project-name nskorean-website
```

详见 [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)

---

## 📁 项目结构

```
nskorean-website/
├── index.html                    # 首页 - 工具导航和资讯
├── article.html                  # 资讯详情页 - 文章和评论
├── features.html                 # 高级功能文档
├── comments.js                   # 基础评论系统
├── comments-advanced.js          # 高级评论系统（搜索、过滤、互动）
├── tool-comments.js              # 工具评论小部件
├── README.md                     # 项目说明
├── DEPLOYMENT.md                 # 完整部署指南
├── CLOUDFLARE_DEPLOYMENT.md      # Cloudflare Pages 部署指南
├── ADVANCED_FEATURES.md          # 高级功能文档
├── COMMENTS_SYSTEM.md            # 评论系统文档
├── QUICK_START.md                # 本文件
├── wrangler.toml                 # Cloudflare 配置
└── .gitignore                    # Git 忽略文件
```

---

## 🎯 核心功能

### 1. 首页 (index.html)

**功能**：
- 🔍 搜索工具和资讯
- 🏷️ 按分类过滤
- ⭐ 工具评分展示
- 📰 最新资讯推荐

**快速访问**：
```
http://localhost:8888/
```

### 2. 资讯详情页 (article.html)

**功能**：
- 📖 完整文章排版
- 💬 用户评论系统
- ⭐ 5 星评分
- 🔗 相关工具推荐

**快速访问**：
```
http://localhost:8888/article.html
```

### 3. 高级功能文档 (features.html)

**功能**：
- 📚 完整的功能文档
- 💻 代码示例
- 📊 API 参考
- 🎯 最佳实践

**快速访问**：
```
http://localhost:8888/features.html
```

---

## 💬 评论系统使用

### 基础功能

```javascript
// 初始化评论系统
const commentSystem = new AdvancedCommentSystem('commentsContainer', {
  enableEmail: true,
  enableNotifications: true
});

// 渲染评论
commentSystem.render();

// 添加评论
commentSystem.addComment({
  name: '用户名',
  email: 'user@example.com',
  rating: 5,
  content: '评论内容'
});

// 获取统计
const stats = commentSystem.getStats();
console.log(stats);
```

### 高级功能

```javascript
// 搜索
commentSystem.searchQuery = '很好用';

// 过滤
commentSystem.ratingFilter = 5;
commentSystem.filterType = 'best';

// 排序
commentSystem.sortType = 'most-liked';

// 互动
commentSystem.likeComment(commentId);
commentSystem.markHelpful(commentId);
commentSystem.markBest(commentId, 'password');
```

详见 [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md)

---

## 🎨 自定义网站

### 修改工具列表

编辑 `index.html` 中的工具数据：

```html
<div class="tool-card">
  <h3>工具名称</h3>
  <p>工具描述</p>
  <div class="rating">⭐ 4.5 (120 条评价)</div>
  <button>查看详情</button>
</div>
```

### 修改样式

编辑 `index.html` 中的 `<style>` 标签：

```css
/* 修改颜色 */
.text-gradient {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

/* 修改字体 */
body {
  font-family: 'Your Font', sans-serif;
}
```

### 添加新页面

1. 创建新 HTML 文件（如 `pricing.html`）
2. 复制 `index.html` 的结构
3. 修改内容
4. 在导航中添加链接

---

## 📧 邮件通知配置

### 使用 FormSubmit（免费）

```javascript
// 在 comments-advanced.js 中修改
sendNotificationEmail(comment) {
  fetch('https://formsubmit.co/your-email@example.com', {
    method: 'POST',
    body: new FormData(form)
  });
}
```

### 使用 Mailgun（推荐）

1. 注册 [Mailgun](https://www.mailgun.com/)
2. 获取 API Key
3. 在代码中配置：

```javascript
const mailgunKey = 'YOUR_MAILGUN_API_KEY';
const domain = 'mg.nskorean.com';

fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`api:${mailgunKey}`)}`
  },
  body: formData
});
```

---

## 🔒 安全建议

### 1. 隐藏敏感信息

不要在代码中暴露 API Key：

```javascript
// ❌ 错误
const apiKey = 'sk_live_123456789';

// ✅ 正确
const apiKey = process.env.MAILGUN_API_KEY;
```

### 2. 验证用户输入

```javascript
// 验证邮箱
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 验证长度
function validateComment(content) {
  return content.length > 0 && content.length < 5000;
}
```

### 3. 防止 XSS 攻击

```javascript
// 转义 HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

---

## 📊 分析和监控

### 启用 Google Analytics

```html
<!-- 在 index.html 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 启用 Cloudflare Analytics

Cloudflare Pages 自动提供分析功能，无需配置。

---

## 🐛 常见问题

### Q: 如何添加新的 AI 工具？

A: 编辑 `index.html` 中的工具列表，添加新的工具卡片：

```html
<div class="tool-card">
  <h3>新工具名称</h3>
  <p>工具描述</p>
  <button onclick="location.href='article.html'">查看详情</button>
</div>
```

### Q: 如何修改评论系统的外观？

A: 编辑 `comments-advanced.js` 中的 `renderComments()` 方法，修改 HTML 结构和样式。

### Q: 如何迁移到数据库？

A: 参考 [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) 中的后端集成部分。

### Q: 如何处理多语言？

A: 当前系统支持任何语言的文本输入。可以添加语言选择器和翻译功能。

### Q: 如何实现用户认证？

A: 使用 Cloudflare Workers 或第三方认证服务（如 Auth0）。

---

## 📚 更多文档

| 文档 | 内容 |
|------|------|
| [README.md](./README.md) | 项目概览 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 完整部署指南 |
| [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) | Cloudflare Pages 部署 |
| [ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md) | 高级功能详解 |
| [COMMENTS_SYSTEM.md](./COMMENTS_SYSTEM.md) | 评论系统文档 |

---

## 🚀 下一步

1. ✅ 本地开发和测试
2. ✅ 部署到 Cloudflare Pages
3. ✅ 绑定自定义域名
4. ✅ 启用 SSL 证书
5. ✅ 配置分析和监控
6. ✅ 收集用户反馈
7. ✅ 持续改进功能

---

## 💡 最佳实践

### 代码质量

- 使用 ESLint 检查代码
- 添加注释说明复杂逻辑
- 定期重构和优化

### 性能优化

- 压缩图片和资源
- 启用 Gzip/Brotli 压缩
- 使用 CDN 加速

### 安全性

- 验证所有用户输入
- 转义 HTML 防止 XSS
- 使用 HTTPS
- 定期更新依赖

### 用户体验

- 响应式设计
- 快速加载速度
- 清晰的导航
- 友好的错误提示

---

## 📞 获取帮助

- 📖 查看文档
- 🐛 提交 Issue
- 💬 在社区讨论
- 📧 联系支持

---

**祝您使用愉快！** 🎉

如有任何问题，请参考相关文档或提交 Issue。

---

**更新日期**: 2026-07-26
**版本**: 1.0
