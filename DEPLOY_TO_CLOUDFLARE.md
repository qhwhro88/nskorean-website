# 📋 在 Cloudflare Pages 部署 GitHub 项目 - 完整步骤指南

本指南将逐步指导您如何在 Cloudflare Pages 上部署 NSKOREAN 网站。

---

## ✅ 前置条件

- ✅ GitHub 账户（已有）
- ✅ GitHub 项目已推送（已完成）
- ⏳ Cloudflare 账户（需要创建）

---

## 🚀 部署步骤

### 第 1 步：创建 Cloudflare 账户

**如果您还没有 Cloudflare 账户：**

1. **访问 Cloudflare 官网**
   - 打开浏览器
   - 访问 https://www.cloudflare.com/
   
2. **点击注册**
   - 在右上角找到 "Sign Up" 按钮
   - 点击注册

3. **填写注册信息**
   - 输入邮箱地址
   - 设置密码
   - 同意条款
   - 点击 "Create Account"

4. **验证邮箱**
   - 检查您的邮箱
   - 点击验证链接
   - 完成邮箱验证

5. **完成账户设置**
   - 选择免费计划
   - 完成账户设置

---

### 第 2 步：进入 Cloudflare Pages

1. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com/
   - 输入邮箱和密码
   - 点击 "Log In"

2. **进入 Pages**
   - 在左侧菜单找到 "Pages"
   - 点击 "Pages"

3. **创建项目**
   - 点击 "Create a project" 按钮
   - 或点击 "Create project"

---

### 第 3 步：连接 GitHub 仓库

1. **选择 Git 连接**
   - 在创建项目页面
   - 选择 "Connect to Git"
   - 点击 "Connect to Git"

2. **授权 GitHub**
   - 点击 "Connect GitHub account"
   - 在弹出窗口中登录 GitHub
   - 输入 GitHub 用户名和密码
   - 点击 "Sign in"

3. **授予权限**
   - Cloudflare 会请求访问您的 GitHub 账户
   - 点击 "Authorize cloudflare"
   - 完成授权

4. **选择仓库**
   - 在仓库列表中找到 `nskorean-website`
   - 点击选择它
   - 点击 "Begin setup"

---

### 第 4 步：配置构建设置

在 "Set up builds and deployments" 页面：

#### 基本信息
| 字段 | 值 | 说明 |
|------|-----|------|
| **Project name** | `nskorean-website` | 项目名称 |
| **Production branch** | `master` | 生产分支 |

#### 构建设置
| 字段 | 值 | 说明 |
|------|-----|------|
| **Build command** | （留空） | 无需构建 |
| **Build output directory** | `.` | 输出目录 |
| **Root directory** | `/` | 根目录 |

#### 环境变量（可选）
- 暂时不需要设置

**重要提示**：
- ✅ 这是一个**静态网站**，不需要构建命令
- ✅ 所有文件都已准备好，可以直接部署

---

### 第 5 步：部署

1. **检查配置**
   - 确认所有设置正确
   - 点击 "Save and Deploy"

2. **等待部署**
   - Cloudflare 开始部署
   - 通常需要 1-2 分钟
   - 您可以看到部署进度

3. **部署完成**
   - 部署完成后，您会看到 "Success" 消息
   - 获得一个临时域名，格式如：
     ```
     https://nskorean-website.pages.dev
     ```

4. **访问网站**
   - 点击临时域名链接
   - 或复制链接到浏览器
   - 您的网站现已在线！

---

## 🌐 绑定自定义域名

### 方式一：使用 Cloudflare 管理的域名（推荐）

#### 步骤 1：购买域名

1. **在 Cloudflare 中购买**
   - 进入 Cloudflare 控制台
   - 点击左侧菜单中的 "Registrar"
   - 点击 "Register domain"
   - 搜索 `nskorean.com`
   - 选择并购买

2. **或在其他注册商购买**
   - 在 GoDaddy、Namecheap 等购买
   - 然后转入 Cloudflare（可选）

#### 步骤 2：添加自定义域

1. **进入 Pages 项目**
   - 进入 Cloudflare 控制台
   - 点击 "Pages"
   - 选择 `nskorean-website` 项目

2. **进入设置**
   - 点击 "Settings"
   - 找到 "Custom domains"
   - 点击 "Add custom domain"

3. **输入域名**
   - 输入 `nskorean.com`
   - 点击 "Continue"

4. **激活域名**
   - Cloudflare 会自动配置 DNS
   - 点击 "Activate domain"
   - 等待激活完成

**等待时间**：5-30 分钟生效

### 方式二：使用其他注册商的域名

#### 步骤 1：获取 DNS 记录

1. **进入 Pages 项目**
   - 进入 Cloudflare 控制台
   - 点击 "Pages"
   - 选择 `nskorean-website` 项目

