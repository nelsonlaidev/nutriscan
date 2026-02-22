import { faker } from '@faker-js/faker'
import { consola } from 'consola'
import { eq } from 'drizzle-orm'

import { db } from './index'
import { accounts, foodEntries, users, waterEntries, weightEntries } from './schemas'

async function main() {
  consola.info('Starting database seed...')

  try {
    // Create a user
    const userId = faker.string.uuid()

    await db.insert(users).values({
      id: userId,
      name: 'Test',
      email: 'test@example.com',
      emailVerified: true,
      onboarded: true,
      startingWeight: 80,
      currentWeight: 80,
      goalWeight: 70,
      height: 175,
      birthday: '1990-06-15',
      gender: 'male',
      waterGoal: 2500,
      calorieBudget: 2200,
      proteinTarget: 160,
      carbTarget: 220,
      fatTarget: 70,
      timezone: 'UTC'
    })

    // Create an account for the user
    await db.insert(accounts).values({
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      providerId: 'credential',
      userId,
      password:
        // Fixed password hash for "12341234"
        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
        '02f7f10d52a0bf69d0ec91c77dd63b47:0601078e5ea7c1a592695bd096f6ea18a1bf6e323cabad8be7f1100a6ea21a63db127128b123da2c847a97763c89683093b6fb36badc9e917a73f230ef82022b'
    })

    consola.success(`Created user: ${userId}`)

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

      // Format as YYYY-MM-DD
      const localDate = date.toISOString().split('T')[0]
      if (!localDate) continue

      const mealCategories = ['breakfast', 'lunch', 'dinner', 'snacks'] as const

      // 3-5 meals a day
      const mealsCount = faker.number.int({ min: 3, max: 5 })

      for (let j = 0; j < mealsCount; j++) {
        const mealCategory = mealCategories[j % mealCategories.length]
        if (!mealCategory) continue

        foodData.push({
          id: faker.string.uuid(),
          userId,
          foodName: faker.food.dish(),
          servingSize: '1 serving',
          calories: faker.number.int({ min: 200, max: 800 }),
          protein: faker.number.int({ min: 5, max: 50 }),
          carbs: faker.number.int({ min: 10, max: 80 }),
          fat: faker.number.int({ min: 5, max: 40 }),
          mealCategory,
          source: faker.helpers.arrayElement(['ai-scan', 'manual', 'barcode']),
          localDate,
          createdAt: date
        })
      }

      // 3-8 glasses a day (250ml each)
      const waterCount = faker.number.int({ min: 3, max: 8 })

      for (let j = 0; j < waterCount; j++) {
        waterData.push({
          id: faker.string.uuid(),
          userId,
          amount: 250,
          localDate,
          createdAt: date
        })
      }

      // Weight goes down slightly on average, but fluctuates
      currentWeight -= faker.number.float({ min: -0.2, max: 0.5 })

      // Log weight 70% of days
      if (faker.number.int({ min: 1, max: 10 }) <= 7) {
        weightData.push({
          id: faker.string.uuid(),
          userId,
          weight: Number(currentWeight.toFixed(1)),
          localDate,
          createdAt: date
        })
      }
    }

    consola.info(`Inserting ${foodData.length} food entries...`)
    await db.insert(foodEntries).values(foodData)

    consola.info(`Inserting ${waterData.length} water entries...`)
    await db.insert(waterEntries).values(waterData)

    consola.info(`Inserting ${weightData.length} weight entries...`)
    await db.insert(weightEntries).values(weightData)

    // Sync users.currentWeight to the latest weight entry
    const latestWeight = weightData.at(-1)
    if (latestWeight) {
      await db.update(users).set({ currentWeight: latestWeight.weight }).where(eq(users.id, userId))
    }

    consola.success('Data seeded successfully!')
  } catch (error) {
    consola.error('Error seeding data:\n', error)
  } finally {
    await db.$client.end()
  }
}

await main()
