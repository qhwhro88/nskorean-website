# 内容管理系统（CMS）

## 项目概述

NSKOREAN CMS 是一个功能完整的内容管理系统，用于管理网站的所有内容、用户和配置。

## 核心功能

### 1. 内容管理
- 文章编辑和发布
- 多媒体管理
- 版本控制
- 发布日程
- 内容预览

### 2. 用户管理
- 用户账户管理
- 权限控制
- 角色管理
- 审计日志
- 安全设置

### 3. 工具管理
- 工具信息编辑
- 分类管理
- 标签管理
- 批量操作
- 数据导入导出

### 4. 评论管理
- 评论审核
- 垃圾评论过滤
- 评论排序
- 批量操作
- 用户屏蔽

### 5. 分析统计
- 流量分析
- 用户行为
- 内容热度
- 转化分析
- 自定义报表

### 6. 系统配置
- 网站设置
- 主题管理
- 插件管理
- 备份恢复
- 日志查看

## 用户角色

### 超级管理员
- 完全系统访问权限
- 用户和权限管理
- 系统配置
- 备份和恢复

### 内容编辑
- 创建和编辑文章
- 发布内容
- 管理多媒体
- 查看分析

### 工具管理员
- 添加和编辑工具
- 管理分类和标签
- 审核评论
- 查看统计

### 评论审核员
- 审核用户评论
- 删除垃圾评论
- 管理用户屏蔽
- 查看评论统计

### 分析师
- 查看分析报表
- 导出数据
- 创建自定义报表
- 查看用户行为

## 后台界面

### 仪表板
- 关键指标卡片
- 流量趋势图
- 热门内容
- 最新评论
- 系统状态

### 内容管理
- 文章列表
- 文章编辑器
- 媒体库
- 分类管理
- 标签管理

### 工具管理
- 工具列表
- 工具编辑
- 分类管理
- 批量导入
- 数据导出

### 用户管理
- 用户列表
- 用户编辑
- 权限设置
- 审计日志
- 安全设置

### 评论管理
- 评论列表
- 评论审核
- 垃圾过滤
- 用户屏蔽
- 统计分析

### 分析报表
- 流量分析
- 用户分析
- 内容分析
- 转化分析
- 自定义报表

### 系统设置
- 网站配置
- 主题管理
- 插件管理
- 备份恢复
- 日志查看

## 技术架构

### 前端
- React 19 + TypeScript
- Ant Design 企业级 UI
- ECharts 数据可视化
- React Query 数据管理
- Redux 状态管理

### 后端
- Node.js + Express
- MongoDB 数据库
- JWT 认证
- RESTful API
- WebSocket 实时更新

### 存储
- 本地文件存储
- 云存储（AWS S3/阿里云 OSS）
- CDN 加速
- 备份系统

### 搜索
- Elasticsearch 全文搜索
- 索引管理
- 搜索分析
- 自动完成

## 数据模型

### Article（文章）
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  author: ObjectId,
  category: ObjectId,
  tags: [ObjectId],
  featured_image: String,
  status: String,
  views: Number,
  likes: Number,
  published_at: Date,
  created_at: Date,
  updated_at: Date
}
```

### Category（分类）
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  icon: String,
  color: String,
  order: Number,
  created_at: Date
}
```

### Media（媒体）
```javascript
{
  _id: ObjectId,
  filename: String,
  url: String,
  type: String,
  size: Number,
  width: Number,
  height: Number,
  uploaded_by: ObjectId,
  created_at: Date
}
```

## API 端点

### 文章
- `GET /api/articles` - 文章列表
- `GET /api/articles/:id` - 文章详情
- `POST /api/articles` - 创建文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章
- `POST /api/articles/:id/publish` - 发布文章

### 分类
- `GET /api/categories` - 分类列表
- `POST /api/categories` - 创建分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

### 媒体
- `GET /api/media` - 媒体列表
- `POST /api/media/upload` - 上传媒体
- `DELETE /api/media/:id` - 删除媒体

### 分析
- `GET /api/analytics/overview` - 概览数据
- `GET /api/analytics/traffic` - 流量数据
- `GET /api/analytics/content` - 内容数据
- `GET /api/analytics/users` - 用户数据

## 部署架构

### 开发环境
- 本地开发服务器
- 本地 MongoDB
- 本地文件存储

### 测试环境
- Docker 容器
- 测试数据库
- 测试存储

### 生产环境
- Kubernetes 集群
- MongoDB Atlas
- AWS S3 存储
- CloudFlare CDN

## 性能优化

### 前端优化
- 代码分割
- 懒加载
- 缓存策略
- 图片优化
- 压缩传输

### 后端优化
- 数据库索引
- 查询优化
- 缓存层
- API 限流
- 异步处理

### 存储优化
- 文件压缩
- 图片缩略图
- CDN 加速
- 过期清理

## 安全措施

### 认证授权
- JWT 认证
- 权限检查
- 会话管理
- 密码加密

### 数据保护
- SQL 注入防护
- XSS 防护
- CSRF 防护
- 数据加密

### 审计日志
- 操作日志
- 访问日志
- 错误日志
- 安全日志

## 扩展性

### 插件系统
- 插件架构
- 钩子系统
- 插件市场
- 开发文档

### 主题系统
- 主题框架
- 主题市场
- 自定义选项
- 预览功能

### 集成
- Webhook
- API 集成
- 第三方服务
- 数据同步

## 开发路线图

### Phase 1（已完成）
- ✅ 核心功能开发
- ✅ 后台界面
- ✅ 用户管理
- ✅ 内容管理

### Phase 2（进行中）
- 🔄 分析统计
- 🔄 性能优化
- 🔄 安全加固
- 🔄 文档完善

### Phase 3（计划中）
- 📅 插件系统
- 📅 主题系统
- 📅 API 完善
- 📅 移动应用

### Phase 4（未来）
- 📅 AI 助手
- 📅 多语言支持
- 📅 企业功能
- 📅 SaaS 版本

## 使用指南

### 安装
```bash
git clone https://github.com/nskorean/cms.git
cd cms
npm install
npm run dev
```

### 配置
```bash
cp .env.example .env
# 编辑 .env 配置文件
npm run setup
```

### 启动
```bash
npm start
# 访问 http://localhost:3000/admin
```

## 支持和文档

- 用户文档：https://docs.nskorean.com/cms
- API 文档：https://api.nskorean.com/docs
- 开发指南：https://dev.nskorean.com
- 问题反馈：https://github.com/nskorean/cms/issues

---

**项目状态**：🚀 生产就绪
**最后更新**：2026-07-26
**许可证**：MIT
