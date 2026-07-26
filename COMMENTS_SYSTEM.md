# 用户评论系统文档

## 概述

NSKOREAN 网站集成了一个完整的用户评论系统，支持评分、评论、回复和本地存储。该系统完全基于 JavaScript 实现，无需后端服务器。

## 功能特性

### 📊 评论统计
- **平均评分** - 实时计算所有评论的平均评分
- **评分分布** - 以柱状图展示各等级评分的数量
- **评论总数** - 显示总评论数量

### ⭐ 评分系统
- **5 星评分** - 用户可选择 1-5 星评分
- **交互式星级** - 鼠标悬停预览，点击确认评分
- **视觉反馈** - 实时显示选中的评分

### 💬 评论功能
- **用户信息** - 收集用户名和邮箱
- **评论内容** - 支持多行文本输入
- **时间戳** - 自动记录评论发表时间
- **相对时间** - 显示"刚刚"、"5 分钟前"等友好格式

### 🔄 回复功能
- **评论回复** - 支持对每条评论进行回复
- **回复列表** - 在原评论下显示所有回复
- **回复统计** - 显示每条评论的回复数量

### 💾 数据持久化
- **本地存储** - 使用 localStorage 保存所有评论
- **自动保存** - 每次操作自动保存到本地
- **数据安全** - 数据仅存储在用户浏览器中

## 使用方法

### 基础集成

1. **引入脚本**
```html
<script src="comments.js"></script>
```

2. **添加容器**
```html
<div id="commentsContainer"></div>
```

3. **初始化系统**
```javascript
const commentSystem = new CommentSystem('commentsContainer');
commentSystem.render();
```

### API 文档

#### 创建实例
```javascript
const commentSystem = new CommentSystem(containerId);
```

**参数：**
- `containerId` (string) - 评论容器的 ID，默认为 `'commentsContainer'`

#### 添加评论
```javascript
commentSystem.addComment({
  name: '用户名',
  email: 'user@example.com',
  rating: 5,
  content: '评论内容'
});
```

**参数：**
- `name` (string) - 用户名
- `email` (string) - 邮箱地址
- `rating` (number) - 评分 (1-5)
- `content` (string) - 评论内容

#### 添加回复
```javascript
commentSystem.addReply(commentId, {
  name: '用户名',
  email: 'user@example.com',
  content: '回复内容'
});
```

**参数：**
- `commentId` (number) - 原评论的 ID
- `name` (string) - 用户名
- `email` (string) - 邮箱地址
- `content` (string) - 回复内容

#### 获取统计信息
```javascript
const stats = commentSystem.getStats();
// 返回：{
//   totalComments: 10,
//   avgRating: 4.5,
//   ratingDistribution: { 5: 6, 4: 3, 3: 1, 2: 0, 1: 0 }
// }
```

#### 渲染评论
```javascript
commentSystem.render();
```

#### 加载评论
```javascript
const comments = commentSystem.loadComments();
```

#### 保存评论
```javascript
commentSystem.saveComments();
```

## 数据结构

### 评论对象
```javascript
{
  id: 1234567890,                    // 时间戳作为唯一 ID
  name: '张三',                       // 用户名
  email: 'user@example.com',         // 邮箱
  rating: 5,                         // 评分 (1-5)
  content: '很好用的工具！',          // 评论内容
  timestamp: '2026-07-26T...',       // ISO 时间戳
  replies: [                         // 回复列表
    {
      id: 1234567891,
      name: '李四',
      email: 'reply@example.com',
      content: '同意！',
      timestamp: '2026-07-26T...'
    }
  ]
}
```

## 本地存储

所有评论存储在浏览器的 localStorage 中，键为 `nskorean_comments`。

### 查看存储的评论
```javascript
// 在浏览器控制台中
const comments = JSON.parse(localStorage.getItem('nskorean_comments'));
console.log(comments);
```

### 清除所有评论
```javascript
localStorage.removeItem('nskorean_comments');
```

