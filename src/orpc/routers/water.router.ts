import { ORPCError } from '@orpc/server'
import { and, desc, eq, gte, lte, sum } from 'drizzle-orm'

import { users } from '@/db/schemas/auth.schema'
import { waterEntries } from '@/db/schemas/water-entry.schema'

import { protectedProcedure } from '../procedures'
import {
  AddWaterEntryInputSchema,
  DeleteWaterEntryInputSchema,
  GetWaterEntriesInputSchema,
  GetWaterTotalInputSchema,
  UpdateWaterEntryInputSchema,
  UpdateWaterGoalInputSchema,
} from '../schemas/water.schema'

const list = protectedProcedure.input(GetWaterEntriesInputSchema).handler(async ({ input, context }) => {
  const rows = await context.db
    .select({
      id: waterEntries.id,
      amount: waterEntries.amount,
      createdAt: waterEntries.createdAt,
    })
    .from(waterEntries)
    .where(
      and(
        eq(waterEntries.userId, context.session.user.id),
        gte(waterEntries.createdAt, new Date(input.startOfDay)),
        lte(waterEntries.createdAt, new Date(input.endOfDay)),
      ),
    )
    .orderBy(desc(waterEntries.createdAt))

  return rows
})

const total = protectedProcedure.input(GetWaterTotalInputSchema).handler(async ({ input, context }) => {
  const [row] = await context.db
    .select({ total: sum(waterEntries.amount) })
    .from(waterEntries)
    .where(
      and(
        eq(waterEntries.userId, context.session.user.id),
        gte(waterEntries.createdAt, new Date(input.startOfDay)),
        lte(waterEntries.createdAt, new Date(input.endOfDay)),
      ),
    )

  return Number(row?.total ?? 0)
})

const create = protectedProcedure.input(AddWaterEntryInputSchema).handler(async ({ input, context }) => {
  const entry = await context.db
    .insert(waterEntries)
    .values({
      userId: context.session.user.id,
      amount: input.amount,
    })
    .returning({ id: waterEntries.id, createdAt: waterEntries.createdAt })

  return entry[0]
})

const update = protectedProcedure.input(UpdateWaterEntryInputSchema).handler(async ({ input, context }) => {
  const [existing] = await context.db
    .select({ id: waterEntries.id })
    .from(waterEntries)
    .where(and(eq(waterEntries.id, input.id), eq(waterEntries.userId, context.session.user.id)))
    .limit(1)

  if (!existing) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db
    .update(waterEntries)
    .set({ amount: input.amount })
    .where(and(eq(waterEntries.id, input.id), eq(waterEntries.userId, context.session.user.id)))
})

const del = protectedProcedure.input(DeleteWaterEntryInputSchema).handler(async ({ input, context }) => {
  const [entry] = await context.db
    .select({ id: waterEntries.id })
    .from(waterEntries)
    .where(and(eq(waterEntries.id, input.id), eq(waterEntries.userId, context.session.user.id)))
    .limit(1)

  if (!entry) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db
    .delete(waterEntries)
    .where(and(eq(waterEntries.id, input.id), eq(waterEntries.userId, context.session.user.id)))
})

const updateGoal = protectedProcedure.input(UpdateWaterGoalInputSchema).handler(async ({ input, context }) => {
  await context.db.update(users).set({ waterGoal: input.goal }).where(eq(users.id, context.session.user.id))
})

export const waterRouter = {
  list,
  total,
  create,
  update,
  delete: del,
  updateGoal,
}
