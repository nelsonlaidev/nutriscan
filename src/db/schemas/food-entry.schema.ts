import { relations } from 'drizzle-orm'
import { index, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const foodEntries = pgTable(
  'food_entries',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    foodName: text('food_name').notNull(),
    servingSize: text('serving_size').notNull(),
    calories: real('calories').notNull(),
    protein: real('protein').notNull(),
    carbs: real('carbs').notNull(),
    fat: real('fat').notNull(),
    mealCategory: text('meal_category', {
      enum: ['breakfast', 'lunch', 'dinner', 'snacks']
    }).notNull(),
    source: text('source', { enum: ['ai-scan', 'manual', 'barcode'] }).notNull(),
    imageUrl: text('image_url'),
    localDate: text('local_date').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index('food_entry_userId_idx').on(table.userId),
    index('food_entry_userId_localDate_idx').on(table.userId, table.localDate)
  ]
)

export const foodEntryRelations = relations(foodEntries, ({ one }) => ({
  user: one(users, {
    fields: [foodEntries.userId],
    references: [users.id]
  })
}))
