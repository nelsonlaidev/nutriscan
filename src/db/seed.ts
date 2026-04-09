import type { InferSelectModel } from 'drizzle-orm'

import { faker } from '@faker-js/faker'
import { generateId } from 'better-auth'
import { consola } from 'consola'
import { eq } from 'drizzle-orm'

import { MEALS, TEST_USER, TEST_USER_CLEAN } from '@/lib/constants'

import { db } from './index'
import {
  accounts,
  chatMessages,
  chats,
  foodEntries,
  savedFoods,
  savedMealTemplateItems,
  savedMealTemplates,
  users,
  waterEntries,
  weightEntries,
} from './schemas'

async function main() {
  consola.info('Starting database seed...')

  try {
    await db.insert(users).values([TEST_USER, TEST_USER_CLEAN])

    await db.insert(accounts).values(
      [TEST_USER, TEST_USER_CLEAN].map((user) => ({
        id: generateId(),
        accountId: generateId(),
        providerId: 'credential',
        userId: user.id,
        password:
          // Fixed password hash for "12341234"
          // eslint-disable-next-line sonarjs/no-hardcoded-passwords
          '02f7f10d52a0bf69d0ec91c77dd63b47:0601078e5ea7c1a592695bd096f6ea18a1bf6e323cabad8be7f1100a6ea21a63db127128b123da2c847a97763c89683093b6fb36badc9e917a73f230ef82022b',
      })),
    )

    consola.success(`Created users: ${TEST_USER.id}, ${TEST_USER_CLEAN.id}`)

    // Generate past 30 days of data
    const today = new Date()

    // Arrays to hold all entries for batch insert
    const foodData = []
    const waterData = []
    const weightData = []

    let currentWeight = 80 // Start weight 30 days ago

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // 3-5 meals a day
      const mealsCount = faker.number.int({ min: 3, max: 5 })

      for (let j = 0; j < mealsCount; j++) {
        const mealCategory = MEALS[j % MEALS.length]
        if (!mealCategory) continue

        foodData.push({
          id: faker.string.uuid(),
          userId: TEST_USER.id,
          foodName: faker.food.dish(),
          servingSize: '1 serving',
          calories: faker.number.int({ min: 200, max: 800 }),
          protein: faker.number.int({ min: 5, max: 50 }),
          carbs: faker.number.int({ min: 10, max: 80 }),
          fat: faker.number.int({ min: 5, max: 40 }),
          mealCategory,
          source: faker.helpers.arrayElement(['ai-scan', 'manual', 'barcode']),
          createdAt: date,
        })
      }

      // 3-8 glasses a day (250ml each)
      const waterCount = faker.number.int({ min: 3, max: 8 })

      for (let j = 0; j < waterCount; j++) {
        waterData.push({
          id: faker.string.uuid(),
          userId: TEST_USER.id,
          amount: 250,
          createdAt: date,
        })
      }

      // Weight goes down slightly on average, but fluctuates
      currentWeight -= faker.number.float({ min: -0.2, max: 0.5 })

      // Log weight 70% of days
      if (faker.number.int({ min: 1, max: 10 }) <= 7) {
        weightData.push({
          id: faker.string.uuid(),
          userId: TEST_USER.id,
          weight: Number(currentWeight.toFixed(1)),
          createdAt: date,
        })
      }
    }

    consola.info(`Inserting ${foodData.length} food entries...`)
    await db.insert(foodEntries).values(foodData)

    consola.info(`Inserting ${waterData.length} water entries...`)
    await db.insert(waterEntries).values(waterData)

    consola.info(`Inserting ${weightData.length} weight entries...`)
    await db.insert(weightEntries).values(weightData)

    const savedFoodData = [
      {
        id: faker.string.uuid(),
        userId: TEST_USER.id,
        foodName: 'Overnight Oats',
        servingSize: '1 jar',
        calories: 320,
        protein: 16,
        carbs: 42,
        fat: 9,
        source: 'manual' as const,
      },
      {
        id: faker.string.uuid(),
        userId: TEST_USER.id,
        foodName: 'Chicken Rice Bowl',
        servingSize: '1 bowl',
        calories: 520,
        protein: 38,
        carbs: 46,
        fat: 18,
        source: 'ai-scan' as const,
      },
      {
        id: faker.string.uuid(),
        userId: TEST_USER.id,
        foodName: 'Protein Shake',
        servingSize: '1 bottle',
        calories: 190,
        protein: 30,
        carbs: 9,
        fat: 3,
        source: 'barcode' as const,
      },
      {
        id: faker.string.uuid(),
        userId: TEST_USER.id,
        foodName: 'Banana',
        servingSize: '1 medium',
        calories: 105,
        protein: 1,
        carbs: 27,
        fat: 0,
        source: 'manual' as const,
      },
    ]

    consola.info(`Inserting ${savedFoodData.length} saved foods...`)
    await db.insert(savedFoods).values(savedFoodData)

    const breakfastTemplateId = faker.string.uuid()
    const lunchTemplateId = faker.string.uuid()

    const savedMealData = [
      {
        id: breakfastTemplateId,
        userId: TEST_USER.id,
        name: 'Quick Breakfast',
        defaultMealCategory: 'breakfast' as const,
      },
      {
        id: lunchTemplateId,
        userId: TEST_USER.id,
        name: 'Gym Lunch',
        defaultMealCategory: 'lunch' as const,
      },
    ]

    const savedMealItemData = [
      {
        id: faker.string.uuid(),
        templateId: breakfastTemplateId,
        position: 0,
        foodName: 'Overnight Oats',
        servingSize: '1 jar',
        calories: 320,
        protein: 16,
        carbs: 42,
        fat: 9,
      },
      {
        id: faker.string.uuid(),
        templateId: breakfastTemplateId,
        position: 1,
        foodName: 'Banana',
        servingSize: '1 medium',
        calories: 105,
        protein: 1,
        carbs: 27,
        fat: 0,
      },
      {
        id: faker.string.uuid(),
        templateId: lunchTemplateId,
        position: 0,
        foodName: 'Chicken Rice Bowl',
        servingSize: '1 bowl',
        calories: 520,
        protein: 38,
        carbs: 46,
        fat: 18,
      },
      {
        id: faker.string.uuid(),
        templateId: lunchTemplateId,
        position: 1,
        foodName: 'Protein Shake',
        servingSize: '1 bottle',
        calories: 190,
        protein: 30,
        carbs: 9,
        fat: 3,
      },
    ]

    consola.info(`Inserting ${savedMealData.length} saved meals...`)
    await db.insert(savedMealTemplates).values(savedMealData)

    consola.info(`Inserting ${savedMealItemData.length} saved meal items...`)
    await db.insert(savedMealTemplateItems).values(savedMealItemData)

    // Generate chat data
    const chat1Id = faker.string.uuid()
    const chat1Date = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
    const chat2Id = faker.string.uuid()
    const chat2Date = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    const chat3Id = faker.string.uuid()
    const chat3Date = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)

    const chatData = [
      { id: chat1Id, userId: TEST_USER.id, title: 'Healthy breakfast ideas', createdAt: chat1Date },
      { id: chat2Id, userId: TEST_USER.id, title: 'Post-workout nutrition tips', createdAt: chat2Date },
      { id: chat3Id, userId: TEST_USER.id, title: 'Low carb dinner options', createdAt: chat3Date },
    ]

    const chatMessageData: Array<InferSelectModel<typeof chatMessages>> = [
      // Chat 1: Healthy breakfast ideas
      {
        id: faker.string.uuid(),
        chatId: chat1Id,
        role: 'user' as const,
        parts: [{ type: 'text', text: 'What are some healthy breakfast ideas under 400 calories?' }],
        createdAt: new Date(chat1Date),
      },
      {
        id: faker.string.uuid(),
        chatId: chat1Id,
        role: 'assistant' as const,
        parts: [
          {
            type: 'text',
            text: 'Here are some great breakfast options under 400 calories:\n\n1. **Greek yogurt with berries** (~250 cal) — High in protein, add some granola for crunch.\n2. **Oatmeal with banana** (~350 cal) — Top with a drizzle of honey and cinnamon.\n3. **Scrambled eggs with toast** (~380 cal) — Two eggs with whole wheat toast.\n4. **Smoothie bowl** (~300 cal) — Blend spinach, banana, and protein powder.',
          },
        ],
        createdAt: new Date(chat1Date.getTime() + 5000),
      },
      // Chat 2: Post-workout nutrition tips
      {
        id: faker.string.uuid(),
        chatId: chat2Id,
        role: 'user' as const,
        parts: [{ type: 'text', text: 'What should I eat after a workout?' }],
        createdAt: new Date(chat2Date),
      },
      {
        id: faker.string.uuid(),
        chatId: chat2Id,
        role: 'assistant' as const,
        parts: [
          {
            type: 'text',
            text: 'After a workout, focus on protein and carbs to help recovery:\n\n- **Protein shake with a banana** — Quick and easy, provides both protein and fast carbs.\n- **Chicken breast with rice** — A classic post-workout meal.\n- **Cottage cheese with fruit** — Great source of casein protein.\n\nAim to eat within 30-60 minutes after your workout for optimal recovery.',
          },
        ],
        createdAt: new Date(chat2Date.getTime() + 5000),
      },
      // Chat 3: Low carb dinner options
      {
        id: faker.string.uuid(),
        chatId: chat3Id,
        role: 'user' as const,
        parts: [{ type: 'text', text: 'Can you suggest some low carb dinners?' }],
        createdAt: new Date(chat3Date),
      },
      {
        id: faker.string.uuid(),
        chatId: chat3Id,
        role: 'assistant' as const,
        parts: [
          {
            type: 'text',
            text: 'Here are some delicious low-carb dinner ideas:\n\n1. **Grilled salmon with asparagus** (~8g carbs) — Season with lemon and herbs.\n2. **Zucchini noodles with meat sauce** (~12g carbs) — Swap pasta for zoodles.\n3. **Stuffed bell peppers** (~15g carbs) — Fill with ground turkey and cheese.\n4. **Cauliflower fried rice** (~10g carbs) — Use riced cauliflower instead of rice.',
          },
        ],
        createdAt: new Date(chat3Date.getTime() + 5000),
      },
    ]

    consola.info(`Inserting ${chatData.length} chats...`)
    await db.insert(chats).values(chatData)

    consola.info(`Inserting ${chatMessageData.length} chat messages...`)
    await db.insert(chatMessages).values(chatMessageData)

    // Sync users.currentWeight to the latest weight entry
    const latestWeight = weightData.at(-1)
    if (latestWeight) {
      await db.update(users).set({ currentWeight: latestWeight.weight }).where(eq(users.id, TEST_USER.id))
    }

    consola.success('Data seeded successfully!')
  } catch (error) {
    consola.error('Error seeding data:\n', error)
  } finally {
    await db.$client.end()
  }
}

await main()
