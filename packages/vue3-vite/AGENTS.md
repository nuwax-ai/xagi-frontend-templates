# Vue Vite Template — AI agent guide

## Overview

Modern Vue 3 + Vite + TypeScript frontend template, structured for AI coding assistants.

## Stack

- **Framework**: Vue 3
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI primitives**: radix-vue based UI set (`src/components/ui`)
- **Forms**: vee-validate + Zod
- **HTTP**: Axios
- **Package manager**: pnpm (required)

## Layout

```text
src/
├── components/
│   └── ui/              # Radix-vue based primitives
├── examples/            # Reference examples
│   ├── api-example.ts
│   ├── form-example.vue
│   └── list-page-example.vue
├── lib/
│   ├── api.ts           # HTTP client + extractApiData
│   ├── services.ts      # useApi + streamRequest
│   └── utils.ts         # cn, debounce, throttle, formatDate, ...
├── pages/
│   ├── Home.vue
│   ├── ExamplesPage.vue
│   └── NotFound.vue
├── router/
│   └── index.ts         # Hash router
├── App.vue
├── main.ts
└── style.css
```

## Code generation rules

Follow these when adding code:

### File placement

| Kind | Location | Notes |
| --- | --- | --- |
| Pages | `src/pages/` | Register routes in `router/index.ts` |
| Components | `src/components/` | Reusable UI |
| API helpers | `src/lib/api.ts` or dedicated services | Use `extractApiData` for wrapped responses |
| Types | Colocated in feature files | Match backend contracts |

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
const { data, loading, error, refetch } = useApi(() => userApi.getList(params), [params]);

await streamRequest<ChatMessage>(url, payload, (msg) => {
  // handle stream chunk
});
```

### Forms

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const schema = toTypedSchema(z.object({ name: z.string().min(1) }));
const { handleSubmit, errors } = useForm({ validationSchema: schema });
</script>
```

### Styling

```vue
<!-- Good -->
<div class="flex items-center gap-4 rounded-lg bg-white p-6 shadow" />

<!-- Avoid -->
<div :style="{ display: 'flex' }" />
```

### Examples folder

`src/examples/` is **not** for production copy-paste.

| Scenario | File | Topics |
| --- | --- | --- |
| HTTP + types | `api-example.ts` | Types, API wrappers, `extractApiData` |
| Forms | `form-example.vue` | Zod, vee-validate, field validation |
| Lists / CRUD | `list-page-example.vue` | `useApi`, pagination, search, empty state |

1. Read for patterns
2. Implement your own modules
3. Do not paste examples wholesale into prod

## Commands

```bash
pnpm run dev         # Dev server
pnpm run build       # Build
pnpm run preview     # Preview build
pnpm run type-check  # vue-tsc check
```

## Package manager

- **Use pnpm only** for installs and scripts.
- **Do not** use npm or yarn for dependencies in this package.
- Install: `pnpm install` · Dev: `pnpm dev` · Build: `pnpm build`

### Registry note for beta dependencies

If beta packages are unavailable on mirror registries, switch to npmjs first:

```bash
nrm use npm
```

## Tooling config files

- `components.json`
  - Uses `shadcn-vue` schema.
  - Tailwind config: `tailwind.config.js`.
  - Global CSS: `src/style.css`.
  - Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`.
- `biome.json`
  - Lint rules only (`formatter.enabled = false`) to avoid Prettier conflicts.
  - Include pattern covers Vue SFCs: `src/**/*.{js,jsx,ts,tsx,vue}`.

## Conventions

- TypeScript strict mode
- Prefer `<script setup lang="ts">`
- Tailwind-first styling
- `PascalCase` components, `camelCase` helpers

## Component guidelines

1. Prefer composition API with focused components
2. Type `props` / `emits` explicitly
3. Use slots intentionally and keep APIs clear
4. Use `computed` for derived state
5. Keep components small and single-purpose

## Reactive state

1. `ref` for primitives
2. `reactive` for objects
3. `computed` for derivations
4. `watch` / `watchEffect` for side effects
5. Use `shallowRef` when large object reactivity is unnecessary

## API layer

1. HTTP via `src/lib/api.ts`
2. `extractApiData<T>()` for `{ code, data, message }` style APIs
3. `useApi` for loading / error / refetch state
4. `streamRequest` for SSE-style streams
5. Prefer `async/await` and consistent error handling

## Styling

1. Tailwind utility classes first
2. Use `cn()` from `src/lib/utils.ts` for class merging
3. Scoped style blocks only when utility classes are insufficient
4. Keep layout mobile-first and responsive

## Common dependencies

- `vue`, `vue-router`
- `axios`
- `zod`, `vee-validate`, `@vee-validate/zod`
- `class-variance-authority`, `clsx`, `tailwind-merge`
- `typescript`, `vue-tsc`

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
- Comment only non-obvious logic
- Keep implementation Vue-native (avoid React-style patterns)
- Route smoke examples via `/#/examples` when validating generated UI
