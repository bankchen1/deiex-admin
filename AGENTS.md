# Repository Guidelines

## Project Structure & Module Organization
The Vue 3 app lives in `admin-vue/`. Core code sits in `src/`: pages/layouts wire screens, `sections/`, `widgets/`, `forms/`, `tables/`, and `modals/` host modular UI, and `services/`, `stores/`, `utils/`, plus `types/` centralize data and typing. Assets stay in `public/` and `src/assets/`. Vite bundles land in `dist/`; leave those generated files alone.

## Build, Test, and Development Commands
Install dependencies once with `npm install`. Use `npm run dev` for local development with hot reload. Validate builds through `npm run build`, or target env-specific output with `npm run build:staging` / `npm run build:production`. Run `npm run lint` before submitting changes and `npm run format` if Prettier adjustments are needed; Husky’s pre-commit hook runs `lint-staged` automatically.

## Coding Style & Naming Conventions
The project adopts TypeScript strict mode and the Vue Composition API. Name components, stores, and services in PascalCase (`UserTable.vue`, `useRiskStore.ts`) and prefer snake-case route segments. Follow the configured style tools: ESLint extends Vue and TypeScript recommendations, and Prettier enforces `singleQuote`, `semi: false`, `printWidth: 100`. Treat `_`-prefixed variables as intentionally unused to satisfy linting.

## Testing Guidelines
There is no automated test runner yet, so lean on focused manual verification via `npm run dev`. When adding logic-heavy modules, create lightweight unit harnesses under `src/__tests__/` with your preferred runner and document the setup in the PR until a shared framework lands. Capture screenshots or recordings for UI flows that touch tables, forms, or dashboards, and call out regression risk in the PR body.

## Commit & Pull Request Guidelines
Craft commits as small, focused units with imperative one-line subjects (`Add futures order search filter`). Combine summary, context, and verification notes in the PR description; link related task IDs or documents (e.g., `TASK_10.3_SUMMARY.md`) when available. Each PR should list the npm scripts you ran, include environment notes when `.env.*` changes are required, and attach visual evidence for UI-facing updates. Request at least one reviewer familiar with the impacted module.

## Security & Configuration Tips
Environment values live in `.env.development`, `.env.staging`, and `.env.production`; never commit secrets and document placeholder keys when onboarding others. Shared security patterns (CSP, token handling) are tracked in `SECURITY_IMPLEMENTATION.md`—review it before touching auth flows. If you add a new integration, flag threat or permissions considerations in the PR so reviewers can loop in security stakeholders.
