# Cloudflare Pages 自动部署配置指南

本文档说明如何在 Cloudflare Pages 中配置 GitHub 自动部署。

---

## 📋 前置条件

✅ GitHub 账户已创建
✅ 代码已推送到 GitHub (`qhwhro88/nskorean-website`)
✅ Cloudflare 账户已创建
✅ 已有 Cloudflare Pages 项目

---

## 🚀 快速部署步骤

### 第一步：登录 Cloudflare 控制台

1. 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)
2. 使用您的 Cloudflare 账户登录

### 第二步：进入 Pages 项目

1. 在左侧菜单中找到 **"Pages"**
2. 如果已有项目，点击项目名称进入
3. 如果没有项目，点击 **"创建项目"**

### 第三步：连接 GitHub 仓库

**如果是新项目：**

1. 点击 **"连接到 Git"**
2. 选择 **"GitHub"**
3. 授权 Cloudflare 访问您的 GitHub 账户
4. 在仓库列表中找到 `nskorean-website`
5. 点击 **"连接"**

**如果是现有项目：**

1. 进入项目设置
2. 点击 **"构建、部署和分支"**
3. 在 **"Git 配置"** 部分检查仓库连接

### 第四步：配置构建设置

在 **"设置构建和部署"** 页面，配置以下参数：

| 设置项 | 值 | 说明 |
|------|-----|------|
| **项目名称** | `nskorean-website` | 项目标识符 |
| **生产分支** | `master` | 主分支名称 |
| **Build command** | （留空） | 静态网站无需构建 |
| **Build output directory** | `.` | 根目录 |
| **Root directory** | `/` | 网站根路径 |

**重要**：这是一个静态网站，不需要构建命令。

### 第五步：保存并部署

1. 点击 **"保存并部署"** 按钮
2. Cloudflare 会自动部署您的网站
3. 等待部署完成（通常 1-2 分钟）

---

## ✅ 部署完成验证

### 获取临时域名

部署完成后，您将获得一个临时域名：

```
https://nskorean-website.pages.dev
```

### 测试网站

1. 访问临时域名
2. 验证所有页面正常加载
3. 检查搜索功能
4. 测试分类过滤

---

## 🔄 自动部署配置

配置完成后，每次推送到 GitHub 时，Cloudflare 会自动部署：

```bash
# 本地修改代码
git add .
git commit -m "Update website content"
git push origin master

# Cloudflare 会自动部署（通常 1-2 分钟）
```

### 查看部署状态

1. 进入 Cloudflare Pages 项目
2. 点击 **"部署"** 标签
3. 查看最新部署的状态和日志

---

## 🌐 绑定自定义域名

### 步骤 1：进入项目设置

1. 进入 Pages 项目
2. 点击 **"设置"** → **"自定义域"**

### 步骤 2：添加自定义域

1. 点击 **"添加自定义域"**
2. 输入您的域名（例如 `nskorean.com`）
3. 点击 **"继续"**

### 步骤 3：配置 DNS

**如果使用 Cloudflare 管理的域名：**
- Cloudflare 会自动配置 DNS 记录
- 点击 **"激活域名"** 完成配置

**如果使用其他注册商的域名：**
- 复制 Cloudflare 提供的 DNS 记录
- 登录您的域名注册商
- 更新 DNS 记录为 Cloudflare 的 NS 服务器
- 等待 DNS 生效（最多 24 小时）

---

## 📊 部署配置文件说明

### `_headers` 文件

这个文件配置 HTTP 响应头，用于：

- **缓存控制**：优化不同资源的缓存策略
- **安全头**：防止 XSS、点击劫持等攻击
- **性能优化**：使用 immutable 标记长期缓存

**主要配置**：

```
HTML 文件: max-age=300 (5 分钟)
JS/CSS: max-age=31536000 (1 年)
数据文件: max-age=3600 (1 小时)
```

### `_redirects` 文件

这个文件配置 URL 重定向规则：

