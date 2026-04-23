#!/bin/bash

# 重启 rcoder 容器内 nuwax-file-server 进程
# 用途: 与 rcoder 容器重启解耦，单独重启 file-server

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

echo "步骤: 重启 rcoder 容器内 nuwax-file-server"
echo "------------------------------------------"
echo "正在连接远程服务器执行 file-server 重启..."

sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no \
    "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
set -e

# 目标容器名和镜像（与你当前环境保持一致）
TARGET_CONTAINER_NAME="docker-rcoder-1"
TARGET_IMAGE="nuwax-docker-images-registry.cn-hangzhou.cr.aliyuncs.com/nuwax-test/rcoder:latest"

# 保存命中的容器 ID 和命中策略，方便排查
RCODER_CONTAINER=""
MATCH_STRATEGY=""

# 1) 优先按容器名精确匹配
RCODER_CONTAINER=$(docker ps -a --filter "name=^${TARGET_CONTAINER_NAME}$" --format "{{.ID}}" | head -1)
if [ -n "$RCODER_CONTAINER" ]; then
    MATCH_STRATEGY="容器名精确匹配: ${TARGET_CONTAINER_NAME}"
fi

# 2) 容器名未命中时，按镜像精确匹配
if [ -z "$RCODER_CONTAINER" ]; then
    RCODER_CONTAINER=$(docker ps -a --filter "ancestor=${TARGET_IMAGE}" --format "{{.ID}}" | head -1)
    if [ -n "$RCODER_CONTAINER" ]; then
        MATCH_STRATEGY="镜像精确匹配: ${TARGET_IMAGE}"
    fi
fi

# 3) 最后兜底模糊匹配，兼容历史命名
if [ -z "$RCODER_CONTAINER" ]; then
    RCODER_CONTAINER=$(docker ps -a --filter "name=rcoder" --format "{{.ID}}" | head -1)
    if [ -n "$RCODER_CONTAINER" ]; then
        MATCH_STRATEGY="兜底模糊匹配: name=rcoder"
    fi
fi

if [ -z "$RCODER_CONTAINER" ]; then
    echo "✗ 未找到 rcoder 容器，无法执行 file-server 重启"
    echo "候选容器（名称或镜像包含 rcoder）:"
    docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}" | grep -i "rcoder" || true
    exit 1
fi

echo "命中策略: $MATCH_STRATEGY"
echo "目标容器详情:"
docker ps -a --filter "id=${RCODER_CONTAINER}" --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""
echo "进入容器执行 nuwax-file-server 重启..."

# 在容器内执行完整重启流程（使用单条 bash -lc，避免 SSH 嵌套 heredoc 丢失 stdin）
docker exec "$RCODER_CONTAINER" /bin/bash -lc '
set -e

# 按 PID 列表查找目标进程，并排除当前 shell 自身，避免统计到检查命令进程
list_target_pids() {
    local self_pid="$1"
    ps -eo pid=,comm=,args= | awk -v self="$self_pid" "\$1 != self && (\$2 == \"node\" || \$2 == \"sh\" || \$2 == \"pnpm\") && (\$0 ~ /nuwax-file-server\\/dist\\/server\\.js/ || \$0 ~ /scripts\\/start-prod\\.js/ || \$0 ~ /\\/usr\\/local\\/bin\\/pnpm prod/ || \$0 ~ /pnpm prod/) { print \$1 }" | sort -u
}

print_target_processes() {
    local self_pid="$1"
    ps -eo pid=,comm=,args= | awk -v self="$self_pid" "\$1 != self && (\$2 == \"node\" || \$2 == \"sh\" || \$2 == \"pnpm\") && (\$0 ~ /nuwax-file-server\\/dist\\/server\\.js/ || \$0 ~ /scripts\\/start-prod\\.js/ || \$0 ~ /\\/usr\\/local\\/bin\\/pnpm prod/ || \$0 ~ /pnpm prod/) { print }"
}

echo "[容器内] 当前 file-server 相关进程:"
print_target_processes "$$" || true
echo ""

