# NSKOREAN 高级功能文档

本文档介绍网站的所有高级功能，包括搜索、过滤、互动、通知等。

## 📚 目录

1. [评论搜索和过滤](#评论搜索和过滤)
2. [互动功能](#互动功能)
3. [邮件通知](#邮件通知)
4. [防垃圾机制](#防垃圾机制)
5. [工具页面评论](#工具页面评论)
6. [高级统计](#高级统计)
7. [实时通知](#实时通知)
8. [API 参考](#api-参考)

---

## 评论搜索和过滤

### 功能概述

用户可以通过多种方式搜索和过滤评论：

- **文本搜索** - 按用户名、邮箱、内容搜索
- **评分过滤** - 按 1-5 星评分过滤
- **类型过滤** - 最佳评论、认证用户、有用评论
- **排序** - 最新、最早、评分最高/最低、最赞、最有用

### 使用示例

```javascript
const commentSystem = new AdvancedCommentSystem('commentsContainer');

// 搜索评论
commentSystem.searchQuery = '很好用';
commentSystem.render();

// 按评分过滤
commentSystem.ratingFilter = 5;
commentSystem.render();

// 按类型过滤
commentSystem.filterType = 'best';
commentSystem.render();

// 排序
commentSystem.sortType = 'most-liked';
commentSystem.render();

// 获取过滤后的评论
const filtered = commentSystem.getFilteredComments();
```

### 快速过滤按钮

界面提供快速过滤按钮：

- **全部** - 显示所有评论
- **最佳评论** - 仅显示被标记为最佳的评论
- **认证用户** - 仅显示来自认证用户的评论
- **最有用** - 仅显示被标记为有用的评论

---

## 互动功能

### 点赞功能

用户可以对评论点赞：

```javascript
// 点赞
const likeCount = commentSystem.likeComment(commentId);
console.log(`点赞数: ${likeCount}`);
```

**存储**: 点赞数存储在 `localStorage` 中，键为 `nskorean_likes`

### 有用性投票

用户可以标记评论是否有用：

```javascript
// 标记为有用
const helpfulCount = commentSystem.markHelpful(commentId);

// 标记为无用
const notHelpfulCount = commentSystem.markNotHelpful(commentId);
```

**用途**: 帮助其他用户快速找到最有用的评论

### 最佳评论标记

管理员可以标记最佳评论（需要密码）：

```javascript
// 标记为最佳
commentSystem.markBest(commentId, 'admin123');

// 取消标记
commentSystem.markBest(commentId, 'admin123');
```

**密码**: 默认密码为 `admin123`（生产环境应更改）

**显示**: 最佳评论会在卡片上显示 ⭐ 标记

---

## 邮件通知

### 功能概述

系统支持两种邮件通知：

1. **新评论通知** - 当有新评论时通知管理员
2. **回复通知** - 当评论有回复时通知评论者

### 配置

```javascript
const commentSystem = new AdvancedCommentSystem('commentsContainer', {
  enableEmail: true,
  // 其他配置...
});
```

### 集成 FormSubmit

使用 FormSubmit 发送邮件（无需后端）：

```javascript
// 在 comments-advanced.js 中修改 sendNotificationEmail 方法
sendNotificationEmail(comment) {
  const formData = new FormData();
  formData.append('email', 'admin@nskorean.com');
  formData.append('subject', `新评论：${comment.name}`);
  formData.append('message', `用户 ${comment.name} 的评论：${comment.content}`);

  fetch('https://formsubmit.co/admin@nskorean.com', {
    method: 'POST',
    body: formData
  });
}
```

### 集成 Mailgun（推荐）

使用 Mailgun API 发送邮件：

```javascript
sendNotificationEmail(comment) {
  const mailgunKey = 'YOUR_MAILGUN_API_KEY';
  const domain = 'mg.nskorean.com';

  fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`api:${mailgunKey}`)}`
    },
    body: new FormData(Object.entries({
      from: 'noreply@nskorean.com',
      to: 'admin@nskorean.com',
      subject: `新评论：${comment.name}`,
      text: `用户 ${comment.name} 的评论：${comment.content}`
    }).reduce((form, [key, value]) => {
      form.append(key, value);
      return form;
    }, new FormData()))
  });
}
```

---

## 防垃圾机制

### 邮箱验证

验证用户邮箱地址：

```javascript
// 验证邮箱格式
commentSystem.validateEmail('user@example.com'); // true

// 验证邮箱（需要验证码）
commentSystem.verifyEmail('user@example.com', '123456');
```

### 重复检测

防止用户快速重复提交相同内容：

```javascript
// 检查是否重复
const isDuplicate = commentSystem.isDuplicate({
  name: '张三',
  email: 'user@example.com',
  content: '很好用！'
});
```

**规则**: 1 分钟内相同用户提交相同内容视为重复

### 垃圾内容检测

检测可能的垃圾内容：

```javascript
// 检查是否为垃圾内容
const isSpam = commentSystem.isSpam('点击这里赚钱！http://...');
```

**关键词**: 买、卖、赚钱、点击、链接、http、www

### reCAPTCHA 集成

添加 Google reCAPTCHA v3 防止机器人：

```javascript
const commentSystem = new AdvancedCommentSystem('commentsContainer', {
  enableRecaptcha: true,
  recaptchaKey: 'YOUR_RECAPTCHA_SITE_KEY'
});
```

**配置步骤**:
1. 访问 [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. 创建新网站
3. 选择 reCAPTCHA v3
4. 获取 Site Key 和 Secret Key
5. 在代码中配置

---

## 工具页面评论

### 功能概述

在首页工具卡片上显示评论统计和快速评论。

### 使用方法

```html
<!-- 在工具卡片中添加评论小部件 -->
<div id="toolComments-1"></div>

<script src="tool-comments.js"></script>
<script>
  const widget = new ToolCommentWidget(1); // toolId = 1
  document.getElementById('toolComments-1').innerHTML = widget.renderMiniWidget();
</script>
```

### 小部件类型

#### 迷你小部件

显示评分和评论数：

```javascript
widget.renderMiniWidget();
// 输出: ★ 4.5 (12 条评价)
```

#### 详细小部件

显示完整的评论统计和最近评论：

```javascript
widget.renderDetailedWidget();
// 输出: 评分分布、最近 3 条评论、查看全部按钮
```

### 在首页集成

修改 `index.html` 中的工具卡片：

```html
<div class="tool-card">
  <!-- 工具信息 -->
  <h3>工具名称</h3>
  <p>工具描述</p>
  
  <!-- 添加评论小部件 -->
  <div id="toolComments-1"></div>
</div>

<script src="tool-comments.js"></script>
<script>
  const widget = new ToolCommentWidget(1);
  document.getElementById('toolComments-1').innerHTML = widget.renderMiniWidget();
</script>
```

---

## 高级统计

### 获取统计信息

```javascript
const stats = commentSystem.getStats();

console.log(stats);
// 输出:
// {
//   totalComments: 25,
//   avgRating: 4.5,
//   ratingDistribution: { 5: 10, 4: 8, 3: 5, 2: 1, 1: 1 },
//   totalReplies: 15,
//   totalLikes: 45,
//   bestCommentCount: 3,
//   verifiedCount: 8,
//   engagementRate: 2.4
// }
```

### 热门评论

获取最热门的评论（基于点赞、有用性、回复数）：

```javascript
const hotComments = commentSystem.getHotComments(5); // 获取前 5 条
```

### 按工具统计

获取特定工具的评论：

```javascript
const toolComments = commentSystem.getCommentsByTool(toolId);
```

### 自定义分析

```javascript
// 获取所有评论
const allComments = commentSystem.comments;

// 按评分分组
const byRating = {};
allComments.forEach(c => {
  if (!byRating[c.rating]) byRating[c.rating] = [];
  byRating[c.rating].push(c);
});

// 计算参与度
const engagementRate = (totalLikes + totalReplies) / totalComments;

// 找出最活跃的用户
const userCommentCount = {};
allComments.forEach(c => {
  userCommentCount[c.email] = (userCommentCount[c.email] || 0) + 1;
});
```

---

## 实时通知

### 浏览器通知

当有新评论时，系统会发送浏览器通知：

```javascript
// 请求通知权限
if ('Notification' in window) {
  Notification.requestPermission();
}

// 监听新评论事件
document.addEventListener('newComment', (e) => {
  console.log('新评论:', e.detail);
  
  // 显示通知
  if (Notification.permission === 'granted') {
    new Notification('新评论', {
      body: e.detail.content,
      icon: '⭐'
    });
  }
});
```

### 自定义事件

系统会触发自定义事件：

```javascript
// 新评论事件
document.addEventListener('newComment', (e) => {
  console.log('新评论:', e.detail);
});

// 可以添加其他事件
// - newReply: 新回复
// - newLike: 新点赞
// - newVote: 新投票
```

### WebSocket 实时推送（高级）

对于生产环境，可以使用 WebSocket 实现真正的实时推送：

```javascript
class RealtimeCommentSystem extends AdvancedCommentSystem {
  constructor(containerId, wsUrl) {
    super(containerId);
    this.ws = new WebSocket(wsUrl);
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'newComment') {
        this.comments.unshift(data.comment);
        this.saveComments();
        this.render();
        this.notifyNewComment(data.comment);
      }
    };
  }
}

// 使用
const realtimeSystem = new RealtimeCommentSystem(
  'commentsContainer',
  'wss://api.nskorean.com/comments'
);
```

---

## API 参考

### AdvancedCommentSystem

#### 构造函数

```javascript
new AdvancedCommentSystem(containerId, options)
```

**参数**:
- `containerId` (string) - 容器 ID
- `options` (object) - 配置选项
  - `enableEmail` (boolean) - 启用邮件通知，默认 true
  - `enableRecaptcha` (boolean) - 启用 reCAPTCHA，默认 false
  - `recaptchaKey` (string) - reCAPTCHA Site Key
  - `enableNotifications` (boolean) - 启用浏览器通知，默认 true

#### 方法

| 方法 | 描述 |
|------|------|
| `addComment(data)` | 添加新评论 |
| `addReply(commentId, data)` | 添加回复 |
| `likeComment(commentId)` | 点赞评论 |
| `markHelpful(commentId)` | 标记为有用 |
| `markNotHelpful(commentId)` | 标记为无用 |
| `markBest(commentId, password)` | 标记为最佳 |
| `verifyEmail(email, code)` | 验证邮箱 |
| `searchComments(query)` | 搜索评论 |
| `filterByRating(rating)` | 按评分过滤 |
| `filterByType(type)` | 按类型过滤 |
| `sortComments(comments, type)` | 排序评论 |
| `getFilteredComments()` | 获取过滤后的评论 |
| `getStats()` | 获取统计信息 |
| `getCommentsByTool(toolId)` | 获取工具的评论 |
| `getHotComments(limit)` | 获取热门评论 |
| `render()` | 渲染评论系统 |

---

## 最佳实践

### 1. 定期备份数据

```javascript
// 导出评论数据
function exportComments() {
  const comments = JSON.parse(localStorage.getItem('nskorean_comments_v2'));
  const json = JSON.stringify(comments, null, 2);
  
  // 下载为文件
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comments-${new Date().toISOString()}.json`;
  a.click();
}
```

### 2. 定期清理垃圾评论

```javascript
// 删除超过 1 年的评论
function cleanOldComments() {
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  commentSystem.comments = commentSystem.comments.filter(c => 
    new Date(c.timestamp) > oneYearAgo
  );
  commentSystem.saveComments();
}
```

### 3. 监控评论质量

```javascript
// 计算评论质量分数
function getCommentQualityScore(comment) {
  let score = 0;
  
  // 基础分
  score += comment.rating * 10;
  
  // 内容长度
  score += Math.min(comment.content.length / 10, 50);
  
  // 互动
  score += (comment.helpful || 0) * 5;
  score -= (comment.notHelpful || 0) * 2;
  
  // 认证用户
  if (comment.isVerified) score += 20;
  
  return Math.min(score, 100);
}
```

### 4. 实现审核工作流

```javascript
// 标记评论为待审核
function flagForReview(commentId, reason) {
  const comment = commentSystem.comments.find(c => c.id === commentId);
  if (comment) {
    comment.flagged = true;
    comment.flagReason = reason;
    commentSystem.saveComments();
  }
}

// 获取待审核评论
function getPendingReviews() {
  return commentSystem.comments.filter(c => c.flagged);
}
```

---

## 常见问题

**Q: 如何迁移到后端数据库？**
A: 参考 [部署指南](./DEPLOYMENT.md) 中的后端集成部分。

**Q: 如何处理多语言评论？**
A: 当前系统支持任何语言的文本输入。可以添加语言检测和自动翻译功能。

**Q: 如何限制评论长度？**
A: 在表单中添加 `maxlength` 属性，或在 `addComment` 方法中验证。

**Q: 如何实现评论审核？**
A: 在 `addComment` 方法中添加审核逻辑，或使用第三方审核 API。

---

**更新日期**: 2026-07-26
