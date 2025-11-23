# Agent Guidelines for HyperAgent Demo UI

## Build/Lint/Test Commands

### Vue.js (Vite)
- **Dev server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` or `pnpm build`
- **Preview**: `npm run preview` or `pnpm preview`

## Code Style Guidelines

### JavaScript/Vue.js
- **Modules**: ES modules with `import`/`export`
- **Imports**: One import per line, group by external libraries first, then local imports
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Path aliases**: Use `@/` for `src/` directory imports
- **Vue composition API**: Prefer `<script setup>` syntax
- **Error handling**: Use try/catch for async operations, `.catch()` for promises
- **Security**: Never log or expose private keys/secrets

### General
- **Formatting**: Follow Prettier defaults (2 spaces, single quotes, semicolons)
- **Comments**: No inline comments unless explaining complex logic
- **Dependencies**: Verify library availability before using