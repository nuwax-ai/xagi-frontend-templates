# React Vite Template — AI agent guide

## Overview

Modern React 18 + Vite + TypeScript frontend template, structured for AI coding assistants.

## Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Radix UI (27 primitives)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Package manager**: pnpm (required)

## Layout

```
src/
├── components/
│   └── ui/              # Radix-based primitives (28)
├── examples/            # Reference examples
│   ├── api-example.ts
│   ├── form-example.tsx
│   └── list-page-example.tsx
├── lib/
│   ├── api.ts           # HTTP client + extractApiData
│   ├── services.ts      # useApi + streamRequest
│   └── utils.ts         # cn, debounce, throttle, formatDate, …
├── pages/
│   ├── Home.tsx
│   └── NotFound.tsx
├── router/
│   └── index.tsx        # Hash router
├── App.tsx
├── main.tsx
└── index.css
```

## Code generation rules

Follow these when adding code:

### File placement

| Kind        | Location                         | Notes                                      |
| ----------- | -------------------------------- | ------------------------------------------ |
| Pages       | `src/pages/`                     | Register routes in `router/index.tsx`      |
| Components  | `src/components/`                | Reusable UI                                |
| API helpers | `src/lib/api.ts` or dedicated    | Use `extractApiData` for wrapped responses |
| Types       | Colocated in feature files       | Match backend contracts                    |

### Types

```typescript
// Good: define types next to usage (see examples/api-example.ts)
interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

const response = await api.get<ApiResponse<User>>('/api/user');
const user = extractApiData<User>(response);
```

### API patterns

```typescript
const { data, loading, error, refetch } = useApi(() => userApi.getList(params), [params]);

await streamRequest<ChatMessage>(url, payload, (msg) => {
  /* … */
});
```

### Forms

```typescript
const schema = z.object({ name: z.string().min(1) });
const form = useForm({ resolver: zodResolver(schema) });
```

### Styling

```tsx
// Good
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow" />

// Avoid
<div style={{ display: 'flex' }} />
```

### Examples folder

`src/examples/` is **not** for production copy-paste.

| Scenario        | File                     | Topics                                   |
| --------------- | ------------------------ | ---------------------------------------- |
| HTTP + types    | `api-example.ts`         | Types, API wrappers, `extractApiData`    |
| Forms           | `form-example.tsx`       | Zod, `useForm`, `FormField`              |
| Lists / CRUD    | `list-page-example.tsx`  | `useApi`, pagination, search, empty state |

1. Read for patterns  
2. Implement your own modules  
3. Do not paste examples wholesale into prod  

## Commands

```bash
pnpm run dev       # Dev server
pnpm run build     # Build
pnpm run preview   # Preview build
pnpm run lint      # ESLint
```

## Package manager

- **Use pnpm only** for installs and scripts.
- **Do not** use npm or yarn for dependencies in this package.
- Install: `pnpm install` · Dev: `pnpm dev` · Build: `pnpm build`

### Why pnpm?

Faster installs, disk efficiency, stricter graph, good workspace support.

## Conventions

- TypeScript strict mode  
- Function components  
- Tailwind-first styling  
- `PascalCase` components, `camelCase` helpers  

## Component guidelines

1. Prefer function components  
2. Hooks for state and effects  
3. Typed props  
4. `React.memo` when it helps  
5. Small, focused components  

## State

1. `useState` / `useReducer` first  
2. Context for cross-cutting state  
3. External stores only when complexity warrants  
4. Avoid unnecessary lifting  

## API layer

1. HTTP via `src/lib/api.ts`  
2. `extractApiData<T>()` for `{ code, data, message }` style APIs  
3. `useApi` for loading / error  
4. `streamRequest` for SSE-style streams  
5. Prefer `async/await` and consistent error handling  

## Styling

1. Tailwind utility classes  
2. CSS Modules only when needed  
3. Consistent spacing and tokens  
4. Mobile-first responsive layout  

## Common dependencies

- `react`, `react-dom`  
- `axios`  
- `tailwindcss`  
- `typescript`  

## Commit message style

```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: refactor
test: tests
chore: tooling / build
```

## Hints for AI

- Readability and consistency with existing code  
- Follow established folder and naming patterns  
- Comment non-obvious logic  
- Think about performance and security  

## Forms (React Hook Form + Zod)

Built-in form primitives wrap RHF + Zod.

- **Form** — RHF context  
- **FormField** — field + validation wiring  
- **FormItem**, **FormLabel**, **FormControl**, **FormDescription**, **FormMessage**  

```typescript
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
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

### Form best practices

- Validate with Zod schemas  
- Surface errors clearly  
- Compose with Radix/shadcn-style primitives  
- Keep accessibility in mind  
- Leverage TypeScript end-to-end  

## Radix UI set (27)

### Layout & navigation

Accordion, Collapsible, Navigation Menu, Menubar, Tabs, Separator  

### Data display

Avatar, Card, Progress, Scroll Area, Aspect Ratio  

### Controls

Button, Checkbox, Input, Label, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group  

### Overlays

Alert Dialog, Dialog, Dropdown Menu, Popover, Tooltip  

### Form system

Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage  

### Traits

Typed APIs, accessibility-oriented, responsive defaults, Tailwind-friendly styling, consistent patterns.
