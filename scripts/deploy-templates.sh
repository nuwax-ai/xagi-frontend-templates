#!/bin/bash

# 完整部署脚本
# 用途: 打包模板 -> 上传到远程服务器 -> 重启 rcoder 容器内 nuwax-file-server 进程

set -e

# 脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=========================================="
echo "  前端模板完整部署流程"
echo "=========================================="
echo ""

# 步骤 1: 打包模板
echo "步骤 1/3: 打包模板"
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

# 步骤 2: 上传模板文件
echo "步骤 2/3: 上传模板文件"
echo "------------------------------------------"
"$SCRIPT_DIR/upload-templates.sh"

# 步骤 3: 重启容器内 file-server 进程（与 rcoder 容器重启分离）
echo ""
echo "步骤 3/3: 重启 rcoder 容器内 nuwax-file-server"
echo "------------------------------------------"
"$SCRIPT_DIR/restart-file-server.sh"

echo ""
echo "=========================================="
echo "  部署完成！"
echo "=========================================="
