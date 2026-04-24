# Nuwax 应用开发平台模板接入规范

> **版本**: 1.0.0
> **更新日期**: 2026-04-24
> **适用模板**: `react-vite`、`vue3-vite`

---

## 目录

- [1. 概述](#1-概述)
- [2. 环境要求](#2-环境要求)
- [3. 模板目录结构](#3-模板目录结构)
- [4. 配置文件规范](#4-配置文件规范)
- [5. 样式规范（TailwindCSS）](#5-样式规范tailwindcss)
- [6. 路由规范（Hash 模式）](#6-路由规范hash-模式)
- [7. 核心模块约定](#7-核心模块约定)
- [8. UI 组件库](#8-ui-组件库)
- [9. 构建与质量门禁](#9-构建与质量门禁)
- [10. 交付物格式](#10-交付物格式)
- [11. 禁止事项](#11-禁止事项)
- [12. React / Vue 对照表](#12-react--vue-对照表)
- [13. 验收 Checklist](#13-验收-checklist)

---

## 1. 概述

本文档定义了接入 Nuwax 应用开发平台的前端模板必须遵循的结构、配置和代码规范。

百特搭团队需按照本规范交付符合平台标准的模板项目，以确保：

- 模板可在 Nuwax 应用开发平台上正确运行（Hash 路由、静态托管兼容）
- 构建产物符合平台部署要求
- 开发体验与平台工具链一致

**本规范中每一项均标注**：

| 标记 | 含义 |
|------|------|
| **[必要]** | 不满足则无法通过验收，模板不可接入平台 |
| **[可选]** | 推荐采用，但可由百特搭团队根据业务需求自行决定 |

---

## 2. 环境要求

**[必要]** 以下为模板开发和构建的最低环境要求：

| 工具 | 最低版本 |
|------|----------|
| Node.js | >= 18.0.0 |
| pnpm | >= 8.0.0 |

---

## 3. 模板目录结构

### 3.1 React + Vite 模板 **[必要]**

```
<project-root>/
├── index.html                  # [必要] 入口 HTML
├── package.json                # [必要] 包配置
├── meta.json                   # [必要] 模板元信息
├── vite.config.ts              # [必要] Vite 构建配置
├── tsconfig.json               # [必要] TypeScript 配置
├── tsconfig.node.json          # [必要] Node 环境 TS 配置
├── tailwind.config.js          # [必要] TailwindCSS 配置
├── postcss.config.js           # [必要] PostCSS 配置
├── components.json             # [可选] shadcn/ui 组件配置
├── .prettierrc                 # [可选] Prettier 格式化配置
├── .eslintrc.json              # [可选] ESLint 配置
├── .editorconfig               # [可选] 编辑器配置
└── src/
    ├── main.tsx                # [必要] 应用入口
    ├── App.tsx                 # [必要] 根组件（RouterProvider）
    ├── index.css               # [必要] 全局样式（含 Tailwind 指令）
    ├── vite-env.d.ts           # [必要] Vite 类型声明
    ├── pages/                  # [必要] 页面组件目录
    │   ├── Home.tsx            # [必要] 首页
    │   └── NotFound.tsx        # [必要] 404 页面
    ├── components/             # [必要] 组件目录
    │   └── ui/                 # [可选] UI 基础组件（shadcn/ui）
    ├── lib/                    # [必要] 工具库目录
    │   ├── api.ts              # [可选] HTTP 客户端
    │   ├── services.ts         # [可选] 数据服务层
    │   └── utils.ts            # [必要] 工具函数（至少含 cn()）
    ├── router/                 # [必要] 路由配置目录
    │   └── index.tsx           # [必要] 路由注册
    └── examples/               # [可选] 示例页面
```

### 3.2 Vue 3 + Vite 模板 **[必要]**

```
<project-root>/
├── index.html                  # [必要] 入口 HTML
├── package.json                # [必要] 包配置
├── meta.json                   # [必要] 模板元信息
├── vite.config.ts              # [必要] Vite 构建配置
├── tsconfig.json               # [必要] TypeScript 配置
├── tsconfig.node.json          # [必要] Node 环境 TS 配置
├── tailwind.config.js          # [必要] TailwindCSS 配置
├── postcss.config.js           # [必要] PostCSS 配置
├── components.json             # [可选] shadcn-vue 组件配置
├── .prettierrc                 # [可选] Prettier 格式化配置
├── .eslintrc.cjs               # [可选] ESLint 配置
├── .editorconfig               # [可选] 编辑器配置
└── src/
    ├── main.ts                 # [必要] 应用入口
    ├── App.vue                 # [必要] 根组件（<router-view />）
    ├── style.css               # [必要] 全局样式（含 Tailwind 指令）
    ├── pages/                  # [必要] 页面组件目录
    │   ├── Home.vue            # [必要] 首页
    │   └── NotFound.vue        # [必要] 404 页面
    ├── components/             # [必要] 组件目录
    │   └── ui/                 # [可选] UI 基础组件（shadcn-vue）
    ├── lib/                    # [必要] 工具库目录
    │   ├── api.ts              # [可选] HTTP 客户端
    │   ├── services.ts         # [可选] 数据服务层
    │   └── utils.ts            # [必要] 工具函数（至少含 cn()）
    ├── router/                 # [必要] 路由配置目录
    │   └── index.ts            # [必要] 路由注册
    └── examples/               # [可选] 示例页面
```

---

## 4. 配置文件规范

### 4.1 `package.json` **[必要]**

以下字段和 scripts 必须存在：

```jsonc
{
  "name": "@xagi-templates/<template-name>",  // [必要] 遵循 @xagi-templates 命名空间（百特搭可自定义 name，但须保持 scoped 格式）
  "version": "<version>",                       // [必要] 语义化版本，与 meta.json 保持一致
  "private": true,                             // [必要] 标记为私有包
  "type": "module",                            // [必要] ESM 模块系统
  "scripts": {
    "dev": "vite",                             // [必要] 启动开发服务器
    "build": "tsc && vite build",              // [必要] 生产构建（Vue: "vite build"）
    "type-check": "tsc --noEmit",              // [必要] 类型检查（Vue: "vue-tsc --noEmit"）
    "lint": "eslint src ...",                  // [必要] 代码规范检查
    "check": "pnpm run type-check && pnpm run lint" // [必要] 组合质量门禁
  },
  "engines": {
    "node": ">=18.0.0"                         // [必要] Node 版本约束
  }
}
```

**[可选]** 推荐包含的 scripts：

```jsonc
{
  "scripts": {
    "build:production": "NODE_ENV=production vite build",
    "preview": "vite preview",
    "lint:fix": "eslint src --fix",
    "clean": "rm -rf dist",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### 4.2 `vite.config.ts` **[必要]**

**[必要]** 必须配置 `@` 路径别名指向 `./src`：

```ts
// react-vite
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```ts
// vue3-vite
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 4.3 `tsconfig.json` **[必要]**

**[必要]** 以下配置项必须包含：

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,                    // [必要] 严格模式
    "noUnusedLocals": true,            // [必要] 禁止未使用的局部变量
    "noUnusedParameters": true,        // [必要] 禁止未使用的参数
    "noFallthroughCasesInSwitch": true, // [必要] switch 禁止贯穿
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]               // [必要] 与 vite.config.ts 别名一致
    }
  }
}
```

React 模板额外需要：**[必要]**

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

Vue 模板额外需要：**[必要]**

```jsonc
{
  "compilerOptions": {
    "jsx": "preserve"
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

### 4.4 `meta.json` **[必要]**

模板元信息，平台据此识别模板类型：

```jsonc
{
  "name": "React + Vite",           // 或 "Vue 3 + Vite"
  "description": "模板描述",
  "version": "<version>",               // [必要] 与 package.json 版本保持一致
  "author": "百特搭",
  "framework": "react",             // [必要] "react" 或 "vue"
  "bundler": "vite",                // [必要] 固定为 "vite"
  "language": "typescript",          // [必要] 固定为 "typescript"
  "category": "frontend"
}
```

### 4.5 `index.html` **[必要]**

React 模板：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Vue 模板：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue3 Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**[必要]** 关键要求：
- React 挂载点 `id="root"`，Vue 挂载点 `id="app"`
- `<script type="module">` 入口指向对应 main 文件

### 4.6 `components.json` **[可选]**

仅在使用 shadcn/ui（React）或 shadcn-vue（Vue）时需要。

React（shadcn/ui）：

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Vue（shadcn-vue）：

```jsonc
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "new-york",
  "typescript": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/style.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  },
  "iconLibrary": "lucide"
}
```

---

## 5. 样式规范（TailwindCSS）

### 5.1 基础配置 **[必要]**

**[必要]** 入口 CSS 必须包含 Tailwind 三指令：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**[必要]** `postcss.config.js` 必须包含 TailwindCSS + Autoprefixer：

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 5.2 `tailwind.config.js` Safelist **[必要]**

**[必要]** 由于平台需要通过类名字符串动态组合样式（如百特搭低代码场景），**必须将所有常用 Tailwind 工具类加入 safelist**，防止构建时被 tree-shake 误删。

需要覆盖的 safelist 类别：

| 类别 | 示例 | 覆盖范围 |
|------|------|----------|
| 颜色 | `text-blue-500`, `bg-primary-600` | 22 个默认色板 + `primary` 自定义色板 × 11 个色阶 × 15 个前缀 |
| 间距 | `p-4`, `m-8`, `px-6` | 0–96 全部间距值 × 14 个 padding/margin 前缀 |
| 边框宽度 | `border-2`, `border-t-4` | 5 个宽度值 × 7 个方向前缀 |
| 边框样式 | `border-solid`, `border-dashed` | 6 种样式 |
| 字重 | `font-bold`, `font-medium` | 9 个字重 |
| 字号 | `text-sm`, `text-2xl` | 13 个尺寸 |
| 行高 | `leading-normal`, `leading-6` | 14 个值 |
| 字距 | `tracking-tight`, `tracking-wide` | 6 个值 |
| 文本对齐 | `text-left`, `text-center` | 6 个值 |
| 透明度 | `opacity-50`, `opacity-100` | 15 个值 |
| 圆角 | `rounded-md`, `rounded-tl-sm` | 8 个值 × 9 个方向前缀 |
| 阴影 | `shadow-md`, `shadow-lg` | 7 个值 |

**[必要]** 参考实现结构（完整代码见标准模板 `tailwind.config.js`）：

```js
// 颜色 safelist 生成函数
const defaultColors = ['slate', 'gray', /* ...全部 22 个 */]
const customColors = ['primary']          // [必要] 自定义主色调
const colorShades = [50, 100, 200, /* ... */ 900, 950]
const colorPrefixes = ['text', 'bg', 'border', 'ring', /* ... */]

function generateColorSafelist() { /* ... */ }
function generateSpacingSafelist() { /* ... */ }
function generateBorderWidthSafelist() { /* ... */ }
function generateBorderRadiusSafelist() { /* ... */ }
function generateShadowSafelist() { /* ... */ }
// ... 其他 safelist 函数

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    ...generateColorSafelist(),
    ...generateSpacingSafelist(),
    ...generateBorderWidthSafelist(),
    ...generateBorderStyleSafelist(),
    ...generateFontWeightSafelist(),
    ...generateFontSizeSafelist(),
    ...generateLineHeightSafelist(),
    ...generateLetterSpacingSafelist(),
    ...generateTextAlignSafelist(),
    ...generateOpacitySafelist(),
    ...generateBorderRadiusSafelist(),
    ...generateShadowSafelist(),
  ],
  // ...
}
```

> **重要**：标准模板中已包含完整的 safelist 生成函数，百特搭可直接复用 `tailwind.config.js`，无需自行编写。

### 5.3 自定义主题 **[必要]**

**[必要]** 必须包含 `primary` 自定义色板：

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',   // 主色
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },
},
```

**[必要]** `darkMode` 配置为 `'class'`：

```js
export default {
  // ...
  darkMode: 'class',
}
```

**[可选]** 推荐包含的扩展：

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    spacing: { 18: '4.5rem', 88: '22rem' },
    borderRadius: { '4xl': '2rem' },
    boxShadow: { soft: '0 2px 15px -3px rgba(0,0,0,0.07), ...' },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.3s ease-out',
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
    keyframes: {
      fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
      'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
    },
  },
},
```

### 5.4 CSS 变量体系 **[可选]**

React 模板推荐使用 CSS 变量定义主题色（兼容 shadcn/ui）：

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --muted: 210 40% 96%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode 变量覆盖 */
  }
}
```

### 5.5 `cn()` 样式合并函数 **[必要]**

**[必要]** `src/lib/utils.ts` 中必须提供 `cn()` 函数用于合并 Tailwind 类名：

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

**[必要]** 对应依赖：

```jsonc
{
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.0"
  }
}
```

---

## 6. 路由规范（Hash 模式）

### 6.1 为什么必须使用 Hash 路由 **[必要]**

Nuwax 应用开发平台使用静态文件托管，所有模板的构建产物以静态资源形式部署。Hash 路由（`/#/path`）的 URL fragment 不会被发送到服务器，因此**无需服务器端 URL 重写规则**，确保所有路由在任意静态托管环境均可正常工作。

### 6.2 React 模板路由 **[必要]**

**[必要]** 使用 `createHashRouter`（来自 `react-router-dom`）：

```tsx
// src/router/index.tsx
import { createHashRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

export const router = createHashRouter([
  { path: '/', element: <Home /> },
  { path: '*', element: <NotFound /> },
  // 业务路由在此添加
])
```

**[必要]** 根组件使用 `RouterProvider`：

```tsx
// src/App.tsx
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

function App() {
  return <RouterProvider router={router} />
}

export default App
```

### 6.3 Vue 模板路由 **[必要]**

**[必要]** 使用 `createWebHashHistory`（来自 `vue-router`）：

```ts
// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import NotFound from '@/pages/NotFound.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
    // 业务路由在此添加
  ],
})

export default router
```

**[必要]** 根组件使用 `<router-view />`：

```vue
<!-- src/App.vue -->
<template>
  <router-view />
</template>
```

### 6.4 路由依赖 **[必要]**

```jsonc
// React
{ "dependencies": { "react-router-dom": "7.9.5" } }

// Vue
{ "dependencies": { "vue-router": "^4.6.0" } }
```

---

## 7. 核心模块约定

### 7.1 `src/lib/utils.ts` **[必要]**

**[必要]** 至少包含 `cn()` 函数。

**[可选]** 推荐包含的工具函数：

| 函数 | 说明 |
|------|------|
| `cn(...inputs)` | Tailwind 类名合并 |
| `formatDate(date, options?)` | 日期格式化 |
| `debounce(fn, wait)` | 函数防抖 |
| `throttle(fn, limit)` | 函数节流 |
| `isMobile()` | 移动端检测 |
| `isDarkMode()` | 暗色模式检测 |
| `toggleDarkMode()` | 暗色模式切换 |
| `initDarkMode()` | 初始化暗色模式 |

### 7.2 `src/lib/api.ts` **[可选]**

如果项目需要 HTTP 请求能力，推荐遵循以下结构：

```
ApiClient 类
├── constructor(baseURL?)     — 创建 Axios 实例，60s 超时
├── setupInterceptors()       — 请求/响应拦截器
├── get/post/put/delete/patch — 标准 HTTP 方法
└── 导出
    ├── apiClient             — ApiClient 单例
    ├── api                   — 便捷方法集合 { get, post, put, delete, patch }
    └── extractApiData()      — 解包后端响应 { code, data, message } -> data
```

**[可选]** HTTP 客户端可自行选择（Axios、fetch 等），但如使用 Axios，建议保持与标准模板一致的接口设计。

### 7.3 `src/lib/services.ts` **[可选]**

**[可选]** 数据服务层，封装业务 API 调用。推荐模式：

React（useApi Hook）：

```tsx
export function useApi<T>(apiCall: () => Promise<T>, deps: any[] = []) {
  // 返回 { data, loading, error, refetch }
}
```

Vue（useApi 组合式函数）：

```ts
export function useApi<T>(apiCall: () => Promise<T>, options?: UseApiOptions) {
  // 返回 { data: Ref, loading: Ref, error: Ref, execute, refetch }
}
```

**[可选]** SSE 流式请求（`streamRequest`），用于对接 AI 流式输出等场景。

---

## 8. UI 组件库

### 8.1 组件库选择 **[可选]**

以下为平台标准模板使用的 UI 组件方案，百特搭可自行选择其他方案：

| 模板 | 推荐方案 | 组件基元 | 图标库 |
|------|----------|----------|--------|
| react-vite | shadcn/ui (new-york) | Radix UI | Lucide React |
| vue3-vite | shadcn-vue (new-york) | radix-vue | Lucide Vue Next |

### 8.2 组件放置位置 **[必要]**

**[必要]** 无论选择哪种组件库，UI 基础组件必须放在 `src/components/ui/` 目录下：

```
src/components/ui/
├── button.tsx|vue
├── card.tsx|vue
├── dialog.tsx|vue
├── input.tsx|vue
├── ...
```

### 8.3 推荐可用的 UI 组件 **[可选]**

标准模板已内置以下 shadcn 组件，可按需使用：

| 组件 | React | Vue |
|------|-------|-----|
| Accordion | `accordion.tsx` | `accordion.vue` |
| Alert Dialog | `alert-dialog.tsx` | `alert-dialog.vue` |
| Avatar | `avatar.tsx` | `avatar.vue` |
| Button | `button.tsx` | `button.vue` |
| Card | `card.tsx` | `card.vue` |
| Checkbox | `checkbox.tsx` | `checkbox.vue` |
| Dialog | `dialog.tsx` | `dialog.vue` |
| Dropdown Menu | `dropdown-menu.tsx` | `dropdown-menu.vue` |
| Form | `form.tsx` | `form.ts` |
| Input | `input.tsx` | `input.vue` |
| Label | `label.tsx` | `label.vue` |
| Popover | `popover.tsx` | `popover.vue` |
| Progress | `progress.tsx` | `progress.vue` |
| Select | `select.tsx` | `select.vue` |
| Separator | `separator.tsx` | `separator.vue` |
| Switch | `switch.tsx` | `switch.vue` |
| Tabs | `tabs.tsx` | `tabs.vue` |
| Textarea | `textarea.tsx` | `textarea.vue` |
| Tooltip | `tooltip.tsx` | `tooltip.vue` |

### 8.4 样式工具依赖 **[可选]**

如果使用 shadcn/ui 风格组件，推荐包含：

```jsonc
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",   // 组件变体管理
    "tailwindcss-animate": "^1.0.7"         // Tailwind 动画插件
  }
}
```

### 8.5 表单验证 **[可选]**

| 模板 | 推荐方案 |
|------|----------|
| react-vite | zod + react-hook-form + @hookform/resolvers |
| vue3-vite | zod + vee-validate + @vee-validate/zod |

---

## 9. 构建与质量门禁

### 9.1 必须通过的命令 **[必要]**

| 命令 | 说明 | 必要性 |
|------|------|--------|
| `pnpm type-check` | TypeScript 类型检查，零错误 | **[必要]** |
| `pnpm lint` | ESLint 代码规范检查，零警告 | **[必要]** |
| `pnpm check` | 等价于 `type-check` + `lint` | **[必要]** |
| `pnpm build` | 生产构建成功，产物输出到 `dist/` | **[必要]** |

### 9.2 构建产物 **[必要]**

**[必要]** Vite 构建产物必须输出到 `dist/` 目录，且包含至少：

```
dist/
├── index.html        # [必要] 入口页面
├── assets/           # [必要] 静态资源
│   ├── index-*.js    # JS bundle
│   └── index-*.css   # CSS bundle
```

### 9.3 版本一致性 **[必要]**

**[必要]** 以下三处版本号必须保持一致：

1. `package.json` 的 `version` 字段
2. `meta.json` 的 `version` 字段
3. `templates.json` 中对应模板的 `version` 字段（如在 monorepo 中）

### 9.4 完整验收脚本 **[可选]**

参考标准模板的 `test-templates.sh`，依次执行：

```bash
pnpm check:versions                          # 版本一致性
pnpm -C packages/react-vite run check        # React 质量门禁
pnpm -C packages/vue3-vite run check         # Vue 质量门禁
pnpm -C packages/react-vite run build        # React 构建
pnpm -C packages/vue3-vite run build         # Vue 构建
```

---

## 10. 交付物格式

### 10.1 打包方式 **[必要]**

百特搭交付的模板以 zip 包形式提交，结构如下：

```
<template-name>-template_<version>_<timestamp>.zip
```

示例：`react-vite-template_<version>_2026_04_24_12_00_00.zip`

### 10.2 打包排除项 **[必要]**

**[必要]** zip 包中不得包含以下内容：

```
node_modules/
dist/
dist-ssr/
.cache/
.parcel-cache/
coverage/
.DS_Store
*.log
*.local
.env
.env.local
.env.*.local
.vscode/
.idea/
*.tgz
tmp/
temp/
playground/
```

### 10.3 打包包含项 **[必要]**

**[必要]** zip 包中必须包含：

```
index.html
package.json
meta.json
vite.config.ts
tsconfig.json
tsconfig.node.json
tailwind.config.js
postcss.config.js
src/                          # 完整源码目录
```

---

## 11. 禁止事项

| 编号 | 禁止项 | 原因 |
|------|--------|------|
| 1 | 禁止使用 `BrowserRouter` / `createWebHistory` | 静态托管不支持服务端 URL 重写 |
| 2 | 禁止使用 npm / yarn 作为包管理器 | 平台统一使用 pnpm |
| 3 | 禁止在代码中硬编码敏感信息（密钥、令牌等） | 安全风险 |
| 4 | 禁止移除 `tailwind.config.js` 中的 safelist | 动态类名会被 tree-shake 删除 |
| 5 | 禁止修改 `"type": "module"` 为其他值 | ESM 是统一模块标准 |
| 6 | 禁止修改 `"private": true` 为 `false` | 模板不可发布到 npm |
| 7 | 禁止修改构建输出目录（必须为 `dist/`） | 平台部署依赖此路径 |
| 8 | 禁止移除 `@` 路径别名配置 | 模板内广泛使用 `@/` 导入 |
| 9 | 禁止在 `node_modules` 或 `dist` 目录中修改代码 | 应修改源码后重新安装/构建 |
| 10 | 禁止引入需要 Node.js 运行时的库到客户端代码 | 模板为纯 SPA，无服务端 |

---

## 12. React / Vue 对照表

以下是两个模板在等价功能上的对照，方便百特搭团队跨框架参考：

| 关注点 | react-vite | vue3-vite |
|--------|-----------|-----------|
| 框架 | React 18 | Vue 3 |
| 入口文件 | `src/main.tsx` | `src/main.ts` |
| 根组件 | `src/App.tsx`（`<RouterProvider />`） | `src/App.vue`（`<router-view />`） |
| 全局样式 | `src/index.css` | `src/style.css` |
| Vite 插件 | `@vitejs/plugin-react` | `@vitejs/plugin-vue` |
| 路由库 | `react-router-dom` | `vue-router` |
| 路由模式 | `createHashRouter` | `createWebHashHistory` |
| 路由文件 | `src/router/index.tsx` | `src/router/index.ts` |
| 路由注册 | `{ path, element: <Component /> }` | `{ path, name, component: Component }` |
| 404 路由 | `path: '*'` | `path: '/:pathMatch(.*)*'` |
| 页面组件 | `src/pages/*.tsx` | `src/pages/*.vue` |
| UI 组件 | `src/components/ui/*.tsx` | `src/components/ui/*.vue` |
| UI 组件库 | shadcn/ui (Radix UI) | shadcn-vue (radix-vue) |
| 图标 | `lucide-react` | `lucide-vue-next` |
| 表单验证 | zod + react-hook-form | zod + vee-validate |
| 异步 Hook | `useApi<T>(apiCall, deps)` | `useApi<T>(apiCall, options?)` |
| 类型检查 | `tsc --noEmit` | `vue-tsc --noEmit` |
| TS JSX | `"jsx": "react-jsx"` | `"jsx": "preserve"` |
| 挂载点 | `<div id="root">` | `<div id="app">` |
| 类型声明 | `src/vite-env.d.ts` | 无（tsconfig include 覆盖） |
| ESConfig | `.eslintrc.json` | `.eslintrc.cjs` |
| Hooks 模式 | `useState` / `useEffect` / `useCallback` | `ref` / `onMounted` / `watch` |
| Props 类型 | interface + React.FC | `defineProps<T>()` |
| 样式类合并 | `cn()` from `@/lib/utils` | `cn()` from `@/lib/utils` |

---

## 13. 验收 Checklist

### 目录结构

- [ ] `index.html` 存在且挂载点正确
- [ ] `package.json` 含 `"type": "module"`, `"private": true`, 完整 scripts
- [ ] `meta.json` 含 `framework`, `bundler`, `language`, `version` 字段
- [ ] `vite.config.ts` 含 `@` 路径别名
- [ ] `tsconfig.json` 含 `strict: true`, `@/*` paths
- [ ] `tailwind.config.js` 含完整 safelist + `primary` 色板 + `darkMode: 'class'`
- [ ] `postcss.config.js` 含 `tailwindcss` + `autoprefixer`
- [ ] `.gitignore` 含 `node_modules/`, `dist/` 等必要排除（如适用）
- [ ] `src/main.ts(x)` 入口文件存在
- [ ] `src/App.tsx` / `src/App.vue` 根组件存在
- [ ] `src/router/` 路由目录及路由文件存在
- [ ] `src/pages/` 页面目录含 `Home` 和 `NotFound`
- [ ] `src/components/` 组件目录存在
- [ ] `src/lib/utils.ts` 含 `cn()` 函数

### 路由

- [ ] React: 使用 `createHashRouter`
- [ ] Vue: 使用 `createWebHashHistory`
- [ ] 存在 `/` 首页路由
- [ ] 存在 404 兜底路由

### 样式

- [ ] 入口 CSS 含 `@tailwind base/components/utilities`
- [ ] TailwindCSS safelist 覆盖：颜色、间距、边框、字重、字号、行高、透明度、圆角、阴影
- [ ] `primary` 自定义色板存在
- [ ] `darkMode: 'class'` 已配置
- [ ] `cn()` 函数可用（依赖 `clsx` + `tailwind-merge`）

### 构建与质量

- [ ] `pnpm type-check` 通过，零错误
- [ ] `pnpm lint` 通过，零警告
- [ ] `pnpm build` 成功，`dist/` 目录正常生成
- [ ] `package.json` / `meta.json` 版本号一致

### 交付物

- [ ] zip 包不含 `node_modules/`, `dist/`, `.DS_Store`
- [ ] zip 包含完整源码和所有必要配置文件
- [ ] 文件名格式：`<template>-template_<version>_<timestamp>.zip`

---

## 附录：标准模板获取

百特搭团队将以 Nuwax 应用开发平台提供的标准模板（`react-vite` / `vue3-vite`）作为基线，在遵循本规范的前提下进行业务开发。

标准模板仓库：`https://github.com/shareAI-lab/xagi-frontend-templates`

- React Vite 模板路径：`packages/react-vite/`
- Vue 3 Vite 模板路径：`packages/vue3-vite/`
