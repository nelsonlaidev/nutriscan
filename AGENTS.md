# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Commands

- `pnpm dev` — start dev server (http://localhost:3000)
- `pnpm build` — production build
- `pnpm check` — runs lint + typecheck + format:check + knip (the full CI suite)
- `pnpm lint` / `pnpm lint:fix` — ESLint (zero warnings allowed)
- `pnpm typecheck` — TypeScript check (no emit)
- `pnpm format` / `pnpm format:check` — Prettier
- `pnpm knip` — detect unused files/exports/dependencies
- `pnpm db:generate` — generate Drizzle migration from schema changes
- `pnpm db:migrate` — apply migrations
- `pnpm db:push` — push schema directly (dev shortcut)
- `pnpm db:studio` — open Drizzle Studio
- `pnpm db:reset` — reset database (runs `src/db/reset.ts`)

## Architecture

**Next.js 16 App Router** with React 19, React Compiler enabled, Tailwind CSS v4.

### Path aliases

- `@/*` → `./src/*`
- `~/*` → `./public/*`

### Route structure (`src/app/`)

- `(main)/` — authenticated layout group (dashboard, add, progress, profile). Layout fetches session and wraps children in `<Providers>` + `<Navbar>`.
- `auth/` — sign-in/sign-up pages (public)
- `onboarding/` — post-signup onboarding flow
- `api/auth/[...all]/` — Better Auth catch-all API handler

### Authentication (Better Auth)

- **Server config**: `src/lib/auth.ts` — `betterAuth()` with Drizzle adapter, email/password, custom user fields (onboarded, currentWeight, goalWeight, height)
- **Client**: `src/lib/auth-client.ts` — exports `signIn`, `signUp`, `signOut`, `useSession`
- **Server session helper**: `getSession()` in `src/lib/auth.ts`
- **React session context**: `src/lib/session.tsx` — `SessionProvider` / `useSession` for server-fetched session in client components

### Middleware (`src/proxy.ts`)

Route protection logic: redirects unauthenticated users to `/`, redirects authenticated users away from auth pages to `/dashboard`, and forces non-onboarded users to `/onboarding`.

### Database

- **PostgreSQL** via Docker (`docker-compose.yml` — postgres:17-alpine on port 5432)
- **Drizzle ORM** with `postgres` driver (`src/db/index.ts`)
- Schemas in `src/db/schemas/` (barrel export via `index.ts`)
- Migrations output to `src/db/migrations/`

### Server Actions

- `next-safe-action` with two clients in `src/lib/safe-action.ts`:
  - `actionClient` — unauthenticated
  - `authActionClient` — middleware that requires session and injects `ctx.user`
- Action files live in `src/actions/`

### State management

- **Jotai** (provider in root layout)

### UI

- **shadcn/ui** (base-maia style) with Phosphor icons, Base UI components
- UI components in `src/components/ui/`
- Toasts via Sonner

### i18n (next-intl)

- **Cookie-based locale** (no URL prefix) — config in `src/i18n/request.ts`
- Translation files in `messages/en.json` and `messages/zh-TW.json`
- Keys use **kebab-case** with dot-notation grouping: `settings.dark-mode`, `nav.dashboard`
- **No namespaces** — always call `getTranslations()` / `useTranslations()` without arguments, then use dot path: `t('settings.title')`
- Server components: `const t = await getTranslations()` from `next-intl/server`
- Client components: `const t = useTranslations()` from `next-intl`

### Environment

- `src/env.ts` — `@t3-oss/env-nextjs` schema validating `DATABASE_URL` and `BETTER_AUTH_SECRET`
- Env loaded via `.env.local` (not committed)
- Node >=24, pnpm enforced via `preinstall` script

## Policies

- Only run `pnpm typecheck` and `pnpm lint` when you want to check for errors
- Never use `pnpm check` in development, as it runs the full CI suite and is very slow
- Never use `npm` or `npx`
- Add UI components using shadcn/ui mcp
- Always add `Icon` suffix when using Phosphor icons. E.g. `ArrowUpRightIcon` instead of `ArrowUpRight`
- When using Phosphor icons, mark sure it is client component
- **Database migrations**: When updating database schemas, NEVER run `pnpm db:push` or `pnpm db:migrate`. Instead, ask the user to run migrations manually after making schema changes
