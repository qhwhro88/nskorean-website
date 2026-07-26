# NSKOREAN 网站部署指南

本指南将帮助您将 NSKOREAN 网站部署到 Cloudflare Pages 并绑定自定义域名。

## 📋 前置要求

- GitHub 账户
- Cloudflare 账户（免费）
- 自定义域名（可选）

## 🚀 部署步骤

### 第一步：推送到 GitHub

1. **创建 GitHub 仓库**
   ```bash
   # 如果还没有初始化 Git
   git init
   git add .
   git commit -m "Initial commit: NSKOREAN website"
   ```

2. **创建新仓库**
   - 访问 [GitHub](https://github.com/new)
   - 创建新仓库 `nskorean-website`
   - 选择 Public（推荐）

3. **推送代码**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nskorean-website.git
   git branch -M main
   git push -u origin main
   ```

### 第二步：连接 Cloudflare Pages

1. **登录 Cloudflare**
   - 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)
   - 登录您的账户

2. **创建 Pages 项目**
   - 在左侧菜单找到 "Pages"
   - 点击 "创建项目"
   - 选择 "连接到 Git"

3. **授权 GitHub**
   - 点击 "连接 GitHub 账户"
   - 授予 Cloudflare 访问权限
   - 选择 `nskorean-website` 仓库

4. **配置构建设置**
   - **项目名称**: `nskorean-website`
   - **生产分支**: `main`
   - **Build command**: 留空（无需构建）
   - **Build output directory**: `.`
   - 点击 "保存并部署"

### 第三步：等待部署完成

- Cloudflare 将自动构建并部署您的网站
- 部署完成后，您将获得一个 `*.pages.dev` 的临时域名
- 例如：`nskorean-website.pages.dev`

### 第四步：绑定自定义域名

#### 方式一：使用 Cloudflare 管理的域名

1. **购买域名**
   - 在 Cloudflare 中购买域名（可选）
   - 或在其他域名注册商购买

2. **添加自定义域**
   - 进入 Pages 项目设置
   - 点击 "自定义域"
   - 输入您的域名（例如 `nskorean.com`）
   - 点击 "继续"

3. **配置 DNS**
   - 如果域名在 Cloudflare 管理：自动配置
   - 如果域名在其他注册商：
     - 复制 Cloudflare 提供的 DNS 记录
     - 登录您的域名注册商
     - 更新 DNS 设置
     - 等待 DNS 生效（通常 24 小时内）

#### 方式二：使用 CNAME 记录

1. **获取 CNAME 值**
   - 在 Cloudflare Pages 设置中查看
   - 通常为 `nskorean-website.pages.dev`

2. **更新 DNS 记录**
   - 登录您的域名注册商
   - 添加 CNAME 记录：
     - **Name**: `www` 或 `@`
     - **Value**: `nskorean-website.pages.dev`
   - 保存更改

3. **等待 DNS 生效**
   - 通常需要 5 分钟到 24 小时
   - 使用 `nslookup` 或 `dig` 检查：
     ```bash
     nslookup nskorean.com
     ```

## 🔒 SSL/TLS 证书

Cloudflare Pages 自动为所有站点提供 SSL/TLS 证书，包括自定义域名。

- ✅ 自动 HTTPS
- ✅ 免费 SSL 证书
- ✅ 自动续期

## 🌍 全球 CDN

您的网站将通过 Cloudflare 的全球 CDN 加速：

- 📍 200+ 个数据中心
- ⚡ 自动缓存优化
- 🚀 快速全球访问

## 📊 监控和分析

### 查看部署日志

1. 进入 Pages 项目
2. 点击 "部署" 标签
3. 查看每次部署的日志

### 启用分析

1. 进入项目设置
2. 启用 "Web Analytics"
3. 查看访问统计

## 🔄 自动部署

配置完成后，每次推送到 GitHub 时，Cloudflare 将自动部署：

```bash
git add .
git commit -m "Update website"
git push origin main
```

部署通常在 1-2 分钟内完成。

## 🛠️ 高级配置

### 自定义缓存规则

创建 `_headers` 文件来自定义 HTTP 头：

```
/*
  Cache-Control: public, max-age=3600
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
```

### 重定向规则

创建 `_redirects` 文件：

```
# 重定向示例
/old-page /new-page 301
/blog/* /news/:splat 301
```

### 环境变量

在 Pages 设置中添加环境变量：

1. 进入项目设置
2. 点击 "环境变量"
3. 添加变量（可在 JavaScript 中通过 `process.env` 访问）

## 📧 邮件通知

### 配置部署通知

1. 进入项目设置
2. 点击 "通知"
3. 选择通知方式（邮件、Slack 等）

## 🚨 故障排查

### 部署失败

**问题**: 部署显示错误
**解决**:
1. 检查 GitHub 仓库是否正确
2. 查看部署日志找出错误
3. 修复代码并重新推送

### 域名未生效

**问题**: 访问自定义域名显示 404
**解决**:
1. 检查 DNS 设置是否正确
2. 等待 DNS 生效（最多 24 小时）
3. 使用 `nslookup` 验证 DNS 记录

### 页面加载缓慢

**问题**: 网站加载速度慢
**解决**:
1. 检查 Cloudflare 缓存设置
2. 优化资源大小（压缩图片、CSS 等）
3. 使用 Cloudflare 的性能分析工具

## 📈 性能优化

### 启用 Brotli 压缩

Cloudflare 自动启用 Brotli 压缩，可减少 20% 的传输大小。

### 启用 HTTP/3

在 Cloudflare 设置中启用 HTTP/3 以提高性能。

### 缓存策略

- **HTML**: 不缓存或短期缓存
- **CSS/JS**: 长期缓存（1 年）
- **图片**: 长期缓存（1 年）

## 🔐 安全设置

### 启用 WAF

1. 进入 Cloudflare 控制台
2. 选择您的域名
3. 进入 "安全" → "WAF"
4. 启用 "Cloudflare 托管规则"

### 启用 DDoS 防护

- Cloudflare 自动提供 DDoS 防护
- 免费计划包括基础防护

### 启用速率限制

1. 进入 "安全" → "速率限制"
2. 创建规则限制请求频率
3. 防止滥用和爬虫

## 📱 移动优化

您的网站已经是响应式设计，在所有设备上都能正常显示。

- ✅ 移动友好
- ✅ 快速加载
- ✅ 触摸优化

## 🎯 SEO 优化

### 提交到搜索引擎

1. **Google Search Console**
   - 访问 [Google Search Console](https://search.google.com/search-console)
   - 添加您的网站
   - 提交 sitemap

2. **Bing Webmaster Tools**
   - 访问 [Bing Webmaster Tools](https://www.bing.com/webmaster)
   - 添加您的网站

### 创建 Sitemap

创建 `sitemap.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nskorean.com/</loc>
    <lastmod>2026-07-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nskorean.com/article.html</loc>
    <lastmod>2026-07-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 📞 支持

- **Cloudflare 文档**: https://developers.cloudflare.com/pages/
- **Cloudflare 社区**: https://community.cloudflare.com/
- **GitHub Pages 替代品**: Cloudflare Pages 提供更好的性能和功能

## ✅ 部署检查清单

- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 main 分支
- [ ] Cloudflare Pages 项目已创建
- [ ] 自动部署已启用
- [ ] 自定义域名已配置
- [ ] DNS 记录已更新
- [ ] SSL 证书已生效
- [ ] 网站可通过 HTTPS 访问
- [ ] 性能优化已启用
- [ ] 安全设置已配置
- [ ] 分析已启用
- [ ] SEO 已优化

---

**部署完成！** 🎉

您的 NSKOREAN 网站现在已在线，可通过自定义域名访问。
