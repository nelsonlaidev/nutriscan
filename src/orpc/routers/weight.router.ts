import { ORPCError } from '@orpc/server'
import { and, desc, eq } from 'drizzle-orm'

import { users } from '@/db/schemas/auth.schema'
import { weightEntries } from '@/db/schemas/weight-entry.schema'

import { protectedProcedure } from '../procedures'
import {
  AddWeightEntryInputSchema,
  DeleteWeightEntryInputSchema,
  UpdateWeightEntryInputSchema,
} from '../schemas/weight.schema'

const list = protectedProcedure.handler(async ({ context }) => {
  const rows = await context.db
    .select({
      id: weightEntries.id,
      weight: weightEntries.weight,
      createdAt: weightEntries.createdAt,
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, context.session.user.id))
    .orderBy(desc(weightEntries.createdAt))
    .limit(30)
  return rows
})

const latest = protectedProcedure.handler(async ({ context }) => {
  const [row] = await context.db
    .select({
      weight: weightEntries.weight,
      createdAt: weightEntries.createdAt,
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, context.session.user.id))
    .orderBy(desc(weightEntries.createdAt))
    .limit(1)
  return row ?? null
})

const create = protectedProcedure.input(AddWeightEntryInputSchema).handler(async ({ input, context }) => {
  await context.db.insert(weightEntries).values({
    userId: context.session.user.id,
    weight: input.weight,
  })

  // Update user's current weight
  await context.db.update(users).set({ currentWeight: input.weight }).where(eq(users.id, context.session.user.id))
})

const update = protectedProcedure.input(UpdateWeightEntryInputSchema).handler(async ({ input, context }) => {
  const [existing] = await context.db
    .select({ id: weightEntries.id })
    .from(weightEntries)
    .where(and(eq(weightEntries.id, input.id), eq(weightEntries.userId, context.session.user.id)))
    .limit(1)

  if (!existing) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db
    .update(weightEntries)
    .set({ weight: input.weight })
    .where(and(eq(weightEntries.id, input.id), eq(weightEntries.userId, context.session.user.id)))

  // Update user's current weight if this is the latest entry
  const [latestWeight] = await context.db
    .select({ id: weightEntries.id })
    .from(weightEntries)
    .where(eq(weightEntries.userId, context.session.user.id))
    .orderBy(desc(weightEntries.createdAt))
    .limit(1)

  if (latestWeight?.id === input.id) {
    await context.db.update(users).set({ currentWeight: input.weight }).where(eq(users.id, context.session.user.id))
  }
})

const remove = protectedProcedure.input(DeleteWeightEntryInputSchema).handler(async ({ input, context }) => {
  const [entry] = await context.db
    .select({ id: weightEntries.id })
    .from(weightEntries)
    .where(and(eq(weightEntries.id, input.id), eq(weightEntries.userId, context.session.user.id)))
    .limit(1)

  if (!entry) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db
    .delete(weightEntries)
    .where(and(eq(weightEntries.id, input.id), eq(weightEntries.userId, context.session.user.id)))

  // Update user's current weight to the latest remaining entry
  const [latestEntry] = await context.db
    .select({ weight: weightEntries.weight })
    .from(weightEntries)
    .where(eq(weightEntries.userId, context.session.user.id))
    .orderBy(desc(weightEntries.createdAt))
    .limit(1)

  if (latestEntry) {
    await context.db
      .update(users)
      .set({ currentWeight: latestEntry.weight })
      .where(eq(users.id, context.session.user.id))
  }
})

export const weightRouter = {
  list,
  latest,
  create,
  update,
  delete: remove,
}
