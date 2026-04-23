#!/bin/bash

# 重启 rcoder 容器
# 用途: 与 file-server 进程重启解耦，单独执行容器重启

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
if [ -z "$REMOTE_HOST" ] || [ -z "$REMOTE_USER" ] || [ -z "$REMOTE_PASSWORD" ]; then
    echo "错误: 缺少必需的环境变量"
    echo "请确保 .env 文件中包含: REMOTE_HOST, REMOTE_USER, REMOTE_PASSWORD"
    exit 1
fi

# 检查 sshpass 是否安装
if ! command -v sshpass &> /dev/null; then
    echo "错误: sshpass 未安装"
    echo "请运行: brew install hudochenkov/sshpass/sshpass"
    exit 1
fi

echo "步骤: 重启 rcoder 容器"
echo "------------------------------------------"
echo "正在连接远程服务器重启容器..."

sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no \
    "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
echo "查找 rcoder 容器..."

# 目标容器名与镜像名（固定值），优先精确匹配，避免误重启同类容器
TARGET_CONTAINER_NAME="docker-rcoder-1"
TARGET_IMAGE="nuwax-docker-images-registry.cn-hangzhou.cr.aliyuncs.com/nuwax-test/rcoder:latest"

# 记录最终命中的容器 ID 与命中策略，便于日志排查
RCODER_CONTAINER=""
MATCH_STRATEGY=""

# 1) 先按容器名精确匹配（最稳定，与你当前线上容器名一致）
RCODER_CONTAINER=$(docker ps -a --filter "name=^${TARGET_CONTAINER_NAME}$" --format "{{.ID}}" | head -1)
if [ -n "$RCODER_CONTAINER" ]; then
    MATCH_STRATEGY="容器名精确匹配: ${TARGET_CONTAINER_NAME}"
fi

# 2) 若容器名未命中，再按镜像精确匹配（适合容器名变化但镜像固定的场景）
if [ -z "$RCODER_CONTAINER" ]; then
    RCODER_CONTAINER=$(docker ps -a --filter "ancestor=${TARGET_IMAGE}" --format "{{.ID}}" | head -1)
    if [ -n "$RCODER_CONTAINER" ]; then
        MATCH_STRATEGY="镜像精确匹配: ${TARGET_IMAGE}"
    fi
fi

# 3) 最后兜底模糊匹配 name=rcoder，兼容历史命名方式
if [ -z "$RCODER_CONTAINER" ]; then
    RCODER_CONTAINER=$(docker ps -a --filter "name=rcoder" --format "{{.ID}}" | head -1)
    if [ -n "$RCODER_CONTAINER" ]; then
        MATCH_STRATEGY="兜底模糊匹配: name=rcoder"
    fi
fi

if [ -z "$RCODER_CONTAINER" ]; then
    echo "✗ 未找到可重启的 rcoder 容器"
    echo "目标容器名: $TARGET_CONTAINER_NAME"
    echo "目标镜像: $TARGET_IMAGE"
    echo ""
    echo "候选容器（名称或镜像包含 rcoder）:"
    docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}" | grep -i "rcoder" || true
    exit 1
fi

echo "命中策略: $MATCH_STRATEGY"
echo "重启前容器详情:"
docker ps -a --filter "id=${RCODER_CONTAINER}" --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"

echo "正在重启容器..."
docker restart "$RCODER_CONTAINER"

echo "重启后容器详情:"
docker ps -a --filter "id=${RCODER_CONTAINER}" --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"
echo "✓ rcoder 容器重启成功"
EOF
