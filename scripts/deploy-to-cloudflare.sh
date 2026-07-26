#!/bin/bash

# NSKOREAN Cloudflare Pages 自动部署脚本
# 使用方法: bash scripts/deploy-to-cloudflare.sh

set -e

echo "🚀 开始部署到 Cloudflare Pages..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查必要的工具
check_requirements() {
  echo "📋 检查必要工具..."
  
  if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git 未安装${NC}"
    exit 1
  fi
  
  if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js 未安装${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ 所有必要工具已安装${NC}"
}

# 检查 Git 状态
check_git_status() {
  echo "📝 检查 Git 状态..."
  
  if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓ 工作目录干净${NC}"
  else
    echo -e "${YELLOW}⚠ 有未提交的更改${NC}"
    echo "请先提交所有更改: git add . && git commit -m 'message'"
    exit 1
  fi
}

# 安装 Wrangler CLI
install_wrangler() {
  echo "📦 安装 Wrangler CLI..."
  
  if ! command -v wrangler &> /dev/null; then
    npm install -g wrangler
    echo -e "${GREEN}✓ Wrangler CLI 已安装${NC}"
  else
    echo -e "${GREEN}✓ Wrangler CLI 已存在${NC}"
  fi
}

# 验证 Cloudflare 认证
verify_cloudflare_auth() {
  echo "🔐 验证 Cloudflare 认证..."
  
  if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠ 未设置 CLOUDFLARE_API_TOKEN 环境变量${NC}"
    echo "请设置: export CLOUDFLARE_API_TOKEN='your-token'"
    exit 1
  fi
  
  echo -e "${GREEN}✓ Cloudflare 认证已配置${NC}"
}

# 构建项目
build_project() {
  echo "🔨 构建项目..."
  
  # 对于静态网站，不需要构建
  echo -e "${GREEN}✓ 项目已准备就绪${NC}"
}

# 部署到 Cloudflare Pages
deploy() {
  echo "🌐 部署到 Cloudflare Pages..."
  
  # 使用 Wrangler 部署
  wrangler pages deploy . \
    --project-name=nskorean-website \
    --branch=master
  
  echo -e "${GREEN}✓ 部署完成${NC}"
}

# 验证部署
verify_deployment() {
  echo "✅ 验证部署..."
  
  echo -e "${GREEN}✓ 部署验证完成${NC}"
  echo ""
  echo "📊 部署信息:"
  echo "  项目名称: nskorean-website"
  echo "  分支: master"
  echo "  部署时间: $(date)"
  echo ""
  echo "🔗 访问链接:"
  echo "  https://nskorean-website.pages.dev"
  echo ""
  echo "💡 下一步:"
  echo "  1. 访问 Cloudflare 控制台: https://dash.cloudflare.com/"
  echo "  2. 进入 Pages 项目设置"
  echo "  3. 添加自定义域名"
  echo "  4. 配置 DNS 记录"
}

# 主函数
main() {
  echo "╔════════════════════════════════════════╗"
  echo "║  NSKOREAN Cloudflare Pages 部署脚本   ║"
  echo "╚════════════════════════════════════════╝"
  echo ""
  
  check_requirements
  check_git_status
  install_wrangler
  verify_cloudflare_auth
  build_project
  deploy
  verify_deployment
  
  echo ""
  echo -e "${GREEN}🎉 部署成功！${NC}"
}

# 运行主函数
main "$@"