### 导出评论为 JSON
```javascript
const comments = JSON.parse(localStorage.getItem('nskorean_comments'));
const json = JSON.stringify(comments, null, 2);
console.log(json);
```

## 安全性考虑

### 当前实现
- ✅ HTML 转义 - 防止 XSS 攻击
- ✅ 客户端验证 - 验证必填字段
- ✅ 本地存储 - 数据不上传到服务器

### 生产环境建议
- 🔒 添加后端验证 - 验证邮箱、防止垃圾评论
- 🔒 实现审核流程 - 在发布前审核评论
- 🔒 添加速率限制 - 防止恶意提交
- 🔒 使用数据库 - 替代 localStorage 进行持久化
- 🔒 实现用户认证 - 验证评论者身份

## 样式定制

### 修改颜色
编辑 `comments.js` 中的颜色值：

```javascript
// 星级颜色
'#fbbf24'  // 黄色（已选中）
'#e5e7eb'  // 灰色（未选中）

// 背景色
'bg-white'      // 白色背景
'bg-slate-50'   // 浅灰背景
'bg-blue-600'   // 蓝色按钮
```

### 修改文本
编辑 `comments.js` 中的文本字符串：

```javascript
placeholder="您的名字"
placeholder="您的邮箱"
placeholder="您的评价"
// 等等...
```

## 高级功能

### 导出评论数据
```javascript
function exportComments() {
  const comments = commentSystem.loadComments();
  const csv = convertToCSV(comments);
  downloadCSV(csv, 'comments.csv');
}
```

### 导入评论数据
```javascript
function importComments(jsonData) {
  const comments = JSON.parse(jsonData);
  localStorage.setItem('nskorean_comments', JSON.stringify(comments));
  commentSystem.render();
}
```

### 过滤评论
```javascript
function getCommentsByRating(rating) {
  return commentSystem.comments.filter(c => c.rating === rating);
}
```

### 搜索评论
```javascript
function searchComments(query) {
  const q = query.toLowerCase();
  return commentSystem.comments.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.content.toLowerCase().includes(q)
  );
}
```

## 迁移到后端

当需要将评论系统迁移到后端时，可以：

1. **保留前端界面** - 评论表单和显示保持不变
2. **修改数据操作** - 将 localStorage 操作替换为 API 调用
3. **示例代码**：

```javascript
// 原始方式（本地存储）
commentSystem.addComment(data);

// 后端方式（API 调用）
fetch('/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(data => commentSystem.render());
```

## 常见问题

### Q: 评论会被永久保存吗？
A: 评论存储在浏览器的 localStorage 中，清除浏览器数据或切换浏览器会丢失评论。建议迁移到后端数据库以实现永久存储。

### Q: 如何防止垃圾评论？
A: 当前版本无法防止垃圾评论。建议：
- 添加后端验证
- 实现邮箱验证
- 添加评论审核流程
- 使用 reCAPTCHA

### Q: 如何删除不当评论？
A: 当前版本支持密码保护的删除功能（密码为 `admin123`）。生产环境应使用更安全的认证机制。

### Q: 支持 Markdown 吗？
A: 当前版本不支持 Markdown，所有内容都作为纯文本处理。可通过修改 `renderStars()` 方法添加 Markdown 支持。

### Q: 如何备份评论？
A: 在浏览器控制台中执行：
```javascript
const comments = localStorage.getItem('nskorean_comments');
console.save(comments, 'comments.json');
```

## 技术栈

- **语言** - JavaScript (ES6+)
- **存储** - Browser localStorage
- **样式** - Tailwind CSS
- **兼容性** - 所有现代浏览器

## 版本历史

### v1.0 (2026-07-26)
- ✨ 初始版本
- ✨ 支持评分、评论、回复
- ✨ 本地存储持久化
- ✨ 评论统计和分布

## 许可证

MIT License

## 支持

如有问题或建议，欢迎提交 Issue。
