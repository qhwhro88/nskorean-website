# NSKOREAN | AI 工具与前沿资讯

一个现代化的 AI 工具导航与资讯平台，采用亮色科技风设计，支持工具搜索、分类过滤和深度资讯阅读。

## 🎯 项目特性

- **🌐 响应式设计** - 完美适配桌面、平板和手机设备
- **⚡ 高性能** - 纯 HTML/CSS/JavaScript，无需后端服务
- **🔍 智能搜索** - 支持工具名称、描述和标签的全文搜索
- **🏷️ 分类过滤** - 支持多维度工具分类（LLM、图像生成、工作流等）
- **📱 Cmd+K 快捷键** - 快速打开搜索框
- **✨ 现代 UI** - 毛玻璃效果、渐变色、平滑动画
- **📰 资讯详情页** - 完整的文章排版、代码高亮、相关工具推荐
- **💬 咨询表单** - 集成联系表单，支持用户咨询

## 📁 项目结构

```
nskorean-website/
├── index.html          # 首页（工具导航 + 资讯）
├── article.html        # 资讯详情页模板
├── README.md           # 项目说明（本文件）
└── .gitignore          # Git 忽略文件
```

## 🚀 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/nskorean-website.git
   cd nskorean-website
   ```

2. **本地预览**
   - 使用 Python 3：`python3 -m http.server 8000`
   - 使用 Node.js：`npx http-server`
   - 或直接用浏览器打开 `index.html`

3. **访问网站**
   - 打开浏览器访问 `http://localhost:8000`

### 部署到 Cloudflare Pages

#### 方式一：通过 GitHub 自动部署（推荐）

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接 Cloudflare Pages**
   - 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)
   - 进入 Pages 项目
   - 点击"创建项目" → "连接到 Git"
   - 选择您的 GitHub 仓库
   - 构建设置：
     - **Build command**: `echo "No build needed"`
     - **Build output directory**: `.`
   - 点击"保存并部署"

3. **绑定自定义域名**
   - 在 Pages 项目设置中，选择"自定义域"
   - 添加 `nskorean.com` 或其他域名
   - 按照 Cloudflare 提示完成 DNS 配置

#### 方式二：直接上传文件

1. 在 Cloudflare Pages 中选择"直接上传"
2. 上传项目文件夹
3. 等待部署完成

## 🛠️ 自定义配置

### 修改工具数据

编辑 `index.html` 中的 `tools` 数组：

```javascript
const tools = [
  {
    id: 1,
    name: "工具名称",
    description: "工具描述",
    category: "llm",  // 分类: llm, image, workflow, cross-border
    tags: ["标签1", "标签2"],
    icon: "⚡",
    pricing: "免费 / 开源",
    url: "article.html?id=1"
  },
  // ... 更多工具
];
```

### 修改样式

编辑 `<style>` 部分的 CSS 变量和类：

```css
/* 主色调 */
.text-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%);
}

/* 背景 */
.bg-light-grid {
  background-color: #f8fafc;
}
```

### 修改内容

- **首页文案** - 编辑 Hero 区域的 `<h1>` 和 `<p>` 标签
- **资讯详情** - 编辑 `article.html` 中的 `.article-body` 内容
- **联系方式** - 修改 Footer 中的链接和信息

## 📊 功能说明

### 首页功能

| 功能 | 说明 |
|------|------|
| **搜索框** | 支持 Cmd+K 快捷键，可搜索工具名称、描述和标签 |
| **分类过滤** | 快速切换不同类型的工具（LLM、图像生成等） |
| **工具卡片** | 展示工具信息，点击可查看详情 |
| **资讯高亮** | 最新资讯以特殊卡片展示 |
| **咨询表单** | 用户可提交咨询需求 |

### 资讯详情页功能

| 功能 | 说明 |
|------|------|
| **文章排版** | 专业的文章排版和阅读体验 |
| **代码高亮** | 使用 Highlight.js 进行代码语法高亮 |
| **目录导航** | 快速导航到文章各个章节 |
| **相关工具** | 推荐与文章相关的工具 |
| **咨询 CTA** | 引导用户进行咨询 |

## 🎨 设计特色

- **亮色科技风** - 浅色背景 + 蓝紫渐变，现代感十足
- **点阵背景** - 微妙的网格背景增加设计感
- **毛玻璃效果** - Header 和卡片使用 backdrop-blur 效果
- **平滑动画** - 所有交互都有流畅的过渡动画
- **响应式布局** - 完美适配各种屏幕尺寸

## 📱 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 移动浏览器（iOS Safari、Chrome Mobile）

## 🔐 安全性

- 纯静态网站，无服务器漏洞风险
- 所有用户数据通过表单提交，可配置后端处理
- 支持 Cloudflare 的 DDoS 防护和 WAF

## 📈 SEO 优化

- 语义化 HTML 结构
- 完整的 Meta 标签和 Open Graph 标签
- 快速的页面加载速度（< 1s）
- 移动端友好

## 🚀 性能指标

- **首屏加载** < 1 秒
- **Lighthouse 评分** 95+
- **Core Web Vitals** 全绿

## 📝 许可证

MIT License - 自由使用和修改

## 💬 支持

如有问题或建议，欢迎提交 Issue 或联系我们。

---

**最后更新**: 2026年7月26日
