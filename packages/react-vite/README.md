# React + Vite + TypeScript Template

A modern React 18 + Vite + TypeScript project template, optimized for AI-assisted development.

## Quick start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (required)

### Install pnpm

If pnpm is not installed yet:

```bash
# Install pnpm with npm
npm install -g pnpm

# Or use the official installer
# curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Project setup

```bash
# 1. Install dependencies (pnpm only)
pnpm install

# 2. Start the dev server
pnpm dev

# 3. Production build
pnpm build

# 4. Preview production build
pnpm preview
```

## Package manager

**This project requires pnpm.**

- Do **not** use `npm` or `yarn` for dependency management.
- Use **pnpm** for all install / add / remove operations.
- Tooling is tuned for pnpm.

### Why pnpm?

- **Faster installs** — often 2–3× faster than npm
- **Less disk usage** — content-addressable store and hard links
- **Stricter dependency graph** — fewer phantom dependency issues
- **Strong monorepo support** — workspaces out of the box

## Scripts

```bash
# Development
pnpm dev              # Dev server
pnpm build            # Production build
pnpm preview          # Preview production build

# Quality
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm type-check       # TypeScript check
pnpm format           # Prettier write
pnpm format:check     # Prettier check

# Utilities
pnpm clean            # Remove dist
```

## Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Radix UI (27 primitives)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Package manager**: pnpm

## Project layout

```
src/
├── components/        # Shared components
│   └── ui/           # Radix-based UI primitives (28)
├── examples/         # Reference only — not for production copy-paste
│   ├── api-example.ts
│   ├── form-example.tsx
│   └── list-page-example.tsx
├── lib/              # Utilities and API client
│   ├── api.ts        # HTTP client + extractApiData
│   ├── services.ts   # useApi + streamRequest
│   └── utils.ts      # cn, debounce, throttle, etc.
├── pages/            # Route-level pages
│   ├── Home.tsx
│   └── NotFound.tsx
├── router/
│   └── index.tsx     # Hash router
├── App.tsx           # Root (RouterProvider)
├── main.tsx          # Entry
└── index.css         # Global styles + Tailwind
```

## UI primitives

Radix-based set (27 components):

### Layout & navigation

Accordion, Collapsible, Navigation Menu, Menubar, Tabs, Separator

### Data display

Avatar, Card, Progress, Scroll Area, Aspect Ratio

### Form controls

Button, Checkbox, Input, Label, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group

### Overlays

Alert Dialog, Dialog, Dropdown Menu, Popover, Tooltip

### Form system

Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage

## Development notes

### Components

```typescript
// Typical component shape
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

### API usage

```typescript
// Define calls in lib/api.ts (or a dedicated module)
export const exampleApi = {
  getData: (params: ListParams) =>
    api.get<ListResult<Data>>('/api/data', { params }),
  createItem: (data: CreateData) => api.post<Data>('/api/data', data),
};

// 1. useApi — loading/error + refetch (useCallback inside)
const { data, loading, error, refetch } = useApi(() => exampleApi.getData(params));

// 2. extractApiData — unwrap { code, data, message }
import { extractApiData } from '@/lib/api';
const result = extractApiData<MyData>(response);

// 3. streamRequest — SSE-style streams
await streamRequest('/api/chat', { prompt: 'hello' }, (res) => {
  console.log(res);
});
```

### Forms

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>
    </Form>
  );
}
```

## Conventions

- TypeScript strict mode
- Function components and hooks
- Tailwind for styling
- `PascalCase` components, `camelCase` utilities

## Deploy

```bash
pnpm build
# Output: dist/ — deploy to any static host
```

## AI assistants

This template is structured for codegen tools:

- Prefer clarity and consistency with existing patterns
- Match architecture and naming in the repo
- Comment non-obvious logic
- Consider performance and security

## Example files

Under `src/examples/` — **reference only**, not production-ready drop-ins.

| Goal              | File                     | Highlights                                      |
| ----------------- | ------------------------ | ----------------------------------------------- |
| Backend API calls | `api-example.ts`         | Types, wrappers, `extractApiData`               |
| Forms             | `form-example.tsx`       | Zod, `useForm`, `FormField`                     |
| List / CRUD UI    | `list-page-example.tsx`  | `useApi`, pagination, search, loading / empty  |

1. Read for patterns  
2. Reuse structure in your own code  
3. Do not copy verbatim into production  

## License

MIT License

## Contributing

Issues and pull requests are welcome.

---

**Always use pnpm for package management.**
