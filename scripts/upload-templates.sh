#!/bin/bash

# 模板上传脚本
# 用途: 自动上传 react-vite 和 vue3-vite 模板到远程服务器

set -e

# 脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 加载环境变量
if [ -f "$PROJECT_ROOT/.env" ]; then
    source "$PROJECT_ROOT/.env"
else
    echo "错误: .env 文件不存在，请先创建 .env 文件"
    echo "可以复制 .env.example 并修改配置"
    exit 1
fi

# 检查必需的环境变量
if [ -z "$REMOTE_HOST" ] || [ -z "$REMOTE_USER" ] || [ -z "$REMOTE_PASSWORD" ] || [ -z "$REMOTE_PATH" ]; then
    echo "错误: 缺少必需的环境变量"
    echo "请确保 .env 文件中包含: REMOTE_HOST, REMOTE_USER, REMOTE_PASSWORD, REMOTE_PATH"
    exit 1
fi

# 检查 sshpass 是否安装
if ! command -v sshpass &> /dev/null; then
    echo "错误: sshpass 未安装"
    echo "请运行: brew install hudochenkov/sshpass/sshpass"
    exit 1
fi

# zip 文件目录
ZIP_DIR="$PROJECT_ROOT/zip"

# 查找最新的模板文件
echo "查找最新的模板文件..."

REACT_VITE_ZIP=$(ls -t "$ZIP_DIR"/react-vite-template_*.zip 2>/dev/null | head -1)
VUE3_VITE_ZIP=$(ls -t "$ZIP_DIR"/vue3-vite-template_*.zip 2>/dev/null | head -1)

if [ -z "$REACT_VITE_ZIP" ]; then
    echo "错误: 未找到 react-vite-template zip 文件"
    exit 1
fi

if [ -z "$VUE3_VITE_ZIP" ]; then
    echo "错误: 未找到 vue3-vite-template zip 文件"
    exit 1
fi

echo "找到模板文件:"
echo "  React Vite: $(basename "$REACT_VITE_ZIP")"
echo "  Vue3 Vite: $(basename "$VUE3_VITE_ZIP")"
echo ""

# 创建临时目录
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# 复制并重命名文件
echo "准备上传文件..."
cp "$REACT_VITE_ZIP" "$TEMP_DIR/react-vite-template.zip"
cp "$VUE3_VITE_ZIP" "$TEMP_DIR/vue3-vite-template.zip"

# 上传文件
echo ""
echo "开始上传到 $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo ""

# 上传 react-vite-template.zip
echo "上传 react-vite-template.zip..."
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no \
    "$TEMP_DIR/react-vite-template.zip" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/react-vite-template.zip"

if [ $? -eq 0 ]; then
    echo "✓ react-vite-template.zip 上传成功"
else
    echo "✗ react-vite-template.zip 上传失败"
    exit 1
fi

# 上传 vue3-vite-template.zip
echo "上传 vue3-vite-template.zip..."
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no \
    "$TEMP_DIR/vue3-vite-template.zip" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/vue3-vite-template.zip"

if [ $? -eq 0 ]; then
    echo "✓ vue3-vite-template.zip 上传成功"
else
    echo "✗ vue3-vite-template.zip 上传失败"
    exit 1
fi

echo ""
echo "所有模板上传完成！"
