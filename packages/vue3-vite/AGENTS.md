# Vue 3 Vite Template - AI Agent Guide

## Project overview
This is a modern Vue 3 + Vite + TypeScript template optimized for AI coding assistants.

## Tech stack
- **Framework**: Vue 3
- **Build tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **HTTP client**: Axios
- **Package manager**: pnpm (required)
- **Recommended IDE extension**: Volar
- **Form validation**: vee-validate + zod

## Project structure
```
src/
├── components/      # Shared UI components
│   └── ui/          # Vue UI library aligned with react-vite
├── examples/        # API/form/list reference implementations
├── lib/             # Utility and API layer
│   ├── api.ts       # Axios client + extractApiData
│   ├── services.ts  # useApi / streamRequest patterns
│   └── utils.ts     # cn / debounce / throttle helpers
├── pages/           # Route pages
├── router/          # Vue Router setup
├── App.vue          # Root component shell
├── main.ts          # Application entry
└── style.css        # Global styles
```

## Development commands
```bash
pnpm run dev          # Start dev server
pnpm run build        # Build production output
pnpm run preview      # Preview production build
```

## Package manager policy
- **Use pnpm only** for dependency and script operations
- **Do not use npm or yarn** in this template
- **Install**: `pnpm install`
- **Develop**: `pnpm dev`
- **Build**: `pnpm build`

## Code conventions
- Prefer Vue 3 Composition API (`<script setup>`)
- Keep TypeScript in strict mode
- Follow Vue Single File Component best practices
- Use `PascalCase` for components
- Use `camelCase` for utilities and helpers

## Component development rules
- Prefer `<script setup>` syntax
- Use `ref` / `reactive` for state
- Use `computed` for derived values
- Use `watch` / `watchEffect` for side effects
- Define typed props and emits with `defineProps` / `defineEmits`
- Use slots intentionally and keep APIs clear

## Reactive state guidelines
1. Use `ref` for primitives
2. Use `reactive` for objects
3. Use `shallowRef` / `shallowReactive` for large structures when needed
4. Use `computed` for cached derivations
5. Keep watchers focused and side-effect oriented

## Component communication
1. Parent to child via props
2. Child to parent via emits
3. Cross-level communication via provide/inject
4. Event bus for lightweight cases
5. Use Pinia when state complexity grows

## API usage
1. Reuse the HTTP client in `src/lib/api.ts`
2. Define endpoint-level services in `src/lib/services.ts`
3. Keep error handling consistent
4. Use `async/await` for readability
5. Use `extractApiData()` for `{ code, data, message }` envelopes
6. Handle async state via `useApi` (`loading/error/refetch`)

## Styling guidance
1. Prefer scoped styles for component isolation
2. Use CSS variables when shared theme values are needed
3. Design mobile-first layouts
4. Consider CSS modules if local complexity grows
5. Use Vue transitions for UI animations

## Common dependencies
- `vue` - core framework
- `vue-router` - client-side routing
- `axios` - HTTP client
- `zod` - schema validation
- `vee-validate` - form state and validation bridge
- `class-variance-authority` - variant-based class API
- `typescript` - type system
- `@vitejs/plugin-vue` - Vue SFC support
- `vue-tsc` - Vue type checker

## Commit style
```
feat: new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code refactor
test: test updates
chore: tooling or build updates
```

## AI implementation hints
- Prefer Composition API patterns
- Keep components focused and maintainable
- Follow Vue 3 best practices
- Consider readability and performance together
- Keep type definitions close to usage
- Keep component naming aligned with `react-vite/src/components/ui`
- Route smoke examples via `/#/examples` when validating generated UI
