import { relations } from 'drizzle-orm'
import { index, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const savedFoods = pgTable(
  'saved_foods',
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
    source: text('source', { enum: ['manual', 'ai-scan', 'barcode'] }).notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('saved_foods_userId_createdAt_idx').on(table.userId, table.createdAt)],
)

export const savedFoodRelations = relations(savedFoods, ({ one }) => ({
  user: one(users, {
    fields: [savedFoods.userId],
    references: [users.id],
  }),
}))
