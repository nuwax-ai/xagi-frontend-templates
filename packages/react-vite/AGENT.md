# React Vite Template - AI Agent 开发指南

## 项目概述
这是一个基于 React 18 + Vite + TypeScript 的现代化前端项目模板，专为 AI 代码开发助手优化。

## 技术栈
- **框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Radix UI (27个组件)
- **表单管理**: React Hook Form + Zod
- **HTTP客户端**: Axios
- **包管理**: pnpm (强制要求)

## 项目结构
```
src/
├── components/     # 组件目录
│   └── ui/        # Radix UI 基础组件 (28个组件)
├── examples/      # 示例代码（供参考）
│   ├── api-example.ts      # API 调用示例
│   ├── form-example.tsx    # 表单组件示例
│   └── list-page-example.tsx # 列表页面示例
├── lib/           # 工具库和配置
│   ├── api.ts     # HTTP客户端 + extractApiData 工具函数
│   ├── services.ts # useApi Hook (useCallback) + streamRequest
│   └── utils.ts   # 工具函数 (cn, debounce, throttle, formatDate 等)
├── pages/         # 页面组件
│   ├── Home.tsx   # 首页
│   └── NotFound.tsx # 404页面
├── router/        # 路由配置
│   └── index.tsx  # Hash 路由
├── App.tsx        # 根组件 (RouterProvider)
├── main.tsx       # 应用入口
└── index.css      # 全局样式 (Tailwind CSS)
```

## ⚠️ 代码生成规则（重要）

生成代码时**必须**遵循以下规则：

### 文件位置
| 类型 | 位置 | 说明 |
|------|------|------|
| 页面 | `src/pages/` | 创建后需更新 `router/index.tsx` |
| 组件 | `src/components/` | 可复用的 UI 组件 |
| API 函数 | `src/lib/api.ts` 或新建专用文件 | 使用 `extractApiData` 处理响应 |
| 类型定义 | 示例文件内联定义 | 根据后端响应格式定义 |

### 类型使用
```typescript
// ✅ 正确：在文件内定义类型（参考 examples/api-example.ts）
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// ✅ 正确：API 响应处理
const response = await api.get<ApiResponse<User>>('/api/user');
const user = extractApiData<User>(response);
```

### API 调用模式
```typescript
// ✅ 正确：使用 useApi hook
const { data, loading, error, refetch } = useApi(() => userApi.getList(params), [params]);

// ✅ 正确：流式请求
await streamRequest<ChatMessage>(url, payload, (msg) => { ... });
```

### 表单开发
```typescript
// ✅ 正确：使用 Zod + React Hook Form
const schema = z.object({ name: z.string().min(1) });
const form = useForm({ resolver: zodResolver(schema) });
```

### 样式规范
```tsx
// ✅ 正确：使用 Tailwind CSS
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">

// ❌ 错误：内联样式
<div style={{ display: 'flex' }}>
```

### 示例代码参考

`src/examples/` 目录包含开发参考示例，**禁止直接用于生产环境**。

#### 何时参考哪个示例

| 开发场景 | 参考示例 | 关键内容 |
|----------|----------|----------|
| 需要调用后端 API | `api-example.ts` | 类型定义、API 函数封装、extractApiData 使用 |
| 创建表单页面 | `form-example.tsx` | Zod 验证、useForm、FormField 组件用法 |
| 创建数据列表页 | `list-page-example.tsx` | useApi 分页、搜索、CRUD 操作、加载/空状态 |

#### 使用方式
1. **阅读示例**了解代码模式和最佳实践
2. **参考结构**创建自己的业务代码
3. **不要直接复制**示例到生产环境

## 开发命令
```bash
pnpm run dev          # 启动开发服务器
pnpm run build        # 构建生产版本
pnpm run preview      # 预览生产版本
pnpm run lint         # 运行ESLint检查
```

## 包管理要求
- **🚨 强制要求使用 pnpm** 作为包管理器
- **❌ 严格禁止使用 npm 或 yarn** 进行依赖管理
- **⚠️ 项目配置已针对 pnpm 优化，使用其他包管理器可能导致问题**
- **安装依赖**: `pnpm install`
- **开发服务器**: `pnpm dev`
- **构建**: `pnpm build`

### 为什么强制使用 pnpm？
- **更快的安装速度** - 比 npm 快 2-3 倍
- **节省磁盘空间** - 使用硬链接共享依赖
- **更严格的依赖管理** - 避免幽灵依赖问题
- **更好的 monorepo 支持** - 原生支持 workspace

