import { ORPCError } from '@orpc/server'
import { and, eq, gte, lte } from 'drizzle-orm'

import { foodEntries } from '@/db/schemas'
import { evaluateAndUnlockAchievementGroup } from '@/lib/achievements/server'
import { MEALS } from '@/lib/constants'

import { protectedProcedure } from '../procedures'
import {
  AddFoodEntryInputSchema,
  DeleteFoodEntryInputSchema,
  GetFoodEntriesByCategoryInputSchema,
  GetFoodEntriesInputSchema,
  GetFoodEntryByIdInputSchema,
} from '../schemas/food.schema'

const list = protectedProcedure.input(GetFoodEntriesInputSchema).handler(async ({ input, context }) => {
  const rows = await context.db
    .select()
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, context.session.user.id),
        gte(foodEntries.createdAt, new Date(input.startOfDay)),
        lte(foodEntries.createdAt, new Date(input.endOfDay)),
      ),
    )

  return rows
})

const listByCategory = protectedProcedure
  .input(GetFoodEntriesByCategoryInputSchema)
  .handler(async ({ input, context }) => {
    const rows = await context.db
      .select()
      .from(foodEntries)
      .where(
        and(
          eq(foodEntries.userId, context.session.user.id),
          gte(foodEntries.createdAt, new Date(input.startOfDay)),
          lte(foodEntries.createdAt, new Date(input.endOfDay)),
          eq(foodEntries.mealCategory, input.category),
        ),
      )

    return rows
  })

const getById = protectedProcedure.input(GetFoodEntryByIdInputSchema).handler(async ({ input, context }) => {
  const [entry] = await context.db
    .select()
    .from(foodEntries)
    .where(and(eq(foodEntries.id, input.id), eq(foodEntries.userId, context.session.user.id)))
    .limit(1)

  if (!entry || entry.mealCategory !== input.category) {
    throw new ORPCError('NOT_FOUND')
  }

  return entry
})

const create = protectedProcedure.input(AddFoodEntryInputSchema).handler(async ({ input, context }) =>
  context.db.transaction(async (tx) => {
    await tx.insert(foodEntries).values({
      ...input,
      userId: context.session.user.id,
    })

    const newUnlocks = await evaluateAndUnlockAchievementGroup(tx, context.session.user.id, 'meals')

    return { newUnlocks }
  }),
)

const remove = protectedProcedure.input(DeleteFoodEntryInputSchema).handler(async ({ input, context }) => {
  const [entry] = await context.db
    .select({ id: foodEntries.id })
    .from(foodEntries)
    .where(and(eq(foodEntries.id, input.id), eq(foodEntries.userId, context.session.user.id)))
    .limit(1)

  if (!entry) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db
    .delete(foodEntries)
    .where(and(eq(foodEntries.id, input.id), eq(foodEntries.userId, context.session.user.id)))
})

const totals = protectedProcedure.input(GetFoodEntriesInputSchema).handler(async ({ input, context }) => {
  const rows = await context.db
    .select()
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, context.session.user.id),
        gte(foodEntries.createdAt, new Date(input.startOfDay)),
        lte(foodEntries.createdAt, new Date(input.endOfDay)),
      ),
    )

  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0

  for (const entry of rows) {
    calories += entry.calories
    protein += entry.protein
    carbs += entry.carbs
    fat += entry.fat
  }

  return { calories, protein, carbs, fat }
})

const meals = protectedProcedure.input(GetFoodEntriesInputSchema).handler(async ({ input, context }) => {
  const rows = await context.db
    .select()
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, context.session.user.id),
        gte(foodEntries.createdAt, new Date(input.startOfDay)),
        lte(foodEntries.createdAt, new Date(input.endOfDay)),
      ),
    )

  return MEALS.map((category) => {
    const items = rows.filter((e) => e.mealCategory === category)

    let calories = 0

    for (const item of items) {
      calories += item.calories
    }

    return { category, items: items.length, calories: Math.round(calories) }
  })
})

export const foodRouter = {
  list,
  listByCategory,
  getById,
  create,
  delete: remove,
  totals,
  meals,
}
