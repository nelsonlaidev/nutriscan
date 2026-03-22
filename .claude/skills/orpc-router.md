---
name: orpc-router
description: Guide for creating oRPC routers, schemas, query hooks, and server-side hydration to replace next-safe-action server actions and raw data queries.
user_invocable: true
---

# oRPC Router Skill

Use this skill when migrating server actions (`src/actions/`) and data queries (`src/data/`) to oRPC routers, or when creating new oRPC endpoints.

## Architecture Overview

```
src/orpc/
├── client.ts          # Client-side oRPC client + TanStack Query utils
├── context.ts         # Request context (session, db, headers)
├── procedures.ts      # Base procedures (public, protected)
├── server.ts          # Server-side router client (for SSR prefetching)
├── routers/
│   ├── index.ts       # Root router (combines all sub-routers)
│   └── *.router.ts    # Individual route handlers
└── schemas/
    └── *.schema.ts    # Zod input/output schemas
```

## Step-by-Step: Creating an oRPC Router

### 1. Define the Zod schema

Create `src/orpc/schemas/<domain>.schema.ts`:

```ts
import * as z from 'zod'

// Input schema for mutations
export const CreateFoodEntryInputSchema = z.object({
  name: z.string().min(1),
  calories: z.number().int().min(0),
  mealCategory: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
})

// Input schema for queries (if needed)
export const GetFoodEntriesInputSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
})
```

### 2. Create the router

Create `src/orpc/routers/<domain>.router.ts`:

```ts
import { and, eq, gte, lte } from 'drizzle-orm'

import { foodEntries } from '@/db/schemas'

import { protectedProcedure } from '../procedures'
import { CreateFoodEntryInputSchema, GetFoodEntriesInputSchema } from '../schemas/food.schema'

// Query: use protectedProcedure (or publicProcedure) + .input() + .handler()
const list = protectedProcedure.input(GetFoodEntriesInputSchema).handler(async ({ input, context }) => {
  const rows = await context.db
    .select()
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, context.session.user.id),
        gte(foodEntries.createdAt, new Date(input.startDate)),
        lte(foodEntries.createdAt, new Date(input.endDate)),
      ),
    )
  return rows
})

// Mutation: same pattern
const create = protectedProcedure.input(CreateFoodEntryInputSchema).handler(async ({ input, context }) => {
  await context.db.insert(foodEntries).values({
    ...input,
    userId: context.session.user.id,
  })
})

export const foodRouter = {
  list,
  create,
}
```

**Key rules:**

- Use `protectedProcedure` for authenticated routes (most cases)
- Use `publicProcedure` only for unauthenticated endpoints
- Access `context.session.user.id` for the current user (guaranteed present in protected procedures)
- Access `context.db` for the Drizzle database instance
- Always scope queries to `context.session.user.id` — never trust client-provided user IDs
- The handler return value is the response — no need to wrap in `{ success: true }`

### 3. Register the router

Add to `src/orpc/routers/index.ts`:

```ts
import { foodRouter } from './food.router'
import { onboardingRouter } from './onboarding.router'

export const router = {
  onboarding: onboardingRouter,
  food: foodRouter,
}
```

### 4. Create TanStack Query hooks

Create `src/hooks/queries/<domain>.query.ts`:

```ts
import { useMutation, useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

// Query hook
export function useFoodEntries(startDate: string, endDate: string) {
  return useQuery(orpc.food.list.queryOptions({ input: { startDate, endDate } }))
}

// Mutation hook
export function useCreateFoodEntry(onSuccess?: () => void) {
  return useMutation(orpc.food.create.mutationOptions({ onSuccess }))
}
```

**Pattern:** `orpc.<router>.<procedure>.queryOptions(...)` for queries, `.mutationOptions(...)` for mutations.

### 5. Server-side data fetching (hydration)

For pages that need SSR data, prefetch in a Server Component:

```tsx
// src/app/(main)/dashboard/page.tsx
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

import { DashboardContent } from './content'

export default async function DashboardPage() {
  const queryClient = getQueryClient()

  // Prefetch on the server — the data will be serialized and hydrated on the client
  await queryClient.prefetchQuery(
    orpc.food.list.queryOptions({
      input: { startDate: '2026-03-21', endDate: '2026-03-21' },
    }),
  )

  return (
    <HydrateClient client={queryClient}>
      <DashboardContent />
    </HydrateClient>
  )
}
```

**Important:** `import '@/orpc/server'` sets `globalThis.$client` to a server-side router client that bypasses HTTP. This import MUST be at the top of any Server Component that prefetches.

The client component (`DashboardContent`) just uses the same `useQuery` hook — TanStack Query automatically picks up the hydrated data.

### 6. Using in client components

```tsx
'use client'

import { useFoodEntries, useCreateFoodEntry } from '@/hooks/queries/food.query'

export function DashboardContent() {
  const { data: entries, isLoading } = useFoodEntries('2026-03-21', '2026-03-21')
  const { mutate, isPending } = useCreateFoodEntry(() => {
    // onSuccess callback
  })

  // Use entries and mutate...
}
```

## Procedures Reference

- `publicProcedure` — no auth required, `context.session` may be null
- `protectedProcedure` — auth required, `context.session` is guaranteed non-null with `.user`

Both provide `context.db` (Drizzle instance) and `context.headers`.
