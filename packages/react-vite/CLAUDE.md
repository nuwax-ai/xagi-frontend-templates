# React Vite Template — Claude guide

## Overview

Modern React 18 + Vite + TypeScript template tuned for Claude and similar assistants.

## Highlights

- Fast dev loop (Vite HMR)
- TypeScript throughout
- Tailwind CSS
- Radix UI primitives (27)
- React Hook Form + Zod
- Axios HTTP client
- Opinionated folder layout

## Setup

### pnpm is required

**Use pnpm only — not npm or yarn for dependencies.**

```bash
# 1. Install pnpm if needed
npm install -g pnpm

# 2. Install deps
pnpm install

# 3. Dev server
pnpm dev

# 4. Build
pnpm build
```

### Why pnpm?

Faster installs, less disk use, stricter dependency graph, solid workspace story.

## Tooling notes

- VS Code / Copilot-friendly defaults where present  
- Cursor rules may live in `.cursorrules`  
- ESLint + Prettier pre-wired  
- TypeScript strict mode  

## Code generation rules

### 1. Where files go

| Kind        | Path                          | Notes                         |
| ----------- | ----------------------------- | ----------------------------- |
| New page    | `src/pages/XxxPage.tsx`       | Update `router/index.tsx`     |
| Component   | `src/components/Xxx.tsx`      | Reusable UI                   |
| API         | `src/lib/api.ts` or `*Api.ts` | Keep calls typed              |
| Types       | Next to usage                 | Mirror backend contracts      |

### 2. Types

```typescript
// Define alongside features (see examples/api-example.ts)
interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}
```

### 3. API usage

```typescript
const userApi = {
  getList: async (params: ListParams) => {
    const res = await api.get<ApiResponse<PaginatedResult<User>>>('/api/users', { params });
    return extractApiData(res);
  },
};

const { data, loading, error, refetch } = useApi(() => userApi.getList(params), [params]);
```

### 4. Forms

```typescript
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
});

const form = useForm({ resolver: zodResolver(schema) });

<Form {...form}>
  <FormField name="name" render={...} />
</Form>
```

### 5. Styling

- Use Tailwind classes  
- Use `cn()` to merge classes  
- Avoid inline `style` for layout  
- Avoid ad-hoc CSS files per component unless necessary  

### 6. Examples

`src/examples/` is reference-only — **not** production copy-paste.

| Goal        | File                    | Focus                                      |
| ----------- | ----------------------- | ------------------------------------------ |
| HTTP        | `api-example.ts`        | Types, wrappers, `extractApiData`          |
| Forms       | `form-example.tsx`      | Zod, RHF, `FormField`                      |
| Lists       | `list-page-example.tsx` | `useApi`, pagination, CRUD, empty states   |

## Component skeleton

```typescript
interface ComponentProps {
  title: string;
  items: Item[];
  onAction?: (id: string) => void;
}

export const Component: React.FC<ComponentProps> = ({ title, items, onAction }) => {
  return (
    <div className="component">
      <h2>{title}</h2>
      {/* ... */}
    </div>
  );
};
```

## API integration sketch

```typescript
export const exampleApi = {
  getData: (params: ListParams) => api.get<ListResult<Data>>('/api/data', { params }),
  createItem: (data: CreateData) => api.post<Data>('/api/data', data),
};

const { data, loading, error, refetch } = useApi(() => exampleApi.getData(params));

import { extractApiData } from '@/lib/api';
const result = extractApiData<MyData>(response);

await streamRequest('/api/stream', { prompt: '...' }, (res) => {
  console.log(res);
});
```

## Prompt templates

### Feature work

```
Implement a [feature name] for this React Vite app:
- TypeScript + Tailwind
- Follow existing structure
- Place shared UI under src/components/
- Wire into routing if it is a page
- Include necessary types
```

### Debugging

```
Issue: [description]
Error: [message]
Code: [snippet]
Expected: [behavior]

Suggest a fix and explain briefly.
```

## Conventions

- Components: `src/components/`  
- Shared API client: `src/lib/api.ts` (and `services.ts` for hooks/helpers)  
- Utilities: `src/lib/utils.ts`  
- Styling: Tailwind first  
- All new source in TypeScript  

## Common patterns

```typescript
const { data, loading, error } = useApi(() => api.getData(params));
const [state, setState] = useState<DataType>(initial);
const handleClick = (id: string) => onAction?.(id);
```

## Performance

- `React.memo` for pure leaf components  
- `useCallback` / `useMemo` when profiling says so  
- Avoid needless re-renders  
- Lazy-load heavy routes when appropriate  

## Debugging

- React DevTools  
- Network tab for API  
- Logging and breakpoints as usual  

## Practices

1. Types at boundaries (API, props)  
2. Single-purpose components  
3. Pick the smallest state solution that works  
4. Error boundaries and user-visible errors  
5. Revisit performance after features land  

## Forms (RHF + Zod)

### Schema example

```typescript
import { z } from 'zod';

const formSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;
```

### Form UI

```typescript
export function UserForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Radix primitives (27)

Layout & navigation: Accordion, Collapsible, Navigation Menu, Menubar, Tabs, Separator  

Display: Avatar, Card, Progress, Scroll Area, Aspect Ratio  

Inputs: Button, Checkbox, Input, Label, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group  

Overlays: Alert Dialog, Dialog, Dropdown Menu, Popover, Tooltip  

Form system: Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage  

## UI snippets

### Buttons

```tsx
<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

### Select inside FormField

```tsx
<FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Pick a category" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```
