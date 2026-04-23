# 模板上传脚本使用说明

## 功能说明

提供两个脚本用于模板部署：

1. **`deploy-templates.sh`** - 完整部署流程（推荐）
   - 打包所有模板
   - 上传到远程服务器
   - 自动解压
   - 重启 rcoder 容器

2. **`upload-templates.sh`** - 仅上传已有的 zip 文件
   - 适用于已经打包好的情况
   - 上传、解压、重启容器

## 前置要求

### 安装 sshpass

macOS 上需要安装 sshpass 工具来实现自动化 SSH 登录：

```bash
brew install hudochenkov/sshpass/sshpass
```

## 配置说明

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件（已在 .gitignore 中，不会提交到 git）：

```bash
cp .env.example .env
```

### 2. 配置环境变量

编辑 `.env` 文件，设置远程服务器信息：

```bash
REMOTE_HOST=192.168.1.34
REMOTE_USER=swufe
REMOTE_PASSWORD=Swufe@2024
REMOTE_PATH=/home/swufe/nuwax/docker/config/rcoder/template
```

## 使用方法

### 方式一: 完整部署（推荐）

一键完成打包、上传、解压、重启：

```bash
# 使用 npm script（推荐）
pnpm deploy:templates

# 或直接运行脚本
./scripts/deploy-templates.sh
```

这个脚本会：
1. 使用 `pnpm pack:all` 打包所有模板
2. 上传 react-vite 和 vue3-vite 到远程服务器
3. 自动解压文件
4. 自动重启 rcoder 容器

### 方式二: 仅上传

如果已经打包好了，只需要上传：

```bash
# 使用 npm script（推荐）
pnpm upload:templates

# 或直接运行脚本
./scripts/upload-templates.sh
```

### 脚本执行流程

1. 加载 `.env` 配置
2. 检查必需的环境变量
3. 查找 `zip/` 目录下最新的模板文件：
   - `react-vite-template_*.zip`
   - `vue3-vite-template_*.zip`
4. 重命名为标准名称：
   - `react-vite-template.zip`
   - `vue3-vite-template.zip`
5. 上传到远程服务器
6. 自动在远程服务器上解压文件
7. 自动查找并重启 rcoder 容器

### 上传的文件

脚本会自动上传以下两个模板：

- `react-vite-template.zip` - React + Vite 模板
- `vue3-vite-template.zip` - Vue3 + Vite 模板

注意：`react-next-template` 不会被上传（根据需求只上传 vite 模板）

## 远程服务器路径

上传目标路径：`/home/swufe/nuwax/docker/config/rcoder/template`

上传后的文件结构：

```
/home/swufe/nuwax/docker/config/rcoder/template/
├── react-vite-template.zip
├── react-vite-template/          # 自动解压后的目录
├── vue3-vite-template.zip
└── vue3-vite-template/           # 自动解压后的目录
```

## 自动化流程

脚本会自动完成以下操作：

1. **上传模板文件** - 上传最新的 react-vite 和 vue3-vite 模板
2. **解压文件** - 在远程服务器上自动解压模板文件
3. **重启容器** - 自动查找 rcoder 容器并重启，使新模板生效

无需手动干预，一键完成整个部署流程。

## 安全说明

- `.env` 文件包含敏感信息（密码），已添加到 `.gitignore`
- 不要将 `.env` 文件提交到 git 仓库
- 可以使用 `.env.example` 作为配置模板分享

## 故障排除

### sshpass 未安装

```
错误: sshpass 未安装
请运行: brew install hudochenkov/sshpass/sshpass
```

解决方法：安装 sshpass

### .env 文件不存在

```
错误: .env 文件不存在，请先创建 .env 文件
```

解决方法：复制 `.env.example` 并修改配置

### 未找到模板文件

```
错误: 未找到 react-vite-template zip 文件
```

解决方法：确保 `zip/` 目录下存在对应的模板 zip 文件

### SSH 连接失败

检查：
1. 远程服务器 IP 是否正确
2. 用户名和密码是否正确
3. 网络连接是否正常
4. 远程服务器是否开启 SSH 服务

## 手动上传方式

如果自动脚本无法使用，可以手动上传：

```bash
# 1. 进入 zip 目录
cd zip

# 2. 使用 scp 上传
scp react-vite-template_*.zip swufe@192.168.1.34:/home/swufe/nuwax/docker/config/rcoder/template/react-vite-template.zip
scp vue3-vite-template_*.zip swufe@192.168.1.34:/home/swufe/nuwax/docker/config/rcoder/template/vue3-vite-template.zip

# 3. SSH 登录到远程服务器
ssh swufe@192.168.1.34

# 4. 解压文件
cd /home/swufe/nuwax/docker/config/rcoder/template
unzip -o react-vite-template.zip -d react-vite-template
unzip -o vue3-vite-template.zip -d vue3-vite-template
```