2. **添加自定义域**
   - 点击 "Settings"
   - 点击 "Custom domains"
   - 点击 "Add custom domain"
   - 输入您的域名

3. **获取 DNS 记录**
   - Cloudflare 会显示需要更新的 DNS 记录
   - 记下这些记录

#### 步骤 2：更新 DNS 记录

1. **登录域名注册商**
   - 登录 GoDaddy、Namecheap 等
   - 进入 DNS 管理

2. **删除旧记录**
   - 删除现有的 DNS 记录

3. **添加新记录**
   - 添加 Cloudflare 提供的 DNS 记录
   - 通常是两条 NS 记录：
     ```
     NS: ns1.cloudflare.com
     NS: ns2.cloudflare.com
     ```

4. **保存**
   - 保存更改

#### 步骤 3：等待 DNS 生效

- **通常需要 24 小时**
- 有时会更快（几分钟到几小时）
- 可以使用 `nslookup` 检查：
  ```bash
  nslookup nskorean.com
  ```

---

## 🔒 SSL/TLS 证书

✅ **自动配置**

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

1. **进入 Cloudflare 控制台**
   - 选择您的域名
   - 进入 "Speed" 标签

2. **启用优化**
   - 点击 "Optimization"
   - 启用 "Brotli"
   - 启用 "HTTP/3 (QUIC)"

### 配置缓存

创建 `_headers` 文件来自定义缓存（已包含示例）：

```
/*
  Cache-Control: public, max-age=3600
  X-Content-Type-Options: nosniff

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

1. **进入安全设置**
   - 选择您的域名
   - 进入 "Security" 标签

2. **启用 WAF**
   - 点击 "WAF"
   - 启用 "Cloudflare Managed Ruleset"

### 启用 DDoS 防护

✅ **自动启用**
- Cloudflare 自动提供 DDoS 防护
- 免费计划包括基础防护

### 启用速率限制

1. **进入 Rate Limiting**
   - 进入 "Security" → "Rate Limiting"

2. **创建规则**
   - 点击 "Create rule"
   - 设置限制（例如：每分钟 100 个请求）
   - 保存规则

---

## 📊 监控和分析

### 查看部署日志

1. **进入 Pages 项目**
   - 进入 Cloudflare 控制台
   - 点击 "Pages"
   - 选择 `nskorean-website` 项目

2. **查看部署**
   - 点击 "Deployments" 标签
   - 查看部署列表
   - 点击部署查看日志

### 启用分析

1. **进入项目设置**
   - 点击 "Settings"
   - 找到 "Analytics"

2. **启用 Web Analytics**
   - 启用 "Web Analytics"
   - 查看访问统计

---

## 🔄 自动更新

配置完成后，每次推送到 GitHub 时自动部署：

```bash
# 本地修改代码
git add .
git commit -m "Update website"
git push origin master

# Cloudflare 会自动部署（通常 1-2 分钟）
```

**查看部署状态**：
1. 进入 Pages 项目
2. 点击 "Deployments" 标签
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
```

### 环境变量

在 Pages 设置中添加环境变量：

1. 进入项目设置
2. 点击 "Environment variables"
3. 添加变量

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
2. 点击 "Build, deployments and branches"
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
3. 优化资源大小
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

## ✅ 部署检查清单

### 前期准备
- [ ] GitHub 账户已创建
- [ ] 代码已推送到 GitHub
- [ ] Cloudflare 账户已创建

### 部署配置
- [ ] Pages 项目已创建
- [ ] GitHub 已授权给 Cloudflare
- [ ] 仓库已连接
- [ ] 构建设置已配置
  - [ ] Build command: （留空）
  - [ ] Build output directory: `.`

### 部署验证
- [ ] 首次部署已完成
- [ ] 临时域名可访问
- [ ] 所有页面加载正常
- [ ] 评论系统正常工作

### 域名配置
- [ ] 自定义域名已购买
- [ ] 域名已添加到 Cloudflare
- [ ] DNS 记录已更新
- [ ] 域名已生效

### 安全和性能
- [ ] SSL 证书已生效
- [ ] HTTPS 可访问
- [ ] 压缩已启用
- [ ] HTTP/3 已启用
- [ ] WAF 已启用
- [ ] 分析已启用

---

## 📞 获取帮助

- **Cloudflare 文档**: https://developers.cloudflare.com/pages/
- **Cloudflare 社区**: https://community.cloudflare.com/
- **GitHub 文档**: https://docs.github.com/
- **网站性能**: https://web.dev/

---

## 🎉 部署完成！

恭喜！您的 NSKOREAN 网站现已在 Cloudflare Pages 上线！

**下一步**：
1. 监控网站性能
2. 收集用户反馈
3. 持续改进功能
4. 扩展内容库

---

**更新日期**: 2026-07-26
**版本**: 1.0
**状态**: ✅ 完整指南
