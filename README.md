# 网页应用开发模版

这个仓库包含了使用的各种前端项目模板，采用 monorepo 架构统一管理。

## 🏗️ 项目架构

本项目使用 **pnpm workspace** 管理，采用现代化的 monorepo 架构：

```
xagi-frontend-templates/
├── packages/                    # 模板包
│   ├── react-vite/             # React + Vite + TypeScript
│   ├── vue3-vite/              # Vue 3 + Vite + TypeScript
│   └── react-next/             # React + Next.js + TypeScript + Tailwind CSS
├── scripts/                     # 管理脚本
├── package.json                # 根包配置
└── pnpm-workspace.yaml         # workspace 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装和运行

```bash
# 克隆项目
git clone <repository-url>
cd xagi-frontend-templates

# 安装所有依赖
pnpm install

# 启动所有开发服务器
pnpm dev

# 构建所有模板
pnpm build

# 运行模板验收脚本（版本一致性 + check + build）
./test-templates.sh
```

## 📦 可用模板

### React + Vite

- **包名**: `@xagi-templates/react-vite`
- **路径**: `packages/react-vite/`
- **端口**: 3000
- **特性**:
  - React 18 + TypeScript + Vite
  - 现代化构建工具链
  - 热重载开发服务器
  - ESLint + Prettier 代码规范
  - Axios HTTP 客户端集成
  - **内置 HTTP 客户端解决方案**
  - 基于 Axios 的统一请求管理
  - React Hooks 封装
  - 自动 token 管理
  - 统一的错误处理

### Vue3 + Vite

- **包名**: `@xagi-templates/vue3-vite`
- **路径**: `packages/vue3-vite/`
- **端口**: 4000
- **特性**:
  - Vue 3 + TypeScript + Vite
  - Composition API
  - 单文件组件 (SFC)
  - 快速热重载
  - Axios HTTP 客户端集成
  - **内置 HTTP 客户端解决方案**
  - 基于 Axios 的统一请求管理
  - Vue 3 Composition API 封装
  - 自动 token 管理
  - 统一的错误处理

### React + Next.js

- **包名**: `@xagi-templates/react-next`
- **路径**: `packages/react-next/`
- **端口**: 3000
- **特性**:
  - Next.js 14 + React 18 + TypeScript
  - Tailwind CSS 样式系统
  - Radix UI 组件库
  - App Router 架构
  - SEO 优化和性能优化
  - **内置 HTTP 客户端解决方案**
  - 基于 Axios 的统一请求管理
  - React Hooks 封装
  - 自动 token 管理
  - 统一的错误处理
  - 支持 Server Components

## 🛠️ 开发命令

### 根级别命令

```bash
pnpm dev                # 启动所有开发服务器
pnpm build              # 构建所有模板
pnpm build:production   # 生产环境构建
pnpm lint               # 代码检查
pnpm lint:fix           # 自动修复
pnpm type-check         # 类型检查
pnpm check:templates    # 仅检查 vue3-vite + react-vite（type-check + lint）
pnpm check:versions     # 校验 package/meta/templates 版本一致性
pnpm test               # 运行测试
pnpm clean              # 清理构建产物
```

### 模板打包命令

```bash
pnpm pack:react-vite    # 打包 React Vite 模板
pnpm pack:vue3-vite     # 打包 Vue3 Vite 模板
pnpm pack:react-next    # 打包 React Next.js 模板
pnpm pack:all           # 打包所有模板
pnpm pack:clean         # 清理 zip 文件
```

### 模板部署命令

```bash
pnpm deploy:templates   # 完整部署流程（打包 + 上传 + 解压 + 重启容器）
pnpm upload:templates   # 仅上传已有的 zip 文件到远程服务器
```

**部署说明**：
- `pnpm deploy:templates` 会自动打包所有模板，然后上传 react-vite 和 vue3-vite 到远程服务器，并自动解压和重启 rcoder 容器
- `pnpm upload:templates` 适用于已经打包好的情况，直接上传、解压和重启
- 详细配置请参考 [scripts/README.md](./scripts/README.md)

### 单独开发模板

```bash
# React Vite
cd packages/react-vite
pnpm dev

# Vue3 Vite
cd packages/vue3-vite
pnpm dev

# React Next.js
cd packages/react-next
pnpm dev
```

### 依赖管理命令

```bash
# 安装依赖
pnpm install                    # 安装所有workspace依赖
pnpm add <package>              # 添加依赖到根项目
pnpm add <package> -w <workspace> # 添加依赖到指定workspace
pnpm remove <package>           # 移除依赖

# 更新依赖
pnpm update                     # 更新所有依赖
pnpm update <package>           # 更新指定依赖
pnpm outdated                   # 检查过时的依赖
pnpm audit                      # 安全审计

# 清理依赖
pnpm clean                      # 清理所有构建产物
pnpm prune                      # 清理未使用的依赖
pnpm store prune               # 清理store中未使用的包

# Workspace特定命令
pnpm --filter <package> <command> # 在特定workspace中运行命令
pnpm --recursive               # 在所有workspace中运行命令
```

## 📚 详细文档

- [Monorepo 管理指南](./MONOREPO.md) - 详细的项目架构和使用说明
- [模板配置文件](./templates.json) - 完整的模板信息和版本配置

## 🔧 模板信息查询

```bash
# 查看所有模板信息
node scripts/list-templates.js

# 直接查看模板配置
cat templates.json
```

## 🔧 配置特性

### 统一配置

- Prettier 代码格式化
- TypeScript 类型检查
- ESLint 代码规范
- 统一的构建和测试流程

### 依赖管理

- **pnpm workspace** 统一管理所有模板包
- 共享依赖自动去重和优化
- 独立的包版本控制和隔离
- **pnpm-lock.yaml** 确保依赖一致性
- 严格workspace依赖管理
- 自动peer依赖安装

### 开发体验

- 并行开发服务器启动
- 热重载和快速构建支持
- 统一的命令接口和脚本
- 自动化测试和构建流程
- 高效的磁盘空间利用
- 优化的依赖提升策略

## 📝 添加新模板

1. 在 `packages/` 目录创建新模板
2. 初始化 `package.json` 和项目结构
3. 配置构建和开发脚本
4. 更新文档和测试脚本
5. 提交 PR 进行审核

## 📄 许可证

MIT License
