import { relations } from 'drizzle-orm'
import { index, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const customFoods = pgTable(
  'custom_foods',
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
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('custom_foods_userId_createdAt_idx').on(table.userId, table.createdAt)],
)

export const customFoodRelations = relations(customFoods, ({ one }) => ({
  user: one(users, {
    fields: [customFoods.userId],
    references: [users.id],
  }),
}))
