# React + Vite + TypeScript Template

A modern React 18 + Vite + TypeScript project template, optimized for AI-assisted development.

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (required)

### Setup

```bash
pnpm install
pnpm dev
```

## Command Contract

Use this command set consistently (same contract as `vue3-vite`).

```bash
# Development
pnpm dev         # Dev server
pnpm build       # Production build
pnpm preview     # Preview production build

# Quality gate
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm check       # Required gate: type-check + lint

# Formatting (optional)
pnpm format
pnpm format:check
```

Workspace-level checks (run from monorepo root):

```bash
pnpm check:templates  # Runs pnpm check for vue3-vite + react-vite
pnpm check:versions   # Verifies package.json/meta.json/templates.json version alignment
```

## Project Layout (Isomorphic with Vue template)

```text
src/
├── components/        # Shared components
│   └── ui/           # Radix-based UI primitives
├── examples/         # Reference only, never copy directly to production
│   ├── api-example.ts
│   ├── form-example.tsx
│   └── list-page-example.tsx
├── lib/              # API and utilities
│   ├── api.ts
│   ├── services.ts
│   └── utils.ts
├── pages/            # Route-level pages
│   ├── Home.tsx
│   ├── ExamplesPage.tsx
│   └── NotFound.tsx
├── router/
│   └── index.tsx     # Hash router (includes /examples)
├── App.tsx
├── main.tsx
└── index.css
```

## Examples Policy

- `src/examples/*` is pattern reference only.
- Re-implement the pattern in real feature files.
- Do not paste example files into production code.

## AI Agent Workflow (minimum path)

### New page (5 steps)

1. Add page in `src/pages/<FeatureName>.tsx`.
2. Register route in `src/router/index.tsx`.
3. Use existing UI primitives from `src/components/ui`.
4. Add service calls through `src/lib/services.ts` when needed.
5. Run `pnpm check`.

### New API flow (4 steps)

1. Define API call in `src/lib/api.ts` or service module.
2. Add typed wrapper in `src/lib/services.ts`.
3. Consume from page/component through the service wrapper.
4. Run `pnpm check`.

## Stack

- React 18
- Vite
- TypeScript (strict)
- Tailwind CSS
- Radix UI primitives
- React Hook Form + Zod
- Axios

## License

MIT License
