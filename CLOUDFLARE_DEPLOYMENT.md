# Cloudflare Pages 部署指南

本指南将帮助您将 NSKOREAN 网站部署到 Cloudflare Pages。

## ✅ 前置条件

- ✅ GitHub 账户（已完成）
- ✅ 代码已推送到 GitHub（已完成）
- ✅ Cloudflare 账户（需要创建）
- ✅ 自定义域名（可选）

## 📋 部署步骤

### 第一步：创建 Cloudflare 账户

1. 访问 [Cloudflare 官网](https://www.cloudflare.com/)
2. 点击 "注册" 创建免费账户
3. 验证邮箱地址
4. 完成账户设置

### 第二步：连接 GitHub 仓库

1. **登录 Cloudflare 控制台**
   - 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)
   - 使用您的账户登录

2. **进入 Pages 项目**
   - 在左侧菜单找到 "Pages"
   - 点击 "创建项目"
   - 选择 "连接到 Git"

3. **授权 GitHub**
   - 点击 "连接 GitHub 账户"
   - 在 GitHub 中授予 Cloudflare 访问权限
   - 选择您的账户

4. **选择仓库**
   - 在仓库列表中找到 `nskorean-website`
   - 点击 "连接"

### 第三步：配置构建设置

在 "设置构建和部署" 页面：

| 字段 | 值 |
|------|-----|
| **项目名称** | `nskorean-website` |
| **生产分支** | `master` |
| **Build command** | （留空） |
| **Build output directory** | `.` |
| **Root directory** | `/` |

**重要**：由于这是静态网站，不需要构建命令。

### 第四步：部署

1. 点击 "保存并部署"
2. Cloudflare 将自动部署您的网站
3. 等待部署完成（通常 1-2 分钟）
4. 您将获得一个 `*.pages.dev` 的临时域名

**示例**：`nskorean-website.pages.dev`

---

## 🌐 绑定自定义域名

### 方式一：使用 Cloudflare 管理的域名（推荐）

#### 步骤 1：购买域名

1. 在 Cloudflare 中购买域名：
   - 进入 Cloudflare 控制台
   - 点击 "域名"
   - 点击 "注册域名"
   - 搜索 `nskorean.com`
   - 完成购买

2. 或在其他注册商购买后转入 Cloudflare

#### 步骤 2：添加自定义域

1. 进入 Pages 项目设置
2. 点击 "自定义域"
3. 输入您的域名（例如 `nskorean.com`）
4. 点击 "继续"
5. Cloudflare 会自动配置 DNS 记录
6. 点击 "激活域名"

**等待时间**：通常 5-30 分钟生效

### 方式二：使用其他注册商的域名

#### 步骤 1：获取 Cloudflare DNS 记录

1. 进入 Pages 项目设置
2. 点击 "自定义域"
3. 输入您的域名
4. Cloudflare 会提示您更新 DNS 记录
5. 复制 Cloudflare 提供的 DNS 记录

#### 步骤 2：更新域名 DNS

1. 登录您的域名注册商（如 GoDaddy、Namecheap 等）
2. 进入 DNS 管理
3. 删除现有的 DNS 记录
4. 添加 Cloudflare 提供的 DNS 记录：
   ```
   NS: ns1.cloudflare.com
   NS: ns2.cloudflare.com
   ```

#### 步骤 3：等待 DNS 生效

- **通常需要 24 小时**（有时更快）
- 使用 `nslookup` 检查：
  ```bash
  nslookup nskorean.com
  ```

---

## 🔒 SSL/TLS 证书

Cloudflare 自动为所有网站提供免费的 SSL/TLS 证书：

- ✅ 自动 HTTPS
- ✅ 免费 SSL 证书
- ✅ 自动续期
- ✅ 支持通配符域名

**验证 HTTPS**：
```bash
curl -I https://nskorean.com
# 应该看到 "HTTP/2 200" 和 SSL 证书信息
```

---

## ⚡ 性能优化

### 启用 Brotli 压缩

1. 进入 Cloudflare 控制台
2. 选择您的域名
3. 进入 "Speed" → "Optimization"
4. 启用 "Brotli"

### 启用 HTTP/3

1. 进入 "Network"
2. 启用 "HTTP/3 (QUIC)"

### 配置缓存规则

创建 `_headers` 文件来自定义缓存：

```
/*
  Cache-Control: public, max-age=3600
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block

/index.html
  Cache-Control: public, max-age=300

/*.js
  Cache-Control: public, max-age=31536000

/*.css
  Cache-Control: public, max-age=31536000

/images/*
  Cache-Control: public, max-age=31536000
```

---

## 🔐 安全设置

### 启用 WAF（Web 应用防火墙）

1. 进入 Cloudflare 控制台
2. 选择您的域名
3. 进入 "Security" → "WAF"
4. 启用 "Cloudflare Managed Ruleset"

