import { ORPCError } from '@orpc/server'
import { and, asc, desc, eq, gte, lte } from 'drizzle-orm'

import { customFoods, foodEntries, savedFoods, savedMealTemplateItems, savedMealTemplates } from '@/db/schemas'
import { evaluateAndUnlockAchievementGroup } from '@/lib/achievements/server'
import { DEFAULT_MEAL, MEALS } from '@/lib/constants'
import { getNutritionTotals } from '@/lib/food-library'

import { protectedProcedure } from '../procedures'
import {
  AddFoodEntryInputSchema,
  CreateSavedFoodInputSchema,
  CreateSavedMealFromCategoryInputSchema,
  CreateSavedMealInputSchema,
  DeleteFoodEntryInputSchema,
  DeleteSavedFoodInputSchema,
  DeleteSavedMealInputSchema,
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

  if (entry?.mealCategory !== input.category) {
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

const listCustomFoods = protectedProcedure.handler(async ({ context }) => {
  return context.db.query.customFoods.findMany({
    where: eq(customFoods.userId, context.session.user.id),
    orderBy: desc(customFoods.createdAt),
  })
})

const listSavedFoods = protectedProcedure.handler(async ({ context }) => {
  return context.db.query.savedFoods.findMany({
    where: eq(savedFoods.userId, context.session.user.id),
    orderBy: desc(savedFoods.createdAt),
  })
})

const createSavedFood = protectedProcedure.input(CreateSavedFoodInputSchema).handler(async ({ input, context }) => {
  const [savedFood] = await context.db
    .insert(savedFoods)
    .values({
      ...input,
      userId: context.session.user.id,
    })
    .returning()

  return savedFood
})

const deleteSavedFood = protectedProcedure.input(DeleteSavedFoodInputSchema).handler(async ({ input, context }) => {
  const [savedFood] = await context.db
    .select({ id: savedFoods.id })
    .from(savedFoods)
    .where(and(eq(savedFoods.id, input.savedFoodId), eq(savedFoods.userId, context.session.user.id)))
    .limit(1)

  if (!savedFood) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db.delete(savedFoods).where(eq(savedFoods.id, input.savedFoodId))
})

const listSavedMeals = protectedProcedure.handler(async ({ context }) => {
  const templates = await context.db.query.savedMealTemplates.findMany({
    where: eq(savedMealTemplates.userId, context.session.user.id),
    with: {
      items: {
        orderBy: asc(savedMealTemplateItems.position),
      },
    },
    orderBy: desc(savedMealTemplates.createdAt),
  })

  return templates.map((template) => ({
    id: template.id,
    name: template.name,
    defaultMealCategory: template.defaultMealCategory,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    itemCount: template.items.length,
    totals: getNutritionTotals(template.items),
    items: template.items.map((item) => ({
      id: item.id,
      foodName: item.foodName,
      servingSize: item.servingSize,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      imageUrl: item.imageUrl ?? undefined,
      position: item.position,
    })),
  }))
})

const createSavedMeal = protectedProcedure.input(CreateSavedMealInputSchema).handler(async ({ input, context }) =>
  context.db.transaction(async (tx) => {
    const [template] = await tx
      .insert(savedMealTemplates)
      .values({
        userId: context.session.user.id,
        name: input.name.trim(),
        defaultMealCategory: DEFAULT_MEAL,
      })
      .returning({ id: savedMealTemplates.id })

    if (!template) {
      throw new ORPCError('INTERNAL_SERVER_ERROR')
    }

    await tx.insert(savedMealTemplateItems).values(
      input.items.map((item, index) => ({
        templateId: template.id,
        position: index,
        foodName: item.foodName,
        servingSize: item.servingSize,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        imageUrl: item.imageUrl,
      })),
    )

    return { templateId: template.id }
  }),
)

const createSavedMealFromCategory = protectedProcedure
  .input(CreateSavedMealFromCategoryInputSchema)
  .handler(async ({ input, context }) =>
    context.db.transaction(async (tx) => {
      const entries = await tx
        .select()
        .from(foodEntries)
        .where(
          and(
            eq(foodEntries.userId, context.session.user.id),
            eq(foodEntries.mealCategory, input.category),
            gte(foodEntries.createdAt, new Date(input.startOfDay)),
            lte(foodEntries.createdAt, new Date(input.endOfDay)),
          ),
        )
        .orderBy(asc(foodEntries.createdAt))

      if (entries.length === 0) {
        throw new ORPCError('BAD_REQUEST', { message: 'errors.saved-meal-empty' })
      }

      const [template] = await tx
        .insert(savedMealTemplates)
        .values({
          userId: context.session.user.id,
          name: input.name.trim(),
          defaultMealCategory: input.category,
        })
        .returning({ id: savedMealTemplates.id })

      if (!template) {
        throw new ORPCError('INTERNAL_SERVER_ERROR')
      }

      await tx.insert(savedMealTemplateItems).values(
        entries.map((entry, index) => ({
          templateId: template.id,
          position: index,
          foodName: entry.foodName,
          servingSize: entry.servingSize,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          imageUrl: entry.imageUrl,
        })),
      )

      return { templateId: template.id }
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

const deleteSavedMeal = protectedProcedure.input(DeleteSavedMealInputSchema).handler(async ({ input, context }) => {
  const [template] = await context.db
    .select({ id: savedMealTemplates.id })
    .from(savedMealTemplates)
    .where(and(eq(savedMealTemplates.id, input.templateId), eq(savedMealTemplates.userId, context.session.user.id)))
    .limit(1)

  if (!template) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db.delete(savedMealTemplates).where(eq(savedMealTemplates.id, input.templateId))
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

  return getNutritionTotals(rows)
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
  listCustomFoods,
  listSavedFoods,
  createSavedFood,
  deleteSavedFood,
  listSavedMeals,
  createSavedMeal,
  createSavedMealFromCategory,
  delete: remove,
  deleteSavedMeal,
  totals,
  meals,
}
