# Repository Guidelines

## Project Structure & Module Organization

`src/app` contains Next.js App Router pages and layouts. Shared UI lives in `src/components`, reusable hooks in `src/hooks`, and app utilities in `src/lib`. Database code is under `src/db` with Drizzle schemas, seed/reset scripts, and generated migrations in `src/db/migrations`. RPC contracts and routers live in `src/orpc`. End-to-end tests are in `e2e/tests/{authed,destructive,unauthed}`, localized messages are in `messages/`, and static assets are in `public/`.

## Build, Test, and Development Commands

Use Bun for all local work.

- `bun dev`: start the Next.js dev server on `localhost:3000`.
- `bun build`: create a production build.
- `bun start`: serve the production build.
- `bun check`: run lint, typecheck, format check, knip, and spellcheck.
- `bun test:unit`: run Vitest tests.
- `bun test:e2e`: run Playwright flows with `.env.local` loaded. Do not run this for the user unless they explicitly ask; they prefer to run E2E tests themselves.
- `bun db:generate` / `bun db:migrate`: create and apply Drizzle migrations.
- `bun db:seed` / `bun db:reset`: seed or recreate local data.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Coding Style & Naming Conventions

The codebase is TypeScript-first and uses the `@/*` path alias for `src/*`. Formatting is handled by `prettier`; linting uses `eslint` with Tailwind-aware rules. Pre-commit hooks run both tools through `lefthook`, so keep files formatted before committing. Follow the existing naming patterns: React components in PascalCase, hooks prefixed with `use-`, route files named `page.tsx`, `layout.tsx`, or `route.ts`, and tests ending in `.test.ts` or `.spec.ts`.

Treat the product as a mobile app by default. Prefer mobile-first layouts and touch-friendly interactions, and avoid desktop-only polish such as hover-dependent affordances unless explicitly requested.

Do not add border utilities to `<Card />` by default. The shared `Card` component already provides its own border/ring treatment, so only override that styling when there is an explicit design reason.

## Testing Guidelines

Unit tests use Vitest and are discovered via `*.test.{ts,tsx}`. Keep unit tests close to the code they cover, like [`src/lib/achievements/evaluator.test.ts`](/Users/nelson/Developer/repositories/nutriscan/src/lib/achievements/evaluator.test.ts). E2E coverage uses Playwright with separate authenticated, destructive, and unauthenticated suites. Do not run `bun test:e2e` for the user unless they explicitly ask; they prefer to run end-to-end tests themselves. Add or update the smallest relevant unit test when behavior changes, and let the user run the targeted Playwright suite before opening a PR when E2E verification is needed.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit style: `feat(settings): ...`, `fix: ...`, `refactor: ...`, `chore: ...`. Keep subjects imperative and scoped when useful. PRs should explain the user-visible change, note schema or env updates, link related issues, and include screenshots for UI changes. Call out destructive flows or data migration impact explicitly.

## Security & Configuration Tips

Secrets are validated in `src/env.ts` and loaded through `.env.local` via `bun with-env`. Never commit credentials. If you change database schema or external storage settings, update the matching Drizzle migration and document any required environment variables in the PR.