### 启用 DDoS 防护

- Cloudflare 自动提供 DDoS 防护
- 免费计划包括基础防护

### 启用速率限制

1. 进入 "Security" → "Rate Limiting"
2. 创建规则限制请求频率
3. 例如：限制每分钟 100 个请求

---

## 📊 监控和分析

### 查看部署日志

1. 进入 Pages 项目
2. 点击 "部署" 标签
3. 查看每次部署的日志和状态

### 启用分析

1. 进入项目设置
2. 启用 "Web Analytics"
3. 查看访问统计

### 自定义分析

在 HTML 中添加 Cloudflare Analytics：

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

---

## 🔄 自动部署

配置完成后，每次推送到 GitHub 时，Cloudflare 会自动部署：

```bash
# 本地修改代码
git add .
git commit -m "Update website"
git push origin master

# Cloudflare 会自动部署（通常 1-2 分钟）
```

**查看部署状态**：
1. 进入 Pages 项目
2. 点击 "部署" 标签
3. 查看最新部署的状态

---

## 🛠️ 高级配置

### 自定义错误页面

创建 `404.html` 和 `500.html` 文件：

```html
<!-- 404.html -->
<!DOCTYPE html>
<html>
<head>
  <title>页面未找到</title>
</head>
<body>
  <h1>404 - 页面未找到</h1>
  <p><a href="/">返回首页</a></p>
</body>
</html>
```

### 重定向规则

创建 `_redirects` 文件：

```
# 重定向示例
/old-page /new-page 301
/blog/* /news/:splat 301
/api/* https://api.example.com/:splat 200
```

### 环境变量

在 Pages 设置中添加环境变量：

1. 进入项目设置
2. 点击 "环境变量"
3. 添加变量（可在 JavaScript 中通过 `process.env` 访问）

---

## 📱 预览部署

### 预览链接

每个部署都有一个唯一的预览链接：

```
https://[hash].nskorean-website.pages.dev
```

### 分支预览

为不同的分支创建预览环境：

1. 进入项目设置
2. 点击 "构建、部署和分支"
3. 配置分支预览规则

---

## 🚨 故障排查

### 部署失败

**问题**：部署显示错误

**解决**：
1. 检查 GitHub 仓库是否正确
2. 查看部署日志找出错误
3. 修复代码并重新推送

### 页面加载缓慢

**问题**：网站加载速度慢

**解决**：
1. 启用 Brotli 压缩
2. 启用 HTTP/3
3. 优化资源大小（压缩图片、CSS 等）
4. 使用 Cloudflare 的性能分析工具

### 域名未生效

**问题**：访问自定义域名显示 404

**解决**：
1. 检查 DNS 设置是否正确
2. 等待 DNS 生效（最多 24 小时）
3. 使用 `nslookup` 验证 DNS 记录

### HTTPS 证书错误

**问题**：浏览器显示 SSL 证书错误

**解决**：
1. 等待 Cloudflare 生成证书（通常 5-30 分钟）
2. 清除浏览器缓存
3. 尝试使用隐身模式访问

---

## 📈 性能指标

### 推荐的性能目标

| 指标 | 目标 |
|------|------|
| **首字节时间 (TTFB)** | < 100ms |
| **首次内容绘制 (FCP)** | < 1.8s |
| **最大内容绘制 (LCP)** | < 2.5s |
| **累积布局偏移 (CLS)** | < 0.1 |

### 检查性能

1. 使用 [Google PageSpeed Insights](https://pagespeed.web.dev/)
2. 使用 [WebPageTest](https://www.webpagetest.org/)
3. 使用 Cloudflare 的分析工具

---

## ✅ 部署检查清单

- [ ] GitHub 账户已创建
- [ ] 代码已推送到 GitHub
- [ ] Cloudflare 账户已创建
- [ ] Pages 项目已创建
- [ ] GitHub 已授权给 Cloudflare
- [ ] 仓库已连接
- [ ] 构建设置已配置
- [ ] 首次部署已完成
- [ ] 临时域名可访问
- [ ] 自定义域名已添加（可选）
- [ ] DNS 记录已更新（可选）
- [ ] SSL 证书已生效
- [ ] HTTPS 可访问
- [ ] 性能优化已启用
- [ ] 分析已启用
- [ ] WAF 已启用

---

## 📞 支持和资源

- **Cloudflare 文档**: https://developers.cloudflare.com/pages/
- **Cloudflare 社区**: https://community.cloudflare.com/
- **GitHub 文档**: https://docs.github.com/
- **网站性能优化**: https://web.dev/

---

## 🎉 部署完成！

您的 NSKOREAN 网站现在已在 Cloudflare Pages 上线！

**下一步**：
1. 监控网站性能
2. 收集用户反馈
3. 持续改进功能
4. 扩展内容库

---

**更新日期**: 2026-07-26
**Cloudflare Pages 文档版本**: v1.0
