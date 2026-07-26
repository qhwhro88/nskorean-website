# ⚡ 快速部署到 Cloudflare Pages（5 分钟）

## 🎯 目标
将 NSKOREAN 网站从 GitHub 部署到 Cloudflare Pages

## 📋 前置条件
- ✅ GitHub 账户
- ✅ GitHub 项目已推送：https://github.com/qhwhro88/nskorean-website
- ⏳ Cloudflare 账户（需要创建）

---

## 🚀 5 步快速部署

### 第 1 步：创建 Cloudflare 账户（2 分钟）

```
1. 打开 https://www.cloudflare.com/
2. 点击 "Sign Up"
3. 输入邮箱和密码
4. 验证邮箱
5. 选择免费计划
```

### 第 2 步：登录 Cloudflare（1 分钟）

```
1. 打开 https://dash.cloudflare.com/
2. 输入邮箱和密码
3. 点击 "Log In"
```

### 第 3 步：创建 Pages 项目（1 分钟）

```
1. 在左侧菜单找到 "Pages"
2. 点击 "Create a project"
3. 点击 "Connect to Git"
```

### 第 4 步：连接 GitHub（1 分钟）

```
1. 点击 "Connect GitHub account"
2. 登录 GitHub
3. 授权 Cloudflare
4. 在仓库列表中找到 "nskorean-website"
5. 点击选择
6. 点击 "Begin setup"
```

### 第 5 步：部署（1 分钟）

```
设置以下值：
- Project name: nskorean-website
- Production branch: master
- Build command: （留空）
- Build output directory: .

然后点击 "Save and Deploy"
```

---

## ✅ 完成！

等待 1-2 分钟后，您会看到：

```
✅ Deployment successful
🌐 Your site is live at: https://nskorean-website.pages.dev
```

---

## 🌐 绑定自定义域名（可选）

### 购买域名
- 在 Cloudflare 中购买：$8.95/年
- 或在其他注册商购买

### 添加域名
```
1. 进入 Pages 项目设置
2. 点击 "Custom domains"
3. 输入 "nskorean.com"
4. 点击 "Continue"
5. 点击 "Activate domain"
```

**等待 5-30 分钟生效**

---

## 🔄 自动更新

每次推送到 GitHub 时自动部署：

```bash
git add .
git commit -m "Update website"
git push origin master
```

Cloudflare 会自动部署（1-2 分钟）

---

## 📊 查看部署状态

1. 进入 Cloudflare 控制台
2. 点击 "Pages"
3. 选择 "nskorean-website"
4. 点击 "Deployments"
5. 查看部署列表

---

## 🆘 遇到问题？

### 部署失败
- 检查 GitHub 仓库是否正确
- 查看部署日志

### 页面加载缓慢
- 启用 Brotli 压缩
- 启用 HTTP/3

### 域名不生效
- 等待 DNS 生效（最多 24 小时）
- 使用 `nslookup nskorean.com` 检查

---

## 📚 更多帮助

- **完整部署指南**: [DEPLOY_TO_CLOUDFLARE.md](./DEPLOY_TO_CLOUDFLARE.md)
- **快速开始**: [QUICK_START.md](./QUICK_START.md)
- **Cloudflare 文档**: https://developers.cloudflare.com/pages/

---

**就这么简单！** 🎉

您的网站现已在线！

---

**更新日期**: 2026-07-26