- 将旧首页重定向到新首页（无价格版本）
- 保留其他页面的正常访问
- 支持 301 永久重定向和 200 内部重定向

---

## 🔒 安全配置

### 启用 SSL/TLS

Cloudflare 自动为所有网站提供免费的 SSL/TLS 证书：

- ✅ 自动 HTTPS
- ✅ 免费 SSL 证书
- ✅ 自动续期
- ✅ 支持通配符域名

### 启用 WAF（Web 应用防火墙）

1. 进入 Cloudflare 控制台
2. 选择您的域名
3. 进入 **"Security"** → **"WAF"**
4. 启用 **"Cloudflare Managed Ruleset"**

### 启用 DDoS 防护

- Cloudflare 自动提供 DDoS 防护
- 免费计划包括基础防护

---

## ⚡ 性能优化

### 启用 Brotli 压缩

1. 进入 Cloudflare 控制台
2. 选择您的域名
3. 进入 **"Speed"** → **"Optimization"**
4. 启用 **"Brotli"**

### 启用 HTTP/3

1. 进入 **"Network"**
2. 启用 **"HTTP/3 (QUIC)"**

### 启用 Minify

1. 进入 **"Speed"** → **"Optimization"**
2. 启用 **"Auto Minify"**（HTML、CSS、JavaScript）

---

## 📈 监控和分析

### 启用 Web Analytics

1. 进入项目设置
2. 启用 **"Web Analytics"**
3. 查看访问统计

### 查看部署日志

1. 进入 **"部署"** 标签
2. 点击具体的部署
3. 查看构建日志和部署状态

---

## 🛠️ 高级配置

### 环境变量

在 Pages 设置中添加环境变量：

1. 进入项目设置
2. 点击 **"环境变量"**
3. 添加变量（可在 JavaScript 中通过 `process.env` 访问）

### 分支预览

为不同的分支创建预览环境：

1. 进入项目设置
2. 点击 **"构建、部署和分支"**
3. 配置分支预览规则

---

## 🚨 故障排查

### 问题 1：部署失败

**症状**：部署显示错误

**解决方案**：
1. 检查 GitHub 仓库是否正确
2. 查看部署日志找出错误
3. 修复代码并重新推送

### 问题 2：页面加载缓慢

**症状**：网站加载速度慢

**解决方案**：
1. 启用 Brotli 压缩
2. 启用 HTTP/3
3. 优化资源大小（压缩图片、CSS 等）
4. 使用 Cloudflare 的性能分析工具

### 问题 3：域名未生效

**症状**：访问自定义域名显示 404

**解决方案**：
1. 检查 DNS 设置是否正确
2. 等待 DNS 生效（最多 24 小时）
3. 使用 `nslookup` 验证 DNS 记录

### 问题 4：HTTPS 证书错误

**症状**：浏览器显示 SSL 证书错误

**解决方案**：
1. 等待 Cloudflare 生成证书（通常 5-30 分钟）
2. 清除浏览器缓存
3. 尝试使用隐身模式访问

---

## ✅ 部署检查清单

- [ ] GitHub 账户已创建
- [ ] 代码已推送到 GitHub
- [ ] Cloudflare 账户已创建
- [ ] Pages 项目已创建
- [ ] GitHub 已授权给 Cloudflare
- [ ] 仓库已连接
- [ ] 构建设置已配置（无构建命令）
- [ ] 首次部署已完成
- [ ] 临时域名可访问
- [ ] 所有页面正常加载
- [ ] 搜索功能正常
- [ ] 分类过滤正常
- [ ] 自定义域名已添加（可选）
- [ ] DNS 记录已更新（可选）
- [ ] SSL 证书已生效
- [ ] HTTPS 可访问
- [ ] Brotli 压缩已启用
- [ ] HTTP/3 已启用
- [ ] WAF 已启用
- [ ] 分析已启用

---

## 📞 支持和资源

- **Cloudflare Pages 文档**: https://developers.cloudflare.com/pages/
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

**更新日期**: 2026-07-27
**版本**: 2.0