TARGET_PIDS="$(list_target_pids "$$")"
if [ -n "$TARGET_PIDS" ]; then
    echo "[容器内] 发现旧进程 PID: $TARGET_PIDS"
    echo "[容器内] 第一步: 发送 TERM，优雅停止旧进程"
    for pid in $TARGET_PIDS; do
        kill "$pid" 2>/dev/null || true
    done

    WAIT_SECONDS=10
    for _ in $(seq 1 "$WAIT_SECONDS"); do
        REMAINING_PIDS=""
        for pid in $TARGET_PIDS; do
            if kill -0 "$pid" 2>/dev/null; then
                REMAINING_PIDS="$REMAINING_PIDS $pid"
            fi
        done
        if [ -z "$REMAINING_PIDS" ]; then
            break
        fi
        sleep 1
    done

    if [ -n "$REMAINING_PIDS" ]; then
        echo "[容器内] 以下 PID 在 TERM 后仍存活，执行 KILL:$REMAINING_PIDS"
        for pid in $REMAINING_PIDS; do
            kill -9 "$pid" 2>/dev/null || true
        done
    fi
else
    echo "[容器内] 未发现旧的 nuwax-file-server 相关进程"
fi

POST_KILL_PIDS="$(list_target_pids "$$")"
if [ -n "$POST_KILL_PIDS" ]; then
    POST_KILL_COUNT="$(echo "$POST_KILL_PIDS" | wc -w | tr -d " ")"
    echo "[容器内] ✗ 旧进程未清理干净，当前残留进程数: $POST_KILL_COUNT"
    echo "[容器内] 为避免双实例冲突，本次停止启动新进程"
    print_target_processes "$$" || true
    exit 1
fi

echo "[容器内] 旧进程已清理完成，准备启动新进程"
echo "[容器内] 启动新进程: pnpm prod"
mkdir -p /app/logs
cd /app/nuwax-file-server
pnpm prod > /app/logs/nuwax-file-server.log 2>&1 &
sleep 2

echo "[容器内] 重启后 file-server 相关进程:"
print_target_processes "$$" || true
echo "[容器内] 日志路径: /app/logs/nuwax-file-server.log"
'

# 重启完成后执行健康检查，尽量在脚本阶段提前发现异常
echo ""
echo "执行健康检查..."

# 1) 检查容器运行状态和健康状态
#    - State.Status 常见值: running/exited
#    - Health.Status 常见值: healthy/unhealthy/starting（若镜像未配置 healthcheck 则为空）
CONTAINER_STATE=$(docker inspect -f '{{.State.Status}}' "$RCODER_CONTAINER")
HEALTH_STATE=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$RCODER_CONTAINER")
echo "容器状态: $CONTAINER_STATE"
echo "健康状态: $HEALTH_STATE"

if [ "$CONTAINER_STATE" != "running" ]; then
    echo "✗ 健康检查失败: 容器未运行"
    exit 1
fi

# 若镜像配置了 healthcheck，则要求至少不是 unhealthy
if [ "$HEALTH_STATE" = "unhealthy" ]; then
    echo "✗ 健康检查失败: 容器健康状态为 unhealthy"
    exit 1
fi

# 2) 检查容器内 nuwax-file-server 关键进程是否存在（排除当前 shell 自身）
PROCESS_COUNT=$(docker exec "$RCODER_CONTAINER" /bin/bash -lc '
SELF_PID="$$"
ps -eo pid=,comm=,args= | awk -v self="$SELF_PID" '\''$1 != self && ($2 == "node" || $2 == "sh" || $2 == "pnpm") && ($0 ~ /nuwax-file-server\/dist\/server\.js/ || $0 ~ /scripts\/start-prod\.js/ || $0 ~ /\/usr\/local\/bin\/pnpm prod/ || $0 ~ /pnpm prod/) {count++} END {print count+0}'\''')
echo "nuwax-file-server 相关进程数: $PROCESS_COUNT"
if [ "$PROCESS_COUNT" -lt 1 ]; then
    echo "✗ 健康检查失败: 未检测到 nuwax-file-server 相关进程"
    exit 1
fi

# 3) 检查日志文件是否存在且非空，作为服务启动后的基础信号
LOG_CHECK=$(docker exec "$RCODER_CONTAINER" /bin/bash -lc \
    "if [ -s /app/logs/nuwax-file-server.log ]; then echo ok; else echo fail; fi")
if [ "$LOG_CHECK" != "ok" ]; then
    echo "✗ 健康检查失败: /app/logs/nuwax-file-server.log 不存在或为空"
    exit 1
fi
echo "日志文件检查: ok (/app/logs/nuwax-file-server.log)"
echo "✓ 健康检查通过"
EOF

echo ""
echo "nuwax-file-server 重启流程执行完成。"
