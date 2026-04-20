# Vue 3 Vite Template - Claude Guide

## Project overview
This Vue template is aligned with the React template structure and now includes:
- Hash-based routing for static deployment safety
- Tailwind CSS as the default styling layer
- A generated Vue UI component set (`src/components/ui`)
- Example modules for API, list page, and Zod-based forms

## Current stack
- Vue 3 + Vite + TypeScript
- Vue Router (hash history)
- Tailwind CSS + PostCSS
- Axios + typed API helpers
- vee-validate + zod (`@vee-validate/zod`) for schema-first forms
- class-variance-authority + clsx + tailwind-merge for component variants
- lucide-vue-next for icons

## Core structure
```text
src/
  components/ui/      # 28 UI component counterparts
  examples/           # api-example.ts, form-example.vue, list-page-example.vue
  lib/
    api.ts            # Axios client + extractApiData
    services.ts       # useApi + streamRequest + domain examples
    utils.ts          # cn, debounce, throttle, formatting helpers
  pages/
    Home.vue
    ExamplesPage.vue
    NotFound.vue
  router/index.ts
```

## Key conventions
1. Prefer `extractApiData(response)` over hand-written envelope parsing.
2. Keep component class composition through `cn()` from `src/lib/utils.ts`.
3. Use Zod schema as the single source of validation truth in forms.
4. Keep examples as references; do not copy them verbatim into production modules.

## Useful commands
```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run type-check
```

## Notes
- `pnpm run type-check` may depend on local Node/toolchain compatibility with `vue-tsc`.
- The examples smoke page is available at `/#/examples`.
