# Agent Guidelines for HyperAgent Demo UI

## Build/Lint/Test Commands

### Vue.js (Vite)
- **Dev server**: `npm run dev` or `pnpm dev`
- **Build**: `npm run build` or `pnpm build`
- **Preview**: `npm run preview` or `pnpm preview`
- **Testing**: No test framework configured - add Vitest if needed: `npm install --save-dev vitest @vue/test-utils`
- **Linting**: No linter configured - add ESLint if needed: `npm install --save-dev eslint eslint-plugin-vue`

## Code Style Guidelines

### JavaScript/Vue.js
- **Modules**: ES modules with `import`/`export`
- **Imports**: One import per line, external libraries first, then local imports
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Path aliases**: Use `@/` for `src/` directory imports (configured in jsconfig.json)
- **Vue composition API**: Prefer `<script setup>` syntax with `ref()` and `computed()`
- **Error handling**: Use try/catch for async operations, `.catch()` for promises
- **Async patterns**: Use async/await with proper error handling
- **Security**: Never log or expose private keys/secrets, use environment variables for sensitive data

### General
- **Formatting**: Follow Prettier defaults (2 spaces, single quotes, semicolons)
- **Comments**: No inline comments unless explaining complex logic
- **Dependencies**: Verify library availability in package.json before using
- **Types**: No TypeScript - use JSDoc for complex function documentation if needed