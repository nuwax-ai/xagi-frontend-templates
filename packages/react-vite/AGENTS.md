# React Vite Template — AI agent guide

## Overview

Modern React 18 + Vite + TypeScript frontend template, structured for AI coding assistants.

## Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI primitives**: Radix UI based UI set (`src/components/ui`)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Package manager**: pnpm (required)

## Layout

```text
src/
├── components/
│   └── ui/              # Radix-based primitives
├── examples/            # Reference examples
│   ├── api-example.ts
│   ├── form-example.tsx
│   └── list-page-example.tsx
├── lib/
│   ├── api.ts           # HTTP client + extractApiData
│   ├── services.ts      # useApi + streamRequest
│   └── utils.ts         # cn, debounce, throttle, formatDate, ...
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

| Kind        | Location                               | Notes                                      |
| ----------- | -------------------------------------- | ------------------------------------------ |
| Pages       | `src/pages/`                           | Register routes in `router/index.tsx`      |
| Components  | `src/components/`                      | Reusable UI                                |
| API helpers | `src/lib/api.ts` or dedicated services | Use `extractApiData` for wrapped responses |
| Types       | Colocated in feature files             | Match backend contracts                    |

### Types

```typescript
// Good: define types next to usage (see examples/api-example.ts)
interface ApiEnvelope<T = unknown> {
  code: number;
  data: T;
  message: string;
}

const response = await api.get<ApiEnvelope<User>>('/api/user');
const user = extractApiData<User>(response);
```

### API patterns

```typescript
const { data, loading, error, refetch } = useApi(
  () => userApi.getList(params),
  [params]
);

await streamRequest<ChatMessage>(url, payload, msg => {
  // handle stream chunk
});
```

### Forms

```typescript
const schema = z.object({ name: z.string().min(1, 'Name is required') });
const form = useForm({ resolver: zodResolver(schema) });
```

### Styling

```tsx
// Good
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow" />

// Avoid
<div style={{ display: 'flex' }} />
```

### Examples folder

`src/examples/` is **not** for production copy-paste.

| Scenario     | File                    | Topics                                    |
| ------------ | ----------------------- | ----------------------------------------- |
| HTTP + types | `api-example.ts`        | Types, API wrappers, `extractApiData`     |
| Forms        | `form-example.tsx`      | Zod, RHF, form field wiring               |
| Lists / CRUD | `list-page-example.tsx` | `useApi`, pagination, search, empty state |

1. Read for patterns
2. Implement your own modules
3. Do not paste examples wholesale into prod

## Commands

```bash
pnpm run dev         # Dev server
pnpm run build       # Build
pnpm run preview     # Preview build
pnpm run lint        # ESLint
pnpm run type-check  # Type check
```

## Package manager

- **Use pnpm only** for installs and scripts.
- **Do not** use npm or yarn for dependencies in this package.
- Install: `pnpm install` · Dev: `pnpm dev` · Build: `pnpm build`

## Tooling config files

- `components.json`
  - Uses `ui.shadcn.com` schema.
  - Global CSS: `src/index.css`.
  - Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`.
- `biome.json`
  - Lint rules only (`formatter.enabled = false`) to avoid Prettier conflicts.
  - Include pattern targets source scripts: `src/**/*.{js,jsx,ts,tsx}`.

## Conventions

- TypeScript strict mode
- Function components + hooks
- Tailwind-first styling
- `PascalCase` components, `camelCase` helpers

## Component guidelines

1. Keep components focused and single-purpose
2. Type props and callbacks explicitly
3. Prefer composition over deeply nested conditionals
4. Add comments only for non-obvious logic
5. Use accessibility-friendly primitives from `src/components/ui`

## State

1. `useState` / `useReducer` first
2. Use context for cross-cutting concerns
3. Introduce external store only when complexity requires it
4. Avoid unnecessary state lifting

## API layer

1. HTTP via `src/lib/api.ts`
2. `extractApiData<T>()` for `{ code, data, message }` style APIs
3. `useApi` for loading / error / refetch state
4. `streamRequest` for SSE-style streams
5. Prefer `async/await` and consistent error handling

## Styling

1. Tailwind utility classes first
2. Use `cn()` from `src/lib/utils.ts` for class merging
3. CSS modules only when utility classes become hard to maintain
4. Keep layout mobile-first and responsive

## Common dependencies

- `react`, `react-dom`, `react-router-dom`
- `axios`
- `zod`, `react-hook-form`, `@hookform/resolvers`
- `class-variance-authority`, `clsx`, `tailwind-merge`
- `typescript`

## Commit message style

```text
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: refactor
test: tests
chore: tooling / build
```

## Hints for AI

- Prioritize readability and consistency with existing code
- Follow established folder and naming patterns
- Keep type definitions close to usage
- Validate behavior with `src/examples/` scenarios when relevant
