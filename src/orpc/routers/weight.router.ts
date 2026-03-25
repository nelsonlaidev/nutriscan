import { ORPCError } from '@orpc/server'
import { and, desc, eq } from 'drizzle-orm'

import { users } from '@/db/schemas/auth.schema'
import { weightEntries } from '@/db/schemas/weight-entry.schema'
import { evaluateAndUnlockAchievementGroup } from '@/lib/achievements/server'

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

const create = protectedProcedure.input(AddWeightEntryInputSchema).handler(async ({ input, context }) =>
  context.db.transaction(async (tx) => {
    await tx.insert(weightEntries).values({
      userId: context.session.user.id,
      weight: input.weight,
    })

    await tx.update(users).set({ currentWeight: input.weight }).where(eq(users.id, context.session.user.id))

    const newUnlocks = await evaluateAndUnlockAchievementGroup(tx, context.session.user.id, 'weight')

    return { newUnlocks }
  }),
)

const update = protectedProcedure.input(UpdateWeightEntryInputSchema).handler(async ({ input, context }) =>
  context.db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: weightEntries.id })
      .from(weightEntries)
      .where(and(eq(weightEntries.id, input.id), eq(weightEntries.userId, context.session.user.id)))
      .limit(1)

    if (!existing) {
      throw new ORPCError('NOT_FOUND')
    }

    await tx
      .update(weightEntries)
      .set({ weight: input.weight })
      .where(and(eq(weightEntries.id, input.id), eq(weightEntries.userId, context.session.user.id)))

    const [latestWeight] = await tx
      .select({ id: weightEntries.id })
      .from(weightEntries)
      .where(eq(weightEntries.userId, context.session.user.id))
      .orderBy(desc(weightEntries.createdAt))
      .limit(1)

    if (latestWeight?.id === input.id) {
      await tx.update(users).set({ currentWeight: input.weight }).where(eq(users.id, context.session.user.id))
    }

    const newUnlocks = await evaluateAndUnlockAchievementGroup(tx, context.session.user.id, 'weight')

    return { newUnlocks }
  }),
)

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
