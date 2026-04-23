#!/bin/bash

# 完整部署脚本
# 用途: 打包模板 -> 上传到远程服务器 -> 解压 -> 重启容器

set -e

# 脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=========================================="
echo "  前端模板完整部署流程"
echo "=========================================="
echo ""

# 步骤 1: 打包模板
echo "步骤 1/4: 打包模板"
echo "------------------------------------------"
cd "$PROJECT_ROOT"

echo "打包所有模板 (react-vite, vue3-vite, react-next)..."
pnpm pack:all

echo "✓ 模板打包完成"
echo ""

# 显示打包结果
echo "打包文件列表:"
ls -lh "$PROJECT_ROOT/zip/"
echo ""

# 步骤 2-4: 上传、解压、重启
echo "步骤 2-4: 上传、解压、重启容器"
echo "------------------------------------------"
"$SCRIPT_DIR/upload-templates.sh"

echo ""
echo "=========================================="
echo "  部署完成！"
echo "=========================================="