## 代码规范
- 使用 TypeScript 严格模式
- 遵循 React 函数组件最佳实践
- 使用 Tailwind CSS 进行样式设计
- 组件文件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

## 组件开发规则
1. 优先使用函数组件
2. 使用 React Hooks 管理状态
3. 组件 props 必须定义类型
4. 使用 React.memo 优化性能
5. 合理拆分组件，保持单一职责

## 状态管理
1. 优先使用 useState/useReducer
2. 全局状态使用 Context API
3. 复杂状态考虑使用状态管理库
4. 避免不必要的状态提升

## API 调用
1. 使用 `src/lib/api.ts` 中的 HTTP 客户端
2. 使用 `extractApiData<T>()` 适配常见后端响应格式 `{ code, data, message }`
3. 使用 `useApi` Hook 自动处理 loading/error 状态
4. 使用 `streamRequest` 处理流式 SSE 响应
5. 统一错误处理，使用 async/await 语法

## 样式开发
1. 优先使用 Tailwind CSS 类
2. 自定义样式使用 CSS Modules
3. 保持样式的一致性
4. 响应式设计优先

## 常用依赖
- `react` - React 核心库
- `react-dom` - React DOM 渲染器
- `axios` - HTTP 客户端
- `tailwindcss` - CSS 框架
- `typescript` - TypeScript 支持

## Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## AI 开发提示
- 优先考虑代码可读性和维护性
- 遵循项目现有架构和设计模式
- 适当添加代码注释
- 考虑性能和安全性
- 保持代码风格一致

## Form 表单开发

### React Hook Form + Zod 集成
此模板包含完整的表单解决方案，使用 React Hook Form 进行状态管理，Zod 进行模式验证。

#### Form 组件
- **Form**: 主表单包装器，提供 React Hook Form 上下文
- **FormField**: 字段包装器，包含验证功能
- **FormItem**: 表单元素容器
- **FormLabel**: 可访问的表单标签
- **FormControl**: 输入控件包装器
- **FormDescription**: 表单字段的帮助文本
- **FormMessage**: 错误消息显示

#### Form 开发模式
```typescript
// 定义 Zod 模式
const formSchema = z.object({
  email: z.string().email("无效的邮箱地址"),
  password: z.string().min(8, "密码至少需要8个字符"),
})

// 使用表单组件
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>邮箱</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Form 最佳实践
- 使用 Zod 模式进行验证
- 实现适当的错误处理
- 与 Radix UI 组件集成
- 遵循可访问性指南
- 使用 TypeScript 确保类型安全

## 可用组件

### 完整的 Radix UI 组件库 (27个组件)

#### 布局和导航
- **Accordion**: 可折叠的内容部分
- **Collapsible**: 显示/隐藏内容区域
- **Navigation Menu**: 复杂的导航结构
- **Menubar**: 应用程序菜单栏
- **Tabs**: 标签页内容组织
- **Separator**: 视觉内容分隔符

#### 数据显示
- **Avatar**: 用户头像
- **Card**: 内容容器
- **Progress**: 进度指示器
- **Scroll Area**: 自定义可滚动区域
- **Aspect Ratio**: 保持宽高比

#### 表单控件
- **Button**: 交互式按钮，支持多种变体
- **Checkbox**: 布尔输入控件
- **Input**: 文本输入字段
- **Label**: 表单字段标签
- **Radio Group**: 单选选择
- **Select**: 下拉选择
- **Slider**: 范围输入控件
- **Switch**: 切换控件
- **Textarea**: 多行文本输入
- **Toggle**: 切换按钮
- **Toggle Group**: 分组切换按钮

#### 覆盖层和对话框
- **Alert Dialog**: 确认对话框
- **Dialog**: 模态对话框
- **Dropdown Menu**: 上下文菜单
- **Popover**: 浮动内容面板
- **Tooltip**: 悬停信息

#### 表单系统
- **Form**: 完整的表单管理
- **FormField**: 带验证的字段包装器
- **FormItem**: 表单元素容器
- **FormLabel**: 可访问的表单标签
- **FormControl**: 输入控件包装器
- **FormDescription**: 帮助文本
- **FormMessage**: 错误消息

### 组件特性
- **TypeScript 支持**: 完整的类型定义
- **可访问性**: 符合 WCAG 2.1 AA 标准
- **响应式设计**: 移动优先方法
- **可定制**: Tailwind CSS 样式
- **一致的 API**: 统一的组件模式
